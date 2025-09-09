# 5osh Fkra Trivia Game - Deployment Guide

This guide provides comprehensive instructions for deploying and sharing the 5osh Fkra Trivia Game across different platforms and environments.

## 📋 Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Sharing with Colleagues](#sharing-with-colleagues)
3. [Development Builds](#development-builds)
4. [Production Deployment](#production-deployment)
5. [Environment Configurations](#environment-configurations)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Testing Procedures](#testing-procedures)
8. [Troubleshooting](#troubleshooting)

## 🌐 Deployment Overview

The 5osh Fkra Trivia Game can be deployed across multiple platforms:

- **Development Sharing**: Expo Go app, Development builds
- **Web**: Static hosting (Netlify, Vercel, AWS S3)
- **iOS**: App Store, TestFlight (beta testing)
- **Android**: Google Play Store, Internal testing
- **Enterprise**: Internal distribution

### Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│                 │    │                 │    │                 │
│ • Expo Go       │    │ • Dev Builds    │    │ • App Stores    │
│ • Local Testing │    │ • Team Testing  │    │ • Web Hosting   │
│ • Hot Reload    │    │ • QA Testing    │    │ • CDN           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 👥 Sharing with Colleagues

### Method 1: Expo Go App (Quickest for Development)

The Expo Go app is the fastest way to share your development build with team members.

#### Prerequisites
- Team members need **Expo Go** app installed:
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

#### Steps to Share

1. **Start Development Server**
   ```bash
   npm run dev
   # or
   npx expo start
   ```

2. **Share via QR Code**
   - QR code appears in terminal and browser
   - Team members scan with Expo Go app
   - Ensure all devices are on the same network

3. **Share via Link**
   ```bash
   # Generate shareable link
   npx expo start --tunnel
   ```
   - Creates a public URL accessible from anywhere
   - Share the `exp://` link with team members

4. **Share via Email/Slack**
   - Copy the Expo URL from the development server
   - Send to team members: `exp://192.168.1.100:8081`

#### Advantages
- ✅ Instant sharing
- ✅ Hot reload for real-time updates
- ✅ No build process required
- ✅ Cross-platform testing

#### Limitations
- ❌ Requires Expo Go app
- ❌ Limited to Expo SDK features
- ❌ Network dependency

### Method 2: Expo Development Builds (Recommended for Teams)

Development builds provide a more native experience and support custom native code.

#### Creating Development Builds

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS Build**
   ```bash
   eas build:configure
   ```

4. **Create Development Build**
   ```bash
   # For iOS
   eas build --platform ios --profile development

   # For Android
   eas build --platform android --profile development

   # For both platforms
   eas build --platform all --profile development
   ```

#### Sharing Development Builds

1. **Via Expo Dashboard**
   - Visit [expo.dev](https://expo.dev)
   - Navigate to your project
   - Go to "Builds" section
   - Share build URLs with team members

2. **Via Direct Download**
   ```bash
   # Get build URL
   eas build:list
   ```
   - Copy download URLs
   - Share via email/Slack/Teams

3. **Via QR Code**
   - Each build has a QR code in Expo dashboard
   - Team members scan to download

#### Installing Development Builds

**iOS (TestFlight or Direct Install):**
```bash
# Install via TestFlight (if configured)
# Or download .ipa file and install via Xcode/Apple Configurator
```

**Android:**
```bash
# Download .apk file
# Enable "Install from Unknown Sources"
# Install the .apk file
```

### Method 3: Expo Web Interface Team Collaboration

#### Setting Up Team Access

1. **Create Expo Organization**
   ```bash
   # Create organization
   expo organizations:create your-org-name
   ```

2. **Invite Team Members**
   - Go to [expo.dev](https://expo.dev)
   - Navigate to your organization
   - Click "Members" → "Invite"
   - Send invitations via email

3. **Configure Project Permissions**
   ```json
   // app.json
   {
     "expo": {
       "owner": "your-org-name",
       "slug": "5osh-fkra-trivia"
     }
   }
   ```

#### Team Collaboration Features

- **Shared Builds**: All team members can access builds
- **Analytics**: Shared crash reports and usage analytics
- **Updates**: OTA (Over-The-Air) updates for the team
- **Comments**: Build-specific feedback and comments

### Method 4: Advanced Sharing Methods

#### Internal Distribution (Enterprise)

1. **iOS Enterprise Distribution**
   ```bash
   # Configure enterprise profile
   eas build --platform ios --profile enterprise
   ```

2. **Android Internal Testing**
   ```bash
   # Upload to Google Play Console
   eas submit --platform android --track internal
   ```

#### Custom Distribution Portal

Create a simple web portal for team access:

```html
<!DOCTYPE html>
<html>
<head>
    <title>5osh Fkra - Team Builds</title>
</head>
<body>
    <h1>Latest Builds</h1>
    <div>
        <h2>iOS</h2>
        <a href="[IOS_BUILD_URL]">Download iOS Build</a>
        <img src="[QR_CODE_URL]" alt="iOS QR Code">
    </div>
    <div>
        <h2>Android</h2>
        <a href="[ANDROID_BUILD_URL]">Download Android Build</a>
        <img src="[QR_CODE_URL]" alt="Android QR Code">
    </div>
</body>
</html>
```

## 🔨 Development Builds

### EAS Build Configuration

Create `eas.json` in your project root:

```json
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Building for Different Environments

```bash
# Development build (for testing)
eas build --profile development --platform all

# Preview build (for stakeholder review)
eas build --profile preview --platform all

# Production build (for app stores)
eas build --profile production --platform all
```

### Custom Development Client

For projects with custom native code:

1. **Install Expo Dev Client**
   ```bash
   npx expo install expo-dev-client
   ```

2. **Configure Development Build**
   ```bash
   eas build --profile development --platform ios
   ```

3. **Install and Use**
   - Install the custom development client
   - Launch and connect to your development server

## 🚀 Production Deployment

### Web Deployment

#### Option 1: Netlify (Recommended)

1. **Build for Web**
   ```bash
   npm run build:web
   ```

2. **Deploy to Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Configure Netlify**
   ```toml
   # netlify.toml
   [build]
     publish = "dist"
     command = "npm run build:web"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option 3: AWS S3 + CloudFront

```bash
# Build
npm run build:web

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### iOS App Store Deployment

#### Prerequisites
- Apple Developer Account ($99/year)
- macOS with Xcode installed
- App Store Connect access

#### Steps

1. **Configure App Store Settings**
   ```json
   // app.json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.khoshfkra.trivia",
         "buildNumber": "1.0.0"
       }
     }
   }
   ```

2. **Create Production Build**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

4. **App Store Connect Configuration**
   - Add app metadata
   - Upload screenshots
   - Set pricing and availability
   - Submit for review

#### TestFlight Beta Testing

```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios --track testflight
```

### Android Google Play Store Deployment

#### Prerequisites
- Google Play Console account ($25 one-time fee)
- Signed APK/AAB

#### Steps

1. **Configure Play Store Settings**
   ```json
   // app.json
   {
     "expo": {
       "android": {
         "package": "com.khoshfkra.trivia",
         "versionCode": 1
       }
     }
   }
   ```

2. **Create Production Build**
   ```bash
   eas build --platform android --profile production
   ```

3. **Submit to Play Store**
   ```bash
   eas submit --platform android
   ```

4. **Play Console Configuration**
   - Complete store listing
   - Upload screenshots
   - Set content rating
   - Configure pricing
   - Submit for review

#### Internal Testing

```bash
# Submit to internal testing track
eas submit --platform android --track internal
```

## ⚙️ Environment Configurations

### Environment-Specific Settings

Create different configurations for each environment:

```javascript
// config/environments.js
const environments = {
  development: {
    API_URL: 'http://localhost:3000',
    DEBUG: true,
    ANALYTICS_ENABLED: false
  },
  staging: {
    API_URL: 'https://staging-api.khoshfkra.com',
    DEBUG: true,
    ANALYTICS_ENABLED: true
  },
  production: {
    API_URL: 'https://api.khoshfkra.com',
    DEBUG: false,
    ANALYTICS_ENABLED: true
  }
};

export default environments[process.env.NODE_ENV || 'development'];
```

### Build-Time Configuration

```json
// app.config.js
export default ({ config }) => {
  const environment = process.env.NODE_ENV || 'development';
  
  return {
    ...config,
    name: environment === 'production' ? '5osh Fkra' : `5osh Fkra (${environment})`,
    slug: 'khosh-fkra-trivia',
    extra: {
      environment,
      apiUrl: process.env.API_URL,
    }
  };
};
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy App

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Setup Expo
      uses: expo/expo-github-action@v8
      with:
        expo-version: latest
        token: ${{ secrets.EXPO_TOKEN }}
        
    - name: Build for production
      if: github.ref == 'refs/heads/main'
      run: |
        eas build --platform all --profile production --non-interactive
        
    - name: Deploy to staging
      if: github.ref == 'refs/heads/develop'
      run: |
        eas build --platform all --profile preview --non-interactive
```

### Automated Testing

```yaml
# Add to CI pipeline
- name: Run E2E tests
  run: |
    npm run test:e2e
    
- name: Run unit tests
  run: |
    npm run test:unit
    
- name: Check TypeScript
  run: |
    npx tsc --noEmit
```

## 🧪 Testing Procedures

### Pre-Deployment Checklist

#### Functionality Testing
- [ ] All screens load correctly
- [ ] Navigation works on all platforms
- [ ] Game mechanics function properly
- [ ] Admin dashboard accessible
- [ ] Language switching works
- [ ] Offline functionality (if applicable)

#### Performance Testing
- [ ] App launches within 3 seconds
- [ ] Smooth animations and transitions
- [ ] Memory usage within acceptable limits
- [ ] Battery usage optimized

#### Platform-Specific Testing
- [ ] iOS: Test on multiple device sizes
- [ ] Android: Test on different Android versions
- [ ] Web: Test on major browsers
- [ ] Responsive design on all screen sizes

#### Security Testing
- [ ] No sensitive data in logs
- [ ] API endpoints secured
- [ ] User data properly encrypted
- [ ] Authentication working correctly

### Automated Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Generate test coverage
npm run test:coverage
```

### Manual Testing Protocol

1. **Device Testing Matrix**
   ```
   iOS: iPhone 12, iPhone 14 Pro, iPad Air
   Android: Samsung Galaxy S21, Google Pixel 6, OnePlus 9
   Web: Chrome, Firefox, Safari, Edge
   ```

2. **Test Scenarios**
   - New user onboarding
   - Game completion flow
   - Admin functions
   - Error handling
   - Network connectivity issues

## 🔧 Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Clear cache and rebuild
expo r -c
eas build --clear-cache --platform all

# Check build logs
eas build:list
eas build:view [BUILD_ID]
```

#### Submission Issues

```bash
# Check submission status
eas submit:list

# Resubmit if needed
eas submit --platform ios --latest
```

#### Environment Issues

```bash
# Verify environment variables
expo config --type public

# Check build configuration
cat eas.json
```

### Performance Optimization

#### Bundle Size Optimization

```bash
# Analyze bundle size
npx expo export --dump-assetmap

# Remove unused dependencies
npm prune
```

#### Runtime Performance

```javascript
// Enable Flipper for debugging
// Add to app.json
{
  "expo": {
    "plugins": [
      ["expo-dev-client", {
        "addGeneratedScheme": false
      }]
    ]
  }
}
```

### Monitoring and Analytics

#### Crash Reporting

```bash
# Install Sentry
npx expo install @sentry/react-native

# Configure in app.json
{
  "expo": {
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "your-org",
            "project": "khosh-fkra-trivia"
          }
        }
      ]
    }
  }
}
```

#### Performance Monitoring

```javascript
// Add performance monitoring
import { Performance } from '@react-native-firebase/perf';

const trace = Performance().newTrace('game_load_time');
await trace.start();
// ... game loading logic
await trace.stop();
```

## 📞 Support and Resources

### Documentation Links
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Guidelines](https://developer.apple.com/app-store/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

### Getting Help
- **Expo Forums**: [forums.expo.dev](https://forums.expo.dev/)
- **Discord**: [Expo Community Discord](https://chat.expo.dev/)
- **GitHub Issues**: Report bugs and feature requests

### Emergency Contacts
- **Technical Lead**: [Insert contact]
- **DevOps Team**: [Insert contact]
- **Project Manager**: [Insert contact]

---

**Successful Deployment! 🚀**

Remember to test thoroughly before each deployment and maintain proper version control practices.