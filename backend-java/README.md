# Smart Tasks Core Java Backend

This is a framework-free Java HTTP backend using JDK `HttpServer`, JDBC and the existing MySQL schema.

## Run

Install JDK 17+ and Maven, then from this directory run:

```bash
mvn compile exec:java
```

Configuration is read from environment variables:
`PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `JWT_SECRET`.

The API remains available under `/health`, `/api/auth`, `/api/tasks`, and `/api/user`, so the mobile client contract is unchanged.

Run `sql/schema.sql` in MySQL before starting the application.