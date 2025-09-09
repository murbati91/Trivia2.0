import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Heart, Zap, Users, CircleCheck as CheckCircle, Circle as XCircle, RotateCcw, Share2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Question {
  id: number;
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  explanationAr: string;
}

interface GameState {
  currentQuestion: number;
  score: number;
  lives: number;
  timeLeft: number;
  gameMode: 'single' | 'multiplayer';
  isGameActive: boolean;
  selectedAnswer: number | null;
  showExplanation: boolean;
  usedLifelines: {
    fiftyFifty: boolean;
    hint: boolean;
    skip: boolean;
  };
}

export default function GameScreen() {
  const [isArabic, setIsArabic] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    lives: 3,
    timeLeft: 30,
    gameMode: 'single',
    isGameActive: false,
    selectedAnswer: null,
    showExplanation: false,
    usedLifelines: {
      fiftyFifty: false,
      hint: false,
      skip: false,
    },
  });

  const [questions] = useState<Question[]>([
    {
      id: 1,
      question: "What is the capital of Bahrain?",
      questionAr: "ما هي عاصمة البحرين؟",
      options: ["Manama", "Dubai", "Doha", "Kuwait City"],
      optionsAr: ["المنامة", "دبي", "الدوحة", "مدينة الكويت"],
      correctAnswer: 0,
      category: "Geography",
      difficulty: "easy",
      explanation: "Manama is the capital and largest city of Bahrain.",
      explanationAr: "المنامة هي عاصمة البحرين وأكبر مدينة فيها.",
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
      explanation: "The first iPhone was announced by Steve Jobs on January 9, 2007.",
      explanationAr: "تم الإعلان عن أول آيفون من قِبل ستيف جوبز في 9 يناير 2007.",
    },
    {
      id: 3,
      question: "What is the largest planet in our solar system?",
      questionAr: "ما هو أكبر كوكب في النظام الشمسي؟",
      options: ["Saturn", "Jupiter", "Neptune", "Earth"],
      optionsAr: ["زحل", "المشتري", "نبتون", "الأرض"],
      correctAnswer: 1,
      category: "Science",
      difficulty: "easy",
      explanation: "Jupiter is the largest planet in our solar system.",
      explanationAr: "المشتري هو أكبر كوكب في النظام الشمسي.",
    },
    {
      id: 4,
      question: "Who wrote the novel '1984'?",
      questionAr: "من كتب رواية '1984'؟",
      options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Kurt Vonnegut"],
      optionsAr: ["جورج أورويل", "ألدوس هكسلي", "راي برادبوري", "كيرت فونيغوت"],
      correctAnswer: 0,
      category: "Literature",
      difficulty: "medium",
      explanation: "George Orwell wrote the dystopian novel '1984' published in 1949.",
      explanationAr: "كتب جورج أورويل الرواية المستقبلية '1984' التي نُشرت في عام 1949.",
    },
    {
      id: 5,
      question: "What is the chemical symbol for gold?",
      questionAr: "ما هو الرمز الكيميائي للذهب؟",
      options: ["Go", "Gd", "Au", "Ag"],
      optionsAr: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: 2,
      category: "Science",
      difficulty: "medium",
      explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum'.",
      explanationAr: "Au هو الرمز الكيميائي للذهب، مشتق من الكلمة اللاتينية 'aurum'.",
    },
  ]);

  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.isGameActive && gameState.timeLeft > 0 && !gameState.showExplanation) {
      timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.isGameActive) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [gameState.timeLeft, gameState.isGameActive, gameState.showExplanation]);

  const startGame = (mode: 'single' | 'multiplayer') => {
    setGameState({
      currentQuestion: 0,
      score: 0,
      lives: 3,
      timeLeft: 30,
      gameMode: mode,
      isGameActive: true,
      selectedAnswer: null,
      showExplanation: false,
      usedLifelines: {
        fiftyFifty: false,
        hint: false,
        skip: false,
      },
    });
    setHiddenOptions([]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (gameState.selectedAnswer !== null || !gameState.isGameActive) return;

    setGameState(prev => ({ ...prev, selectedAnswer: answerIndex }));

    setTimeout(() => {
      const currentQ = questions[gameState.currentQuestion];
      const isCorrect = answerIndex === currentQ.correctAnswer;
      
      if (isCorrect) {
        const points = calculatePoints();
        setGameState(prev => ({ 
          ...prev, 
          score: prev.score + points,
          showExplanation: true 
        }));
      } else {
        setGameState(prev => ({ 
          ...prev, 
          lives: prev.lives - 1,
          showExplanation: true 
        }));
      }
    }, 1000);
  };

  const calculatePoints = () => {
    const basePoints = 100;
    const timeBonus = gameState.timeLeft * 2;
    const difficultyMultiplier = questions[gameState.currentQuestion].difficulty === 'hard' ? 1.5 : 
                                questions[gameState.currentQuestion].difficulty === 'medium' ? 1.2 : 1;
    return Math.round((basePoints + timeBonus) * difficultyMultiplier);
  };

  const handleTimeUp = () => {
    setGameState(prev => ({ 
      ...prev, 
      lives: prev.lives - 1,
      selectedAnswer: -1,
      showExplanation: true 
    }));
  };

  const nextQuestion = () => {
    if (gameState.currentQuestion < questions.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        timeLeft: 30,
        selectedAnswer: null,
        showExplanation: false,
      }));
      setHiddenOptions([]);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, isGameActive: false }));
    Alert.alert(
      isArabic ? 'انتهت اللعبة!' : 'Game Over!',
      isArabic ? `نتيجتك النهائية: ${gameState.score}` : `Your final score: ${gameState.score}`,
      [
        { text: isArabic ? 'العب مرة أخرى' : 'Play Again', onPress: () => startGame('single') },
        { text: isArabic ? 'العودة للرئيسية' : 'Back to Home', style: 'cancel' },
      ]
    );
  };

  const useFiftyFifty = () => {
    if (gameState.usedLifelines.fiftyFifty || gameState.selectedAnswer !== null) return;
    
    const currentQ = questions[gameState.currentQuestion];
    const wrongOptions = currentQ.options
      .map((_, index) => index)
      .filter(index => index !== currentQ.correctAnswer);
    
    const optionsToHide = wrongOptions.slice(0, 2);
    setHiddenOptions(optionsToHide);
    
    setGameState(prev => ({
      ...prev,
      usedLifelines: { ...prev.usedLifelines, fiftyFifty: true }
    }));
  };

  const useSkip = () => {
    if (gameState.usedLifelines.skip) return;
    
    setGameState(prev => ({
      ...prev,
      usedLifelines: { ...prev.usedLifelines, skip: true }
    }));
    
    nextQuestion();
  };

  const shareResult = () => {
    Alert.alert(
      isArabic ? 'مشاركة النتيجة' : 'Share Result',
      isArabic ? 'تم نسخ النتيجة للحافظة' : 'Result copied to clipboard'
    );
  };

  if (!gameState.isGameActive && gameState.currentQuestion === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.startScreen}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <Text style={styles.welcomeTitle}>
            {isArabic ? 'مرحباً بك في خوش فكرة!' : 'Welcome to 5osh Fkra!'}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            {isArabic ? 'اختبر معرفتك وتحدى أصدقاءك' : 'Test your knowledge and challenge your friends'}
          </Text>

          <View style={styles.gameModeContainer}>
            <TouchableOpacity
              style={styles.gameModeButton}
              onPress={() => startGame('single')}
              activeOpacity={0.8}>
              <View style={styles.gameModeIcon}>
                <Users size={32} color="#3B82F6" />
              </View>
              <Text style={styles.gameModeTitle}>
                {isArabic ? 'لعبة فردية' : 'Single Player'}
              </Text>
              <Text style={styles.gameModeSubtitle}>
                {isArabic ? 'العب بمفردك واختبر معرفتك' : 'Play solo and test your knowledge'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gameModeButton}
              onPress={() => startGame('multiplayer')}
              activeOpacity={0.8}>
              <View style={styles.gameModeIcon}>
                <Users size={32} color="#10B981" />
              </View>
              <Text style={styles.gameModeTitle}>
                {isArabic ? 'متعدد اللاعبين' : 'Multiplayer'}
              </Text>
              <Text style={styles.gameModeSubtitle}>
                {isArabic ? 'تحدى أصدقاءك واللاعبين الآخرين' : 'Challenge friends and other players'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setIsArabic(!isArabic)}>
            <Text style={styles.languageButtonText}>
              {isArabic ? 'Switch to English' : 'التبديل للعربية'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  if (!gameState.isGameActive) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.resultScreen}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <Text style={styles.resultTitle}>
            {isArabic ? 'مبروك!' : 'Congratulations!'}
          </Text>
          <Text style={styles.resultScore}>{gameState.score}</Text>
          <Text style={styles.resultSubtitle}>
            {isArabic ? 'نقطة' : 'Points'}
          </Text>

          <View style={styles.resultStats}>
            <View style={styles.resultStat}>
              <Text style={styles.resultStatNumber}>
                {gameState.currentQuestion + 1}
              </Text>
              <Text style={styles.resultStatLabel}>
                {isArabic ? 'أسئلة' : 'Questions'}
              </Text>
            </View>
            <View style={styles.resultStat}>
              <Text style={styles.resultStatNumber}>
                {Math.round((gameState.score / ((gameState.currentQuestion + 1) * 100)) * 100)}%
              </Text>
              <Text style={styles.resultStatLabel}>
                {isArabic ? 'دقة' : 'Accuracy'}
              </Text>
            </View>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity
              style={[styles.resultButton, styles.playAgainButton]}
              onPress={() => startGame('single')}>
              <RotateCcw size={20} color="white" />
              <Text style={styles.resultButtonText}>
                {isArabic ? 'العب مرة أخرى' : 'Play Again'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resultButton, styles.shareButton]}
              onPress={shareResult}>
              <Share2 size={20} color="#3B82F6" />
              <Text style={[styles.resultButtonText, { color: '#3B82F6' }]}>
                {isArabic ? 'مشاركة' : 'Share'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const currentQuestion = questions[gameState.currentQuestion];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={styles.gameHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.gameStats}>
          <View style={styles.statItem}>
            <Clock size={20} color="white" />
            <Text style={styles.statText}>{gameState.timeLeft}s</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.scoreText}>{gameState.score}</Text>
          </View>
          <View style={styles.statItem}>
            <Heart size={20} color={gameState.lives > 0 ? "#EF4444" : "#9CA3AF"} />
            <Text style={styles.statText}>×{gameState.lives}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((gameState.currentQuestion + 1) / questions.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {gameState.currentQuestion + 1}/{questions.length}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.gameContent} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{currentQuestion.category}</Text>
          </View>
          
          <Text style={styles.questionText}>
            {isArabic ? currentQuestion.questionAr : currentQuestion.question}
          </Text>

          {gameState.showExplanation && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationText}>
                {isArabic ? currentQuestion.explanationAr : currentQuestion.explanation}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isHidden = hiddenOptions.includes(index);
            const isSelected = gameState.selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showResult = gameState.showExplanation;

            if (isHidden) return null;

            let buttonStyle = [styles.optionButton];
            let textStyle = [styles.optionText];

            if (showResult) {
              if (isCorrect) {
                buttonStyle.push(styles.correctOption);
                textStyle.push(styles.correctOptionText);
              } else if (isSelected && !isCorrect) {
                buttonStyle.push(styles.wrongOption);
                textStyle.push(styles.wrongOptionText);
              }
            } else if (isSelected) {
              buttonStyle.push(styles.selectedOption);
            }

            return (
              <TouchableOpacity
                key={index}
                style={buttonStyle}
                onPress={() => handleAnswerSelect(index)}
                disabled={gameState.selectedAnswer !== null}
                activeOpacity={0.8}>
                <View style={styles.optionContent}>
                  <View style={styles.optionIndex}>
                    <Text style={styles.optionIndexText}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={textStyle}>
                    {isArabic ? currentQuestion.optionsAr[index] : option}
                  </Text>
                </View>
                {showResult && isCorrect && (
                  <CheckCircle size={24} color="#10B981" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle size={24} color="#EF4444" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {!gameState.showExplanation && (
          <View style={styles.lifelinesContainer}>
            <TouchableOpacity
              style={[
                styles.lifelineButton,
                gameState.usedLifelines.fiftyFifty && styles.lifelineUsed
              ]}
              onPress={useFiftyFifty}
              disabled={gameState.usedLifelines.fiftyFifty}>
              <Text style={styles.lifelineText}>50:50</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.lifelineButton,
                gameState.usedLifelines.hint && styles.lifelineUsed
              ]}
              disabled={gameState.usedLifelines.hint}>
              <Zap size={20} color={gameState.usedLifelines.hint ? "#9CA3AF" : "#3B82F6"} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.lifelineButton,
                gameState.usedLifelines.skip && styles.lifelineUsed
              ]}
              onPress={useSkip}
              disabled={gameState.usedLifelines.skip}>
              <Text style={styles.lifelineText}>
                {isArabic ? 'تخطي' : 'Skip'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {gameState.showExplanation && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={nextQuestion}>
            <Text style={styles.nextButtonText}>
              {gameState.currentQuestion < questions.length - 1 
                ? (isArabic ? 'السؤال التالي' : 'Next Question')
                : (isArabic ? 'إنهاء اللعبة' : 'Finish Game')
              }
            </Text>
          </TouchableOpacity>
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
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  gameModeContainer: {
    width: '100%',
    marginBottom: 30,
  },
  gameModeButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  gameModeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gameModeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  gameModeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  languageButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  languageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  gameHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  scoreText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  gameContent: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
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
  categoryBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 26,
  },
  explanationContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  explanationText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  wrongOption: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionIndexText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  correctOptionText: {
    color: '#10B981',
    fontWeight: '600',
  },
  wrongOptionText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  lifelinesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  lifelineButton: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lifelineUsed: {
    backgroundColor: '#F3F4F6',
    opacity: 0.5,
  },
  lifelineText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  nextButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  resultScore: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 40,
  },
  resultStats: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  resultStat: {
    alignItems: 'center',
    marginHorizontal: 30,
  },
  resultStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  resultStatLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  resultActions: {
    width: '100%',
  },
  resultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  playAgainButton: {
    backgroundColor: '#3B82F6',
  },
  shareButton: {
    backgroundColor: 'white',
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: 'white',
  },
});