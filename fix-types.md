# TypeScript Fixes for Trivia2.0

## Quick Fix Commands

Run these commands in your terminal:

```bash
# 1. Navigate to project directory
cd C:\Users\Faisal\CascadeProjects\Trivia2.0

# 2. Install missing dependencies
npm install @types/react-native

# 3. Clean install (if issues persist)
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 4. Install additional missing packages that might be needed
npm install expo-dev-client

# 5. Try starting the development server
npx expo start --clear
```

## Type Fixes Applied

1. **Updated tsconfig.json** - Added proper JSX configuration
2. **Updated package.json** - Added missing @types/react-native dependency
3. **Fixed import formatting** - Better organized imports in admin.tsx

## Next Steps for EAS Build

After fixing the TypeScript errors, you can proceed with EAS setup:

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo (create account at expo.dev first)
eas login

# Initialize EAS
eas init

# Create development build
eas build --platform android --profile development
# OR for iOS
eas build --platform ios --profile development
```

## Remaining Type Issues

If you still see type errors, add these temporary fixes to admin.tsx:

1. Add `// @ts-ignore` above problematic lines temporarily
2. Or change function parameter types:
   - `(q) =>` becomes `(q: any) =>`
   - `(category, index) =>` becomes `(category: any, index: number) =>`
   - `(text) =>` becomes `(text: string) =>`

## Alternative: Disable Strict Mode Temporarily

If you want to proceed quickly with EAS build, you can temporarily disable strict mode:

In tsconfig.json, change:
```json
"strict": true,
```
to:
```json
"strict": false,
```

This will allow the build to proceed while you fix the type issues.
