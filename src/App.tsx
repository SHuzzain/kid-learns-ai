import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Pages
import { LandingPage } from "@/pages/LandingPage";
import { AuthPage } from "@/pages/AuthPage";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminTestsPage } from "@/pages/admin/AdminTestsPage";
import { CreateTestPage } from "@/pages/admin/CreateTestPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminLessonsPage } from "@/pages/admin/AdminLessonsPage";
import { AdminAnalyticsPage } from "@/pages/admin/AdminAnalyticsPage";
import { StudentDashboard } from "@/pages/student/StudentDashboard";
import { TestTakingPage } from "@/pages/student/TestTakingPage";
import { TestResultsPage } from "@/pages/student/TestResultsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tests" element={<AdminTestsPage />} />
            <Route path="/admin/tests/new" element={<CreateTestPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/lessons" element={<AdminLessonsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            
            {/* Student Routes */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/test/:testId" element={<TestTakingPage />} />
            <Route path="/student/results/:attemptId" element={<TestResultsPage />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
