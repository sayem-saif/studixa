import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, School, Building2, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Onboarding = () => {
  const [userType, setUserType] = useState<"school" | "college" | null>(null);
  const [schoolClass, setSchoolClass] = useState<string>("");
  const [schoolStream, setSchoolStream] = useState<string>("");
  const [collegeCourse, setCollegeCourse] = useState<string>("");
  const [collegeBranch, setCollegeBranch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!user) return;

    if (!userType) {
      toast.error("Please select your education level");
      return;
    }

    if (userType === "school" && !schoolClass) {
      toast.error("Please select your class");
      return;
    }

    if (userType === "school" && parseInt(schoolClass) >= 11 && !schoolStream) {
      toast.error("Please select your stream");
      return;
    }

    if (userType === "college" && (!collegeCourse || !collegeBranch)) {
      toast.error("Please select your course and branch");
      return;
    }

    setLoading(true);

    try {
      const profileData: any = {
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || "",
        user_type: userType,
      };

      if (userType === "school") {
        profileData.school_class = parseInt(schoolClass);
        profileData.school_stream = parseInt(schoolClass) >= 11 ? schoolStream : "general";
      } else {
        profileData.college_course = collegeCourse;
        profileData.college_branch = collegeBranch;
      }

      const { error } = await supabase.from("profiles").insert(profileData);

      if (error) throw error;

      toast.success("Profile created successfully!");
      
      if (userType === "school") {
        navigate("/school-dashboard");
      } else {
        navigate("/college-dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  const collegeCourses = [
    { name: "B.Tech", available: true },
    { name: "B.Sc", available: false },
    { name: "BCA", available: false },
    { name: "B.Com", available: false },
    { name: "BA", available: false },
  ];
  const collegeBranches = ["CSE", "ECE", "Mechanical", "Civil", "Chemical", "IT", "EEE"];

  const handleCourseSelect = (courseName: string, isAvailable: boolean) => {
    if (!isAvailable) {
      toast.info(`${courseName} is coming soon! B.Tech is currently live.`);
      return;
    }
    setCollegeCourse(courseName);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 rounded-xl bg-gradient-primary">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">Studixa</span>
        </div>

        <div className="p-8 rounded-2xl bg-card border border-border shadow-xl">
          <h1 className="font-display text-3xl font-bold text-center mb-2">
            Tell us about yourself
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            This helps us personalize your learning experience
          </p>

          {/* Step 1: Choose type */}
          <div className="mb-8">
            <Label className="text-lg font-semibold mb-4 block">
              I am a...
            </Label>
            <div className="grid md:grid-cols-2 gap-4">
              <motion.button
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  userType === "school"
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => {
                  setUserType("school");
                  setCollegeCourse("");
                  setCollegeBranch("");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <School className={`w-10 h-10 mb-3 ${userType === "school" ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="font-semibold text-lg mb-1">School Student</h3>
                <p className="text-sm text-muted-foreground">
                  Classes 9-12, NCERT curriculum
                </p>
              </motion.button>

              <motion.button
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  userType === "college"
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => {
                  setUserType("college");
                  setSchoolClass("");
                  setSchoolStream("");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Building2 className={`w-10 h-10 mb-3 ${userType === "college" ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="font-semibold text-lg mb-1">College Student</h3>
                <p className="text-sm text-muted-foreground">
                  Undergraduate programs
                </p>
              </motion.button>
            </div>
          </div>

          {/* Step 2: Additional details */}
          {userType === "school" && (
            <motion.div
              className="space-y-4 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-2">
                <Label>Select your class</Label>
                <Select value={schoolClass} onValueChange={setSchoolClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">Class 9</SelectItem>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {parseInt(schoolClass) >= 11 && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Label>Select your stream</Label>
                  <Select value={schoolStream} onValueChange={setSchoolStream}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your stream" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcm">PCM (Physics, Chemistry, Math)</SelectItem>
                      <SelectItem value="pcb">PCB (Physics, Chemistry, Biology)</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </motion.div>
          )}

          {userType === "college" && (
            <motion.div
              className="space-y-4 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-2">
                <Label>Select your course</Label>
                <div className="grid grid-cols-2 gap-2">
                  {collegeCourses.map((course) => (
                    <button
                      key={course.name}
                      type="button"
                      className={`p-3 rounded-lg border text-left transition-all ${
                        collegeCourse === course.name
                          ? "border-primary bg-primary/10"
                          : course.available
                          ? "border-border hover:border-primary/50"
                          : "border-border/50 opacity-60"
                      }`}
                      onClick={() => handleCourseSelect(course.name, course.available)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{course.name}</span>
                        {!course.available && (
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded">Coming Soon</span>
                        )}
                        {course.available && (
                          <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">Live</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select your branch</Label>
                <Select value={collegeBranch} onValueChange={setCollegeBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {collegeBranches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          <Button
            onClick={handleSubmit}
            variant="hero"
            size="lg"
            className="w-full"
            disabled={loading || !userType}
          >
            {loading ? (
              "Creating profile..."
            ) : (
              <>
                Continue to Dashboard
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
