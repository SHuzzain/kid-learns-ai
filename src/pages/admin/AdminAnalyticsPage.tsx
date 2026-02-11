/**
 * Admin Analytics Page
 */

import { AdminLayout } from '@/components/layout';
import { useAnalytics } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart3, Users, FileText, Clock, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="text-center py-12 text-muted-foreground">Loading analytics...</p>
      </AdminLayout>
    );
  }

  if (!analytics) {
    return (
      <AdminLayout>
        <p className="text-center py-12 text-muted-foreground">No analytics data available.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Platform performance overview</p>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><FileText className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="text-2xl font-bold">{analytics.totalTests}</p>
                  <p className="text-sm text-muted-foreground">Total Tests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><Users className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="text-2xl font-bold">{analytics.totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><BarChart3 className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="text-2xl font-bold">{analytics.totalAttempts}</p>
                  <p className="text-sm text-muted-foreground">Total Attempts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><BarChart3 className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="text-2xl font-bold">{analytics.averageScore}%</p>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Test Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.testAnalytics.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No test data yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Avg Time</TableHead>
                    <TableHead>Hints Used</TableHead>
                    <TableHead>Completion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.testAnalytics.map((t) => (
                    <TableRow key={t.testId}>
                      <TableCell className="font-medium">{t.testTitle}</TableCell>
                      <TableCell>{t.totalAttempts}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{t.averageScore}%</span>
                          <Progress value={t.averageScore} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {Math.round(t.averageTime / 60)}m
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-muted-foreground" />
                        {t.averageHintsUsed}
                      </TableCell>
                      <TableCell>{t.completionRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
