import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BarChart3,
  Award,
  Bell,
  Code2,
  LogOut,
  Briefcase,
  Brain,
  FileText,
  Github,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CGPATracker from "@/components/college/CGPATracker";
import CertificateTracker from "@/components/college/CertificateTracker";
import NotificationsPanel from "@/components/college/NotificationsPanel";
import SkillCourses from "@/components/college/SkillCourses";
import InternshipApplication from "@/components/college/InternshipApplication";
import AIMentor from "@/components/college/AIMentor";
import DocumentSummarizer from "@/components/college/DocumentSummarizer";
import ProjectTracker from "@/components/college/ProjectTracker";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type ActiveSection = "dashboard" | "cgpa" | "certificates" | "notifications" | "skills" | "internship" | "ai-mentor" | "summarizer" | "projects";

interface OverviewStats {
  semestersLogged: number;
  currentCgpa: number;
  certificatesCount: number;
  skillsCompleted: number;
  internshipReadyCourses: number;
}

interface ChartPoint {
  label: string;
  value: number;
}

interface SkillProgressRow {
  id: string;
  name: string;
  progress: number;
  completed: boolean;
}

const EmptyChartState = ({ message }: { message: string }) => (
  <div className="h-[280px] flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
    <p className="text-sm text-muted-foreground text-center px-4">{message}</p>
  </div>
);

