/**
 * React Query Hooks for AI Learning Platform
 * 
 * All data access goes through these hooks.
 * When backend is ready, only the service functions need to change.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Test, 
  Question,
  Lesson, 
  TestAttempt, 
  TestWithQuestions,
  AttemptResult,
  ExtractedQuestions,
  OverallAnalytics,
  PaginatedResponse,
  UserRole
} from '@/types';
import * as api from '@/services/api';

// ============================================
// Query Keys
// ============================================

export const queryKeys = {
  // Auth
  currentUser: ['currentUser'] as const,
  
  // Users
  users: (filters?: { role?: UserRole; search?: string }) => ['users', filters] as const,
  user: (id: string) => ['user', id] as const,
  
  // Tests
  tests: (filters?: { status?: Test['status']; search?: string }) => ['tests', filters] as const,
  test: (id: string) => ['test', id] as const,
  testWithQuestions: (id: string) => ['test', id, 'questions'] as const,
  
  // Lessons
  lessons: ['lessons'] as const,
  
  // Attempts
  upcomingTests: (studentId: string) => ['upcomingTests', studentId] as const,
  studentAttempts: (studentId: string) => ['studentAttempts', studentId] as const,
  attemptResult: (attemptId: string) => ['attemptResult', attemptId] as const,
  
  // Analytics
  analytics: ['analytics'] as const,
  testAnalytics: (testId: string) => ['analytics', 'test', testId] as const,
};

// ============================================
// Authentication Hooks
// ============================================

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: api.getCurrentUser,
    staleTime: Infinity,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.loginUser,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.currentUser, user);
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.signUpUser,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.currentUser, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.currentUser, null);
      queryClient.clear();
    },
  });
}

// ============================================
// User Management Hooks (Admin)
// ============================================

export function useUsers(filters?: { role?: UserRole; search?: string; page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: queryKeys.users(filters),
    queryFn: () => api.getUsers(filters),
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => api.getUserById(userId),
    enabled: !!userId,
  });
}

// ============================================
// Test Management Hooks
// ============================================

export function useTests(filters?: { status?: Test['status']; search?: string }) {
  return useQuery({
    queryKey: queryKeys.tests(filters),
    queryFn: () => api.getTests(filters),
  });
}

export function useTest(testId: string) {
  return useQuery({
    queryKey: queryKeys.test(testId),
    queryFn: async () => {
      const test = await api.getTestWithQuestions(testId);
      return test as Test | null;
    },
    enabled: !!testId,
  });
}

export function useTestWithQuestions(testId: string) {
  return useQuery({
    queryKey: queryKeys.testWithQuestions(testId),
    queryFn: () => api.getTestWithQuestions(testId),
    enabled: !!testId,
  });
}

export function useCreateTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}

export function useUpdateTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ testId, data }: { testId: string; data: Partial<Test> }) => 
      api.updateTest(testId, data),
    onSuccess: (_, { testId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.test(testId) });
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}

export function useDeleteTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}

export function useExtractQuestions() {
  return useMutation({
    mutationFn: api.extractQuestionsFromFile,
  });
}

export function useAddQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ testId, question }: { testId: string; question: Omit<Question, 'id' | 'testId'> }) =>
      api.addQuestion(testId, question),
    onSuccess: (_, { testId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testWithQuestions(testId) });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: Partial<Question> }) =>
      api.updateQuestion(questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test'] });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test'] });
    },
  });
}

export function useGuessAnswer() {
  return useMutation({
    mutationFn: api.guessAnswer,
  });
}

// ============================================
// Lesson Hooks
// ============================================

export function useLessons() {
  return useQuery({
    queryKey: queryKeys.lessons,
    queryFn: api.getLessons,
  });
}

export function useUploadLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.uploadLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons });
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons });
    },
  });
}

// ============================================
// Test Attempt Hooks (Student)
// ============================================

export function useUpcomingTests(studentId: string) {
  return useQuery({
    queryKey: queryKeys.upcomingTests(studentId),
    queryFn: () => api.getUpcomingTests(studentId),
    enabled: !!studentId,
  });
}

export function useStudentAttempts(studentId: string) {
  return useQuery({
    queryKey: queryKeys.studentAttempts(studentId),
    queryFn: () => api.getStudentAttempts(studentId),
    enabled: !!studentId,
  });
}

export function useStartAttempt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ testId, studentId }: { testId: string; studentId: string }) =>
      api.startTestAttempt(testId, studentId),
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studentAttempts(studentId) });
    },
  });
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: api.submitAnswer,
  });
}

export function useHint() {
  return useMutation({
    mutationFn: ({ attemptId, questionId, hintIndex }: { attemptId: string; questionId: string; hintIndex: number }) =>
      api.useHint(attemptId, questionId, hintIndex),
  });
}

export function useMicroLearning() {
  return useMutation({
    mutationFn: api.getMicroLearning,
  });
}

export function useCompleteAttempt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.completeAttempt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentAttempts'] });
    },
  });
}

// ============================================
// Analytics Hooks
// ============================================

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics,
    queryFn: api.getOverallAnalytics,
  });
}

export function useTestAnalytics(testId: string) {
  return useQuery({
    queryKey: queryKeys.testAnalytics(testId),
    queryFn: () => api.getTestAnalytics(testId),
    enabled: !!testId,
  });
}
