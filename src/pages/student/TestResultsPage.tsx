/**
 * Test Results Page - Shows score and breakdown
 */

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Clock, 
  Lightbulb, 
  Star,
  Home,
  RotateCcw,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { StudentLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';

export function TestResultsPage() {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get results from navigation state or use defaults
  const { score = 80, timeTaken = 600, results = [], testTitle = 'Test' } = location.state || {};

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStarCount = (score: number) => Math.min(5, Math.floor(score / 20) + 1);
  const stars = getStarCount(score);

  const getMessage = (score: number) => {
    if (score >= 90) return { text: "Amazing! You're a superstar!", emoji: "🏆" };
    if (score >= 70) return { text: "Great job! Keep it up!", emoji: "🎉" };
    if (score >= 50) return { text: "Good effort! Practice makes perfect!", emoji: "👍" };
    return { text: "Keep trying! You'll get better!", emoji: "🌈" };
  };

  const message = getMessage(score);

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto">
        {/* Celebration Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-8xl mb-4"
          >
            {message.emoji}
          </motion.div>
          <h1 className="text-kid-2xl font-bold mb-2">{message.text}</h1>
          <p className="text-muted-foreground text-lg">{testTitle}</p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card-kid text-center mb-8"
        >
          <div className="mb-6">
            <p className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-kid-purple via-kid-pink to-kid-orange bg-clip-text text-transparent">
              {score}%
            </p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <Star 
                  className={`w-10 h-10 ${
                    i < stars 
                      ? 'text-kid-yellow fill-kid-yellow' 
                      : 'text-muted'
                  }`} 
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="card-kid text-center">
            <Trophy className="w-8 h-8 text-kid-green mx-auto mb-2" />
            <p className="text-2xl font-bold">{results.filter((r: any) => r.correct).length}/{results.length}</p>
            <p className="text-sm text-muted-foreground">Correct</p>
          </div>
          <div className="card-kid text-center">
            <Clock className="w-8 h-8 text-kid-blue mx-auto mb-2" />
            <p className="text-2xl font-bold">{formatTime(timeTaken)}</p>
            <p className="text-sm text-muted-foreground">Time</p>
          </div>
          <div className="card-kid text-center">
            <Lightbulb className="w-8 h-8 text-kid-yellow mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {results.reduce((sum: number, r: any) => sum + (r.hintsUsed || 0), 0)}
            </p>
            <p className="text-sm text-muted-foreground">Hints</p>
          </div>
        </motion.div>

        {/* Question Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold mb-4">Question Breakdown</h3>
            <div className="space-y-3">
              {results.map((result: any, index: number) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    result.correct ? 'bg-success/10' : 'bg-destructive/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.correct ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : (
                      <XCircle className="w-6 h-6 text-destructive" />
                    )}
                    <span className="font-medium">Question {index + 1}</span>
                  </div>
                  {result.hintsUsed > 0 && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Lightbulb className="w-4 h-4" />
                      {result.hintsUsed} hints
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button 
            onClick={() => navigate('/student')} 
            className="flex-1 py-6 text-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button>
          <Button 
            onClick={() => navigate('/student/tests')} 
            variant="outline"
            className="flex-1 py-6 text-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            More Tests
          </Button>
        </motion.div>
      </div>
    </StudentLayout>
  );
}
