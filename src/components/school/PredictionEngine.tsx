import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, AlertCircle, ChevronRight, Loader2, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface PredictionData {
  subject: string;
  currentAccuracy: number;
  predictedScore: number;
  scoreRange: [number, number];
  confidence: number;
  improvements: string[];
  targetScore: number;
}

interface PredictionEngineProps {
  profile: any;
}

const PredictionEngine = ({ profile }: PredictionEngineProps) => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallPrediction, setOverallPrediction] = useState<any>(null);

  useEffect(() => {
    calculatePredictions();
  }, [profile]);

  const calculatePredictions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Fetch all performance logs
      const { data: allLogs } = await supabase
        .from("performance_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!allLogs || allLogs.length === 0) {
        setLoading(false);
        return;
      }

      // Group by subject
      const subjectMap: Record<string, any[]> = {};

      for (const log of allLogs) {
        if (!subjectMap[log.subject_id]) {
          subjectMap[log.subject_id] = [];
        }
        subjectMap[log.subject_id].push(log);
      }

      const predictionsArray: PredictionData[] = [];
      let totalPrediction = 0;
      let subjectCount = 0;

      for (const [subjectId, logs] of Object.entries(subjectMap)) {
        // Get subject name
        const { data: subject } = await supabase
          .from("subjects")
          .select("name")
          .eq("id", subjectId)
          .single();

        if (!subject) continue;

        // Calculate metrics for prediction
        const overallAccuracy = Math.round(
          logs.reduce((sum, log) => sum + log.accuracy, 0) / logs.length
        );

        // Recent accuracy (last 5 attempts)
        const recentLogs = logs.slice(0, 5);
        const recentAccuracy = Math.round(
          recentLogs.reduce((sum, log) => sum + log.accuracy, 0) / recentLogs.length
        );

        // Consistency score (how consistent are the scores)
        const accuracies = logs.map(l => l.accuracy);
        const avgAccuracy = accuracies.reduce((a, b) => a + b) / accuracies.length;
        const variance = accuracies.reduce((sum, acc) => sum + Math.pow(acc - avgAccuracy, 2), 0) / accuracies.length;
        const stdDev = Math.sqrt(variance);
        const consistency = Math.max(0, 100 - stdDev); // Higher consistency = lower std dev

        // Improvement trend (are they improving over time?)
        let improvementTrend = 0;
        if (logs.length > 1) {
          const firstHalf = logs.slice(Math.ceil(logs.length / 2));
          const secondHalf = logs.slice(0, Math.ceil(logs.length / 2));
          const firstHalfAvg = firstHalf.reduce((sum, log) => sum + log.accuracy, 0) / firstHalf.length;
          const secondHalfAvg = secondHalf.reduce((sum, log) => sum + log.accuracy, 0) / secondHalf.length;
          improvementTrend = secondHalfAvg - firstHalfAvg;
        }

        // PREDICTION FORMULA (Rule-based)
        // predicted_score = (avg_accuracy * 0.4) + (recent_accuracy * 0.4) + (consistency * 0.2)
        const weightedPrediction = (overallAccuracy * 0.4) + (recentAccuracy * 0.4) + (consistency * 0.2);

        // Apply trend adjustment
        const trendAdjustment = improvementTrend * 0.3;
        const predictedScore = Math.round(weightedPrediction + trendAdjustment);

        // Score range (±10% confidence interval)
        const margin = 10;
        const scoreRange: [number, number] = [
          Math.max(0, predictedScore - margin),
          Math.min(100, predictedScore + margin),
        ];

        // Confidence (based on number of attempts and consistency)
        const attemptConfidence = Math.min(100, (logs.length / 10) * 100);
        const consistencyConfidence = 100 - stdDev;
        const confidence = Math.round((attemptConfidence * 0.5) + (consistencyConfidence * 0.5));

        // Improvement recommendations
        const improvements: string[] = [];
        if (overallAccuracy < 60) {
          improvements.push("Focus on fundamentals");
        }
        if (consistency < 70) {
          improvements.push("Maintain consistent practice");
        }
        if (improvementTrend < 0) {
          improvements.push("Performance declining - review concepts");
        }
        if (recentAccuracy > overallAccuracy + 5) {
          improvements.push("Keep up momentum!");
        }

        predictionsArray.push({
          subject: subject.name,
          currentAccuracy: overallAccuracy,
          predictedScore: Math.max(0, Math.min(100, predictedScore)),
          scoreRange,
          confidence,
          improvements: improvements.length > 0 ? improvements : ["Continue practice"],
          targetScore: Math.min(95, predictedScore + 10), // Target is 10% higher
        });

        totalPrediction += predictedScore;
        subjectCount++;
      }

      // Sort by predicted score (lowest first - needs most help)
      predictionsArray.sort((a, b) => a.predictedScore - b.predictedScore);

      // Calculate overall prediction
      const overallPred = Math.round(totalPrediction / (subjectCount || 1));
      setOverallPrediction({
        predictedScore: overallPred,
        range: [Math.max(0, overallPred - 10), Math.min(100, overallPred + 10)],
        subjectsNeedingHelp: predictionsArray.filter(p => p.predictedScore < 60).length,
        strongSubjects: predictionsArray.filter(p => p.predictedScore >= 80).length,
      });

      setPredictions(predictionsArray);
      setLoading(false);
    } catch (error) {
      console.error("Error calculating predictions:", error);
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

  if (predictions.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Take more quizzes to get accurate predictions!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Prediction */}
      {overallPrediction && (
        <motion.div
          className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Overall Expected Score</p>
              <div className="flex items-center gap-3">
                <h1 className="text-5xl font-bold text-primary">{overallPrediction.predictedScore}</h1>
                <div>
                  <p className="text-lg font-semibold text-primary">
                    {overallPrediction.range[0]}–{overallPrediction.range[1]}%
                  </p>
                  <p className="text-xs text-muted-foreground">Confidence Range</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-primary/10">
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-primary/10">
            <div>
              <p className="text-muted-foreground text-xs">Strong Subjects</p>
              <p className="text-2xl font-bold text-success">{overallPrediction.strongSubjects}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Need Improvement</p>
              <p className="text-2xl font-bold text-warning">{overallPrediction.subjectsNeedingHelp}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Subject Predictions */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Target className="w-5 h-5" />
          Subject-wise Predictions
        </h3>

        {predictions.map((pred, index) => (
          <motion.div
            key={index}
            className={`p-5 rounded-xl border ${
              pred.predictedScore < 60
                ? "border-warning/30 bg-warning/5"
                : pred.predictedScore < 75
                ? "border-accent/30 bg-accent/5"
                : "border-success/30 bg-success/5"
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold">{pred.subject}</h4>
                <p className="text-xs text-muted-foreground">
                  Current: {pred.currentAccuracy}% • Trend analyzed
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${
                  pred.predictedScore >= 80
                    ? "text-success"
                    : pred.predictedScore >= 60
                    ? "text-primary"
                    : "text-warning"
                }`}>
                  {pred.predictedScore}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {pred.scoreRange[0]}–{pred.scoreRange[1]}%
                </p>
              </div>
            </div>

            {/* Prediction bar */}
            <div className="mb-4">
              <div className="h-3 bg-secondary rounded-full overflow-hidden mb-2">
                <motion.div
                  className={`h-full ${
                    pred.predictedScore >= 80
                      ? "bg-success"
                      : pred.predictedScore >= 60
                      ? "bg-primary"
                      : "bg-warning"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pred.predictedScore}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: {pred.scoreRange[0]}%</span>
                <span>Confidence: {pred.confidence}%</span>
                <span>Target: {pred.targetScore}%</span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Recommendations:</p>
              {pred.improvements.map((improvement, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  <span>{improvement}</span>
                </div>
              ))}
            </div>

            {/* Action button */}
            {pred.predictedScore < 75 && (
              <Button className="w-full mt-4" size="sm" variant="outline">
                Start Practice
              </Button>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Methodology */}
      <motion.div
        className="p-4 rounded-xl bg-secondary/50 border border-border text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="font-medium mb-2">How predictions are calculated:</p>
        <ul className="space-y-1 text-xs">
          <li>• Overall accuracy (40%) + Recent performance (40%) + Consistency (20%)</li>
          <li>• Adjusted for improvement trends</li>
          <li>• Range reflects confidence level based on practice volume</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default PredictionEngine;
