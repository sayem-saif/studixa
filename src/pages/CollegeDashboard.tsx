import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, BarChart3, Award, Bell, Code2, LogOut, Gift, Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CGPATracker from "@/components/college/CGPATracker";
import CertificateTracker from "@/components/college/CertificateTracker";
import NotificationsPanel from "@/components/college/NotificationsPanel";
import SkillCourses from "@/components/college/SkillCourses";
import InternshipApplication from "@/components/college/InternshipApplication";

type ActiveSection = "dashboard" | "cgpa" | "certificates" | "notifications" | "skills" | "internship";

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

  const features = [
    { id: "cgpa" as const, title: "CGPA Tracker", desc: "Log and track your semester grades", icon: BarChart3 },
    { id: "certificates" as const, title: "Certificate Tracker", desc: "Store all your certificates", icon: Award },
    { id: "notifications" as const, title: "Notifications", desc: "Events, hackathons & internships", icon: Bell },
    { id: "skills" as const, title: "Skill Courses", desc: "Learn C, Python, Java & Web Dev", icon: Code2 },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-primary">Loading...</div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            {activeSection !== "dashboard" && (
              <Button variant="ghost" size="icon" onClick={() => setActiveSection("dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="p-2 rounded-xl bg-gradient-primary">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold">Studixa</h1>
              <p className="text-xs text-muted-foreground">{profile?.college_course} • {profile?.college_branch}</p>
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
        {activeSection === "dashboard" ? (
          <>
            <motion.div 
              className="mb-8 p-6 rounded-2xl bg-gradient-primary text-primary-foreground" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-display text-2xl font-bold mb-1">Welcome, {profile?.full_name || "Student"}! 🎓</h2>
              <p className="text-primary-foreground/80">Build your skills and advance your career</p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {features.map((f, i) => (
                <motion.button
                  key={i}
                  className="p-5 rounded-xl bg-card border border-border relative overflow-hidden text-left hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setActiveSection(f.id)}
                >
                  <div className="absolute top-0 right-0 px-2 py-1 bg-success text-success-foreground text-xs font-medium rounded-bl-lg">
                    Free!
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10 inline-flex mb-3">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </motion.button>
              ))}
            </div>

            {/* Internship Application Card */}
            <motion.button
              className="w-full p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-left hover:border-indigo-500/50 transition-colors mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => setActiveSection("internship")}
            >
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-indigo-500/20">
                  <Briefcase className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Apply for Internship</h3>
                  <p className="text-muted-foreground">
                    Complete your skill courses and apply for internship opportunities
                  </p>
                </div>
              </div>
            </motion.button>

            {/* Quick Stats */}
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div 
                className="p-6 rounded-2xl bg-card border border-border" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-display text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveSection("cgpa")}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Track your CGPA
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveSection("certificates")}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Add a Certificate
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveSection("skills")}
                  >
                    <Code2 className="w-4 h-4 mr-2" />
                    Start Learning
                  </Button>
                </div>
              </motion.div>

              <motion.div 
                className="p-6 rounded-2xl bg-card border border-border" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.6 }}
              >
                <h3 className="font-display text-xl font-bold mb-4">Available Courses</h3>
                <div className="space-y-3">
                  {["C Programming", "Python", "Java", "HTML & CSS"].map((course, i) => (
                    <div key={i} className="p-4 rounded-xl bg-secondary/50 flex items-center justify-between">
                      <span className="font-medium">{course}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setActiveSection("skills")}
                      >
                        Start Learning
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {renderContent()}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CollegeDashboard;
