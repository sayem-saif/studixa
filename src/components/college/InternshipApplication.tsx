import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Send, CheckCircle, User, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InternshipApplicationProps {
  userId: string;
  userName?: string;
  userEmail?: string;
}

const InternshipApplication = ({ userId, userName, userEmail }: InternshipApplicationProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userName || "",
    email: userEmail || "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast.error("Please write a message about your internship interest");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSubmitted(true);
    toast.success("Application submitted successfully!");
  };

  if (submitted) {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="p-8 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center">
          <motion.div
            className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Thank you for expressing your interest in internship opportunities. 
            Our team will analyze your progress and skills, and you will be informed 
            soon about suitable internship opportunities.
          </p>
          <div className="p-4 rounded-xl bg-card border border-border inline-block">
            <p className="text-sm text-muted-foreground">
              You will receive updates at: <strong>{formData.email}</strong>
            </p>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-secondary/50 border border-border">
          <h3 className="font-semibold mb-3">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">1</div>
              <p className="text-sm text-muted-foreground">We analyze your skill progress and completed courses</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">2</div>
              <p className="text-sm text-muted-foreground">Match your skills with available internship opportunities</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">3</div>
              <p className="text-sm text-muted-foreground">You receive personalized internship recommendations</p>
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Submit Another Application
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Ready to Start?</p>
            <h2 className="text-2xl font-bold">Apply for Internship</h2>
            <p className="text-white/70 text-sm mt-1">
              Express your interest and we'll match you with opportunities
            </p>
          </div>
          <Briefcase className="w-16 h-16 text-white/30" />
        </div>
      </motion.div>

      {/* Application Form */}
      <motion.form
        className="p-6 rounded-xl bg-card border border-border space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Your Name
          </Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Why are you interested in an internship?
          </Label>
          <Textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Write about your skills, interests, and why you're ready for an internship opportunity. Mention any relevant projects or achievements..."
            rows={5}
            required
          />
          <p className="text-xs text-muted-foreground">
            Pro tip: Mention the skills you've learned and any projects you've worked on
          </p>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            "Submitting..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Application
            </>
          )}
        </Button>
      </motion.form>

      {/* Info Section */}
      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <h4 className="font-semibold mb-2">Tips for a strong application</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Complete all skill courses before applying</li>
          <li>• Pass the quizzes with high scores</li>
          <li>• Mention specific technologies you've learned</li>
          <li>• Share any personal projects or achievements</li>
        </ul>
      </div>
    </div>
  );
};

export default InternshipApplication;
