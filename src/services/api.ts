/**
 * Mock API Services
 * 
 * These services simulate API calls and return Promise-based responses.
 * Replace these with real API calls when backend is ready.
 * 
 * TODO: Replace with actual API endpoints
 */

import { 
  User, 
  Test, 
  Question, 
  Lesson, 
  TestAttempt, 
  QuestionAttempt,
  TestWithQuestions,
  AttemptResult,
  ExtractedQuestions,
  OverallAnalytics,
  PaginatedResponse,
  UserRole
} from '@/types';

import { 
  mockUsers, 
  mockTests, 
  mockQuestions, 
  mockLessons, 
  mockAttempts,
  mockQuestionAttempts,
  mockOverallAnalytics
} from '@/mocks/data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const MOCK_DELAY = 500;

// ============================================
// Authentication Services
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends LoginCredentials {
  name: string;
  role: UserRole;
}

/**
 * Mock login - checks against mock users
 * TODO: Replace with Clerk/Auth API
 */
export async function loginUser(credentials: LoginCredentials): Promise<User> {
  await delay(MOCK_DELAY);
  
  const user = mockUsers.find(u => u.email === credentials.email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Store in localStorage for demo purposes
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  return user;
}

/**
 * Mock signup
 * TODO: Replace with Clerk/Auth API
 */
export async function signUpUser(data: SignUpData): Promise<User> {
  await delay(MOCK_DELAY);
  
  const existingUser = mockUsers.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: data.email,
    name: data.name,
    role: data.role,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
    createdAt: new Date(),
    lastActiveAt: new Date(),
  };
  
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  return newUser;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  await delay(300);
  
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    return JSON.parse(stored);
  }
  
  return null;
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
  await delay(300);
  localStorage.removeItem('currentUser');
}

// ============================================
// User Management Services (Admin)
// ============================================

/**
 * Get all users with optional filters
 * TODO: Replace with real API endpoint
 */
export async function getUsers(filters?: {
  role?: UserRole;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<User>> {
  await delay(MOCK_DELAY);
  
  let filtered = [...mockUsers];
  
  if (filters?.role) {
    filtered = filtered.filter(u => u.role === filters.role);
  }
  
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(search) || 
      u.email.toLowerCase().includes(search)
    );
  }
  
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

/**
 * Get single user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  await delay(MOCK_DELAY);
  return mockUsers.find(u => u.id === userId) || null;
}

// ============================================
// Test Management Services
// ============================================

/**
 * Get all tests
 * TODO: Replace with real API endpoint
 */
export async function getTests(filters?: {
  status?: Test['status'];
  search?: string;
}): Promise<Test[]> {
  await delay(MOCK_DELAY);
  
  let filtered = [...mockTests];
  
  if (filters?.status) {
    filtered = filtered.filter(t => t.status === filters.status);
  }
  
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(search) || 
      t.description.toLowerCase().includes(search)
    );
  }
  
  return filtered;
}

/**
 * Get single test with questions
 */
export async function getTestWithQuestions(testId: string): Promise<TestWithQuestions | null> {
  await delay(MOCK_DELAY);
  
  const test = mockTests.find(t => t.id === testId);
  if (!test) return null;
  
  const questions = mockQuestions[testId] || [];
  
  return { ...test, questions };
}

/**
 * Create a new test
 * TODO: Replace with real API endpoint
 */
export async function createTest(data: {
  title: string;
  description: string;
  scheduledDate: Date;
  duration: number;
  lessonId?: string;
}): Promise<Test> {
  await delay(MOCK_DELAY);
  
  const newTest: Test = {
    id: `test-${Date.now()}`,
    ...data,
    createdAt: new Date(),
    createdBy: 'admin-1', // TODO: Get from auth context
    status: 'draft',
    questionCount: 0,
  };
  
  return newTest;
}

/**
 * Update test
 */
export async function updateTest(testId: string, data: Partial<Test>): Promise<Test> {
  await delay(MOCK_DELAY);
  
  const test = mockTests.find(t => t.id === testId);
  if (!test) throw new Error('Test not found');
  
  return { ...test, ...data };
}

/**
 * Delete test
 */
export async function deleteTest(testId: string): Promise<void> {
  await delay(MOCK_DELAY);
  // In real implementation, delete from database
}

/**
 * Extract questions from uploaded file (AI mock)
 * TODO: Replace with real AI API
 */
export async function extractQuestionsFromFile(file: File): Promise<ExtractedQuestions> {
  await delay(2000); // Simulate AI processing
  
  // Mock extracted questions
  return {
    questions: [
      {
        questionText: 'The __BLANK__ is the largest planet in our solar system.',
        correctAnswer: 'Jupiter',
        hints: ['It has a big red spot', 'Its a gas giant', 'Starts with J'],
        microLearning: 'Jupiter is the largest planet! Its so big that over 1,300 Earths could fit inside it. Jupiter has a famous Great Red Spot which is actually a giant storm!',
        order: 1,
      },
      {
        questionText: 'Plants need __BLANK__ and water to grow.',
        correctAnswer: 'sunlight',
        hints: ['It comes from the sun', 'Its bright and warm', 'Plants use it to make food'],
        microLearning: 'Plants are amazing! They use sunlight, water, and air to make their own food through a process called photosynthesis. Thats why plants are usually green!',
        order: 2,
      },
    ],
    rawText: 'Mock extracted text from uploaded file...',
    confidence: 0.92,
  };
}

/**
 * Add question to test
 */
export async function addQuestion(testId: string, question: Omit<Question, 'id' | 'testId'>): Promise<Question> {
  await delay(MOCK_DELAY);
  
  const newQuestion: Question = {
    id: `q-${Date.now()}`,
    testId,
    ...question,
  };
  
  return newQuestion;
}

