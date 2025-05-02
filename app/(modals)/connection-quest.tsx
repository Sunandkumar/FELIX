import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/Card';
import { supabase } from '@/lib/supabase';

interface Question {
  id: string;
  question: string;
  points: number;
}

interface Connection {
  id: string;
  name: string;
  photo: string;
  title: string;
  company: string;
  batch: string;
  industry: string;
  looking: string;
  offering: string;
}

export default function ConnectionQuestScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { userId } = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState<'questions' | 'answer' | 'qr'>('questions');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  useEffect(() => {
    fetchConnectionDetails();
  }, [userId]);

  const fetchConnectionDetails = async () => {
    try {
      if (!userId) {
        throw new Error('No user ID provided');
      }

      const { data, error: fetchError } = await supabase
        .from('all_connections')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Connection not found');

      setConnection(data);
      await generateQuestions(userId as string);
    } catch (err) {
      console.error('Error fetching connection:', err);
      setError(err instanceof Error ? err.message : 'Failed to load connection details');
      setLoadingQuestions(false);
    }
  };

  const generateQuestions = async (userId: string) => {
    try {
      setLoadingQuestions(true);
      setError(null);

      // Use the full Supabase URL for the edge function
      const apiUrl = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/generate-questions`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
      // Set some fallback questions
      setQuestions([
        {
          id: '1',
          question: "What's your biggest professional achievement?",
          points: 50,
        },
        {
          id: '2',
          question: "What advice would you give to MBA aspirants?",
          points: 30,
        },
        {
          id: '3',
          question: "What's your favorite memory from MBA?",
          points: 40,
        },
      ]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const selectedQuestionData = questions.find(q => q.id === selectedQuestion);

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestion(questionId);
    setError(null);
  };

  const handleContinueToAnswer = () => {
    if (!selectedQuestion) {
      setError('Please select a question first');
      return;
    }
    setCurrentStep('answer');
  };

  const handleStartQRVerification = () => {
    if (!answer.trim()) {
      setError('Please provide an answer');
      return;
    }
    setCurrentStep('qr');
  };

  const handleVerifyConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would verify the QR code
      // and update points for both users
      
      // For demo, we'll just show success and close
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      console.error('Error verifying connection:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify connection');
    } finally {
      setLoading(false);
    }
  };

  if (loadingQuestions) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Generating personalized questions...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => currentStep === 'questions' ? router.back() : setCurrentStep(currentStep === 'answer' ? 'questions' : 'answer')}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {currentStep === 'questions' ? 'Select Question' : currentStep === 'answer' ? 'Your Answer' : 'Verify Connection'}
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 'questions' ? (
          <>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Select a question to ask your connection and earn points for meaningful conversations
            </Text>

            {error && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            )}

            <View style={styles.questionsContainer}>
              {questions.map((question) => (
                <TouchableOpacity
                  key={question.id}
                  onPress={() => handleSelectQuestion(question.id)}
                >
                  <Card 
                    style={[
                      styles.questionCard,
                      selectedQuestion === question.id && {
                        borderColor: colors.primary,
                        borderWidth: 2,
                      }
                    ]}
                  >
                    <View style={styles.questionHeader}>
                      <View 
                        style={[
                          styles.pointsBadge,
                          { backgroundColor: colors.primaryLight }
                        ]}
                      >
                        <Text style={[styles.pointsText, { color: colors.primary }]}>
                          {question.points} pts
                        </Text>
                      </View>

                      {selectedQuestion === question.id && (
                        <View style={[styles.checkIcon, { backgroundColor: colors.primary }]}>
                          <Check size={16} color="#fff" />
                        </View>
                      )}
                    </View>

                    <Text style={[styles.questionText, { color: colors.text }]}>
                      {question.question}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primary },
                !selectedQuestion && { opacity: 0.6 }
              ]}
              onPress={handleContinueToAnswer}
              disabled={!selectedQuestion}
            >
              <Text style={styles.actionButtonText}>
                Continue
              </Text>
            </TouchableOpacity>
          </>
        ) : currentStep === 'answer' ? (
          <View style={styles.answerContainer}>
            <Card style={styles.selectedQuestionCard}>
              <View 
                style={[
                  styles.pointsBadge,
                  { backgroundColor: colors.primaryLight }
                ]}
              >
                <Text style={[styles.pointsText, { color: colors.primary }]}>
                  {selectedQuestionData?.points} pts
                </Text>
              </View>
              
              <Text style={[styles.selectedQuestionText, { color: colors.text }]}>
                {selectedQuestionData?.question}
              </Text>
            </Card>

            <Text style={[styles.answerLabel, { color: colors.text }]}>
              Your Answer
            </Text>

            <TextInput
              style={[
                styles.answerInput,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text
                }
              ]}
              placeholder="Type your answer here..."
              placeholderTextColor={colors.textSecondary}
              value={answer}
              onChangeText={setAnswer}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {error && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primary },
                !answer.trim() && { opacity: 0.6 }
              ]}
              onPress={handleStartQRVerification}
              disabled={!answer.trim()}
            >
              <Text style={styles.actionButtonText}>
                Continue to Verification
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.qrContainer}>
            <View 
              style={[
                styles.qrWrapper,
                { backgroundColor: colors.card }
              ]}
            >
              <QRCode
                value={`${userId}:${selectedQuestion}:${encodeURIComponent(answer)}`}
                size={200}
                color={colors.text}
                backgroundColor={colors.card}
              />
            </View>

            <Text style={[styles.qrInstructions, { color: colors.text }]}>
              Show this QR code to your connection
            </Text>
            
            <Text style={[styles.qrSubtext, { color: colors.textSecondary }]}>
              They'll need to scan it with their app to verify the connection
            </Text>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primary }
              ]}
              onPress={handleVerifyConnection}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>
                {loading ? 'Verifying...' : 'Verify Connection'}
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={[
                styles.backButton,
                { borderColor: colors.border }
              ]}
              onPress={() => setCurrentStep('answer')}
            >
              <Text style={[styles.backButtonText, { color: colors.text }]}>
                Go Back
              </Text>
            </TouchableOpacity> */}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  questionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  questionCard: {
    padding: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  answerContainer: {
    flex: 1,
  },
  selectedQuestionCard: {
    padding: 16,
    marginBottom: 24,
  },
  selectedQuestionText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    lineHeight: 24,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  answerInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  actionButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  qrWrapper: {
    width: 280,
    height: 280,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  qrInstructions: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  qrSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    height: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: '12%',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});