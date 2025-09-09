import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChartBar as BarChart3,
  Users,
  FileText,
  Settings,
  Plus,
  CreditCard as Edit,
  Trash2,
  Eye,
  TrendingUp,
  Calendar,
  Target,
  Globe,
  Download
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface QuestionData {
  id: number;
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdDate: string;
}

interface AnalyticsData {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  totalGames: number;
  avgSessionDuration: number;
  popularCategories: { name: string; percentage: number }[];
  dailyStats: { date: string; users: number; games: number }[];
}

export default function AdminScreen() {
  const [isArabic, setIsArabic] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'analytics' | 'questions' | 'users' | 'settings'>('analytics');
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null);

  const [newQuestion, setNewQuestion] = useState<Partial<QuestionData>>({
    question: '',
    questionAr: '',
    options: ['', '', '', ''],
    optionsAr: ['', '', '', ''],
    correctAnswer: 0,
    category: '',
    difficulty: 'medium',
  });

  const [analyticsData] = useState<AnalyticsData>({
    dailyActiveUsers: 8547,
    monthlyActiveUsers: 45632,
    totalGames: 234567,
    avgSessionDuration: 12.5,
    popularCategories: [
      { name: 'General Knowledge', percentage: 35 },
      { name: 'History', percentage: 22 },
      { name: 'Science', percentage: 18 },
      { name: 'Sports', percentage: 15 },
      { name: 'Arts', percentage: 10 },
    ],
    dailyStats: [
      { date: '2025-01-01', users: 7832, games: 15643 },
      { date: '2025-01-02', users: 8156, games: 16234 },
      { date: '2025-01-03', users: 8547, games: 17123 },
    ],
  });

  const [questionsData, setQuestionsData] = useState<QuestionData[]>([
    {
      id: 1,
      question: "What is the capital of Bahrain?",
      questionAr: "ما هي عاصمة البحرين؟",
      options: ["Manama", "Dubai", "Doha", "Kuwait City"],
      optionsAr: ["المنامة", "دبي", "الدوحة", "مدينة الكويت"],
      correctAnswer: 0,
      category: "Geography",
      difficulty: "easy",
      isActive: true,
      createdDate: "2025-01-01",
    },
    {
      id: 2,
      question: "Which year did the first iPhone launch?",
      questionAr: "في أي عام تم إطلاق أول آيفون؟",
      options: ["2006", "2007", "2008", "2009"],
      optionsAr: ["2006", "2007", "2008", "2009"],
      correctAnswer: 1,
      category: "Technology",
      difficulty: "medium",
      isActive: true,
      createdDate: "2025-01-01",
    },
  ]);

  const adminSections = [
    { key: 'analytics', label: isArabic ? 'التحليلات' : 'Analytics', icon: BarChart3 },
    { key: 'questions', label: isArabic ? 'الأسئلة' : 'Questions', icon: FileText },
    { key: 'users', label: isArabic ? 'المستخدمون' : 'Users', icon: Users },
    { key: 'settings', label: isArabic ? 'الإعدادات' : 'Settings', icon: Settings },
  ];

  const categories = [
    'General Knowledge', 'History', 'Science', 'Sports', 'Arts', 'Geography', 
    'Technology', 'Literature', 'Movies', 'Music'
  ];

  const handleAddQuestion = () => {
    if (!newQuestion.question || !newQuestion.questionAr || !newQuestion.category) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields'
      );
      return;
    }

    const question: QuestionData = {
      id: Date.now(),
      question: newQuestion.question!,
      questionAr: newQuestion.questionAr!,
      options: newQuestion.options as string[],
      optionsAr: newQuestion.optionsAr as string[],
      correctAnswer: newQuestion.correctAnswer!,
      category: newQuestion.category!,
      difficulty: newQuestion.difficulty as 'easy' | 'medium' | 'hard',
      isActive: true,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setQuestionsData([...questionsData, question]);
    setShowAddQuestionModal(false);
    setNewQuestion({
      question: '',
      questionAr: '',
      options: ['', '', '', ''],
      optionsAr: ['', '', '', ''],
      correctAnswer: 0,
      category: '',
      difficulty: 'medium',
    });

    Alert.alert(
      isArabic ? 'نجح' : 'Success',
      isArabic ? 'تم إضافة السؤال بنجاح' : 'Question added successfully'
    );
  };

  const handleDeleteQuestion = (id: number) => {
    Alert.alert(
      isArabic ? 'تأكيد الحذف' : 'Confirm Delete',
      isArabic ? 'هل أنت متأكد من حذف هذا السؤال؟' : 'Are you sure you want to delete this question?',
      [
        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: isArabic ? 'حذف' : 'Delete',
          style: 'destructive',
          onPress: () => {
            setQuestionsData(questionsData.filter(q => q.id !== id));
          },
        },
      ]
    );
  };

  const toggleQuestionStatus = (id: number) => {
    setQuestionsData(questionsData.map(q => 
      q.id === id ? { ...q, isActive: !q.isActive } : q
    ));
  };

  const exportData = () => {
    Alert.alert(
      isArabic ? 'تصدير البيانات' : 'Export Data',
      isArabic ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully'
    );
  };

  const renderAnalytics = () => (
    <ScrollView style={styles.sectionContent} showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Users size={24} color="#3B82F6" />
          </View>
          <Text style={styles.statNumber}>
            {analyticsData.dailyActiveUsers.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>
            {isArabic ? 'مستخدم نشط يومي' : 'Daily Active Users'}
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Calendar size={24} color="#10B981" />
          </View>
          <Text style={styles.statNumber}>
            {analyticsData.monthlyActiveUsers.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>
            {isArabic ? 'مستخدم نشط شهري' : 'Monthly Active Users'}
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Target size={24} color="#F59E0B" />
          </View>
          <Text style={styles.statNumber}>
            {analyticsData.totalGames.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>
            {isArabic ? 'إجمالي الألعاب' : 'Total Games'}
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <TrendingUp size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.statNumber}>
            {analyticsData.avgSessionDuration}m
          </Text>
          <Text style={styles.statLabel}>
            {isArabic ? 'متوسط مدة الجلسة' : 'Avg Session Duration'}
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {isArabic ? 'الفئات الشائعة' : 'Popular Categories'}
        </Text>
        {analyticsData.popularCategories.map((category, index) => (
          <View key={index} style={styles.categoryBar}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <View style={styles.barContainer}>
              <View 
                style={[styles.barFill, { width: `${category.percentage}%` }]} 
              />
            </View>
            <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={exportData}>
        <Download size={20} color="white" />
        <Text style={styles.exportButtonText}>
          {isArabic ? 'تصدير التقرير' : 'Export Report'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderQuestions = () => (
    <View style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {isArabic ? 'إدارة الأسئلة' : 'Question Management'}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddQuestionModal(true)}>
          <Plus size={20} color="white" />
          <Text style={styles.addButtonText}>
            {isArabic ? 'إضافة سؤال' : 'Add Question'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.questionsList} showsVerticalScrollIndicator={false}>
        {questionsData.map((question) => (
          <View key={question.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.questionInfo}>
                <Text style={styles.questionText} numberOfLines={2}>
                  {isArabic ? question.questionAr : question.question}
                </Text>
                <View style={styles.questionMeta}>
                  <Text style={styles.categoryTag}>{question.category}</Text>
                  <Text style={[
                    styles.difficultyTag,
                    question.difficulty === 'easy' && styles.easyTag,
                    question.difficulty === 'medium' && styles.mediumTag,
                    question.difficulty === 'hard' && styles.hardTag,
                  ]}>
                    {question.difficulty}
                  </Text>
                  <Text style={styles.dateTag}>{question.createdDate}</Text>
                </View>
              </View>
              <View style={[
                styles.statusIndicator,
                question.isActive && styles.activeIndicator
              ]} />
            </View>

            <View style={styles.questionActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => toggleQuestionStatus(question.id)}>
                <Eye size={16} color={question.isActive ? "#10B981" : "#6B7280"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setEditingQuestion(question)}>
                <Edit size={16} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteQuestion(question.id)}>
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderUsers = () => (
    <ScrollView style={styles.sectionContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>
        {isArabic ? 'إدارة المستخدمين' : 'User Management'}
      </Text>
      <View style={styles.comingSoon}>
        <Text style={styles.comingSoonText}>
          {isArabic ? 'قريباً...' : 'Coming Soon...'}
        </Text>
        <Text style={styles.comingSoonSubtext}>
          {isArabic ? 'ستتوفر إدارة المستخدمين قريباً' : 'User management features coming soon'}
        </Text>
      </View>
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView style={styles.sectionContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>
        {isArabic ? 'إعدادات النظام' : 'System Settings'}
      </Text>
      <View style={styles.comingSoon}>
        <Text style={styles.comingSoonText}>
          {isArabic ? 'قريباً...' : 'Coming Soon...'}
        </Text>
        <Text style={styles.comingSoonSubtext}>
          {isArabic ? 'ستتوفر إعدادات النظام قريباً' : 'System settings coming soon'}
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {isArabic ? 'لوحة الإدارة' : 'Admin Dashboard'}
          </Text>
          <TouchableOpacity
            style={styles.languageToggle}
            onPress={() => setIsArabic(!isArabic)}>
            <Globe size={16} color="white" />
            <Text style={styles.languageText}>
              {isArabic ? 'EN' : 'عربي'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          {isArabic ? 'إدارة محتوى وتحليلات التطبيق' : 'Manage app content and analytics'}
        </Text>
      </LinearGradient>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {adminSections.map((section) => (
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
        {selectedSection === 'analytics' && renderAnalytics()}
        {selectedSection === 'questions' && renderQuestions()}
        {selectedSection === 'users' && renderUsers()}
        {selectedSection === 'settings' && renderSettings()}
      </View>

      <Modal
        visible={showAddQuestionModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isArabic ? 'إضافة سؤال جديد' : 'Add New Question'}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAddQuestionModal(false)}>
              <Text style={styles.modalCloseText}>
                {isArabic ? 'إلغاء' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {isArabic ? 'السؤال (إنجليزي)' : 'Question (English)'}
              </Text>
              <TextInput
                style={styles.textInput}
                value={newQuestion.question}
                onChangeText={(text) => setNewQuestion({ ...newQuestion, question: text })}
                placeholder={isArabic ? 'أدخل السؤال بالإنجليزية' : 'Enter question in English'}
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {isArabic ? 'السؤال (عربي)' : 'Question (Arabic)'}
              </Text>
              <TextInput
                style={styles.textInput}
                value={newQuestion.questionAr}
                onChangeText={(text) => setNewQuestion({ ...newQuestion, questionAr: text })}
                placeholder={isArabic ? 'أدخل السؤال بالعربية' : 'Enter question in Arabic'}
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {isArabic ? 'الخيارات (إنجليزي)' : 'Options (English)'}
              </Text>
              {newQuestion.options?.map((option, index) => (
                <TextInput
                  key={index}
                  style={[
                    styles.textInput,
                    styles.optionInput,
                    newQuestion.correctAnswer === index && styles.correctOption
                  ]}
                  value={option}
                  onChangeText={(text) => {
                    const newOptions = [...(newQuestion.options || [])];
                    newOptions[index] = text;
                    setNewQuestion({ ...newQuestion, options: newOptions });
                  }}
                  placeholder={`${isArabic ? 'خيار' : 'Option'} ${index + 1}`}
                />
              ))}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {isArabic ? 'الخيارات (عربي)' : 'Options (Arabic)'}
              </Text>
              {newQuestion.optionsAr?.map((option, index) => (
                <TextInput
                  key={index}
                  style={[
                    styles.textInput,
                    styles.optionInput,
                    newQuestion.correctAnswer === index && styles.correctOption
                  ]}
                  value={option}
                  onChangeText={(text) => {
                    const newOptions = [...(newQuestion.optionsAr || [])];
                    newOptions[index] = text;
                    setNewQuestion({ ...newQuestion, optionsAr: newOptions });
                  }}
                  placeholder={`${isArabic ? 'خيار' : 'Option'} ${index + 1} (عربي)`}
                />
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddQuestion}>
                <Text style={styles.saveButtonText}>
                  {isArabic ? 'حفظ السؤال' : 'Save Question'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsGrid: {
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
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
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
  categoryBar: {
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
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  categoryPercentage: {
    width: 40,
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'right',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  questionsList: {
    flex: 1,
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
    alignItems: 'flex-start',
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
    flexWrap: 'wrap',
  },
  categoryTag: {
    fontSize: 10,
    backgroundColor: '#3B82F6',
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  difficultyTag: {
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  easyTag: {
    backgroundColor: '#DCFCE7',
    color: '#16A34A',
  },
  mediumTag: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  },
  hardTag: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
  },
  dateTag: {
    fontSize: 10,
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  activeIndicator: {
    backgroundColor: '#10B981',
  },
  questionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    marginLeft: 8,
  },
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 12,
  },
  comingSoonSubtext: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 48,
  },
  optionInput: {
    marginBottom: 8,
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  modalActions: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});