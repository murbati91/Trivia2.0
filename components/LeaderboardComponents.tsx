import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trophy, Medal, Award, Crown } from 'lucide-react-native';

interface PlayerRankProps {
  player: {
    id: number;
    name: string;
    nameAr: string;
    score: number;
    gamesPlayed: number;
    winRate: number;
    avatar: string;
    country: string;
    level: number;
  };
  position: number;
  isArabic?: boolean;
}

export const PlayerRankCard: React.FC<PlayerRankProps> = ({ 
  player, 
  position, 
  isArabic = false 
}) => {
  const getRankIcon = () => {
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

  const getCardStyle = () => {
    const baseStyle = [styles.playerCard];
    switch (position) {
      case 1:
        return [...baseStyle, styles.firstPlace];
      case 2:
        return [...baseStyle, styles.secondPlace];
      case 3:
        return [...baseStyle, styles.thirdPlace];
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity style={getCardStyle()} activeOpacity={0.8}>
      <View style={styles.rankContainer}>
        {getRankIcon()}
      </View>
      
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{player.avatar}</Text>
        <Text style={styles.country}>{player.country}</Text>
      </View>

      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>
          {isArabic ? player.nameAr : player.name}
        </Text>
        <View style={styles.playerStats}>
          <Text style={styles.statText}>
            {player.score.toLocaleString()} {isArabic ? 'نقطة' : 'pts'}
          </Text>
          <Text style={styles.statText}>
            {player.gamesPlayed} {isArabic ? 'لعبة' : 'games'}
          </Text>
          <Text style={styles.statText}>
            {player.winRate}% {isArabic ? 'فوز' : 'win'}
          </Text>
        </View>
      </View>

      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>Lv.{player.level}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface TournamentCardProps {
  tournament: {
    id: number;
    name: string;
    nameAr: string;
    startDate: string;
    endDate: string;
    participants: number;
    prize: string;
    status: 'active' | 'upcoming' | 'completed';
  };
  isArabic?: boolean;
  onJoin?: () => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ 
  tournament, 
  isArabic = false, 
  onJoin 
}) => {
  const getStatusStyle = () => {
    switch (tournament.status) {
      case 'active':
        return [styles.statusBadge, styles.activeStatus];
      case 'upcoming':
        return [styles.statusBadge, styles.upcomingStatus];
      case 'completed':
        return [styles.statusBadge, styles.completedStatus];
      default:
        return styles.statusBadge;
    }
  };

  const getStatusText = () => {
    switch (tournament.status) {
      case 'active':
        return isArabic ? 'جارية' : 'Active';
      case 'upcoming':
        return isArabic ? 'قادمة' : 'Upcoming';
      case 'completed':
        return isArabic ? 'منتهية' : 'Completed';
      default:
        return '';
    }
  };

  return (
    <View style={styles.tournamentCard}>
      <View style={styles.tournamentHeader}>
        <View style={styles.tournamentInfo}>
          <Text style={styles.tournamentName}>
            {isArabic ? tournament.nameAr : tournament.name}
          </Text>
          <Text style={styles.tournamentDates}>
            {tournament.startDate} - {tournament.endDate}
          </Text>
        </View>
        <View style={getStatusStyle()}>
          <Text style={[
            styles.statusText,
            tournament.status === 'active' && styles.activeStatusText,
            tournament.status === 'upcoming' && styles.upcomingStatusText,
            tournament.status === 'completed' && styles.completedStatusText,
          ]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <View style={styles.tournamentStats}>
        <View style={styles.tournamentStat}>
          <Text style={styles.statValue}>
            {tournament.participants > 0 
              ? tournament.participants.toLocaleString() 
              : '0'
            }
          </Text>
          <Text style={styles.statLabel}>
            {isArabic ? 'مشارك' : 'Participants'}
          </Text>
        </View>
        <View style={styles.tournamentStat}>
          <Trophy size={16} color="#F59E0B" />
          <Text style={styles.prizeText}>
            {tournament.prize}
          </Text>
        </View>
      </View>

      {tournament.status !== 'completed' && onJoin && (
        <TouchableOpacity 
          style={[
            styles.actionButton,
            tournament.status === 'active' && styles.activeButton
          ]} 
          onPress={onJoin}
          activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>
            {tournament.status === 'active' 
              ? (isArabic ? 'شارك الآن' : 'Join Now')
              : (isArabic ? 'سجل الاهتمام' : 'Register Interest')
            }
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  rankContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  avatarContainer: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  avatar: {
    fontSize: 32,
    marginBottom: 4,
  },
  country: {
    fontSize: 14,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  playerStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statText: {
    fontSize: 11,
    color: '#6B7280',
  },
  levelBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
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
    marginBottom: 16,
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
  tournamentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tournamentStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  prizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});