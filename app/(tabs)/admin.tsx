import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  BarChart3, 
  Settings, 
  Shield,
  Database,
  FileText,
  Download,
  X,
  Save
} from 'lucide-react-native';
import { supabase, getFallbackQuestions, testSupabaseConnection } from '../../config/supabase';

interface Question {
  id: number;
  question: string;
  question_ar: string;
  options: string[];
  options_ar: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  created_at: string;
  correct_answer: number;
}

export default function AdminScreen() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'offline' | 'testing'>('testing');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    activeQuestions: 0,
    totalUsers: 0,
    totalGames: 0,
  });

  // New question form state
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    question_ar: '',
    options: ['', '', '', ''],
    options_ar: ['', '', '', ''],
    category: 'General',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    correct_answer: 0,
  });

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setLoading(true);
    setConnectionStatus('testing');
    
    // Test connection first
    const connectionTest = await testSupabaseConnection();
    
    if (connectionTest.success) {
      setConnectionStatus('connected');
      await loadQuestionsFromSupabase();
    } else {
      console.warn('Supabase connection failed, using offline mode:', connectionTest.message);
      setConnectionStatus('offline');
      const fallbackQuestions = getFallbackQuestions();
      setQuestions(fallbackQuestions);
      updateStats(fallbackQuestions);
      setLoading(false);
    }
  };

  const loadQuestionsFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formattedQuestions = data.map(q => ({
          ...q,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]'),
          options_ar: Array.isArray(q.options_ar) ? q.options_ar : JSON.parse(q.options_ar || '[]'),
        }));
        
        setQuestions(formattedQuestions.length > 0 ? formattedQuestions : getFallbackQuestions());
        updateStats(formattedQuestions.length > 0 ? formattedQuestions : getFallbackQuestions());
      } else {
        setQuestions(getFallbackQuestions());
        updateStats(getFallbackQuestions());
      }
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      setConnectionStatus('offline');
      setQuestions(getFallbackQuestions());
      updateStats(getFallbackQuestions());
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (questionsData: Question[]) => {
    setStats({
      totalQuestions: questionsData.length,
      activeQuestions: questionsData.filter(q => q.is_active).length,
      totalUsers: 156, // Mock data
      totalGames: 1247, // Mock data
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeData();
    setRefreshing(false);
  };

  const toggleQuestionStatus = async (questionId: number, currentStatus: boolean) => {
    if (connectionStatus === 'connected') {
      try {
        const { error } = await supabase
          .from('questions')
          .update({ is_active: !currentStatus })
          .eq('id', questionId);

        if (error) throw error;
      } catch (error) {
        Alert.alert('Error', 'Failed to update question status in database');
        return;
      }
    }

    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId ? { ...q, is_active: !currentStatus } : q
      )
    );

    Alert.alert('Success', 'Question status updated');
  };

  const deleteQuestion = async (questionId: number) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (connectionStatus === 'connected') {
              try {
                const { error } = await supabase
                  .from('questions')
                  .delete()
                  .eq('id', questionId);

                if (error) throw error;
              } catch (error) {
                Alert.alert('Error', 'Failed to delete question from database');
                return;
              }
            }

            setQuestions(prev => prev.filter(q => q.id !== questionId));
            Alert.alert('Success', 'Question deleted');
          },
        },
      ]
    );
  };

  const saveNewQuestion = async () => {
    if (!newQuestion.question.trim() || !newQuestion.question_ar.trim()) {
      Alert.alert('Error', 'Please fill in both English and Arabic questions');
      return;
    }

    if (newQuestion.options.some(opt => !opt.trim()) || newQuestion.options_ar.some(opt => !opt.trim())) {
      Alert.alert('Error', 'Please fill in all answer options');
      return;
    }

    const questionData = {
      ...newQuestion,
      id: Date.now(), // Temporary ID for offline mode
      is_active: true,
      created_at: new Date().toISOString(),
    };

    if (connectionStatus === 'connected') {
      try {
        const { data, error } = await supabase
          .from('questions')
          .insert([{
            question: newQuestion.question,
            question_ar: newQuestion.question_ar,
            options: JSON.stringify(newQuestion.options),
            options_ar: JSON.stringify(newQuestion.options_ar),
            category: newQuestion.category,
            difficulty: newQuestion.difficulty,
            correct_answer: newQuestion.correct_answer,
            is_active: true,
          }])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          questionData.id = data[0].id;
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to save question to database');
        return;
      }
    }

    setQuestions(prev => [questionData, ...prev]);
    setShowAddModal(false);
    setNewQuestion({
      question: '',
      question_ar: '',
      options: ['', '', '', ''],
      options_ar: ['', '', '', ''],
      category: 'General',
      difficulty: 'easy',
      correct_answer: 0,
    });
    Alert.alert('Success', 'Question added successfully');
  };

  const resetNewQuestion = () => {
    setNewQuestion({
      question: '',
      question_ar: '',
      options: ['', '', '', ''],
      options_ar: ['', '', '', ''],
      category: 'General',
      difficulty: 'easy',
      correct_answer: 0,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading Admin Portal...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View style={styles.adminInfo}>
            <Shield size={24} color="#10B981" />
            <View style={styles.adminDetails}>
              <Text style={styles.adminTitle}>Admin Portal</Text>
              <Text style={styles.adminRole}>
                {connectionStatus === 'connected' ? 'Online' : 'Offline Mode'}
              </Text>
            </View>
          </View>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: connectionStatus === 'connected' ? '#10B981' : '#EF4444' }
          ]} />
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Database size={20} color="#3B82F6" />
            <Text style={styles.statNumber}>{stats.totalQuestions}</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statCard}>
            <FileText size={20} color="#10B981" />
            <Text style={styles.statNumber}>{stats.activeQuestions}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={20} color="#F59E0B" />
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={24} color="#3B82F6" />
              <Text style={styles.actionText}>Add Question</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <BarChart3 size={24} color="#10B981" />
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Download size={24} color="#F59E0B" />
              <Text style={styles.actionText}>Export Data</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Settings size={24} color="#EF4444" />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Questions Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Question Management ({questions.length})</Text>
          {questions.map((question) => (
            <View key={question.id} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionInfo}>
                  <Text style={styles.questionText} numberOfLines={2}>
                    {question.question}
                  </Text>
                  <View style={styles.questionMeta}>
                    <Text style={styles.categoryText}>{question.category}</Text>
                    <Text style={styles.difficultyText}>{question.difficulty}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: question.is_active ? '#10B981' : '#EF4444' }
                    ]}>
                      <Text style={styles.statusText}>
                        {question.is_active ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.questionActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Eye size={16} color="#6B7280" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Edit size={16} color="#3B82F6" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleQuestionStatus(question.id, question.is_active)}
                >
                  <Text style={styles.toggleText}>
                    {question.is_active ? 'Disable' : 'Enable'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => deleteQuestion(question.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Question Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Question</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>English Question</Text>
              <TextInput
                style={styles.textInput}
                value={newQuestion.question}
                onChangeText={(text) => setNewQuestion(prev => ({ ...prev, question: text }))}
                placeholder="Enter question in English"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Arabic Question</Text>
              <TextInput
                style={styles.textInput}
                value={newQuestion.question_ar}
                onChangeText={(text) => setNewQuestion(prev => ({ ...prev, question_ar: text }))}
                placeholder="Enter question in Arabic"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>English Options</Text>
              {newQuestion.options.map((option, index) => (
                <View key={index} style={styles.optionContainer}>
                  <Text style={styles.optionLabel}>{String.fromCharCode(65 + index)}.</Text>
                  <TextInput
                    style={[styles.textInput, styles.optionInput]}
                    value={option}
                    onChangeText={(text) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index] = text;
                      setNewQuestion(prev => ({ ...prev, options: newOptions }));
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                  <TouchableOpacity
                    style={[
                      styles.correctIndicator,
                      { backgroundColor: newQuestion.correct_answer === index ? '#10B981' : '#E5E7EB' }
                    ]}
                    onPress={() => setNewQuestion(prev => ({ ...prev, correct_answer: index }))}
                  >
                    <Text style={[
                      styles.correctText,
                      { color: newQuestion.correct_answer === index ? 'white' : '#6B7280' }
                    ]}>
                      ✓
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Arabic Options</Text>
              {newQuestion.options_ar.map((option, index) => (
                <TextInput
                  key={index}
                  style={[styles.textInput, styles.optionInput]}
                  value={option}
                  onChangeText={(text) => {
                    const newOptions = [...newQuestion.options_ar];
                    newOptions[index] = text;
                    setNewQuestion(prev => ({ ...prev, options_ar: newOptions }));
                  }}
                  placeholder={`Arabic Option ${String.fromCharCode(65 + index)}`}
                />
              ))}
            </View>

            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                  style={styles.textInput}
                  value={newQuestion.category}
                  onChangeText={(text) => setNewQuestion(prev => ({ ...prev, category: text }))}
                  placeholder="Category"
                />
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Difficulty</Text>
                <View style={styles.difficultyButtons}>
                  {['easy', 'medium', 'hard'].map((diff) => (
                    <TouchableOpacity
                      key={diff}
                      style={[
                        styles.difficultyButton,
                        { backgroundColor: newQuestion.difficulty === diff ? '#3B82F6' : '#F3F4F6' }
                      ]}
                      onPress={() => setNewQuestion(prev => ({ ...prev, difficulty: diff as any }))}
                    >
                      <Text style={[
                        styles.difficultyButtonText,
                        { color: newQuestion.difficulty === diff ? 'white' : '#374151' }
                      ]}>
                        {diff}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAddModal(false);
                resetNewQuestion();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveNewQuestion}
            >
              <Save size={16} color="white" />
              <Text style={styles.saveButtonText}>Save Question</Text>
            </TouchableOpacity>
          </View>
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminDetails: {
    marginLeft: 12,
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  adminRole: {
    fontSize: 14,
    color: '#10B981',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionHeader: {
    marginBottom: 12,
  },
  questionInfo: {
    flex: 1,
  },
  questionText: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryText: {
    fontSize: 12,
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 12,
    color: '#F59E0B',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  questionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  toggleText: {
    fontSize: 12,
    color: '#3B82F6',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
    width: 20,
  },
  optionInput: {
    flex: 1,
    marginRight: 8,
  },
  correctIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  difficultyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
});
