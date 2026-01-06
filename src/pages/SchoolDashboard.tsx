import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen, 
  Brain, 
  Trophy, 
  LogOut, 
  User,
  ChevronRight,
  Sparkles,
  Crown,
  FileText,
  BarChart3,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SubjectsGrid from "@/components/school/SubjectsGrid";
import AIMentor from "@/components/school/AIMentor";
import QuizSection from "@/components/school/QuizSection";
import ProgressTracker from "@/components/school/ProgressTracker";
import DocumentSummarizer from "@/components/school/DocumentSummarizer";

type Tab = "subjects" | "mentor" | "summarizer" | "quiz" | "progress";

const SchoolDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("subjects");
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
    { id: "subjects" as Tab, label: "Subjects", icon: BookOpen },
    { id: "mentor" as Tab, label: "AI Mentor", icon: Brain },
    { id: "summarizer" as Tab, label: "Summarizer", icon: FileText },
    { id: "quiz" as Tab, label: "Daily Quiz", icon: Trophy },
    { id: "progress" as Tab, label: "Progress", icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-primary">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold">Studixa</h1>
              <p className="text-xs text-muted-foreground">
                Class {profile?.school_class} • {profile?.school_stream?.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-premium text-premium-foreground text-xs font-medium">
              <Gift className="w-3 h-3" />
              Premium Free!
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Opening Sale Banner */}
      <motion.div 
        className="bg-gradient-to-r from-premium via-accent to-premium text-premium-foreground"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container px-4 py-3 flex items-center justify-center gap-3 text-center">
          <Gift className="w-5 h-5 animate-pulse" />
          <span className="font-semibold">🎉 Opening Sale! All Premium Features are FREE for a limited time!</span>
          <Gift className="w-5 h-5 animate-pulse" />
        </div>
      </motion.div>

      <div className="container px-4 py-6">
        {/* Welcome section */}
        <motion.div
          className="mb-8 p-6 rounded-2xl bg-gradient-primary text-primary-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold mb-1">
                Welcome back, {profile?.full_name || "Student"}! 👋
              </h2>
              <p className="text-primary-foreground/80">
                Ready to continue your learning journey?
              </p>
            </div>
            <Sparkles className="w-12 h-12 opacity-50" />
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "secondary"}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "subjects" && <SubjectsGrid profile={profile} />}
          {activeTab === "mentor" && <AIMentor profile={profile} />}
          {activeTab === "summarizer" && <DocumentSummarizer profile={profile} />}
          {activeTab === "quiz" && <QuizSection profile={profile} mode="fullClass" />}
          {activeTab === "progress" && <ProgressTracker profile={profile} />}
        </motion.div>
      </div>
    </div>
  );
};

export default SchoolDashboard;
