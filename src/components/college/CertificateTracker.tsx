import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Award, Trash2, ExternalLink, Calendar, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  category: string | null;
  file_url: string | null;
}

interface CertificateTrackerProps {
  userId: string;
}

const categories = [
  "Technical",
  "Coursera",
  "Udemy",
  "NPTEL",
  "LinkedIn Learning",
  "Google",
  "Microsoft",
  "AWS",
  "Hackathon",
  "Workshop",
  "Other",
];

const CertificateTracker = ({ userId }: CertificateTrackerProps) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    issue_date: "",
    category: "",
    file_url: "",
  });

  useEffect(() => {
    fetchCertificates();
  }, [userId]);

  const fetchCertificates = async () => {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("user_id", userId)
      .order("issue_date", { ascending: false });

    if (error) {
      toast.error("Failed to fetch certificates");
    } else {
      setCertificates(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.issuer || !formData.issue_date) {
      toast.error("Please fill all required fields");
      return;
    }

    const { error } = await supabase.from("certificates").insert({
      user_id: userId,
      name: formData.name,
      issuer: formData.issuer,
      issue_date: formData.issue_date,
      category: formData.category || null,
      file_url: formData.file_url || null,
    });

    if (error) {
      toast.error("Failed to add certificate");
    } else {
      toast.success("Certificate added!");
      setFormData({ name: "", issuer: "", issue_date: "", category: "", file_url: "" });
      setShowForm(false);
      fetchCertificates();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete certificate");
    } else {
      toast.success("Certificate deleted!");
      fetchCertificates();
    }
  };

  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      Technical: "bg-blue-500/20 text-blue-400",
      Coursera: "bg-purple-500/20 text-purple-400",
      Udemy: "bg-pink-500/20 text-pink-400",
      NPTEL: "bg-orange-500/20 text-orange-400",
      Google: "bg-green-500/20 text-green-400",
      Microsoft: "bg-cyan-500/20 text-cyan-400",
      AWS: "bg-amber-500/20 text-amber-400",
      Hackathon: "bg-red-500/20 text-red-400",
      Workshop: "bg-indigo-500/20 text-indigo-400",
    };
    return colors[category || ""] || "bg-secondary text-secondary-foreground";
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Total Certificates</p>
            <h2 className="text-4xl font-bold">{certificates.length}</h2>
            <p className="text-white/70 text-sm mt-1">
              Keep building your portfolio!
            </p>
          </div>
          <Award className="w-16 h-16 text-white/30" />
        </div>
      </motion.div>

      {/* Add Form */}
      {showForm && (
        <motion.form
          className="p-4 rounded-xl bg-secondary/50 border border-border space-y-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleSubmit}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Certificate Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Python for Data Science"
                required
              />
            </div>
            <div>
              <Label>Issuing Organization *</Label>
              <Input
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="Coursera"
                required
              />
            </div>
            <div>
              <Label>Issue Date *</Label>
              <Input
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Certificate URL (optional)</Label>
              <Input
                type="url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="https://coursera.org/verify/..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              Add Certificate
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </motion.form>
      )}

      {/* Certificates List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Your Certificates</h3>
          {!showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Certificate
            </Button>
          )}
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No certificates added yet. Start building your portfolio!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                className="p-4 rounded-xl bg-card border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold line-clamp-1">{cert.name}</h4>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Building className="w-4 h-4" />
                  <span>{cert.issuer}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(cert.issue_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  {cert.category && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(cert.category)}`}>
                      {cert.category}
                    </span>
                  )}
                  {cert.file_url && (
                    <a
                      href={cert.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center gap-1"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateTracker;
