import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Globe, Shield, CircleHelp as HelpCircle, LogOut, CreditCard as Edit, Trophy, Target, Calendar, Star, Volume2, VolumeX, Moon, Sun, Smartphone, Mail, Lock } from 'lucide-react-native';
import { authService } from '../../config/supabase';

const { width } = Dimensions.get('window');

interface UserProfile {
  name: string;
  nameAr: string;
  email: string;
  level: number;
  totalScore: number;
  gamesPlayed: number;
  winRate: number;
  joinDate: string;
  country: string;
  avatar: string;
}

interface UserSettings {
  notifications: boolean;
  soundEffects: boolean;
  darkMode: boolean;
  language: 'en' | 'ar';
  emailUpdates: boolean;
  pushNotifications: boolean;
}

export default function ProfileScreen() {
  const [isArabic, setIsArabic] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'profile' | 'settings' | 'help'>('profile');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    nameAr: "",
    email: "",
    level: 1,
    totalScore: 0,
    gamesPlayed: 0,
    winRate: 0,
    joinDate: new Date().toISOString().split('T')[0],
    country: "🇧🇭 Bahrain",
    avatar: "👨‍💼",
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    notifications: true,
    soundEffects: true,
    darkMode: false,
    language: 'en',
    emailUpdates: false,
    pushNotifications: true,
  });

  const [editedProfile, setEditedProfile] = useState({ ...userProfile });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      
      if (user) {
        setCurrentUser(user);
        
        // Load user profile from database
        const { data: profile, error } = await authService.getUserProfile(user.id);
        
        if (profile) {
          const profileData = {
            name: profile.name || user.user_metadata?.name || '',
            nameAr: profile.name_ar || user.user_metadata?.name_ar || '',
            email: user.email || '',
            level: profile.level || 1,
            totalScore: profile.total_score || 0,
            gamesPlayed: profile.games_played || 0,
            winRate: profile.games_played > 0 ? (profile.games_won / profile.games_played * 100) : 0,
            joinDate: user.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            country: profile.country || "🇧🇭 Bahrain",
            avatar: profile.avatar || "👨‍💼",
          };
          setUserProfile(profileData);
          setEditedProfile(profileData);
        } else {
          // Create initial profile
          const initialProfile = {
            name: user.user_metadata?.name || '',
            nameAr: user.user_metadata?.name_ar || '',
            email: user.email || '',
            level: 1,
            totalScore: 0,
            gamesPlayed: 0,
            winRate: 0,
            joinDate: user.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            country: "🇧🇭 Bahrain",
            avatar: "👨‍💼",
          };
          setUserProfile(initialProfile);
          setEditedProfile(initialProfile);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const achievements = [
    { id: 1, name: isArabic ? 'أول انتصار' : 'First Victory', icon: '🏆', unlocked: userProfile.gamesPlayed > 0 },
    { id: 2, name: isArabic ? 'عاشق المعرفة' : 'Knowledge Lover', icon: '📚', unlocked: userProfile.totalScore > 500 },
    { id: 3, name: isArabic ? 'خبير التاريخ' : 'History Expert', icon: '🏛️', unlocked: userProfile.level > 5 },
    { id: 4, name: isArabic ? 'عالم الجغرافيا' : 'Geography Master', icon: '🌍', unlocked: userProfile.level > 10 },
    { id: 5, name: isArabic ? 'نجم الرياضة' : 'Sports Star', icon: '⚽', unlocked: userProfile.winRate > 70 },
    { id: 6, name: isArabic ? 'عبقري العلوم' : 'Science Genius', icon: '🔬', unlocked: userProfile.level > 15 },
  ];

  const stats = [
    { 
      label: isArabic ? 'المستوى' : 'Level', 
      value: userProfile.level.toString(), 
      icon: Star, 
      color: '#F59E0B' 
    },
    { 
      label: isArabic ? 'النقاط' : 'Score', 
      value: userProfile.totalScore.toLocaleString(), 
      icon: Target, 
      color: '#3B82F6' 
    },
    { 
      label: isArabic ? 'الألعاب' : 'Games', 
      value: userProfile.gamesPlayed.toString(), 
      icon: Trophy, 
      color: '#10B981' 
    },
    { 
      label: isArabic ? 'معدل الفوز' : 'Win Rate', 
      value: `${userProfile.winRate.toFixed(1)}%`, 
      icon: Calendar, 
      color: '#8B5CF6' 
    },
  ];

  const menuSections = [
    { key: 'profile', label: isArabic ? 'الملف الشخصي' : 'Profile', icon: User },
    { key: 'settings', label: isArabic ? 'الإعدادات' : 'Settings', icon: Settings },
    { key: 'help', label: isArabic ? 'المساعدة' : 'Help', icon: HelpCircle },
  ];

  const handleSaveProfile = async () => {
    try {
      if (!currentUser) return;
      
      const { error } = await authService.updateProfile(currentUser.id, {
        name: editedProfile.name,
        name_ar: editedProfile.nameAr,
        country: editedProfile.country,
        avatar: editedProfile.avatar,
      });

      if (error) throw error;

      setUserProfile({ ...editedProfile });
      setIsEditingProfile(false);
      Alert.alert(
        isArabic ? 'تم الحفظ' : 'Saved',
        isArabic ? 'تم حفظ الملف الشخصي بنجاح' : 'Profile saved successfully'
      );
    } catch (error: any) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        error.message || (isArabic ? 'حدث خطأ أثناء الحفظ' : 'Failed to save profile')
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      isArabic ? 'تسجيل الخروج' : 'Logout',
      isArabic ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?',
      [
        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { 
          text: isArabic ? 'تسجيل الخروج' : 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.signOut();
              // The app will automatically redirect to auth screen
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setUserSettings({ ...userSettings, [key]: value });
    
    // Apply dark mode immediately
    if (key === 'darkMode') {
      // You can implement dark mode theme switching here
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>
          {isArabic ? 'جاري التحميل...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  const renderProfileSection = () => (
    <ScrollView style={styles.sectionContent} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{userProfile.avatar}</Text>
          <Text style={styles.countryFlag}>{userProfile.country}</Text>
        </View>
        
        <View style={styles.profileInfo}>
          {isEditingProfile ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.nameInput}
                value={editedProfile.name}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
                placeholder={isArabic ? 'الاسم' : 'Name'}
              />
              <TextInput
                style={styles.nameInput}
                value={editedProfile.nameAr}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, nameAr: text })}
                placeholder={isArabic ? 'الاسم بالعربية' : 'Arabic Name'}
              />
              <View style={styles.editActions}>
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={handleSaveProfile}>
                  <Text style={styles.saveButtonText}>
                    {isArabic ? 'حفظ' : 'Save'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    setEditedProfile({ ...userProfile });
                    setIsEditingProfile(false);
                  }}>
                  <Text style={styles.cancelButtonText}>
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileDisplay}>
              <Text style={styles.userName}>
                {isArabic ? userProfile.nameAr || userProfile.name : userProfile.name}
              </Text>
              <Text style={styles.userEmail}>{userProfile.email}</Text>
              <Text style={styles.joinDate}>
                {isArabic ? 'انضم في ' : 'Joined '}
                {new Date(userProfile.joinDate).toLocaleDateString()}
              </Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditingProfile(true)}>
                <Edit size={16} color="#3B82F6" />
                <Text style={styles.editButtonText}>
                  {isArabic ? 'تعديل' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
              <stat.icon size={24} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>
          {isArabic ? 'الإنجازات' : 'Achievements'}
        </Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View 
              key={achievement.id} 
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.lockedAchievement
              ]}>
              <Text style={[
                styles.achievementIcon,
                !achievement.unlocked && styles.lockedIcon
              ]}>
                {achievement.icon}
              </Text>
              <Text style={[
                styles.achievementName,
                !achievement.unlocked && styles.lockedText
              ]}>
                {achievement.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderSettingsSection = () => (
    <ScrollView style={styles.sectionContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>
        {isArabic ? 'الإعدادات' : 'Settings'}
      </Text>

      <View style={styles.settingGroup}>
        <Text style={styles.settingGroupTitle}>
          {isArabic ? 'التفضيلات' : 'Preferences'}
        </Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Bell size={20} color="#3B82F6" />
            <Text style={styles.settingLabel}>
              {isArabic ? 'الإشعارات' : 'Notifications'}
            </Text>
          </View>
          <Switch
            value={userSettings.notifications}
            onValueChange={(value) => updateSetting('notifications', value)}
            trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
            thumbColor="white"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            {userSettings.soundEffects ? (
              <Volume2 size={20} color="#3B82F6" />
            ) : (
              <VolumeX size={20} color="#6B7280" />
            )}
            <Text style={styles.settingLabel}>
              {isArabic ? 'الأصوات' : 'Sound Effects'}
            </Text>
          </View>
          <Switch
            value={userSettings.soundEffects}
            onValueChange={(value) => updateSetting('soundEffects', value)}
            trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
            thumbColor="white"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            {userSettings.darkMode ? (
              <Moon size={20} color="#3B82F6" />
            ) : (
              <Sun size={20} color="#F59E0B" />
            )}
            <Text style={styles.settingLabel}>
              {isArabic ? 'الوضع الليلي' : 'Dark Mode'}
            </Text>
          </View>
          <Switch
            value={userSettings.darkMode}
            onValueChange={(value) => updateSetting('darkMode', value)}
            trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
            thumbColor="white"
          />
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={() => setIsArabic(!isArabic)}>
          <View style={styles.settingLeft}>
            <Globe size={20} color="#3B82F6" />
            <Text style={styles.settingLabel}>
              {isArabic ? 'اللغة' : 'Language'}
            </Text>
          </View>
          <Text style={styles.settingValue}>
            {isArabic ? 'العربية' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#EF4444" />
        <Text style={styles.logoutText}>
          {isArabic ? 'تسجيل الخروج' : 'Logout'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderHelpSection = () => (
    <ScrollView style={styles.sectionContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>
        {isArabic ? 'المساعدة والدعم' : 'Help & Support'}
      </Text>

      <View style={styles.helpContainer}>
        <TouchableOpacity style={styles.helpItem}>
          <HelpCircle size={20} color="#3B82F6" />
          <Text style={styles.helpLabel}>
            {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </Text>
          <Text style={styles.helpArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpItem}>
          <Mail size={20} color="#3B82F6" />
          <Text style={styles.helpLabel}>
            {isArabic ? 'اتصل بنا' : 'Contact Us'}
          </Text>
          <Text style={styles.helpArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpItem}>
          <Shield size={20} color="#3B82F6" />
          <Text style={styles.helpLabel}>
            {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </Text>
          <Text style={styles.helpArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>
          {isArabic ? 'إصدار التطبيق: 1.0.0' : 'App Version: 1.0.0'}
        </Text>
        <Text style={styles.copyright}>
          © 2025 MindSpark Trivia - Murbati.ai & Salahuddin Softech Solutions
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <View style={[styles.container, userSettings.darkMode && styles.darkContainer]}>
      <LinearGradient
        colors={userSettings.darkMode ? ['#1F2937', '#111827'] : ['#3B82F6', '#1D4ED8']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>
          {selectedSection === 'profile' && (isArabic ? 'الملف الشخصي' : 'Profile')}
          {selectedSection === 'settings' && (isArabic ? 'الإعدادات' : 'Settings')}
          {selectedSection === 'help' && (isArabic ? 'المساعدة' : 'Help')}
        </Text>
        <TouchableOpacity
          style={styles.languageToggle}
          onPress={() => setIsArabic(!isArabic)}>
          <Globe size={16} color="white" />
          <Text style={styles.languageText}>
            {isArabic ? 'EN' : 'عربي'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {menuSections.map((section) => (
            <TouchableOpacity
              key={section.key}
              style={[
                styles.tabButton,
                selectedSection === section.key && styles.activeTab,
              ]}
              onPress={() => setSelectedSection(section.key as any)}
              activeOpacity={0.8}>
              <section.icon
                size={18}
                color={selectedSection === section.key ? '#3B82F6' : '#6B7280'}
              />
              <Text style={[
                styles.tabText,
                selectedSection === section.key && styles.activeTabText,
              ]}>
                {section.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {selectedSection === 'profile' && renderProfileSection()}
        {selectedSection === 'settings' && renderSettingsSection()}
        {selectedSection === 'help' && renderHelpSection()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  languageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  tabsContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  sectionContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  avatar: {
    fontSize: 48,
    marginBottom: 8,
  },
  countryFlag: {
    fontSize: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileDisplay: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  editContainer: {
    flex: 1,
  },
  nameInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  editActions: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  achievementsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 80) / 3,
    aspectRatio: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  lockedAchievement: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  lockedIcon: {
    opacity: 0.3,
  },
  achievementName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  settingGroup: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  helpContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  helpLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    marginLeft: 12,
  },
  helpArrow: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
