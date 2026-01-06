import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle, Play, FileText, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChapterViewProps {
  subject: any;
  profile: any;
  onBack: () => void;
  onStartQuiz?: (chapter: any) => void;
}

const ChapterView = ({ subject, profile, onBack, onStartQuiz }: ChapterViewProps) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<{ [key: string]: { completed: boolean; quizScore: number | null } }>({});
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const fetchData = async () => {
    // Get chapters from database
    const { data: dbChapters } = await supabase
      .from("chapters")
      .select("*")
      .eq("subject_id", subject.id)
      .order("chapter_number");

    if (dbChapters && dbChapters.length > 0) {
      setChapters(dbChapters);
    } else {
      setChapters([]);
    }

    // Fetch user progress
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && dbChapters) {
      const chapterIds = dbChapters.map(c => c.id);
      const { data: progress } = await supabase
        .from("user_progress")
        .select("chapter_id, completed, quiz_score")
        .eq("user_id", session.user.id)
        .in("chapter_id", chapterIds);

      const progressMap: { [key: string]: { completed: boolean; quizScore: number | null } } = {};
      progress?.forEach((p) => {
        progressMap[p.chapter_id] = { completed: p.completed || false, quizScore: p.quiz_score };
      });
      setUserProgress(progressMap);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [subject]);

  const handleMarkComplete = async () => {
    if (!selectedChapter) return;
    
    setMarking(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast.error("Please log in to track progress");
      setMarking(false);
      return;
    }

    try {
      // Check if progress exists
      const { data: existing } = await supabase
        .from("user_progress")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("chapter_id", selectedChapter.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        await supabase
          .from("user_progress")
          .update({ completed: true, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        // Insert new
        await supabase
          .from("user_progress")
          .insert({
            user_id: session.user.id,
            chapter_id: selectedChapter.id,
            completed: true,
          });
      }

      setUserProgress(prev => ({
        ...prev,
        [selectedChapter.id]: { ...prev[selectedChapter.id], completed: true }
      }));

      toast.success("Chapter marked as complete! You can now take the quiz.");
    } catch (error) {
      toast.error("Failed to update progress");
    } finally {
      setMarking(false);
    }
  };

  const handleStartQuiz = () => {
    if (onStartQuiz && selectedChapter) {
      onStartQuiz(selectedChapter);
    }
  };

  const isChapterComplete = (chapterId: string) => userProgress[chapterId]?.completed || false;
  const hasQuizScore = (chapterId: string) => userProgress[chapterId]?.quizScore !== null && userProgress[chapterId]?.quizScore !== undefined;

  if (selectedChapter) {
    const isComplete = isChapterComplete(selectedChapter.id);
    const quizScore = userProgress[selectedChapter.id]?.quizScore;

    return (
      <div>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => setSelectedChapter(null)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Chapters
        </Button>

        <motion.div
          className="p-6 rounded-2xl bg-card border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold">{selectedChapter.name}</h2>
              <p className="text-muted-foreground">{subject.name} • Chapter {selectedChapter.chapter_number}</p>
            </div>
            {isComplete && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Completed
              </span>
            )}
          </div>

          {selectedChapter.summary && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
              <h3 className="text-lg font-semibold text-primary mb-2">Summary</h3>
              <p className="text-muted-foreground">{selectedChapter.summary}</p>
            </div>
          )}

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="whitespace-pre-line text-foreground leading-relaxed">
              {selectedChapter.content || "Content coming soon..."}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            {!isComplete ? (
              <Button 
                variant="default" 
                className="flex-1 bg-success hover:bg-success/90"
                onClick={handleMarkComplete}
                disabled={marking}
              >
                {marking ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Mark as Complete
              </Button>
            ) : (
              <div className="flex-1 p-3 rounded-lg bg-success/10 text-success text-center text-sm font-medium">
                ✓ You've completed reading this chapter
              </div>
            )}
            
            {isComplete ? (
              <Button 
                variant="default" 
                className="flex-1"
                onClick={handleStartQuiz}
              >
                <Play className="w-4 h-4 mr-2" />
                {quizScore !== null && quizScore !== undefined ? `Retake Quiz (Best: ${quizScore}%)` : "Take Quiz"}
              </Button>
            ) : (
              <Button 
                variant="secondary" 
                className="flex-1 opacity-60"
                disabled
              >
                <Lock className="w-4 h-4 mr-2" />
                Complete Chapter First
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <Button variant="ghost" className="mb-4" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Subjects
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary/10">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">{subject.name}</h2>
          <p className="text-muted-foreground">Class {subject.class_level} • {chapters.length} Chapters</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : chapters.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No chapters available yet for this subject.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter, index) => {
            const isComplete = isChapterComplete(chapter.id);
            const quizScore = userProgress[chapter.id]?.quizScore;
            
            return (
              <motion.button
                key={chapter.id}
                className={`w-full p-5 rounded-xl bg-card border hover:shadow-md text-left transition-all group ${
                  isComplete ? "border-success/30 bg-success/5" : "border-border hover:border-primary/30"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedChapter(chapter)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                      isComplete 
                        ? "bg-success/20 text-success" 
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      {isComplete ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        chapter.chapter_number
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {chapter.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {chapter.summary}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {quizScore !== null && quizScore !== undefined && (
                      <span className="text-sm font-medium text-primary">
                        Quiz: {quizScore}%
                      </span>
                    )}
                    <Play className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChapterView;
