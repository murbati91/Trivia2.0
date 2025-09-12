import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://sgkmfdpgbwfnepuuaygv.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNna21mZHBnYndmbmVwdXVheWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDkxNjEsImV4cCI6MjA1MjMyNTE2MX0.T4OHw2YjOYpGpBGjz-jlWlSQrBmW4BFfDl68o_8pVwY';

// Create Supabase client with authentication enabled
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Authentication functions
export const authService = {
  // Sign up new user
  async signUp(email: string, password: string, userData: any) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign in user
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      return null;
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({ user_id: userId, ...updates })
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Fallback questions for offline mode
export const getFallbackQuestions = () => [
  {
    id: 1,
    question: "What is the capital of Bahrain?",
    question_ar: "ما هي عاصمة البحرين؟",
    options: ["Manama", "Dubai", "Doha", "Kuwait City"],
    options_ar: ["المنامة", "دبي", "الدوحة", "مدينة الكويت"],
    correct_answer: 0,
    category: "Geography",
    difficulty: "easy",
    explanation: "Manama is the capital and largest city of Bahrain.",
    explanation_ar: "المنامة هي عاصمة البحرين وأكبر مدينة فيها.",
    is_active: true,
  },
  {
    id: 2,
    question: "Which year did the first iPhone launch?",
    question_ar: "في أي عام تم إطلاق أول آيفون؟",
    options: ["2006", "2007", "2008", "2009"],
    options_ar: ["2006", "2007", "2008", "2009"],
    correct_answer: 1,
    category: "Technology",
    difficulty: "medium",
    explanation: "The first iPhone was announced by Steve Jobs on January 9, 2007.",
    explanation_ar: "تم الإعلان عن أول آيفون من قِبل ستيف جوبز في 9 يناير 2007.",
    is_active: true,
  },
  {
    id: 3,
    question: "What is the largest planet in our solar system?",
    question_ar: "ما هو أكبر كوكب في نظامنا الشمسي؟",
    options: ["Saturn", "Jupiter", "Neptune", "Earth"],
    options_ar: ["زحل", "المشتري", "نبتون", "الأرض"],
    correct_answer: 1,
    category: "Science",
    difficulty: "easy",
    explanation: "Jupiter is the largest planet in our solar system.",
    explanation_ar: "المشتري هو أكبر كوكب في نظامنا الشمسي.",
    is_active: true,
  },
  {
    id: 4,
    question: "Who painted the Mona Lisa?",
    question_ar: "من رسم الموناليزا؟",
    options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"],
    options_ar: ["فان جوخ", "بيكاسو", "ليوناردو دا فينشي", "مايكل أنجلو"],
    correct_answer: 2,
    category: "Art",
    difficulty: "medium",
    explanation: "Leonardo da Vinci painted the Mona Lisa between 1503-1519.",
    explanation_ar: "رسم ليوناردو دا فينشي الموناليزا بين عامي 1503-1519.",
    is_active: true,
  },
  {
    id: 5,
    question: "What is the chemical symbol for gold?",
    question_ar: "ما هو الرمز الكيميائي للذهب؟",
    options: ["Go", "Gd", "Au", "Ag"],
    options_ar: ["Go", "Gd", "Au", "Ag"],
    correct_answer: 2,
    category: "Science",
    difficulty: "medium",
    explanation: "Au comes from the Latin word 'aurum' meaning gold.",
    explanation_ar: "Au يأتي من الكلمة اللاتينية 'aurum' والتي تعني الذهب.",
    is_active: true,
  }
];

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    return { success: true, message: 'Connected to Supabase successfully' };
  } catch (error: any) {
    return { success: false, message: `Connection failed: ${error.message}` };
  }
};
