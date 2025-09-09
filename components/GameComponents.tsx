import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface QuestionCardProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  onAnswerSelect: (index: number) => void;
  isArabic?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  onAnswerSelect,
  isArabic = false,
}) => {
  return (
    <View style={styles.questionCard}>
      <Text style={[styles.questionText, isArabic && styles.arabicText]}>
        {question}
      </Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === correctAnswer;
          
          let buttonStyle = [styles.optionButton];
          let textStyle = [styles.optionText];
          
          if (showResult) {
            if (isCorrect) {
              buttonStyle.push(styles.correctOption);
              textStyle.push(styles.correctText);
            } else if (isSelected && !isCorrect) {
              buttonStyle.push(styles.wrongOption);
              textStyle.push(styles.wrongText);
            }
          } else if (isSelected) {
            buttonStyle.push(styles.selectedOption);
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => onAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              activeOpacity={0.8}>
              <View style={styles.optionIndex}>
                <Text style={styles.optionIndexText}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={textStyle}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime }) => {
  const progress = (timeLeft / totalTime) * 100;
  
  return (
    <View style={styles.timerContainer}>
      <View style={styles.timerBar}>
        <View style={[styles.timerProgress, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.timerText}>{timeLeft}s</Text>
    </View>
  );
};

interface ScoreDisplayProps {
  score: number;
  lives: number;
  level?: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  lives, 
  level = 1 
}) => {
  return (
    <View style={styles.scoreContainer}>
      <View style={styles.scoreItem}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
      </View>
      
      <View style={styles.scoreItem}>
        <Text style={styles.scoreLabel}>Level</Text>
        <Text style={styles.scoreValue}>{level}</Text>
      </View>
      
      <View style={styles.scoreItem}>
        <Text style={styles.scoreLabel}>Lives</Text>
        <View style={styles.livesContainer}>
          {Array.from({ length: 3 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.lifeIndicator,
                i < lives ? styles.lifeActive : styles.lifeInactive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  questionCard: {
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
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 26,
    marginBottom: 20,
  },
  arabicText: {
    textAlign: 'right',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
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
  optionIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionIndexText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  correctText: {
    color: '#10B981',
    fontWeight: '600',
  },
  wrongText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  timerBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 12,
  },
  timerProgress: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 30,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreItem: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lifeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lifeActive: {
    backgroundColor: '#EF4444',
  },
  lifeInactive: {
    backgroundColor: '#E5E7EB',
  },
});