/**
 * Update question
 */
export async function updateQuestion(questionId: string, data: Partial<Question>): Promise<Question> {
  await delay(MOCK_DELAY);
  
  // Find and update question
  for (const questions of Object.values(mockQuestions)) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      return { ...question, ...data };
    }
  }
  
  throw new Error('Question not found');
}

/**
 * Delete question
 */
export async function deleteQuestion(questionId: string): Promise<void> {
  await delay(MOCK_DELAY);
}

/**
 * AI-guess answer for a question (mock)
 * TODO: Replace with real AI API
 */
export async function guessAnswer(questionText: string): Promise<string> {
  await delay(1500);
  
  // Simple mock logic
  if (questionText.toLowerCase().includes('planet')) return 'Earth';
  if (questionText.toLowerCase().includes('color')) return 'blue';
  if (questionText.toLowerCase().includes('animal')) return 'dog';
  
  return 'example answer';
}

// ============================================
// Lesson Management Services
// ============================================

/**
 * Get all lessons
 */
export async function getLessons(): Promise<Lesson[]> {
  await delay(MOCK_DELAY);
  return [...mockLessons];
}

/**
 * Upload lesson file
 */
export async function uploadLesson(data: {
  title: string;
  description?: string;
  file: File;
}): Promise<Lesson> {
  await delay(1000);
  
  const newLesson: Lesson = {
    id: `lesson-${Date.now()}`,
    title: data.title,
    description: data.description,
    fileName: data.file.name,
    fileUrl: URL.createObjectURL(data.file),
    fileType: data.file.type,
    uploadedAt: new Date(),
    uploadedBy: 'admin-1',
  };
  
  return newLesson;
}

/**
 * Delete lesson
 */
export async function deleteLesson(lessonId: string): Promise<void> {
  await delay(MOCK_DELAY);
}

// ============================================
// Test Attempt Services (Student)
// ============================================

/**
 * Get upcoming tests for student
 */
export async function getUpcomingTests(studentId: string): Promise<Test[]> {
  await delay(MOCK_DELAY);
  
  return mockTests.filter(t => 
    t.status === 'active' || t.status === 'scheduled'
  );
}

/**
 * Get student's past attempts
 */
export async function getStudentAttempts(studentId: string): Promise<TestAttempt[]> {
  await delay(MOCK_DELAY);
  
  return mockAttempts.filter(a => a.studentId === studentId);
}

/**
 * Start a test attempt
 */
export async function startTestAttempt(testId: string, studentId: string): Promise<TestAttempt> {
  await delay(MOCK_DELAY);
  
  const test = mockTests.find(t => t.id === testId);
  if (!test) throw new Error('Test not found');
  
  const attempt: TestAttempt = {
    id: `attempt-${Date.now()}`,
    testId,
    studentId,
    startedAt: new Date(),
    status: 'in_progress',
    totalQuestions: test.questionCount,
    correctAnswers: 0,
    hintsUsed: 0,
  };
  
  return attempt;
}

/**
 * Submit answer for a question
 */
export async function submitAnswer(data: {
  attemptId: string;
  questionId: string;
  answer: string;
}): Promise<{ isCorrect: boolean; correctAnswer: string }> {
  await delay(MOCK_DELAY);
  
  // Find the correct answer
  for (const questions of Object.values(mockQuestions)) {
    const question = questions.find(q => q.id === data.questionId);
    if (question) {
      const isCorrect = data.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      return { isCorrect, correctAnswer: question.correctAnswer };
    }
  }
  
  throw new Error('Question not found');
}

/**
 * Use a hint
 */
export async function useHint(attemptId: string, questionId: string, hintIndex: number): Promise<string> {
  await delay(MOCK_DELAY);
  
  for (const questions of Object.values(mockQuestions)) {
    const question = questions.find(q => q.id === questionId);
    if (question && question.hints[hintIndex]) {
      return question.hints[hintIndex];
    }
  }
  
  throw new Error('Hint not found');
}

/**
 * Get micro learning content
 */
export async function getMicroLearning(questionId: string): Promise<string> {
  await delay(MOCK_DELAY);
  
  for (const questions of Object.values(mockQuestions)) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      return question.microLearning;
    }
  }
  
  throw new Error('Question not found');
}

/**
 * Complete test attempt
 */
export async function completeAttempt(attemptId: string): Promise<AttemptResult> {
  await delay(MOCK_DELAY);
  
  const attempt = mockAttempts.find(a => a.id === attemptId) || {
    id: attemptId,
    testId: 'test-1',
    studentId: 'student-1',
    startedAt: new Date(Date.now() - 600000),
    completedAt: new Date(),
    status: 'completed' as const,
    score: 80,
    totalQuestions: 5,
    correctAnswers: 4,
    hintsUsed: 2,
    timeTakenSeconds: 600,
  };
  
  const test = mockTests.find(t => t.id === attempt.testId)!;
  
  return {
    attempt: { ...attempt, status: 'completed', completedAt: new Date() },
    questionResults: mockQuestionAttempts.filter(qa => qa.attemptId === attemptId),
    test,
  };
}

// ============================================
// Analytics Services
// ============================================

/**
 * Get overall analytics
 */
export async function getOverallAnalytics(): Promise<OverallAnalytics> {
  await delay(MOCK_DELAY);
  return mockOverallAnalytics;
}

/**
 * Get analytics for a specific test
 */
export async function getTestAnalytics(testId: string) {
  await delay(MOCK_DELAY);
  return mockOverallAnalytics.testAnalytics.find(t => t.testId === testId);
}
