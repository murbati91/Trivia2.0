import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ChartBar as BarChart3, Users, Target, TrendingUp, Calendar } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  subtitle?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}) => {
  return (
    <View style={styles.analyticsCard}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </View>
  );
};

interface CategoryChartProps {
  categories: Array<{
    name: string;
    percentage: number;
    color?: string;
  }>;
  isArabic?: boolean;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ 
  categories, 
  isArabic = false 
}) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>
        {isArabic ? 'الفئات الشائعة' : 'Popular Categories'}
      </Text>
      {categories.map((category, index) => (
        <View key={index} style={styles.categoryRow}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <View style={styles.barContainer}>
            <View 
              style={[
                styles.barFill, 
                { 
                  width: `${category.percentage}%`,
                  backgroundColor: category.color || '#3B82F6'
                }
              ]} 
            />
          </View>
          <Text style={styles.percentage}>{category.percentage}%</Text>
        </View>
      ))}
    </View>
  );
};

interface QuestionManagementCardProps {
  question: {
    id: number;
    question: string;
    questionAr: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    isActive: boolean;
    createdDate: string;
  };
  isArabic?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
}

export const QuestionManagementCard: React.FC<QuestionManagementCardProps> = ({
  question,
  isArabic = false,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'easy':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'hard':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <View style={styles.questionInfo}>
          <Text style={styles.questionText} numberOfLines={2}>
            {isArabic ? question.questionAr : question.question}
          </Text>
          <View style={styles.questionMeta}>
            <View style={[styles.categoryTag, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.tagText}>{question.category}</Text>
            </View>
            <View style={[styles.difficultyTag, { backgroundColor: getDifficultyColor() }]}>
              <Text style={styles.tagText}>{question.difficulty}</Text>
            </View>
            <Text style={styles.dateText}>{question.createdDate}</Text>
          </View>
        </View>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: question.isActive ? '#10B981' : '#E5E7EB' }
        ]} />
      </View>

      <View style={styles.questionActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onToggleStatus}>
          <Text style={styles.actionText}>
            {question.isActive ? (isArabic ? 'إخفاء' : 'Hide') : (isArabic ? 'إظهار' : 'Show')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={onEdit}>
          <Text style={styles.editButtonText}>
            {isArabic ? 'تعديل' : 'Edit'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}>
          <Text style={styles.deleteButtonText}>
            {isArabic ? 'حذف' : 'Delete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface UserManagementCardProps {
  user: {
    id: number;
    name: string;
    email: string;
    gamesPlayed: number;
    score: number;
    joinDate: string;
    isActive: boolean;
  };
  isArabic?: boolean;
  onToggleStatus?: () => void;
  onViewDetails?: () => void;
}

export const UserManagementCard: React.FC<UserManagementCardProps> = ({
  user,
  isArabic = false,
  onToggleStatus,
  onViewDetails,
}) => {
  return (
    <TouchableOpacity style={styles.userCard} onPress={onViewDetails} activeOpacity={0.8}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.userStats}>
          <Text style={styles.userStatText}>
            {user.gamesPlayed} {isArabic ? 'لعبة' : 'games'}
          </Text>
          <Text style={styles.userStatText}>
            {user.score.toLocaleString()} {isArabic ? 'نقطة' : 'points'}
          </Text>
          <Text style={styles.userStatText}>
            {isArabic ? 'انضم في' : 'Joined'} {user.joinDate}
          </Text>
        </View>
      </View>
      
      <View style={styles.userActions}>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: user.isActive ? '#10B981' : '#E5E7EB' }
        ]} />
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={onToggleStatus}>
          <Text style={styles.toggleButtonText}>
            {user.isActive 
              ? (isArabic ? 'تعطيل' : 'Disable') 
              : (isArabic ? 'تفعيل' : 'Enable')
            }
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  analyticsCard: {
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 2,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    width: 100,
    fontSize: 12,
    color: '#4B5563',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    width: 40,
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'right',
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  questionInfo: {
    flex: 1,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 10,
    color: '#6B7280',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
  questionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  editButton: {
    backgroundColor: '#EFF6FF',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  editButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
  },
  deleteButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  userStatText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  userActions: {
    alignItems: 'center',
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  toggleButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
});