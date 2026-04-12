import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, CheckCircle, XCircle, ArrowRight, RotateCcw, Sparkles, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QuizSectionProps {
  profile: any;
  chapter?: any;
  onBack?: () => void;
  mode?: "chapter" | "fullClass";
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject?: string;
  chapterName?: string;
}

const QuizSection = ({ profile, chapter, onBack, mode = "fullClass" }: QuizSectionProps) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ correct: boolean; question: Question }[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);

  // Log performance data to performance_logs table
  const logPerformance = async (accuracy: number, userScore: number, totalQuestions: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Get subject ID from chapter
      let subjectId = chapter?.subject_id;
      if (!subjectId && chapter?.id) {
        const { data: chapterData } = await supabase
          .from("chapters")
          .select("subject_id")
          .eq("id", chapter.id)
          .single();
        subjectId = chapterData?.subject_id;
      }

      if (!subjectId) return;

      const timeTakenSeconds = Math.round((Date.now() - quizStartTime) / 1000);

      // Insert performance log
      const { error } = await supabase.from("performance_logs").insert({
        user_id: session.user.id,
        user_type: profile?.user_type || "school",
        subject_id: subjectId,
        chapter_id: chapter?.id || null,
        topic_name: chapter?.name || "General Quiz",
        accuracy: accuracy,
        score: userScore,
        total_questions: totalQuestions,
        time_taken: timeTakenSeconds,
        difficulty: "medium", // Can be made dynamic based on question difficulty
        attempt_number: 1,
      });

      if (error) {
        console.error("Error logging performance:", error);
      }
    } catch (error) {
      console.error("Error in logPerformance:", error);
    }
  };

  const fetchChapterQuestions = async (chapterId: string, limit: number = 10) => {
    const { data, error } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("chapter_id", chapterId);

    if (error || !data || data.length === 0) return [];

    // Shuffle and pick random questions
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(limit, shuffled.length)).map(q => ({
      id: q.id,
      question: q.question,
      options: q.options as string[],
      correctAnswer: q.correct_answer,
      explanation: q.explanation || "No explanation available.",
    }));
  };

  const fetchFullClassQuestions = async () => {
    // Get all subjects for the class
    const stream = profile?.school_stream || "general";
    const { data: subjects } = await supabase
      .from("subjects")
      .select("id, name")
      .eq("class_level", profile?.school_class)
      .or(`stream.eq.${stream},stream.is.null`);

    if (!subjects || subjects.length === 0) return [];

    const allQuestions: Question[] = [];

    // Get chapters and questions for each subject (10 questions per subject)
    for (const subject of subjects) {
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id, name")
        .eq("subject_id", subject.id);

      if (!chapters || chapters.length === 0) continue;

      const chapterIds = chapters.map(c => c.id);
      const { data: questions } = await supabase
        .from("quiz_questions")
        .select("*")
        .in("chapter_id", chapterIds);

      if (questions && questions.length > 0) {
        // Shuffle and pick 10 random questions from this subject
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(10, shuffled.length));
        
        selected.forEach(q => {
          const ch = chapters.find(c => c.id === q.chapter_id);
          allQuestions.push({
            id: q.id,
            question: q.question,
            options: q.options as string[],
            correctAnswer: q.correct_answer,
            explanation: q.explanation || "No explanation available.",
            subject: subject.name,
            chapterName: ch?.name,
          });
        });
      }
    }

    // Shuffle all questions
    return allQuestions.sort(() => Math.random() - 0.5);
  };

  const startQuiz = async () => {
    setLoading(true);
    let fetchedQuestions: Question[] = [];

    if (mode === "chapter" && chapter) {
      fetchedQuestions = await fetchChapterQuestions(chapter.id, 10);
      if (fetchedQuestions.length === 0) {
        toast.error("No quiz questions available for this chapter yet.");
        setLoading(false);
        return;
      }
    } else {
      fetchedQuestions = await fetchFullClassQuestions();
      if (fetchedQuestions.length === 0) {
        toast.error("No quiz questions available for your class yet.");
        setLoading(false);
        return;
      }
    }

    setQuestions(fetchedQuestions);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
    setAnswers([]);
    setQuizStartTime(Date.now());
    setLoading(false);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    const isCorrect = index === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setAnswers([...answers, { correct: isCorrect, question: questions[currentQuestion] }]);
  };

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
      const percentage = Math.round((score / questions.length) * 100);
      
      // Log performance to performance_logs table
      await logPerformance(percentage, score, questions.length);
      
      // Save quiz score for chapter quiz to user_progress (legacy)
      if (mode === "chapter" && chapter) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: existing } = await supabase
            .from("user_progress")
            .select("id, quiz_score")
            .eq("user_id", session.user.id)
            .eq("chapter_id", chapter.id)
            .maybeSingle();

          if (existing) {
            // Only update if new score is higher
            if (!existing.quiz_score || percentage > existing.quiz_score) {
              await supabase
                .from("user_progress")
                .update({ 
                  quiz_score: percentage, 
                  quiz_completed_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .eq("id", existing.id);
            }
          } else {
            await supabase
              .from("user_progress")
              .insert({
                user_id: session.user.id,
                chapter_id: chapter.id,
                completed: true,
                quiz_score: percentage,
                quiz_completed_at: new Date().toISOString(),
              });
          }
        }
      }
    }
  };

  if (!quizStarted) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-premium">
            {mode === "chapter" ? (
              <BookOpen className="w-10 h-10 text-premium-foreground" />
            ) : (
              <GraduationCap className="w-10 h-10 text-premium-foreground" />
            )}
          </div>
          
          {mode === "chapter" && chapter ? (
            <>
              <h2 className="font-display text-2xl font-bold mb-3">Chapter Quiz</h2>
              <p className="text-lg font-medium text-primary mb-2">{chapter.name}</p>
              <p className="text-muted-foreground mb-6">
                Test your understanding with 10 random questions from this chapter. 
                Questions are based on NCERT curriculum.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold mb-3">Full Class Quiz</h2>
              <p className="text-muted-foreground mb-6">
                Challenge yourself with 10 questions from each subject in Class {profile?.school_class}. 
                Questions are randomly selected from all chapters you've learned.
              </p>
            </>
          )}
          
          <div className="flex gap-3 justify-center">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
            <Button variant="hero" size="lg" onClick={startQuiz} disabled={loading}>
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Quiz
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center p-8 rounded-2xl bg-card border border-border mb-6">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            percentage >= 80 ? "bg-success/20" : percentage >= 50 ? "bg-warning/20" : "bg-destructive/20"
          }`}>
            <Trophy className={`w-12 h-12 ${
              percentage >= 80 ? "text-success" : percentage >= 50 ? "text-warning" : "text-destructive"
            }`} />
          </div>
          
          <h2 className="font-display text-3xl font-bold mb-2">Quiz Complete!</h2>
          {mode === "chapter" && chapter && (
            <p className="text-muted-foreground mb-2">{chapter.name}</p>
          )}
          <p className="text-muted-foreground mb-4">You scored</p>
          <div className="text-5xl font-bold mb-2">
            <span className="text-primary">{score}</span>
            <span className="text-muted-foreground">/{questions.length}</span>
          </div>
          <p className="text-2xl font-bold text-primary mb-6">{percentage}%</p>
          
          <p className={`text-lg font-medium mb-6 ${
            percentage >= 80 ? "text-success" : percentage >= 50 ? "text-warning" : "text-destructive"
          }`}>
            {percentage >= 80 ? "Excellent! Keep it up!" : 
             percentage >= 50 ? "Good job! Room for improvement" : 
             "Keep practicing! You'll get better"}
          </p>

          <div className="flex gap-3 justify-center">
            {onBack && (
              <Button onClick={onBack} variant="outline">
                Back to Chapter
              </Button>
            )}
            <Button onClick={startQuiz} variant="hero" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </div>
        </div>

        {/* Results breakdown */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h3 className="font-semibold mb-4">Your Answers</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  answer.correct ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  {answer.correct ? (
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{answer.question.question}</p>
                    {answer.question.subject && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {answer.question.subject} • {answer.question.chapterName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="font-medium text-primary">Score: {score}/{currentQuestion + (selectedAnswer !== null ? 1 : 0)}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        {question.subject && (
          <p className="text-xs text-muted-foreground mt-2">
            {question.subject} • {question.chapterName}
          </p>
        )}
      </div>

      {/* Question card */}
      <div className="p-6 rounded-2xl bg-card border border-border mb-6">
        <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showResult = selectedAnswer !== null;

            return (
              <button
                key={index}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  showResult
                    ? isCorrect
                      ? "border-success bg-success/10 text-success"
                      : isSelected
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border opacity-50"
                    : isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                    showResult
                      ? isCorrect
                        ? "bg-success text-success-foreground"
                        : isSelected
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-secondary"
                      : "bg-secondary"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrect && <CheckCircle className="w-5 h-5" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6"
        >
          <p className="font-semibold text-primary mb-2">Explanation</p>
          <p className="text-sm text-muted-foreground">{question.explanation}</p>
        </motion.div>
      )}

      {/* Next button */}
      {selectedAnswer !== null && (
        <Button onClick={nextQuestion} variant="hero" size="lg" className="w-full">
          {currentQuestion < questions.length - 1 ? (
            <>
              Next Question
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            "See Results"
          )}
        </Button>
      )}
    </motion.div>
  );
};

export default QuizSection;
