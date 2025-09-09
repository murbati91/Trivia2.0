# 5osh Fkra Trivia Game

A modern, bilingual trivia game built with Expo and React Native, designed for the GCC market. Features comprehensive gameplay mechanics, admin dashboard, and cross-platform compatibility.

## 🎮 Features

### Core Gameplay
- **Multi-language Support**: Full Arabic and English bilingual interface
- **Interactive Gameplay**: Multiple choice questions with lifelines (50/50, hints, skip)
- **Scoring System**: Comprehensive scoring with levels, achievements, and leaderboards
- **Game Modes**: Single player with future multi-player capabilities
- **Categories**: Dynamic question categories (Geography, History, Science, Sports, etc.)

### Administrative Features
- **Content Management**: Add, edit, and manage trivia questions
- **Analytics Dashboard**: User engagement metrics and game statistics
- **User Management**: Player profiles and activity tracking
- **Tournament System**: Leaderboards and competitive gameplay

### Technical Features
- **Cross-Platform**: iOS, Android, and Web support
- **Responsive Design**: Optimized for all screen sizes
- **Modern UI**: Clean, professional interface with smooth animations
- **TypeScript**: Full type safety and better developer experience

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (LTS version 18.x or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js) or **Yarn**
  - Verify npm: `npm --version`
  - Or install Yarn: `npm install -g yarn`
- **Git** for version control
  - Download from [git-scm.com](https://git-scm.com/)

### Development Tools
- **Expo CLI** (recommended for easier development)
  ```bash
  npm install -g @expo/cli
  ```
- **Code Editor**: VS Code with React Native extensions recommended
- **Mobile Testing**: 
  - **Expo Go** app on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
  - Or iOS Simulator (macOS) / Android Emulator

### System Requirements
- **macOS**: 10.15 or later (for iOS development)
- **Windows**: 10 or later
- **Linux**: Ubuntu 18.04 or equivalent
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd 5osh-fkra-trivia-game
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Or using Yarn
yarn install
```

### 3. Verify Installation
```bash
# Check if all dependencies are installed correctly
npm list --depth=0
```

## 🛠️ Local Development Setup

### 1. Start the Development Server
```bash
# Start Expo development server
npm run dev

# Alternative commands
npx expo start
# or
yarn start
```

### 2. Running on Different Platforms

Once the development server starts, you'll see a QR code and several options:

#### Web Browser
- Press `w` in the terminal, or
- Click "Open in web browser" in the Expo Dev Tools
- Navigate to `http://localhost:8081` (or the displayed URL)

#### iOS Simulator (macOS only)
- Press `i` in the terminal, or
- Click "Run on iOS simulator" in Expo Dev Tools
- Requires Xcode to be installed

#### Android Emulator
- Press `a` in the terminal, or
- Click "Run on Android emulator" in Expo Dev Tools
- Requires Android Studio and an AVD to be set up

#### Physical Device
- Install **Expo Go** app on your device
- Scan the QR code displayed in the terminal
- Ensure your device and computer are on the same network

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Expo |
| `npm run build:web` | Build web version for production |
| `npm run lint` | Run ESLint to check code quality |
| `npm start` | Alternative way to start development server |

## 📁 Project Structure

```
5osh-fkra-trivia-game/
├── app/                          # Expo Router app directory
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx            # Home screen
│   │   ├── game.tsx             # Game screen
│   │   ├── leaderboard.tsx      # Leaderboard screen
│   │   ├── admin.tsx            # Admin dashboard
│   │   ├── profile.tsx          # User profile
│   │   └── _layout.tsx          # Tab layout configuration
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx           # 404 page
├── components/                   # Reusable UI components
│   ├── GameComponents.tsx       # Game-specific components
│   ├── LeaderboardComponents.tsx # Leaderboard components
│   └── AdminComponents.tsx      # Admin dashboard components
├── hooks/                       # Custom React hooks
│   └── useFrameworkReady.ts     # Framework initialization hook
├── assets/                      # Static assets
│   └── images/                  # Image files
├── .expo/                       # Expo configuration (auto-generated)
├── node_modules/                # Dependencies (auto-generated)
├── app.json                     # Expo app configuration
├── package.json                 # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🔧 Environment Variables

Currently, this project doesn't require environment variables for basic functionality. However, for production deployment, you may need:

### Create `.env` file (if needed):
```bash
# Example environment variables
EXPO_PUBLIC_API_URL=https://your-api-endpoint.com
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Accessing Environment Variables:
```typescript
// In your code
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

> **Note**: Environment variables in Expo must be prefixed with `EXPO_PUBLIC_` to be accessible in the client-side code.

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Metro bundler issues
```bash
# Clear Metro cache
npx expo start --clear

# Or clear npm cache
npm start -- --reset-cache
```

#### 2. Node modules issues
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### 3. Expo CLI issues
```bash
# Update Expo CLI
npm install -g @expo/cli@latest

# Check Expo CLI version
expo --version
```

#### 4. iOS Simulator not opening
- Ensure Xcode is installed and updated
- Open Xcode and accept license agreements
- Try: `sudo xcode-select --install`

#### 5. Android Emulator issues
- Ensure Android Studio is installed
- Create an AVD (Android Virtual Device)
- Start the emulator manually before running the app

#### 6. Network connectivity issues
- Ensure your device and computer are on the same WiFi network
- Try using tunnel mode: `expo start --tunnel`
- Check firewall settings

#### 7. TypeScript errors
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Install missing type definitions
npm install --save-dev @types/react @types/react-native
```

### Getting Help

If you encounter issues not covered here:

1. Check the [Expo Documentation](https://docs.expo.dev/)
2. Search [Expo Forums](https://forums.expo.dev/)
3. Check [GitHub Issues](https://github.com/expo/expo/issues)
4. Contact the development team

## 🤝 Contributing

We welcome contributions to improve the 5osh Fkra Trivia Game!

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add TypeScript types for new code
   - Test your changes thoroughly
4. **Commit your changes**
   ```bash
   git commit -m "Add: your descriptive commit message"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

### Code Style Guidelines

- Use TypeScript for all new code
- Follow React Native best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure responsive design for all screen sizes
- Test on both iOS and Android platforms

### Commit Message Format
```
Type: Brief description

Types: Add, Update, Fix, Remove, Refactor
Example: "Add: user authentication system"
```

## 📱 Platform-Specific Notes

### iOS Development
- Requires macOS for iOS Simulator
- Xcode installation needed for iOS builds
- Apple Developer account required for App Store deployment

### Android Development
- Android Studio recommended for emulator setup
- Java Development Kit (JDK) required
- Google Play Console account needed for Play Store deployment

### Web Development
- Works in all modern browsers
- Responsive design optimized for mobile-first
- Progressive Web App (PWA) capabilities

## 🔗 Useful Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Expo Router Documentation](https://expo.github.io/router/)
- [React Navigation](https://reactnavigation.org/)

## 📄 License

This project is proprietary software. Faisal Almurbati and Salahuddin Softech Solution retains complete ownership of all source code, intellectual property, and game assets developed under this project.

## 📞 Support

For technical support or questions about this project, please contact:

- **Development Team**: [Insert contact information]
- **Project Manager**: [Insert contact information]
- **Technical Lead**: [Insert contact information]

---

**Happy Coding! 🎮✨**