import { motion } from "framer-motion";
import { BarChart3, BookOpen, Trophy, Target, TrendingUp, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgressTrackerProps {
  profile: any;
}

const ProgressTracker = ({ profile }: ProgressTrackerProps) => {
  // Mock progress data
  const subjectProgress = [
    { name: "Mathematics", progress: 65, quizScore: 78, color: "subject-purple" },
    { name: "Science", progress: 45, quizScore: 82, color: "subject-green" },
    { name: "English", progress: 80, quizScore: 90, color: "subject-blue" },
    { name: "Social Studies", progress: 30, quizScore: 75, color: "subject-orange" },
  ];

  const stats = [
    { label: "Chapters Completed", value: "12/32", icon: BookOpen, color: "primary" },
    { label: "Quizzes Taken", value: "28", icon: Trophy, color: "premium" },
    { label: "Average Score", value: "81%", icon: Target, color: "success" },
    { label: "Study Streak", value: "5 days", icon: TrendingUp, color: "accent" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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
          {subjectProgress.map((subject, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{subject.name}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{subject.progress}% complete</span>
                  <span className={`font-medium text-${subject.color}`}>Quiz: {subject.quizScore}%</span>
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
          ))}
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
              🎉 Opening Sale Active!
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
          <h4 className="font-semibold text-success mb-4">💪 Your Strengths</h4>
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
          <h4 className="font-semibold text-warning mb-4">📚 Areas to Improve</h4>
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
