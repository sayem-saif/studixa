import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen, 
  Brain, 
  Trophy, 
  LogOut, 
  FileText,
  BarChart3,
  Clock,
  Target,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SubjectsGrid from "@/components/school/SubjectsGrid";
import AIMentor from "@/components/school/AIMentor";
import QuizSection from "@/components/school/QuizSection";
import DocumentSummarizer from "@/components/school/DocumentSummarizer";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

type Tab = "dashboard" | "subjects" | "quiz" | "mentor" | "summarizer";

interface OverviewStats {
  totalChapters: number;
  completedChapters: number;
  quizzesTaken: number;
  averageQuizScore: number;
  studyStreak: number;
}

interface SubjectProgressItem {
  subjectId: string;
  subjectName: string;
  totalChapters: number;
  completedChapters: number;
  completionPercent: number;
}

interface ChartPoint {
  label: string;
  value: number;
}

const EmptyChartState = ({ message }: { message: string }) => (
  <div className="h-[280px] flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
    <p className="text-sm text-muted-foreground text-center px-4">{message}</p>
  </div>
);

const StudentOverview = ({ profile }: { profile: any }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OverviewStats>({
    totalChapters: 0,
    completedChapters: 0,
    quizzesTaken: 0,
    averageQuizScore: 0,
    studyStreak: 0,
  });
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgressItem[]>([]);
  const [quizTrend, setQuizTrend] = useState<ChartPoint[]>([]);
  const [dailyStudy, setDailyStudy] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const stream = profile?.school_stream || "general";
      const classLevel = profile?.school_class;

      const { data: subjects } = await supabase
        .from("subjects")
        .select("id, name")
        .eq("class_level", classLevel)
        .or(`stream.eq.${stream},stream.is.null`)
        .order("name", { ascending: true });

      const subjectList = subjects || [];
      const subjectIds = subjectList.map((s) => s.id);

      const { data: chapters } = await supabase
        .from("chapters")
        .select("id, subject_id")
        .in("subject_id", subjectIds.length > 0 ? subjectIds : ["00000000-0000-0000-0000-000000000000"]);

      const chapterList = chapters || [];
      const chapterIds = chapterList.map((c) => c.id);

      const { data: progressRows } = await supabase
        .from("user_progress")
        .select("chapter_id, completed, quiz_score, updated_at")
        .eq("user_id", session.user.id)
        .in("chapter_id", chapterIds.length > 0 ? chapterIds : ["00000000-0000-0000-0000-000000000000"])
        .order("updated_at", { ascending: false });

      const progress = progressRows || [];
      const completedRows = progress.filter((p) => p.completed);
      const quizRows = progress.filter((p) => p.quiz_score !== null);

      const totalQuizScore = quizRows.reduce((sum, row) => sum + (row.quiz_score || 0), 0);
      const averageQuizScore = quizRows.length > 0 ? Math.round(totalQuizScore / quizRows.length) : 0;

      // Study streak based on consecutive active dates.
      const activityDays = new Set(
        progress.map((row) => new Date(row.updated_at).toISOString().slice(0, 10)),
      );

      let streak = 0;
      const cursor = new Date();
      while (true) {
        const key = cursor.toISOString().slice(0, 10);
        if (!activityDays.has(key)) break;
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      }

      setStats({
        totalChapters: chapterList.length,
        completedChapters: completedRows.length,
        quizzesTaken: quizRows.length,
        averageQuizScore,
        studyStreak: streak,
      });

      // Subject progress.
      const chaptersBySubject: Record<string, number> = {};
      const completedBySubject: Record<string, number> = {};
      const chapterToSubject: Record<string, string> = {};

      chapterList.forEach((chapter) => {
        chapterToSubject[chapter.id] = chapter.subject_id;
        chaptersBySubject[chapter.subject_id] = (chaptersBySubject[chapter.subject_id] || 0) + 1;
      });

      completedRows.forEach((row) => {
        const subjectId = chapterToSubject[row.chapter_id];
        if (!subjectId) return;
        completedBySubject[subjectId] = (completedBySubject[subjectId] || 0) + 1;
      });

      const dedupBySubjectName = new Map<string, SubjectProgressItem>();
      subjectList.forEach((subject) => {
        const total = chaptersBySubject[subject.id] || 0;
        const completed = completedBySubject[subject.id] || 0;
        if (total === 0) return;

        const key = subject.name.trim().toLowerCase();
        const existing = dedupBySubjectName.get(key);

        if (!existing) {
          dedupBySubjectName.set(key, {
            subjectId: subject.id,
            subjectName: subject.name,
            totalChapters: total,
            completedChapters: completed,
            completionPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
          });
          return;
        }

        const mergedTotal = existing.totalChapters + total;
        const mergedCompleted = existing.completedChapters + completed;
        dedupBySubjectName.set(key, {
          ...existing,
          totalChapters: mergedTotal,
          completedChapters: mergedCompleted,
          completionPercent: mergedTotal > 0 ? Math.round((mergedCompleted / mergedTotal) * 100) : 0,
        });
      });

      const subjectProgressData = Array.from(dedupBySubjectName.values()).sort(
        (a, b) => b.completionPercent - a.completionPercent,
      );

      setSubjectProgress(subjectProgressData);

      // Quiz score trend (last 8 quiz records).
      const quizTrendData = quizRows
        .slice(0, 8)
        .reverse()
        .map((row, index) => ({
          label: `Q${index + 1}`,
          value: row.quiz_score || 0,
        }));

      setQuizTrend(quizTrendData);

      // Daily study trend (last 7 days, number of chapter activities/day).
      const dayMap: Record<string, number> = {};
      const now = new Date();
      const dayLabels: ChartPoint[] = [];

      for (let i = 6; i >= 0; i -= 1) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString(undefined, { weekday: "short" });
        dayMap[key] = 0;
        dayLabels.push({ label, value: 0 });
      }

      progress.forEach((row) => {
        const key = new Date(row.updated_at).toISOString().slice(0, 10);
        if (key in dayMap) dayMap[key] += 1;
      });

      const keys = Object.keys(dayMap);
      const dailyTrend = dayLabels.map((point, index) => ({
        label: point.label,
        value: dayMap[keys[index]] || 0,
      }));

      setDailyStudy(dailyTrend);
      setLoading(false);
    };

    if (profile) fetchOverview();
  }, [profile]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
        Loading your dashboard data...
      </div>
    );
  }

  const hasAnyProgress = stats.completedChapters > 0 || stats.quizzesTaken > 0;
  const topSubjects = subjectProgress.slice(0, 3);
  const needsAttentionSubjects = subjectProgress
    .filter((item) => item.completionPercent < 60)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Chapter Progress</p>
          <p className="text-2xl font-bold">{stats.completedChapters}/{stats.totalChapters}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Quizzes Taken</p>
          <p className="text-2xl font-bold">{stats.quizzesTaken}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Average Quiz Score</p>
          <p className="text-2xl font-bold">{stats.quizzesTaken > 0 ? `${stats.averageQuizScore}%` : "No data"}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Study Streak</p>
          <p className="text-2xl font-bold">{stats.studyStreak > 0 ? `${stats.studyStreak}d` : "0d"}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 col-span-2 xl:col-span-1">
          <p className="text-xs text-muted-foreground mb-1">Completion Rate</p>
          <p className="text-2xl font-bold">
            {stats.totalChapters > 0 ? `${Math.round((stats.completedChapters / stats.totalChapters) * 100)}%` : "0%"}
          </p>
        </div>
      </div>

      {!hasAnyProgress && (
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          You have not started any chapter or quiz yet. Once you begin studying, your quiz graph, daily study graph, and growth trends will appear here.
        </div>
      )}

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Quiz Score Trend</h3>
          </div>
          {quizTrend.length === 0 ? (
            <EmptyChartState message="No quiz attempts yet. Take a quiz to see score trend." />
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={quizTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Daily Study Activity</h3>
          </div>
          {dailyStudy.every((d) => d.value === 0) ? (
            <EmptyChartState message="No daily activity yet. Complete chapters or quizzes to see this graph." />
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyStudy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Subject-wise Progress</h3>
        </div>

        {subjectProgress.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">
            No subject progress yet. Start learning to track growth here.
          </div>
        ) : (
          <div className="space-y-4">
            {subjectProgress.map((item) => (
              <div key={item.subjectId}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{item.subjectName}</span>
                  <span className="text-muted-foreground">
                    {item.completedChapters}/{item.totalChapters} chapters ({item.completionPercent}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${item.completionPercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-3">Top Performing Subjects</h3>
          {topSubjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subject progress yet.</p>
          ) : (
            <div className="space-y-3">
              {topSubjects.map((item) => (
                <div key={`top-${item.subjectId}`} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.subjectName}</span>
                  <span className="text-success">{item.completionPercent}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-3">Needs Attention</h3>
          {needsAttentionSubjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">Great work. No low-progress subjects right now.</p>
          ) : (
            <div className="space-y-3">
              {needsAttentionSubjects.map((item) => (
                <div key={`weak-${item.subjectId}`} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.subjectName}</span>
                  <span className="text-warning">{item.completionPercent}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SchoolDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (!profileData) {
        navigate("/onboarding");
        return;
      }

      if (profileData.user_type !== "school") {
        navigate("/college-dashboard");
        return;
      }

      setProfile(profileData);
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: BarChart3 },
    { id: "subjects" as Tab, label: "Subjects", icon: BookOpen },
    { id: "quiz" as Tab, label: "Quiz", icon: Trophy },
    { id: "mentor" as Tab, label: "AI Mentor", icon: Brain },
    { id: "summarizer" as Tab, label: "Summarizer", icon: FileText },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex-col">
        <div className="h-16 px-4 border-b border-border flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-primary">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold">Studixa</h1>
            <p className="text-xs text-muted-foreground">Student Dashboard</p>
          </div>
        </div>

        <nav className="p-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-3 border-t border-border">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="md:ml-64 min-h-screen">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur px-4 md:px-6 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Welcome, {profile?.full_name || "Student"}</h2>
            <p className="text-xs text-muted-foreground">
              Class {profile?.school_class} {profile?.school_stream ? `• ${profile.school_stream.toUpperCase()}` : ""}
            </p>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <div className="md:hidden mb-4 grid grid-cols-2 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && <StudentOverview profile={profile} />}
            {activeTab === "subjects" && <SubjectsGrid profile={profile} />}
            {activeTab === "quiz" && <QuizSection profile={profile} mode="fullClass" />}
            {activeTab === "mentor" && <AIMentor profile={profile} />}
            {activeTab === "summarizer" && <DocumentSummarizer profile={profile} />}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SchoolDashboard;
