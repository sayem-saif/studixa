import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Calendar, Target, Loader2, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProgressData {
  subject: string;
  overallAccuracy: number;
  weeklyChange: number;
  recentAccuracy: number;
  trend: "up" | "down" | "stable";
  attempts: number;
  lastAttempt: string;
}

interface ProgressIntelligenceProps {
  profile: any;
}

const ProgressIntelligence = ({ profile }: ProgressIntelligenceProps) => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [improvementAreas, setImprovementAreas] = useState<any[]>([]);

  useEffect(() => {
    fetchProgressData();
  }, [profile]);

  const fetchProgressData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Fetch all performance logs for this user
      const { data: allLogs, error } = await supabase
        .from("performance_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error || !allLogs || allLogs.length === 0) {
        setLoading(false);
        return;
      }

      // Group by subject and calculate trends
      const subjectMap: Record<string, any[]> = {};

      for (const log of allLogs) {
        if (!subjectMap[log.subject_id]) {
          subjectMap[log.subject_id] = [];
        }
        subjectMap[log.subject_id].push(log);
      }

      const progressArray: ProgressData[] = [];
      const improvements: any[] = [];

      // Calculate one week ago
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      for (const [subjectId, logs] of Object.entries(subjectMap)) {
        // Get subject name
        const { data: subject } = await supabase
          .from("subjects")
          .select("name")
          .eq("id", subjectId)
          .single();

        if (!subject) continue;

        const overallAccuracy = Math.round(
          logs.reduce((sum, log) => sum + log.accuracy, 0) / logs.length
        );

        // Calculate weekly accuracy (last 7 days)
        const weeklyLogs = logs.filter(
          (log) => new Date(log.created_at) > oneWeekAgo
        );
        const weeklyAccuracy = weeklyLogs.length > 0
          ? Math.round(
              weeklyLogs.reduce((sum, log) => sum + log.accuracy, 0) / weeklyLogs.length
            )
          : overallAccuracy;

        // Calculate recent accuracy (last 3 attempts)
        const recentLogs = logs.slice(0, 3);
        const recentAccuracy = Math.round(
          recentLogs.reduce((sum, log) => sum + log.accuracy, 0) / recentLogs.length
        );

        // Determine trend
        let trend: "up" | "down" | "stable" = "stable";
        const weeklyChange = weeklyAccuracy - overallAccuracy;
        if (weeklyChange > 5) trend = "up";
        else if (weeklyChange < -5) trend = "down";

        progressArray.push({
          subject: subject.name,
          overallAccuracy,
          weeklyChange: weeklyAccuracy - overallAccuracy,
          recentAccuracy,
          trend,
          attempts: logs.length,
          lastAttempt: logs[0]?.created_at || new Date().toISOString(),
        });

        // Detect improvement areas
        if (weeklyChange > 0) {
          improvements.push({
            subject: subject.name,
            improvement: weeklyChange,
            message: `Improved by ${Math.abs(weeklyChange)}% this week`,
          });
        } else if (weeklyChange < -5) {
          improvements.push({
            subject: subject.name,
            improvement: weeklyChange,
            message: `Declining by ${Math.abs(weeklyChange)}% - needs attention`,
          });
        }
      }

      // Sort improvements by absolute value
      improvements.sort((a, b) => Math.abs(b.improvement) - Math.abs(a.improvement));

      setProgressData(progressArray.sort((a, b) => b.overallAccuracy - a.overallAccuracy));
      setImprovementAreas(improvements);

      // Calculate weekly trend data (last 7 days)
      const last7Days: Record<string, number[]> = {};
      const last7DaysAccuracies: Record<string, any> = {};

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();

        const dayLogs = allLogs.filter(
          (log) => new Date(log.created_at).toLocaleDateString() === dateStr
        );

        const dayAccuracy = dayLogs.length > 0
          ? Math.round(
              dayLogs.reduce((sum, log) => sum + log.accuracy, 0) / dayLogs.length
            )
          : 0;

        last7DaysAccuracies[dateStr] = {
          date: dateStr,
          accuracy: dayAccuracy,
          attempts: dayLogs.length,
        };
      }

      setWeeklyTrend(
        Object.values(last7DaysAccuracies).reverse()
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching progress data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (progressData.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Start taking quizzes to see your progress trends!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Improvements */}
      {improvementAreas.length > 0 && (
        <motion.div
          className="p-6 rounded-2xl bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Progress Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {improvementAreas.map((area, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border ${
                  area.improvement > 0
                    ? "bg-success/5 border-success/30"
                    : area.improvement < 0
                    ? "bg-warning/5 border-warning/30"
                    : "bg-secondary/50 border-border"
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{area.subject}</p>
                    <p className="text-xs text-muted-foreground">{area.message}</p>
                  </div>
                  <div className={`p-2 rounded ${
                    area.improvement > 0
                      ? "bg-success/20"
                      : area.improvement < 0
                      ? "bg-warning/20"
                      : "bg-secondary"
                  }`}>
                    {area.improvement > 0 ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : area.improvement < 0 ? (
                      <TrendingDown className="w-5 h-5 text-warning" />
                    ) : (
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Subject Performance Comparison */}
      <motion.div
        className="p-6 rounded-2xl bg-card border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-semibold text-lg mb-6">Overall vs. Weekly Performance</h3>
        <div className="space-y-6">
          {progressData.map((subject, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium">{subject.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {subject.attempts} attempts • Last attempt {new Date(subject.lastAttempt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Comparison bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Overall</span>
                    <span className="font-semibold">{subject.overallAccuracy}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.overallAccuracy}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Recent (This Week)</span>
                    <span className={`font-semibold ${
                      subject.weeklyChange > 0 ? "text-success" : subject.weeklyChange < 0 ? "text-warning" : ""
                    }`}>
                      {subject.recentAccuracy}% {subject.weeklyChange > 0 ? "up" : subject.weeklyChange < 0 ? "down" : "stable"}
                    </span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        subject.trend === "up"
                          ? "bg-success"
                          : subject.trend === "down"
                          ? "bg-warning"
                          : "bg-accent"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.recentAccuracy}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Activity */}
      {weeklyTrend.length > 0 && (
        <motion.div
          className="p-6 rounded-2xl bg-card border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Weekly Activity Summary
          </h3>
          <div className="space-y-3">
            {weeklyTrend.map((day, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="text-sm text-muted-foreground min-w-24">{day.date}</span>
                <div className="flex-1">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: day.attempts > 0 ? `${Math.min((day.attempts * 25) / 10, 100)}%` : 0 }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium min-w-16">
                  {day.attempts} quiz{day.attempts !== 1 ? "zes" : ""}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressIntelligence;
