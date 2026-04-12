import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, BookOpen, Trophy, Target, TrendingUp, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface ProgressTrackerProps {
  profile: any;
}

interface SubjectProgress {
  name: string;
  progress: number;
  quizScore: number;
  color: string;
  totalChapters: number;
  completedChapters: number;
}

const ProgressTracker = ({ profile }: ProgressTrackerProps) => {
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [stats, setStats] = useState({
    totalChapters: 0,
    completedChapters: 0,
    quizzesTaken: 0,
    averageScore: 0,
    studyStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealProgress();
  }, [profile]);

  const fetchRealProgress = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Get all subjects for the user's class
      const { data: subjects } = await supabase
        .from("subjects")
        .select("id, name, icon, color")
        .eq("class_level", profile?.school_class || 9);

      if (!subjects || subjects.length === 0) {
        setLoading(false);
        return;
      }

      const progressData: SubjectProgress[] = [];
      let totalChaps = 0;
      let completedChaps = 0;
      let totalQuizzesTaken = 0;
      let totalQuizScore = 0;
      let quizCount = 0;

      // Get progress for each subject
      for (const subject of subjects) {
        // Get all chapters for this subject
        const { data: chapters } = await supabase
          .from("chapters")
          .select("id")
          .eq("subject_id", subject.id);

        const totalChapters = chapters?.length || 0;
        totalChaps += totalChapters;

        if (totalChapters === 0) continue;

        // Get user's progress for these chapters
        const chapterIds = chapters?.map(c => c.id) || [];
        const { data: userProgress } = await supabase
          .from("user_progress")
          .select("chapter_id, completed, quiz_score")
          .eq("user_id", session.user.id)
          .in("chapter_id", chapterIds);

        const completed = userProgress?.filter(p => p.completed).length || 0;
        completedChaps += completed;

        const quizScores = userProgress?.filter(p => p.quiz_score !== null).map(p => p.quiz_score || 0) || [];
        const avgQuizScore = quizScores.length > 0
          ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
          : 0;

        totalQuizzesTaken += quizScores.length;
        if (quizScores.length > 0) {
          totalQuizScore += quizScores.reduce((sum, score) => sum + score, 0);
          quizCount += quizScores.length;
        }

        const colorMap: Record<string, string> = {
          purple: "subject-purple",
          green: "subject-green",
          blue: "subject-blue",
          orange: "subject-orange",
          teal: "subject-teal",
        };

        progressData.push({
          name: subject.name,
          progress: totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0,
          quizScore: avgQuizScore,
          color: colorMap[subject.color] || "primary",
          totalChapters,
          completedChapters: completed,
        });
      }

      // Calculate overall average quiz score
      const overallAvgScore = quizCount > 0 ? Math.round(totalQuizScore / quizCount) : 0;

      // Calculate study streak (simplified - based on last activity)
      const { data: recentProgress } = await supabase
        .from("user_progress")
        .select("updated_at")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false })
        .limit(7);

      let streak = 0;
      if (recentProgress && recentProgress.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < recentProgress.length; i++) {
          const activityDate = new Date(recentProgress[i].updated_at);
          activityDate.setHours(0, 0, 0, 0);
          
          const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === i) {
            streak++;
          } else {
            break;
          }
        }
      }

      setSubjectProgress(progressData);
      setStats({
        totalChapters: totalChaps,
        completedChapters: completedChaps,
        quizzesTaken: totalQuizzesTaken,
        averageScore: overallAvgScore,
        studyStreak: streak,
      });
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
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

  const statsDisplay = [
    { 
      label: "Chapters Completed", 
      value: `${stats.completedChapters}/${stats.totalChapters}`, 
      icon: BookOpen, 
      color: "primary" 
    },
    { 
      label: "Quizzes Taken", 
      value: stats.quizzesTaken.toString(), 
      icon: Trophy, 
      color: "premium" 
    },
    { 
      label: "Average Score", 
      value: stats.averageScore > 0 ? `${stats.averageScore}%` : "N/A", 
      icon: Target, 
      color: "success" 
    },
    { 
      label: "Study Streak", 
      value: stats.studyStreak > 0 ? `${stats.studyStreak} day${stats.studyStreak > 1 ? 's' : ''}` : "Start today!", 
      icon: TrendingUp, 
      color: "accent" 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsDisplay.map((stat, index) => (
          <motion.div
            key={index}
            className="p-4 rounded-xl bg-card border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`inline-flex p-2 rounded-lg bg-${stat.color}/10 mb-3`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Subject Progress */}
      <motion.div
        className="p-6 rounded-2xl bg-card border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold">Subject Progress</h3>
          <BarChart3 className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="space-y-6">
          {subjectProgress.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start learning to see your progress here!</p>
            </div>
          ) : (
            subjectProgress.map((subject, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{subject.name}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {subject.completedChapters}/{subject.totalChapters} chapters • {subject.progress}%
                    </span>
                    {subject.quizScore > 0 && (
                      <span className={`font-medium text-${subject.color}`}>
                        Quiz: {subject.quizScore}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-${subject.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Opening Sale - Premium features unlocked! */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-r from-success/20 to-primary/20 border border-success/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-success/20">
            <Trophy className="w-8 h-8 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1 flex items-center gap-2">
              Opening Sale Active!
            </h3>
            <p className="text-sm text-muted-foreground">
              All premium analytics features are unlocked for free! Enjoy detailed insights, weakness analysis, and AI-powered recommendations.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          className="p-6 rounded-2xl bg-success/5 border border-success/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="font-semibold text-success mb-4">Your Strengths</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              English - Reading Comprehension
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              Science - Chemical Reactions
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              Math - Algebra
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="p-6 rounded-2xl bg-warning/5 border border-warning/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h4 className="font-semibold text-warning mb-4">Areas to Improve</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning" />
              Social Studies - French Revolution
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning" />
              Math - Coordinate Geometry
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning" />
              Science - Atomic Structure
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressTracker;
