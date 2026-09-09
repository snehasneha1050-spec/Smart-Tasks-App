package com.smarttasks;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

final class Database {
    private Database() { }

    static Connection open() throws SQLException {
        String host = env("DB_HOST", "localhost");
        String port = env("DB_PORT", "3306");
        String name = env("DB_NAME", "smarttasks_db");
        String url = "jdbc:mysql://" + host + ":" + port + "/" + name
                + "?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        return DriverManager.getConnection(url, env("DB_USER", "root"), env("DB_PASSWORD", ""));
    }

    static String env(String name, String fallback) {
        String value = System.getenv(name);
        return value == null || value.isBlank() ? fallback : value;
    }
}