<div align="center">
  <h1>📱 Smart Tasks App</h1>
  <p><b>A modern, feature-rich task management mobile application built with React Native.</b></p>
  
  ![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
  ![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
  ![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white)
</div>

<br />

Smart Tasks App helps you organize your daily activities, track your progress, and stay productive.

---

## 📸 Screenshots

> **Note:** Replace these placeholder images with actual screenshots of your app.

<div align="center">
  <img src="https://via.placeholder.com/250x500.png?text=Home+Screen" width="200" alt="Home Screen"/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://via.placeholder.com/250x500.png?text=Add+Task" width="200" alt="Add Task"/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://via.placeholder.com/250x500.png?text=Dark+Mode" width="200" alt="Dark Mode"/>
</div>

---

## ✨ Features

- 📝 **Task Management**: Comprehensive CRUD operations (Create, view, update, delete) and the ability to toggle task completion status.
- 🏷️ **Categorization & Priority**: Assign categories (*Work, Personal, Shopping, Health, Other*) and priorities (*High, Medium, Low*) to your tasks.
- 📊 **Dashboard & Statistics**: View your task statistics, completion rate, and track progress on the Home and Profile screens.
- 🔍 **Filtering & Sorting**: Filter tasks by status (*All, Pending, Completed*) and sort them by Priority, Title, or Date.
- 🌍 **Multi-language Support**: Seamlessly switch between **English** and **Hindi**.
- 🌗 **Theming**: **Dark** and **Light** mode support dynamically adapting to your preference.
- 💾 **Session & Preferences**: Encrypted session storage and MySQL-backed user preferences.
- 🔔 **Custom Alerts**: Beautiful, customizable alert dialogs built from scratch.
- 🔐 **Authentication Flow**: JWT-based Sign up, Login, password reset, and protected API access.
- 🔔 **Task Reminders**: Scheduled reminders using Notifee.

---

## 🛠️ Tech Stack

| Category | Technology Used |
| :--- | :--- |
| **Framework** | React Native |
| **State Management**| Redux Toolkit (`react-redux`, `@reduxjs/toolkit`) |
| **Navigation** | React Navigation (`native`, `native-stack`, `bottom-tabs`) |
| **API Client** | Axios |
| **Backend** | Core Java JDK `HttpServer`, JDBC, JWT |
| **Database** | MySQL using JDBC |
| **Secure Session Storage** | `react-native-encrypted-storage` |
| **Notifications** | Notifee |
| **Language / i18n** | Custom translation hook setup |

---

## 📁 Project Structure

```text
src/
 ├── components/       # Reusable UI components
 ├── hooks/            # Theme, styles, and translation hooks
 ├── navigation/       # Stack and bottom-tab navigation
 ├── screens/          # Login, Home, task, Profile, and Settings screens
 ├── services/         # Axios API client and API service functions
 ├── store/            # Redux store, user, task, and theme slices
 └── utils/            # Session, preferences, translations, and helpers

backend-java/
 ├── src/main/java/com/smarttasks/ # Core Java API and JDBC code
 ├── sql/schema.sql                 # MySQL schema
 ├── pom.xml                        # Java dependencies and build config
 └── README.md                      # Backend run instructions
```

## Architecture

```text
React Native app -> Axios REST API -> Core Java backend -> MySQL
```

The mobile app does not connect directly to MySQL. It calls the Express API using
Axios. The backend validates the JWT token, runs parameterized JDBC queries, and
returns JSON responses.

The main navigation flow is:

```text
Splash -> Login or MainTabs
MainTabs -> Home, Profile, Settings
Home -> AddTask, TaskDetail, EditTask
```

## API Endpoints

### Authentication

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Create a user account |
| `POST` | `/api/auth/login` | Authenticate a user and return a JWT |
| `POST` | `/api/auth/reset-password` | Reset a password |

### Tasks (JWT required)

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get the logged-in user's tasks |
| `GET` | `/api/tasks/:id` | Get one task |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle completion |

### User preferences (JWT required)

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/user/profile` | Get profile details |
| `GET` | `/api/user/preferences` | Load saved preferences |
| `PUT` | `/api/user/preferences` | Save preferences |

## 🚀 Getting Started

### Prerequisites

- **JDK** installed (17 or above)
- **Maven** installed
- **MySQL** installed and running
- React Native development environment set up (Android Studio / Xcode)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/snehasneha1050-spec/Smart-Tasks-App.git
   ```

2. Navigate to the project directory:
   ```bash
   cd SmartTasksApp
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   *(or `yarn install`)*

### Backend configuration

Set these environment variables when the local MySQL settings differ from the defaults:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smarttasks_db
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
```

Run `backend-java/sql/schema.sql` in MySQL before starting the backend.

### Running the App

- **For Android**:
  ```bash
  npx react-native run-android
  ```
- **For iOS** (macOS only):
  ```bash
  cd ios && pod install && cd ..
  npx react-native run-ios
  ```

- **Start the Core Java backend** (from the `backend-java` directory):
  ```bash
  mvn compile exec:java
  ```

The frontend API URL is configured in `src/services/api.js`. For a physical
Android device, replace the local network IP with the IP address of the machine
running the backend. For an Android emulator, use the host address appropriate
for your emulator configuration.

## 🔐 Authentication

Create an account from the Sign Up screen or use an existing account. Passwords
are hashed with bcrypt and successful login returns a JWT valid for seven days.

The `backend-java` folder is the only backend used by the mobile app. The mobile
client connects to its REST API through Axios; it never connects directly to MySQL.

---
<div align="center">
  <p><i>Built with ❤️ using React Native.</i></p>
</div>
