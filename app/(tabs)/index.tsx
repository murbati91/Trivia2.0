import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Play,
  Users,
  Trophy,
  Star,
  Clock,
  Target,
  Globe,
  TrendingUp,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface GameStats {
  totalPlayers: number;
  totalGames: number;
  totalQuestions: number;
  averageScore: number;
}

interface UserStats {
  gamesPlayed: number;
  bestScore: number;
  totalScore: number;
  rank: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const [gameStats, setGameStats] = useState<GameStats>({
    totalPlayers: 15432,
    totalGames: 89756,
    totalQuestions: 2340,
    averageScore: 78.5,
  });

  const [userStats, setUserStats] = useState<UserStats>({
    gamesPlayed: 24,
    bestScore: 950,
    totalScore: 18750,
    rank: 127,
  });

  const [isArabic, setIsArabic] = useState(false);

  const gameCategories = [
    { id: 1, name: isArabic ? 'الثقافة العامة' : 'General Culture', icon: '🧠', color: '#3B82F6' },
    { id: 2, name: isArabic ? 'التاريخ' : 'History', icon: '🏛️', color: '#10B981' },
    { id: 3, name: isArabic ? 'الرياضة' : 'Sports', icon: '⚽', color: '#F59E0B' },
    { id: 4, name: isArabic ? 'العلوم' : 'Science', icon: '🔬', color: '#8B5CF6' },
    { id: 5, name: isArabic ? 'الفن' : 'Art', icon: '🎨', color: '#EF4444' },
    { id: 6, name: isArabic ? 'الجغرافيا' : 'Geography', icon: '🌍', color: '#06B6D4' },
  ];

  const quickActions = [
    {
      id: 1,
      title: isArabic ? 'لعبة سريعة' : 'Quick Game',
      subtitle: isArabic ? 'ابدأ لعبة مع أسئلة عشوائية' : 'Start a game with random questions',
      icon: Play,
      color: '#3B82F6',
      action: () => router.push('/game'),
    },
    {
      id: 2,
      title: isArabic ? 'تحدي الأصدقاء' : 'Challenge Friends',
      subtitle: isArabic ? 'ادع أصدقاءك للعب معك' : 'Invite friends to play with you',
      icon: Users,
      color: '#10B981',
      action: () => router.push('/game'),
    },
    {
      id: 3,
      title: isArabic ? 'بطولة يومية' : 'Daily Tournament',
      subtitle: isArabic ? 'شارك في البطولة اليومية' : 'Join the daily tournament',
      icon: Trophy,
      color: '#F59E0B',
      action: () => router.push('/leaderboard'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>5osh Fkra</Text>
            <Text style={styles.logoSubtext}>
              {isArabic ? 'خوش فكرة' : 'Trivia Challenge'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.languageToggle}
            onPress={() => setIsArabic(!isArabic)}>
            <Globe size={20} color="white" />
            <Text style={styles.languageText}>{isArabic ? 'EN' : 'عربي'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.gamesPlayed}</Text>
            <Text style={styles.statLabel}>
              {isArabic ? 'ألعاب' : 'Games'}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.bestScore}</Text>
            <Text style={styles.statLabel}>
              {isArabic ? 'أفضل نتيجة' : 'Best Score'}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>#{userStats.rank}</Text>
            <Text style={styles.statLabel}>
              {isArabic ? 'الترتيب' : 'Rank'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'الإجراءات السريعة' : 'Quick Actions'}
          </Text>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={action.action}
              activeOpacity={0.8}>
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <action.icon size={24} color="white" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>
              <View style={styles.actionArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'الفئات الشائعة' : 'Popular Categories'}
          </Text>
          <View style={styles.categoriesGrid}>
            {gameCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { borderColor: category.color }]}
                onPress={() => router.push('/game')}
                activeOpacity={0.8}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[styles.categoryName, { color: category.color }]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'إحصائيات عامة' : 'Global Stats'}
          </Text>
          <View style={styles.globalStatsContainer}>
            <View style={styles.globalStatCard}>
              <View style={styles.globalStatIcon}>
                <Users size={24} color="#3B82F6" />
              </View>
              <Text style={styles.globalStatNumber}>
                {gameStats.totalPlayers.toLocaleString()}
              </Text>
              <Text style={styles.globalStatLabel}>
                {isArabic ? 'لاعب نشط' : 'Active Players'}
              </Text>
            </View>

            <View style={styles.globalStatCard}>
              <View style={styles.globalStatIcon}>
                <Target size={24} color="#10B981" />
              </View>
              <Text style={styles.globalStatNumber}>
                {gameStats.totalGames.toLocaleString()}
              </Text>
              <Text style={styles.globalStatLabel}>
                {isArabic ? 'لعبة مكتملة' : 'Games Completed'}
              </Text>
            </View>

            <View style={styles.globalStatCard}>
              <View style={styles.globalStatIcon}>
                <Star size={24} color="#F59E0B" />
              </View>
              <Text style={styles.globalStatNumber}>
                {gameStats.averageScore}%
              </Text>
              <Text style={styles.globalStatLabel}>
                {isArabic ? 'متوسط النتيجة' : 'Average Score'}
              </Text>
            </View>

            <View style={styles.globalStatCard}>
              <View style={styles.globalStatIcon}>
                <TrendingUp size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.globalStatNumber}>
                {gameStats.totalQuestions.toLocaleString()}
              </Text>
              <Text style={styles.globalStatLabel}>
                {isArabic ? 'سؤال متاح' : 'Questions Available'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.achievementsBanner}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.achievementGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>
                  {isArabic ? 'إنجازات جديدة!' : 'New Achievements!'}
                </Text>
                <Text style={styles.achievementSubtitle}>
                  {isArabic ? 'اكتشف التحديات الجديدة' : 'Discover new challenges'}
                </Text>
              </View>
              <View style={styles.achievementIcon}>
                <Trophy size={32} color="white" />
              </View>
            </LinearGradient>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  logoSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  languageToggle: {
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionArrow: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  globalStatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  globalStatCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  globalStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  globalStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  globalStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  achievementsBanner: {
    marginTop: 10,
  },
  achievementGradient: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  achievementIcon: {
    marginLeft: 16,
  },
});