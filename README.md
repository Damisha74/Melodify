# 🎵 Melodify - Music Streaming App

A **React Native** mobile application that allows users to discover and listen to music using the **Deezer API**.

## ✨ Features

### 🔐 User Authentication System
- 📝 **User registration** with email validation  
- 🔒 Secure **login system**  
- ✅ Password strength validation  
- 🗄️ Session management using **AsyncStorage**  
- 👁️ Password visibility toggle  

### 🎶 Music Player
- 🌟 Browse **top tracks** from Deezer  
- ⏯️ **Play/pause functionality**  
- 📊 Display **track ranking**  
- 🔍 **Search** for songs and artists  
- 🔢 **Play count** tracking  

### 🎨 User Interface
- 🌑 Modern, **dark-themed design**  
- 📱 Responsive layout  
- ⏳ **Loading states** with activity indicators  
- ❗ **Error handling** and validation  
- 🖼️ Background image on the welcome screen  

## ⚙️ Prerequisites

- 📦 **Node.js**  
- 📱 **React Native development environment**  
- 🚀 **Expo CLI**  
- 📂 **npm** or **yarn** package manager  

## 📋 Dependencies

- `react-native`  
- `@react-navigation/native`  
- `expo-av` (for audio playback)  
- `react-hook-form` (for form handling)  
- `@react-native-async-storage/async-storage`  
- `react-native-vector-icons/Ionicons`  

## 🛠️ Installation

1. Clone the repository:  
```bash
git clone https://github.com/Damisha74/Melodify.git
```

2. Install dependencies:  
```bash
npm install
# or
yarn install
```

3. Start the development server:  
```bash
npx expo start
```

## 📂 Project Structure

- `WelcomePage.js` - 🎉 Initial landing page with login/register options  
- `LoginPage.js` - 🔐 User authentication screen  
- `RegisterPage.js` - 📝 New user registration screen  
- `HomePage.js` - 🎶 Main application screen with music player functionality  

## 🔍 Features Implementation Details

### 🔐 Authentication
- 📧 Email validation using **regex patterns**  
- 🔑 Password validation  
- 📝 Form data handling using **React Hook Form**  
- 🗄️ User authentication using **AsyncStorage**  

### 🎵 Music Player
- 🌍 Integration with **Deezer API**  
- 🎧 Preview track playback  
- 🔍 Track search by song name or artist  
- 📊 Play count tracking using **Context API**  

### 💾 Data Storage
- 🗂️ User credentials stored in **AsyncStorage**  
- 📋 Session management  
- 🔢 Play count persistence  

## 🔒 Security Considerations
- ✅ Password validation enforced on both **registration** and **login**  
- 🔐 Secure storage of user credentials using **AsyncStorage**  
- 🛡️ Session management for maintaining user state  
- 🧹 Input sanitization for search queries  
