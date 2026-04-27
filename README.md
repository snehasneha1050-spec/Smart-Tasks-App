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
- 💾 **Local Storage**: Persistent data retention using `AsyncStorage`.
- 🔔 **Custom Alerts**: Beautiful, customizable alert dialogs built from scratch.
- 🔐 **Authentication Flow**: Smooth Splash Screen transition into mockup Sign up and Login flows.

---

## 🛠️ Tech Stack

| Category | Technology Used |
| :--- | :--- |
| **Framework** | React Native |
| **State Management**| Redux Toolkit (`react-redux`, `@reduxjs/toolkit`) |
| **Navigation** | React Navigation (`native`, `native-stack`, `bottom-tabs`) |
| **Storage** | AsyncStorage (`@react-native-async-storage/async-storage`) |
| **Language / i18n** | Custom translation hook setup |

---

## 📁 Project Structure

```text
src/
 ├── components/       # Reusable UI components (TaskCard, CustomAlert, CustomButton)
 ├── hooks/            # Custom React hooks (useTranslation, useTheme)
 ├── screens/          # Application screens (Home, AddTask, TaskDetail, Profile, Settings, etc.)
 ├── store/            # Redux setup and slices (taskSlice, themeSlice)
 └── utils/            # Utilities like AsyncStorage helpers and translations data
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** installed (v16 or above recommended)
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

## 🔐 Login Demo
To test the app, you can use the following default credentials on the login screen:
- **Username**: `admin`
- **Password**: `1234`

---
<div align="center">
  <p><i>Built with ❤️ using React Native.</i></p>
</div>
