import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, Globe } from 'lucide-react-native';
import { authService } from '../config/supabase';

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isArabic, setIsArabic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nameAr: '',
  });

  const handleAuth = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'يرجى ملء جميع الحقول' : 'Please fill all fields'
      );
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'
      );
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await authService.signIn(formData.email, formData.password);
        if (error) throw error;
        if (data.user) {
          onAuthSuccess(data.user);
        }
      } else {
        const { data, error } = await authService.signUp(formData.email, formData.password, {
          name: formData.name,
          name_ar: formData.nameAr,
        });
        if (error) throw error;
        
        Alert.alert(
          isArabic ? 'نجح التسجيل' : 'Success',
          isArabic ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully'
        );
        
        if (data.user) {
          onAuthSuccess(data.user);
        }
      }
    } catch (error: any) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        error.message || (isArabic ? 'حدث خطأ ما' : 'Something went wrong')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        
        <TouchableOpacity
          style={styles.languageToggle}
          onPress={() => setIsArabic(!isArabic)}>
          <Globe size={16} color="white" />
          <Text style={styles.languageText}>
            {isArabic ? 'EN' : 'عربي'}
          </Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>
            {isArabic ? 'مرحباً بك في' : 'Welcome to'}
          </Text>
          <Text style={styles.appName}>MindSpark Trivia</Text>
          <Text style={styles.subtitle}>
            {isLogin 
              ? (isArabic ? 'سجل دخولك للمتابعة' : 'Sign in to continue')
              : (isArabic ? 'أنشئ حساباً جديداً' : 'Create new account')
            }
          </Text>

          <View style={styles.form}>
            {!isLogin && (
              <>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder={isArabic ? 'الاسم' : 'Name'}
                    value={formData.name}
                    onChangeText={(text) => setFormData({...formData, name: text})}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Mail size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder={isArabic ? 'الاسم بالعربية' : 'Arabic Name'}
                    value={formData.nameAr}
                    onChangeText={(text) => setFormData({...formData, nameAr: text})}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <Mail size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder={isArabic ? 'البريد الإلكتروني' : 'Email'}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder={isArabic ? 'كلمة المرور' : 'Password'}
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
                secureTextEntry={!showPassword}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder={isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAuth}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.authButtonText}>
                  {isLogin 
                    ? (isArabic ? 'تسجيل الدخول' : 'Sign In')
                    : (isArabic ? 'إنشاء حساب' : 'Sign Up')
                  }
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.switchText}>
                {isLogin 
                  ? (isArabic ? 'ليس لديك حساب؟ ' : "Don't have an account? ")
                  : (isArabic ? 'لديك حساب؟ ' : 'Already have an account? ')
                }
                <Text style={styles.switchTextBold}>
                  {isLogin 
                    ? (isArabic ? 'إنشاء حساب' : 'Sign Up')
                    : (isArabic ? 'تسجيل الدخول' : 'Sign In')
                  }
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  languageToggle: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  languageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  authButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  switchTextBold: {
    fontWeight: '600',
    color: 'white',
  },
});
