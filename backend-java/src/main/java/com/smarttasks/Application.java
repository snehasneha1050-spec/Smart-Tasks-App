package com.smarttasks;

import com.google.gson.*;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.mindrot.jbcrypt.BCrypt;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

public final class Application {
    private static final Gson JSON = new GsonBuilder().serializeNulls().create();
    private static final SecretKey JWT_KEY = Keys.hmacShaKeyFor(
            Database.env("JWT_SECRET", "smarttasks_secret_key_2026_change_me").getBytes(StandardCharsets.UTF_8));

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(Database.env("PORT", "5000"));
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", Application::handle);
        server.setExecutor(null);
        server.start();
        System.out.println("SmartTasks Core Java backend running on port " + port);
    }

    private static void handle(HttpExchange exchange) throws IOException {
        addCors(exchange);
        if (exchange.getRequestMethod().equals("OPTIONS")) { send(exchange, 204, ""); return; }
        String path = exchange.getRequestURI().getPath();
        try {
            if (path.equals("/health")) { health(exchange); return; }
            if (path.equals("/api/auth/signup") && post(exchange)) { signup(exchange); return; }
            if (path.equals("/api/auth/login") && post(exchange)) { login(exchange); return; }
            if (path.equals("/api/auth/reset-password") && post(exchange)) { resetPassword(exchange); return; }
            if (path.startsWith("/api/tasks")) { tasks(exchange, path); return; }
            if (path.startsWith("/api/user")) { user(exchange, path); return; }
            sendJson(exchange, 404, error("Route not found."));
        } catch (Exception exception) {
            System.err.println("Request failed: " + exception.getMessage());
            sendJson(exchange, 500, error("Internal server error."));
        }
    }

    private static void health(HttpExchange exchange) throws Exception {
        try (Connection connection = Database.open(); Statement statement = connection.createStatement()) {
            statement.execute("SELECT 1");
            JsonObject result = success(); result.addProperty("status", "ok"); result.addProperty("database", "connected");
            sendJson(exchange, 200, result);
        } catch (SQLException exception) {
            JsonObject result = error("Database unavailable."); result.addProperty("status", "degraded"); result.addProperty("database", "disconnected");
            sendJson(exchange, 503, result);
        }
    }

    private static void signup(HttpExchange exchange) throws Exception {
        JsonObject body = body(exchange); String name = text(body, "name"); String email = text(body, "email"); String password = text(body, "password");
        if (name.isBlank() || email.isBlank() || password.isBlank()) { sendJson(exchange, 400, error("Name, email and password are required.")); return; }
        try (Connection c = Database.open()) {
            try (PreparedStatement check = c.prepareStatement("SELECT id FROM users WHERE email = ?")) { check.setString(1, email); if (check.executeQuery().next()) { sendJson(exchange, 409, error("User already exists with this email.")); return; } }
            try (PreparedStatement insert = c.prepareStatement("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", Statement.RETURN_GENERATED_KEYS)) {
                insert.setString(1, name.trim()); insert.setString(2, email.trim()); insert.setString(3, BCrypt.hashpw(password, BCrypt.gensalt(10))); insert.executeUpdate();
                try (ResultSet keys = insert.getGeneratedKeys()) { keys.next(); sendAuth(exchange, 201, keys.getInt(1), name.trim(), email.trim(), "User registered successfully."); }
            }
        }
    }

    private static void login(HttpExchange exchange) throws Exception {
        JsonObject body = body(exchange); String identifier = text(body, "email"); if (identifier.isBlank()) identifier = text(body, "username"); if (identifier.isBlank()) identifier = text(body, "name"); String password = text(body, "password");
        try (Connection c = Database.open(); PreparedStatement ps = c.prepareStatement("SELECT id,name,email,password,created_at FROM users WHERE LOWER(email)=LOWER(?) OR LOWER(name)=LOWER(?) LIMIT 1")) {
            ps.setString(1, identifier.trim()); ps.setString(2, identifier.trim()); try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next() || !BCrypt.checkpw(password, rs.getString("password"))) { sendJson(exchange, 401, error("Invalid email or password.")); return; }
                sendAuth(exchange, 200, rs.getInt("id"), rs.getString("name"), rs.getString("email"), "Login successful.");
            }
        }
    }

    private static void resetPassword(HttpExchange exchange) throws Exception {
        JsonObject body = body(exchange); String identifier = text(body, "username"); String password = text(body, "newPassword");
        try (Connection c = Database.open(); PreparedStatement ps = c.prepareStatement("UPDATE users SET password=? WHERE LOWER(email)=LOWER(?) OR LOWER(name)=LOWER(?)")) {
            ps.setString(1, BCrypt.hashpw(password, BCrypt.gensalt(10))); ps.setString(2, identifier); ps.setString(3, identifier); if (ps.executeUpdate() == 0) { sendJson(exchange, 404, error("Username not found. Please Sign Up first.")); return; }
            JsonObject result = success(); result.addProperty("message", "Password reset successfully."); sendJson(exchange, 200, result);
        }
    }

    private static void tasks(HttpExchange e, String path) throws Exception {
        int userId = requireUser(e); if (userId < 0) return; String suffix = path.substring("/api/tasks".length());
        if (suffix.isEmpty() || suffix.equals("/")) { if (get(e)) listTasks(e, userId); else if (post(e)) createTask(e, userId); else sendJson(e, 405, error("Method not allowed.")); return; }
        String[] parts = suffix.split("/"); String id = parts[1];
        if (parts.length == 3 && parts[2].equals("toggle") && e.getRequestMethod().equals("PATCH")) { toggleTask(e, userId, id); return; }
        if (get(e)) oneTask(e, userId, id); else if (e.getRequestMethod().equals("PUT")) updateTask(e, userId, id); else if (e.getRequestMethod().equals("DELETE")) deleteTask(e, userId, id); else sendJson(e, 405, error("Method not allowed."));
    }

    private static void listTasks(HttpExchange e, int userId) throws Exception { try (Connection c=Database.open(); PreparedStatement p=c.prepareStatement("SELECT * FROM tasks WHERE user_id=? ORDER BY created_at DESC")) { p.setInt(1,userId); try(ResultSet r=p.executeQuery()){ JsonArray tasks=new JsonArray(); while(r.next()) tasks.add(task(r)); JsonObject out=success(); out.add("tasks",tasks); sendJson(e,200,out); } } }
    private static void oneTask(HttpExchange e,int userId,String id) throws Exception { oneTask(e,userId,id,200); }
    private static void oneTask(HttpExchange e,int userId,String id,int status) throws Exception { try(Connection c=Database.open(); PreparedStatement p=c.prepareStatement("SELECT * FROM tasks WHERE id=? AND user_id=?")){p.setString(1,id);p.setInt(2,userId);try(ResultSet r=p.executeQuery()){if(!r.next()){sendJson(e,404,error("Task not found."));return;}JsonObject out=success();out.add("task",task(r));sendJson(e,status,out);}}}
    private static void createTask(HttpExchange e,int userId) throws Exception { JsonObject b=body(e); if(text(b,"title").isBlank()||text(b,"description").isBlank()){sendJson(e,400,error("Title and description are required."));return;} String id=text(b,"id");if(id.isBlank())id=String.valueOf(System.currentTimeMillis());try(Connection c=Database.open();PreparedStatement p=c.prepareStatement("INSERT INTO tasks (id,user_id,title,description,category,priority,completed,due_date,is_daily,subtasks) VALUES (?,?,?,?,?,?,?,?,?,?)")){p.setString(1,id);p.setInt(2,userId);setTaskParams(p,b,3);p.executeUpdate();oneTask(e,userId,id,201);}}
    private static void updateTask(HttpExchange e,int userId,String id) throws Exception { JsonObject b=body(e); try(Connection c=Database.open();PreparedStatement p=c.prepareStatement("UPDATE tasks SET title=?,description=?,category=?,priority=?,completed=?,due_date=?,is_daily=?,subtasks=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?")){setTaskParams(p,b,1);p.setString(9,id);p.setInt(10,userId);if(p.executeUpdate()==0){sendJson(e,404,error("Task not found."));return;}oneTask(e,userId,id);}}
    private static void deleteTask(HttpExchange e,int userId,String id)throws Exception{try(Connection c=Database.open();PreparedStatement p=c.prepareStatement("DELETE FROM tasks WHERE id=? AND user_id=?")){p.setString(1,id);p.setInt(2,userId);if(p.executeUpdate()==0){sendJson(e,404,error("Task not found."));return;}JsonObject out=success();out.addProperty("message","Task deleted successfully.");sendJson(e,200,out);}}
    private static void toggleTask(HttpExchange e,int userId,String id)throws Exception{try(Connection c=Database.open();PreparedStatement p=c.prepareStatement("UPDATE tasks SET completed=NOT completed,updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?")){p.setString(1,id);p.setInt(2,userId);if(p.executeUpdate()==0){sendJson(e,404,error("Task not found."));return;}oneTask(e,userId,id);}}

    private static void user(HttpExchange e,String path)throws Exception{int userId=requireUser(e);if(userId<0)return;if(path.equals("/api/user/profile")){try(Connection c=Database.open();PreparedStatement p=c.prepareStatement("SELECT id,name,email,created_at FROM users WHERE id=?")){p.setInt(1,userId);try(ResultSet r=p.executeQuery()){if(!r.next()){sendJson(e,404,error("User not found."));return;}JsonObject out=success();out.add("user",user(r));sendJson(e,200,out);}}}else if(path.equals("/api/user/preferences")){if(get(e))preferences(e,userId,false);else if(e.getRequestMethod().equals("PUT"))preferences(e,userId,true);else sendJson(e,405,error("Method not allowed."));}else sendJson(e,404,error("Route not found."));}
    private static void preferences(HttpExchange e,int userId,boolean update)throws Exception{try(Connection c=Database.open()){if(update){JsonObject b=body(e);try(PreparedStatement p=c.prepareStatement("INSERT INTO user_preferences(user_id,dark_mode,language,notifications_enabled) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE dark_mode=VALUES(dark_mode),language=VALUES(language),notifications_enabled=VALUES(notifications_enabled)")){p.setInt(1,userId);p.setBoolean(2,bool(b,"darkMode"));p.setString(3,textOr(b,"language","English"));p.setBoolean(4,!b.has("notificationsEnabled")||bool(b,"notificationsEnabled"));p.executeUpdate();}}try(PreparedStatement p=c.prepareStatement("SELECT dark_mode,language,notifications_enabled FROM user_preferences WHERE user_id=?")){p.setInt(1,userId);try(ResultSet r=p.executeQuery()){JsonObject pref=new JsonObject();if(r.next()){pref.addProperty("darkMode",r.getBoolean(1));pref.addProperty("language",r.getString(2));pref.addProperty("notificationsEnabled",r.getBoolean(3));}else{pref.addProperty("darkMode",false);pref.addProperty("language","English");pref.addProperty("notificationsEnabled",true);}JsonObject out=success();out.add("preferences",pref);sendJson(e,200,out);}}}}

    private static void setTaskParams(PreparedStatement p,JsonObject b,int start)throws Exception{p.setString(start,textOr(b,"title","Untitled task"));p.setString(start+1,textOr(b,"description",""));p.setString(start+2,textOr(b,"category","Other"));p.setString(start+3,textOr(b,"priority","Medium"));p.setBoolean(start+4,bool(b,"completed"));p.setTimestamp(start+5,date(b,"dueDate"));p.setBoolean(start+6,bool(b,"isDaily"));p.setString(start+7,b.has("subtasks")?b.get("subtasks").toString():"[]");}
    private static JsonObject task(ResultSet r)throws Exception{JsonObject o=new JsonObject();o.addProperty("id",r.getString("id"));o.addProperty("title",r.getString("title"));o.addProperty("description",text(r,"description",""));o.addProperty("category",text(r,"category","Other"));o.addProperty("priority",text(r,"priority","Medium"));o.addProperty("completed",r.getBoolean("completed"));o.addProperty("createdAt",String.valueOf(r.getTimestamp("created_at")));o.addProperty("updatedAt",String.valueOf(r.getTimestamp("updated_at")));o.addProperty("dueDate",r.getTimestamp("due_date")==null?null:String.valueOf(r.getTimestamp("due_date")));o.addProperty("isDaily",r.getBoolean("is_daily"));try{JsonElement sub=JsonParser.parseString(r.getString("subtasks"));o.add("subtasks",sub.isJsonArray()?sub:new JsonArray());}catch(JsonParseException x){o.add("subtasks",new JsonArray());}return o;}
    private static JsonObject user(ResultSet r)throws Exception{JsonObject o=new JsonObject();o.addProperty("id",r.getInt("id"));o.addProperty("name",r.getString("name"));o.addProperty("email",r.getString("email"));o.addProperty("created_at",String.valueOf(r.getTimestamp("created_at")));return o;}
    private static void sendAuth(HttpExchange e,int status,int id,String name,String email,String message)throws IOException{String token=Jwts.builder().subject(String.valueOf(id)).claim("email",email).claim("name",name).issuedAt(new java.util.Date()).expiration(java.util.Date.from(Instant.now().plus(7,ChronoUnit.DAYS))).signWith(JWT_KEY).compact();JsonObject out=success();out.addProperty("token",token);out.add("user",userJson(id,name,email));out.addProperty("message",message);sendJson(e,status,out);}
    private static int requireUser(HttpExchange e)throws IOException{try{String header=e.getRequestHeaders().getFirst("Authorization");if(header==null||!header.startsWith("Bearer "))throw new Exception();return Integer.parseInt(Jwts.parser().verifyWith(JWT_KEY).build().parseSignedClaims(header.substring(7)).getPayload().getSubject());}catch(Exception x){sendJson(e,401,error("Authentication required."));return -1;}}
    private static JsonObject body(HttpExchange e)throws IOException{byte[] data=e.getRequestBody().readAllBytes();return data.length==0?new JsonObject():JSON.fromJson(new String(data,StandardCharsets.UTF_8),JsonObject.class);}
    private static JsonObject success(){JsonObject o=new JsonObject();o.addProperty("success",true);return o;}private static JsonObject error(String m){JsonObject o=new JsonObject();o.addProperty("success",false);o.addProperty("message",m);return o;}private static JsonObject userJson(int id,String name,String email){JsonObject o=new JsonObject();o.addProperty("id",id);o.addProperty("name",name);o.addProperty("email",email);return o;}
    private static String text(JsonObject o,String k){return o.has(k)&&!o.get(k).isJsonNull()?o.get(k).getAsString():"";}private static String textOr(JsonObject o,String k,String d){String v=text(o,k);return v.isBlank()?d:v;}private static boolean bool(JsonObject o,String k){return o.has(k)&&!o.get(k).isJsonNull()&&o.get(k).getAsBoolean();}private static Timestamp date(JsonObject o,String k){String v=text(o,k);try{return v.isBlank()?null:Timestamp.from(Instant.parse(v));}catch(Exception x){return null;}}private static String text(ResultSet r,String c,String d)throws SQLException{String v=r.getString(c);return v==null?d:v;}private static boolean get(HttpExchange e){return e.getRequestMethod().equals("GET");}private static boolean post(HttpExchange e){return e.getRequestMethod().equals("POST");}
    private static void addCors(HttpExchange e){e.getResponseHeaders().set("Access-Control-Allow-Origin","*");e.getResponseHeaders().set("Access-Control-Allow-Headers","Content-Type, Authorization");e.getResponseHeaders().set("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE, OPTIONS");}private static void sendJson(HttpExchange e,int status,JsonElement body)throws IOException{send(e,status,JSON.toJson(body));}private static void send(HttpExchange e,int status,String body)throws IOException{byte[] bytes=body.getBytes(StandardCharsets.UTF_8);e.getResponseHeaders().set("Content-Type","application/json");e.sendResponseHeaders(status,bytes.length);try(var out=e.getResponseBody()){out.write(bytes);}}
}