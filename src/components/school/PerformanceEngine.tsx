import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, TrendingUp, Zap, BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PerformanceData {
  subject: string;
  accuracy: number;
  level: "weak" | "medium" | "strong";
  attempts: number;
  topics: {
    name: string;
    accuracy: number;
    level: "weak" | "medium" | "strong";
  }[];
}

interface PerformanceEngineProps {
  profile: any;
}

const PerformanceEngine = ({ profile }: PerformanceEngineProps) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [weakTopics, setWeakTopics] = useState<any[]>([]);
  const [strongTopics, setStrongTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallAccuracy, setOverallAccuracy] = useState(0);

  useEffect(() => {
    fetchPerformanceData();
  }, [profile]);

  const fetchPerformanceData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Fetch all performance logs for this user
      const { data: logs, error } = await supabase
        .from("performance_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error || !logs || logs.length === 0) {
        console.log("No performance data yet");
        setLoading(false);
        return;
      }

      // Group by subject and analyze
      const subjectMap: Record<string, any> = {};

      for (const log of logs) {
        const { data: subject } = await supabase
          .from("subjects")
          .select("name")
          .eq("id", log.subject_id)
          .single();

        if (!subject) continue;

        if (!subjectMap[log.subject_id]) {
          subjectMap[log.subject_id] = {
            subject: subject.name,
            logs: [],
            topicsMap: {},
          };
        }

        subjectMap[log.subject_id].logs.push(log);

        // Track topics
        if (log.topic_name) {
          if (!subjectMap[log.subject_id].topicsMap[log.topic_name]) {
            subjectMap[log.subject_id].topicsMap[log.topic_name] = [];
          }
          subjectMap[log.subject_id].topicsMap[log.topic_name].push(log);
        }
      }

      // Calculate performance levels
      const performanceArray: PerformanceData[] = [];
      const allWeakTopics: any[] = [];
      const allStrongTopics: any[] = [];
      let totalAccuracy = 0;
      let totalAttempts = 0;

      for (const [subjectId, data] of Object.entries(subjectMap)) {
        const logs = (data as any).logs;
        const topicsMap = (data as any).topicsMap;
        const avgAccuracy = Math.round(logs.reduce((sum: number, log: any) => sum + log.accuracy, 0) / logs.length);
        const level = avgAccuracy < 50 ? "weak" : avgAccuracy <= 75 ? "medium" : "strong";

        // Analyze topics
        const topics = Object.entries(topicsMap).map(([topicName, topicLogs]: [string, any]) => {
          const topicAccuracy = Math.round(
            topicLogs.reduce((sum: number, log: any) => sum + log.accuracy, 0) / topicLogs.length
          );
          const topicLevel = topicAccuracy < 50 ? "weak" : topicAccuracy <= 75 ? "medium" : "strong";

          if (topicLevel === "weak") {
            allWeakTopics.push({
              subject: (data as any).subject,
              topic: topicName,
              accuracy: topicAccuracy,
              attempts: topicLogs.length,
            });
          } else if (topicLevel === "strong") {
            allStrongTopics.push({
              subject: (data as any).subject,
              topic: topicName,
              accuracy: topicAccuracy,
              attempts: topicLogs.length,
            });
          }

          return {
            name: topicName,
            accuracy: topicAccuracy,
            level: topicLevel,
          };
        });

        performanceArray.push({
          subject: (data as any).subject,
          accuracy: avgAccuracy,
          level,
          attempts: logs.length,
          topics,
        });

        totalAccuracy += avgAccuracy * logs.length;
        totalAttempts += logs.length;
      }

      setPerformanceData(performanceArray);
      setWeakTopics(allWeakTopics.sort((a, b) => a.accuracy - b.accuracy));
      setStrongTopics(allStrongTopics.sort((a, b) => b.accuracy - a.accuracy));
      setOverallAccuracy(totalAttempts > 0 ? Math.round(totalAccuracy / totalAttempts) : 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching performance data:", error);
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

  if (performanceData.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Start taking quizzes to see your performance analysis!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Performance Summary */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Overall Accuracy</p>
            <h2 className="text-4xl font-bold text-primary">{overallAccuracy}%</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {performanceData.reduce((sum, p) => sum + p.attempts, 0)} quiz attempts
            </p>
          </div>
          <div className={`p-4 rounded-xl ${
            overallAccuracy >= 75 ? "bg-success/20" : overallAccuracy >= 50 ? "bg-warning/20" : "bg-destructive/20"
          }`}>
            <Zap className={`w-8 h-8 ${
              overallAccuracy >= 75 ? "text-success" : overallAccuracy >= 50 ? "text-warning" : "text-destructive"
            }`} />
          </div>
        </div>
      </motion.div>

      {/* Weak Topics - Requires Attention */}
      {weakTopics.length > 0 && (
        <motion.div
          className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold text-lg">Areas Needing Attention</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Focus on these topics to improve your performance
          </p>
          <div className="space-y-3">
            {weakTopics.slice(0, 5).map((topic, index) => (
              <motion.div
                key={index}
                className="p-3 rounded-lg bg-background border border-destructive/20 flex items-center justify-between"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div>
                  <p className="font-medium text-sm">{topic.topic}</p>
                  <p className="text-xs text-muted-foreground">{topic.subject} • {topic.attempts} attempts</p>
                </div>
                <span className="text-sm font-bold text-destructive">{topic.accuracy}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Subject-wise Performance */}
      <motion.div
        className="p-6 rounded-2xl bg-card border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-semibold text-lg mb-4">Performance by Subject</h3>
        <div className="space-y-4">
          {performanceData.map((subjectPerf, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{subjectPerf.subject}</span>
                <span className={`text-sm font-bold px-2 py-1 rounded ${
                  subjectPerf.level === "strong"
                    ? "bg-success/20 text-success"
                    : subjectPerf.level === "medium"
                    ? "bg-warning/20 text-warning"
                    : "bg-destructive/20 text-destructive"
                }`}>
                  {subjectPerf.accuracy}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                <motion.div
                  className={`h-full ${
                    subjectPerf.level === "strong"
                      ? "bg-success"
                      : subjectPerf.level === "medium"
                      ? "bg-warning"
                      : "bg-destructive"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${subjectPerf.accuracy}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              {subjectPerf.topics.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {subjectPerf.topics.filter(t => t.level === "weak").length} weak •{" "}
                  {subjectPerf.topics.filter(t => t.level === "medium").length} medium •{" "}
                  {subjectPerf.topics.filter(t => t.level === "strong").length} strong topics
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Strong Topics - Building on Strengths */}
      {strongTopics.length > 0 && (
        <motion.div
          className="p-6 rounded-2xl bg-success/5 border border-success/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-success" />
            <h3 className="font-semibold text-lg">Your Strengths</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Keep building on these strong areas
          </p>
          <div className="space-y-3">
            {strongTopics.slice(0, 5).map((topic, index) => (
              <motion.div
                key={index}
                className="p-3 rounded-lg bg-background border border-success/20 flex items-center justify-between"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div>
                  <p className="font-medium text-sm">{topic.topic}</p>
                  <p className="text-xs text-muted-foreground">{topic.subject} • {topic.attempts} attempts</p>
                </div>
                <span className="text-sm font-bold text-success">{topic.accuracy}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PerformanceEngine;
