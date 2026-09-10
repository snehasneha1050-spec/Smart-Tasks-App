# Smart Tasks Core Java Backend

This is a framework-free Java HTTP backend using JDK `HttpServer`, JDBC and the existing MySQL schema.

## Run

Install JDK 17+ and Maven, then from this directory run:

```bash
mvn compile exec:java
```

Configuration is read from environment variables:
`PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `JWT_SECRET`.

For PowerShell, replace the database password with the actual local MySQL password.
`JWT_SECRET` must be at least 32 characters; this command generates a suitable
local-only value without storing it in the repository:

```powershell
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_USER = "root"
$env:DB_PASSWORD = "<your-actual-mysql-password>"
$env:DB_NAME = "smarttasks_db"
$env:JWT_SECRET = ([guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N"))
$env:PORT = "5000"
mvn compile exec:java
```

Do not type the angle-bracket placeholders literally, and do not commit the
password or JWT secret.

The API remains available under `/health`, `/api/auth`, `/api/tasks`, and `/api/user`, so the mobile client contract is unchanged.

Run `sql/schema.sql` in MySQL before starting the application.