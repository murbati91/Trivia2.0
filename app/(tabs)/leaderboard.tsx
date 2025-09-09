import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Trophy,
  Medal,
  Award,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Crown,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Player {
  id: number;
  name: string;
  nameAr: string;
  score: number;
  gamesPlayed: number;
  winRate: number;
  avatar: string;
  country: string;
  level: number;
}

interface Tournament {
  id: number;
  name: string;
  nameAr: string;
  startDate: string;
  endDate: string;
  participants: number;
  prize: string;
  status: 'active' | 'upcoming' | 'completed';
}

export default function LeaderboardScreen() {
  const [isArabic, setIsArabic] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly' | 'allTime' | 'tournaments'>('daily');

  const [leaderboardData] = useState<Player[]>([
    {
      id: 1,
      name: "Ahmed Al-Rashid",
      nameAr: "أحمد الراشد",
      score: 15420,
      gamesPlayed: 89,
      winRate: 92.1,
      avatar: "👨‍💼",
      country: "🇧🇭",
      level: 25,
    },
    {
      id: 2,
      name: "Fatima Al-Zahra",
      nameAr: "فاطمة الزهراء",
      score: 14850,
      gamesPlayed: 76,
      winRate: 88.7,
      avatar: "👩‍🎓",
      country: "🇰🇼",
      level: 23,
    },
    {
      id: 3,
      name: "Omar Hassan",
      nameAr: "عمر حسان",
      score: 14200,
      gamesPlayed: 82,
      winRate: 85.4,
      avatar: "👨‍🔬",
      country: "🇶🇦",
      level: 22,
    },
    {
      id: 4,
      name: "Layla Mansouri",
      nameAr: "ليلى منصوري",
      score: 13950,
      gamesPlayed: 71,
      winRate: 87.3,
      avatar: "👩‍💻",
      country: "🇦🇪",
      level: 21,
    },
    {
      id: 5,
      name: "Khalid Al-Sabah",
      nameAr: "خالد الصباح",
      score: 13700,
      gamesPlayed: 68,
      winRate: 84.2,
      avatar: "👨‍🎨",
      country: "🇸🇦",
      level: 20,
    },
    {
      id: 6,
      name: "Nour Abdullah",
      nameAr: "نور عبد الله",
      score: 13450,
      gamesPlayed: 65,
      winRate: 82.8,
      avatar: "👩‍⚕️",
      country: "🇴🇲",
      level: 19,
    },
    {
      id: 7,
      name: "Yussef Al-Mahmoud",
      nameAr: "يوسف المحمود",
      score: 13200,
      gamesPlayed: 62,
      winRate: 81.5,
      avatar: "👨‍🏫",
      country: "🇧🇭",
      level: 18,
    },
    {
      id: 8,
      name: "Maryam Al-Qasimi",
      nameAr: "مريم القاسمي",
      score: 12980,
      gamesPlayed: 59,
      winRate: 79.9,
      avatar: "👩‍🎤",
      country: "🇦🇪",
      level: 17,
    },
  ]);

  const [tournaments] = useState<Tournament[]>([
    {
      id: 1,
      name: "GCC Knowledge Championship",
      nameAr: "بطولة المعرفة الخليجية",
      startDate: "2025-01-15",
      endDate: "2025-01-22",
      participants: 2847,
      prize: "$10,000",
      status: "active",
    },
    {
      id: 2,
      name: "Ramadan Quiz Challenge",
      nameAr: "تحدي مسابقة رمضان",
      startDate: "2025-03-01",
      endDate: "2025-03-29",
      participants: 0,
      prize: "$5,000",
      status: "upcoming",
    },
    {
      id: 3,
      name: "History Masters",
      nameAr: "أساتذة التاريخ",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      participants: 5432,
      prize: "$7,500",
      status: "completed",
    },
  ]);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown size={20} color="#FFD700" />;
      case 2:
        return <Medal size={20} color="#C0C0C0" />;
      case 3:
        return <Award size={20} color="#CD7F32" />;
      default:
        return <Text style={styles.rankNumber}>{position}</Text>;
    }
  };

  const getRankStyle = (position: number) => {
    switch (position) {
      case 1:
        return [styles.playerCard, styles.firstPlace];
      case 2:
        return [styles.playerCard, styles.secondPlace];
      case 3:
        return [styles.playerCard, styles.thirdPlace];
      default:
        return styles.playerCard;
    }
  };

  const tabs = [
    { key: 'daily', label: isArabic ? 'يومي' : 'Daily', icon: Calendar },
    { key: 'weekly', label: isArabic ? 'أسبوعي' : 'Weekly', icon: TrendingUp },
    { key: 'allTime', label: isArabic ? 'كل الأوقات' : 'All Time', icon: Trophy },
    { key: 'tournaments', label: isArabic ? 'البطولات' : 'Tournaments', icon: Award },
  ];

  const renderPlayerCard = (player: Player, position: number) => (
    <View key={player.id} style={getRankStyle(position)}>
      <View style={styles.playerRank}>
        {getRankIcon(position)}
      </View>
      
      <View style={styles.playerAvatar}>
        <Text style={styles.avatarEmoji}>{player.avatar}</Text>
        <Text style={styles.countryFlag}>{player.country}</Text>
      </View>

      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>
          {isArabic ? player.nameAr : player.name}
        </Text>
        <View style={styles.playerStats}>
          <View style={styles.statContainer}>
            <Target size={12} color="#6B7280" />
            <Text style={styles.statText}>{player.score.toLocaleString()}</Text>
          </View>
          <View style={styles.statContainer}>
            <Users size={12} color="#6B7280" />
            <Text style={styles.statText}>{player.gamesPlayed}</Text>
          </View>
          <View style={styles.statContainer}>
            <TrendingUp size={12} color="#6B7280" />
            <Text style={styles.statText}>{player.winRate}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.playerLevel}>
        <Text style={styles.levelText}>Lv.{player.level}</Text>
      </View>
    </View>
  );

  const renderTournamentCard = (tournament: Tournament) => (
    <View key={tournament.id} style={styles.tournamentCard}>
      <View style={styles.tournamentHeader}>
        <View style={styles.tournamentInfo}>
          <Text style={styles.tournamentName}>
            {isArabic ? tournament.nameAr : tournament.name}
          </Text>
          <Text style={styles.tournamentDates}>
            {tournament.startDate} - {tournament.endDate}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          tournament.status === 'active' && styles.activeStatus,
          tournament.status === 'upcoming' && styles.upcomingStatus,
          tournament.status === 'completed' && styles.completedStatus,
        ]}>
          <Text style={[
            styles.statusText,
            tournament.status === 'active' && styles.activeStatusText,
            tournament.status === 'upcoming' && styles.upcomingStatusText,
            tournament.status === 'completed' && styles.completedStatusText,
          ]}>
            {tournament.status === 'active' && (isArabic ? 'جارية' : 'Active')}
            {tournament.status === 'upcoming' && (isArabic ? 'قادمة' : 'Upcoming')}
            {tournament.status === 'completed' && (isArabic ? 'منتهية' : 'Completed')}
          </Text>
        </View>
      </View>

      <View style={styles.tournamentDetails}>
        <View style={styles.tournamentStat}>
          <Users size={16} color="#6B7280" />
          <Text style={styles.tournamentStatText}>
            {tournament.participants > 0 
              ? `${tournament.participants.toLocaleString()} ${isArabic ? 'مشارك' : 'participants'}`
              : (isArabic ? 'قريباً' : 'Coming Soon')
            }
          </Text>
        </View>
        <View style={styles.tournamentStat}>
          <Trophy size={16} color="#F59E0B" />
          <Text style={styles.tournamentStatText}>
            {tournament.prize} {isArabic ? 'جائزة' : 'Prize'}
          </Text>
        </View>
      </View>

      {tournament.status === 'upcoming' && (
        <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
          <Text style={styles.joinButtonText}>
            {isArabic ? 'انضم الآن' : 'Join Now'}
          </Text>
        </TouchableOpacity>
      )}
      
      {tournament.status === 'active' && (
        <TouchableOpacity style={[styles.joinButton, styles.activeButton]} activeOpacity={0.8}>
          <Text style={[styles.joinButtonText, styles.activeButtonText]}>
            {isArabic ? 'شارك الآن' : 'Play Now'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>
          {isArabic ? 'لوحة المتصدرين' : 'Leaderboards'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isArabic ? 'تنافس مع أفضل اللاعبين' : 'Compete with the best players'}
        </Text>

        <TouchableOpacity
          style={styles.languageToggle}
          onPress={() => setIsArabic(!isArabic)}>
          <Text style={styles.languageText}>
            {isArabic ? 'English' : 'عربي'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                selectedTab === tab.key && styles.activeTab,
              ]}
              onPress={() => setSelectedTab(tab.key as any)}
              activeOpacity={0.8}>
              <tab.icon
                size={18}
                color={selectedTab === tab.key ? '#3B82F6' : '#6B7280'}
              />
              <Text style={[
                styles.tabText,
                selectedTab === tab.key && styles.activeTabText,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'tournaments' ? (
          <View style={styles.tournamentsContainer}>
            {tournaments.map(renderTournamentCard)}
          </View>
        ) : (
          <>
            <View style={styles.topThreeContainer}>
              {leaderboardData.slice(0, 3).map((player, index) => (
                <View key={player.id} style={styles.podiumContainer}>
                  <View style={[
                    styles.podiumRank,
                    index === 0 && styles.firstPodium,
                    index === 1 && styles.secondPodium,
                    index === 2 && styles.thirdPodium,
                  ]}>
                    <Text style={styles.podiumAvatar}>{player.avatar}</Text>
                    <Text style={styles.podiumCountry}>{player.country}</Text>
                    {getRankIcon(index + 1)}
                  </View>
                  <Text style={styles.podiumName}>
                    {isArabic ? player.nameAr : player.name}
                  </Text>
                  <Text style={styles.podiumScore}>
                    {player.score.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.leaderboardContainer}>
              <Text style={styles.sectionTitle}>
                {isArabic ? 'التصنيف الكامل' : 'Full Rankings'}
              </Text>
              {leaderboardData.map((player, index) => renderPlayerCard(player, index + 1))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  languageToggle: {
    position: 'absolute',
    top: 65,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  languageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tabsContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
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
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  podiumContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  podiumRank: {
    width: 80,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  firstPodium: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
    height: 120,
  },
  secondPodium: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#9CA3AF',
  },
  thirdPodium: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#F87171',
  },
  podiumAvatar: {
    fontSize: 24,
  },
  podiumCountry: {
    fontSize: 16,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  leaderboardContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  firstPlace: {
    backgroundColor: '#FFFBEB',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  secondPlace: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#9CA3AF',
  },
  thirdPlace: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#F87171',
  },
  playerRank: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  playerAvatar: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  avatarEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  countryFlag: {
    fontSize: 16,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  playerStats: {
    flexDirection: 'row',
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  playerLevel: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  tournamentsContainer: {
    padding: 20,
  },
  tournamentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  tournamentDates: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#DCFCE7',
  },
  upcomingStatus: {
    backgroundColor: '#FEF3C7',
  },
  completedStatus: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatusText: {
    color: '#16A34A',
  },
  upcomingStatusText: {
    color: '#D97706',
  },
  completedStatusText: {
    color: '#6B7280',
  },
  tournamentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tournamentStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tournamentStatText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 6,
  },
  joinButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#10B981',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  activeButtonText: {
    color: 'white',
  },
});