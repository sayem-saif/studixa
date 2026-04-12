import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, FlaskConical, Globe, Calculator, Atom, Dna } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ChapterView from "./ChapterView";
import QuizSection from "./QuizSection";

const iconMap: { [key: string]: any } = {
  BookOpen,
  FlaskConical,
  Globe,
  Calculator,
  Atom,
  Dna,
};

const colorMap: { [key: string]: string } = {
  blue: "bg-subject-blue/10 text-subject-blue",
  green: "bg-subject-green/10 text-subject-green",
  orange: "bg-subject-orange/10 text-subject-orange",
  purple: "bg-subject-purple/10 text-subject-purple",
  teal: "bg-subject-teal/10 text-subject-teal",
};

interface SubjectsGridProps {
  profile: any;
}

type ViewMode = "subjects" | "chapters" | "quiz";

const SubjectsGrid = ({ profile }: SubjectsGridProps) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("subjects");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      const stream = profile?.school_stream || "general";
      
      const { data } = await supabase
        .from("subjects")
        .select("*")
        .eq("class_level", profile?.school_class)
        .or(`stream.eq.${stream},stream.is.null`)
        .order("name", { ascending: true });

      const subjectList = data || [];

      if (subjectList.length === 0) {
        setSubjects([]);
        setLoading(false);
        return;
      }

      const subjectIds = subjectList.map((s) => s.id);
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id, subject_id")
        .in("subject_id", subjectIds);

      const chapterCountBySubject: Record<string, number> = {};
      (chapters || []).forEach((chapter) => {
        chapterCountBySubject[chapter.subject_id] = (chapterCountBySubject[chapter.subject_id] || 0) + 1;
      });

      // Remove duplicates by subject name and keep the entry with more chapters.
      const dedupedByName = new Map<string, any>();
      subjectList.forEach((subject) => {
        const chapterCount = chapterCountBySubject[subject.id] || 0;
        const existing = dedupedByName.get(subject.name);

        if (!existing || chapterCount > existing.chapterCount) {
          dedupedByName.set(subject.name, { ...subject, chapterCount });
        }
      });

      // Hide subjects with no chapters so users don't see unusable cards.
      const filteredSubjects = Array.from(dedupedByName.values()).filter(
        (subject) => subject.chapterCount > 0,
      );

      setSubjects(filteredSubjects);
      setLoading(false);
    };

    if (profile) {
      fetchSubjects();
    }
  }, [profile]);

  const handleStartQuiz = (chapter: any) => {
    setSelectedChapter(chapter);
    setViewMode("quiz");
  };

  const handleBackFromQuiz = () => {
    setViewMode("chapters");
    setSelectedChapter(null);
  };

  const handleBackFromChapters = () => {
    setViewMode("subjects");
    setSelectedSubject(null);
  };

  // Quiz mode
  if (viewMode === "quiz" && selectedChapter) {
    return (
      <QuizSection 
        profile={profile}
        chapter={selectedChapter}
        mode="chapter"
        onBack={handleBackFromQuiz}
      />
    );
  }

  // Chapters view
  if (viewMode === "chapters" && selectedSubject) {
    return (
      <ChapterView 
        subject={selectedSubject} 
        profile={profile}
        onBack={handleBackFromChapters}
        onStartQuiz={handleStartQuiz}
      />
    );
  }

  // Subjects grid
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Your Subjects</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map((subject, index) => {
          const IconComponent = iconMap[subject.icon] || BookOpen;
          const colorClass = colorMap[subject.color] || colorMap.blue;

          return (
            <motion.button
              key={subject.id}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg text-left transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedSubject(subject);
                setViewMode("chapters");
              }}
            >
              <div className={`inline-flex p-3 rounded-xl ${colorClass} mb-4`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                {subject.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Class {subject.class_level}
              </p>
              <div className="flex items-center text-sm text-primary">
                View Chapters
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No subjects found for your class.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectsGrid;
