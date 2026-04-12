# 📱 Smart Tasks App

## 📌 Project Overview
Smart Tasks App is a task management application built using React Native.  
This app helps users to manage daily tasks efficiently.

---

## 🚀 Day 1 Progress

### ✅ Project Architecture & Setup
- Organized folder structure (screens, components, store, navigation, data)

### ✅ Static Data Management
- Used dummy data (dummyTasks.js) instead of backend

### ✅ Redux Toolkit Integration
- Implemented centralized state management
- Created slices (taskSlice, userSlice, themeSlice)

### ✅ React-Redux Provider
- Connected Redux store with the app using Provider

---

## 🛠️ Tech Stack
- React Native
- Redux Toolkit
- JavaScript

---

## 🔗 GitHub Repository                                                                               https://github.com/snehasneha1050-spec/Smart-Tasks-App.git
## 🚀 Day 2: React Navigation Setup
**Date:** 10-Apr-2026

### 🎯 Objective
Set up the core navigation flow of the application using React Navigation.

### 🛠️ Tasks Completed
- **Dependencies Installed:** Added `@react-navigation/native`, `@react-navigation/native-stack`, and `@react-navigation/bottom-tabs`.
- **Screen Initialization:** Created base UI components in the `src/screens/` directory (Home, AddTask, Profile, Settings, Login, Splash).
- **Bottom Tab Navigator:** Implemented `TabNavigator` to allow seamless switching between the main app features.
- **Stack Navigator:** Configured `AppNavigator` to handle the entry flow (`Splash` -> `Login`) and nested the main tabs inside it.
- **Environment Troubleshooting:** Successfully resolved Android Native build issues (NDK version mismatch and Metro Port conflicts).

### 📁 Updated Folder Structure
```text
src/
 ├── navigation/
 │    ├── AppNavigator.js
 │    └── TabNavigator.js
 ├── screens/
 │    ├── AddTaskScreen.js
 │    ├── HomeScreen.js
 │    ├── LoginScreen.js
 │    ├── ProfileScreen.js
 │    ├── SettingsScreen.js
 │    ├── SplashScreen.js
 │    └── TaskDetailScreen.js
  
## 🔗 GitHub Repository                                                                                                    https://github.com/snehasneha1050-spec/Smart-Tasks-App.git