const CollegeOverview = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OverviewStats>({
    semestersLogged: 0,
    currentCgpa: 0,
    certificatesCount: 0,
    skillsCompleted: 0,
    internshipReadyCourses: 0,
  });
  const [cgpaTrend, setCgpaTrend] = useState<ChartPoint[]>([]);
  const [dailyLearning, setDailyLearning] = useState<ChartPoint[]>([]);
  const [skillProgress, setSkillProgress] = useState<SkillProgressRow[]>([]);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);

      const { data: cgpaRecords } = await supabase
        .from("cgpa_records")
        .select("semester, sgpa, credits, created_at")
        .eq("user_id", userId)
        .order("semester", { ascending: true });

      const { data: certificates } = await supabase
        .from("certificates")
        .select("id")
        .eq("user_id", userId);

      const { data: skillCertificates } = await supabase
        .from("skill_certificates")
        .select("id")
        .eq("user_id", userId);

      const { data: courseCatalog } = await supabase
        .from("skills_courses")
        .select("id, name");

      const { data: skillProgressRows } = await supabase
        .from("user_skills_progress")
        .select("course_id, progress, completed, eligible_for_internship")
        .eq("user_id", userId);

      const { data: watchedVideos } = await supabase
        .from("skill_watched_videos")
        .select("watched_at")
        .eq("user_id", userId)
        .order("watched_at", { ascending: false });

      const cgpaList = cgpaRecords || [];
      const certCount = (certificates?.length || 0) + (skillCertificates?.length || 0);
      const rawSkillsList = skillProgressRows || [];
      const dedupSkillsByCourseId = new Map<string, typeof rawSkillsList[number]>();

      rawSkillsList.forEach((row) => {
        const existing = dedupSkillsByCourseId.get(row.course_id);
        if (!existing) {
          dedupSkillsByCourseId.set(row.course_id, row);
          return;
        }

        const existingProgress = existing.progress || 0;
        const incomingProgress = row.progress || 0;
        if (incomingProgress >= existingProgress) {
          dedupSkillsByCourseId.set(row.course_id, {
            ...row,
            completed: row.completed || existing.completed,
            eligible_for_internship: row.eligible_for_internship || existing.eligible_for_internship,
          });
        } else {
          dedupSkillsByCourseId.set(row.course_id, {
            ...existing,
            completed: row.completed || existing.completed,
            eligible_for_internship: row.eligible_for_internship || existing.eligible_for_internship,
          });
        }
      });

      const skillsList = Array.from(dedupSkillsByCourseId.values());

      const totalCredits = cgpaList.reduce((sum, row) => sum + (row.credits || 0), 0);
      const weightedPoints = cgpaList.reduce((sum, row) => sum + (row.sgpa * (row.credits || 0)), 0);
      const unweightedAvg = cgpaList.length > 0 ? cgpaList.reduce((sum, row) => sum + row.sgpa, 0) / cgpaList.length : 0;
      const currentCgpa = totalCredits > 0 ? weightedPoints / totalCredits : unweightedAvg;

      const completedSkills = skillsList.filter((row) => row.completed).length;
      const internshipReady = skillsList.filter((row) => row.eligible_for_internship).length;

      setStats({
        semestersLogged: cgpaList.length,
        currentCgpa: Number(currentCgpa.toFixed(2)),
        certificatesCount: certCount,
        skillsCompleted: completedSkills,
        internshipReadyCourses: internshipReady,
      });

      setCgpaTrend(
        cgpaList.map((row) => ({
          label: `Sem ${row.semester}`,
          value: row.sgpa,
        })),
      );

      const now = new Date();
      const byDay: Record<string, number> = {};
      const labelRows: Array<{ key: string; label: string }> = [];

      for (let i = 6; i >= 0; i -= 1) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        byDay[key] = 0;
        labelRows.push({
          key,
          label: d.toLocaleDateString(undefined, { weekday: "short" }),
        });
      }

      (watchedVideos || []).forEach((row) => {
        const key = new Date(row.watched_at).toISOString().slice(0, 10);
        if (key in byDay) byDay[key] += 1;
      });

      setDailyLearning(
        labelRows.map((row) => ({
          label: row.label,
          value: byDay[row.key] || 0,
        })),
      );

      const courseNameById: Record<string, string> = {};
      (courseCatalog || []).forEach((course) => {
        courseNameById[course.id] = course.name;
      });

      setSkillProgress(
        skillsList
          .map((row) => ({
            id: row.course_id,
            name: courseNameById[row.course_id] || "Course",
            progress: Math.max(0, Math.min(100, row.progress || 0)),
            completed: !!row.completed,
          }))
          .sort((a, b) => b.progress - a.progress),
      );

      setLoading(false);
    };

    if (userId) fetchOverview();
  }, [userId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
        Loading your dashboard data...
      </div>
    );
  }

  const hasData = stats.semestersLogged > 0 || stats.certificatesCount > 0 || stats.skillsCompleted > 0 || dailyLearning.some((d) => d.value > 0);
  const topSkills = skillProgress.slice(0, 3);
  const focusSkills = skillProgress.filter((item) => item.progress < 60).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Semesters Logged</p>
          <p className="text-2xl font-bold">{stats.semestersLogged}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Current CGPA</p>
          <p className="text-2xl font-bold">{stats.semestersLogged > 0 ? stats.currentCgpa : "No data"}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Certificates</p>
          <p className="text-2xl font-bold">{stats.certificatesCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Skills Completed</p>
          <p className="text-2xl font-bold">{stats.skillsCompleted}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 col-span-2 xl:col-span-1">
          <p className="text-xs text-muted-foreground mb-1">Internship Ready</p>
          <p className="text-2xl font-bold">{stats.internshipReadyCourses}</p>
        </div>
      </div>

      {!hasData && (
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          You have not logged CGPA, completed skills, or added certificates yet. Once you start, your growth charts and dashboard analytics will appear here.
        </div>
      )}

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">CGPA / SGPA Trend</h3>
          </div>
          {cgpaTrend.length === 0 ? (
            <EmptyChartState message="No CGPA records yet. Add semester SGPA to see your growth." />
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cgpaTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" />
                  <YAxis domain={[0, 10]} />
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
            <h3 className="font-semibold">Daily Learning Activity</h3>
          </div>
          {dailyLearning.every((d) => d.value === 0) ? (
            <EmptyChartState message="No learning activity yet. Watch course videos to see daily trend." />
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyLearning}>
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
          <h3 className="font-semibold">Skill Progress</h3>
        </div>

        {skillProgress.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">
            No skill progress yet. Start courses to track completion.
          </div>
        ) : (
          <div className="space-y-4">
            {skillProgress.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{item.progress}% {item.completed ? "(Completed)" : ""}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-3">Top Skills</h3>
          {topSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skill progress yet.</p>
          ) : (
            <div className="space-y-3">
              {topSkills.map((item) => (
                <div key={`top-${item.id}`} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-success">{item.progress}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-3">Focus Next</h3>
          {focusSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground">Great work. No low-progress skills right now.</p>
          ) : (
            <div className="space-y-3">
              {focusSkills.map((item) => (
                <div key={`focus-${item.id}`} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-warning">{item.progress}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CollegeDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate("/auth"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).single();
      if (!data) { navigate("/onboarding"); return; }
      if (data.user_type !== "college") { navigate("/school-dashboard"); return; }
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const sections = [
    { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
    { id: "cgpa" as const, label: "CGPA", icon: BarChart3 },
    { id: "certificates" as const, label: "Certificates", icon: Award },
    { id: "skills" as const, label: "Skills", icon: Code2 },
    { id: "projects" as const, label: "Projects", icon: Github },
    { id: "internship" as const, label: "Internship", icon: Briefcase },
    { id: "ai-mentor" as const, label: "AI Mentor", icon: Brain },
    { id: "summarizer" as const, label: "Summarizer", icon: FileText },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-primary">Loading...</div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <CollegeOverview userId={profile.user_id} />;
      case "cgpa":
        return <CGPATracker userId={profile.user_id} />;
      case "certificates":
        return <CertificateTracker userId={profile.user_id} />;
      case "notifications":
        return <NotificationsPanel />;
      case "skills":
        return <SkillCourses userId={profile.user_id} />;
      case "internship":
        return (
          <InternshipApplication 
            userId={profile.user_id} 
            userName={profile.full_name}
            userEmail={profile.email}
          />
        );
      case "ai-mentor":
        return <AIMentor profile={profile} />;
      case "summarizer":
        return <DocumentSummarizer profile={profile} />;
      case "projects":
        return <ProjectTracker userId={profile.user_id} />;
      default:
        return <CollegeOverview userId={profile.user_id} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex-col">
        <div className="h-16 px-4 border-b border-border flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-primary">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold">Studixa</h1>
            <p className="text-xs text-muted-foreground">College Dashboard</p>
          </div>
        </div>

        <nav className="p-3 space-y-2 overflow-y-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                activeSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
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
            <p className="text-xs text-muted-foreground">{profile?.college_course} {profile?.college_branch ? `• ${profile.college_branch}` : ""}</p>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <div className="md:hidden mb-4 grid grid-cols-2 gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground"
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CollegeDashboard;
