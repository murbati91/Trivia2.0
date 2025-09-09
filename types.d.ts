// Global type declarations for React Native components and modules
declare module 'react-native' {
  export * from 'react-native/Libraries/ReactNative/ReactNative';
}

declare module 'expo-linear-gradient' {
  export const LinearGradient: any;
}

declare module 'lucide-react-native' {
  export const ChartBar: any;
  export const Users: any;
  export const FileText: any;
  export const Settings: any;
  export const Plus: any;
  export const CreditCard: any;
  export const Trash2: any;
  export const Eye: any;
  export const TrendingUp: any;
  export const Calendar: any;
  export const Target: any;
  export const Globe: any;
  export const Download: any;
  export const Play: any;
  export const Trophy: any;
  export const Star: any;
  export const Clock: any;
}

// Fix for expo router
declare module 'expo-router' {
  export const useRouter: () => any;
}
