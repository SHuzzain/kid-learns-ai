/**
 * Create/Edit Test Page for Admin
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  Sparkles, 
  Plus, 
  Trash2,
  Save,
  FileText,
  Wand2
} from 'lucide-react';
import { AdminLayout } from '@/components/layout';
import { useCreateTest, useExtractQuestions, useAddQuestion, useLessons } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Question } from '@/types';

interface QuestionForm {
  id: string;
  questionText: string;
  correctAnswer: string;
  hints: string[];
  microLearning: string;
}

export function CreateTestPage() {
  const navigate = useNavigate();
  const createTest = useCreateTest();
  const extractQuestions = useExtractQuestions();
  const addQuestion = useAddQuestion();
  const { data: lessons } = useLessons();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(15);
  const [scheduledDate, setScheduledDate] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const result = await extractQuestions.mutateAsync(file);
      const newQuestions: QuestionForm[] = result.questions.map((q, i) => ({
        id: `temp-${Date.now()}-${i}`,
        questionText: q.questionText,
        correctAnswer: q.correctAnswer,
        hints: q.hints,
        microLearning: q.microLearning,
      }));
      setQuestions(prev => [...prev, ...newQuestions]);
    } catch (error) {
      console.error('Failed to extract questions:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  const addEmptyQuestion = () => {
    setQuestions(prev => [...prev, {
      id: `temp-${Date.now()}`,
      questionText: 'The __BLANK__ is...',
      correctAnswer: '',
      hints: ['', '', ''],
      microLearning: '',
    }]);
  };

  const updateQuestion = (id: string, updates: Partial<QuestionForm>) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const updateHint = (questionId: string, hintIndex: number, value: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const newHints = [...q.hints];
        newHints[hintIndex] = value;
        return { ...q, hints: newHints };
      }
      return q;
    }));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSave = async () => {
    if (!title || !scheduledDate || questions.length === 0) {
      alert('Please fill in all required fields and add at least one question.');
      return;
    }

    setIsSaving(true);
    try {
      const test = await createTest.mutateAsync({
        title,
        description,
        duration,
        scheduledDate: new Date(scheduledDate),
        lessonId: lessonId || undefined,
      });

      // Add questions to the test
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await addQuestion.mutateAsync({
          testId: test.id,
          question: {
            questionText: q.questionText,
            correctAnswer: q.correctAnswer,
            hints: q.hints.filter(h => h.trim()),
            microLearning: q.microLearning,
            order: i + 1,
          },
        });
      }

      navigate('/admin/tests');
    } catch (error) {
      console.error('Failed to create test:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Test</h1>
            <p className="text-muted-foreground">Set up a new test for students</p>
          </div>
        </div>

        {/* Test Details */}
        <Card>
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Animal Friends Quiz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Scheduled Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this test covers..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={5}
                  max={60}
                />
              </div>
              <div className="space-y-2">
                <Label>Assign Lesson (optional)</Label>
                <Select value={lessonId} onValueChange={setLessonId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lesson" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No lesson</SelectItem>
                    {lessons?.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Section */}
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex-1">
                <div className="flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-xl hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {isExtracting ? 'Extracting questions...' : 'Upload question file (PDF/DOC/TXT)'}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isExtracting}
                />
              </label>
              <Button 
                variant="outline" 
                onClick={addEmptyQuestion}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Manually
              </Button>
            </div>

            {/* AI Extraction Notice */}
            {isExtracting && (
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-sm">AI is extracting fill-in-the-blank questions...</span>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-xl bg-muted/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      Question {index + 1}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteQuestion(question.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question (use __BLANK__ for the fill-in)</Label>
                      <Textarea
                        value={question.questionText}
                        onChange={(e) => updateQuestion(question.id, { questionText: e.target.value })}
                        placeholder="The __BLANK__ is the largest planet."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Input
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                        placeholder="Jupiter"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hints (up to 3)</Label>
                      <div className="grid gap-2">
                        {[0, 1, 2].map((i) => (
                          <Input
                            key={i}
                            value={question.hints[i] || ''}
                            onChange={(e) => updateHint(question.id, i, e.target.value)}
                            placeholder={`Hint ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Micro Learning Explanation</Label>
                      <Textarea
                        value={question.microLearning}
                        onChange={(e) => updateQuestion(question.id, { microLearning: e.target.value })}
                        placeholder="A simple explanation for kids aged 5-10..."
                        rows={3}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {questions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No questions yet. Upload a file or add manually.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !title || !scheduledDate || questions.length === 0}
            className="gap-2"
          >
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Test
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
