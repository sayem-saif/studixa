import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, TrendingUp, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CGPARecord {
  id: string;
  semester: number;
  sgpa: number;
  credits: number | null;
}

interface CGPATrackerProps {
  userId: string;
}

const CGPATracker = ({ userId }: CGPATrackerProps) => {
  const [records, setRecords] = useState<CGPARecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ semester: "", sgpa: "", credits: "" });

  useEffect(() => {
    fetchRecords();
  }, [userId]);

  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from("cgpa_records")
      .select("*")
      .eq("user_id", userId)
      .order("semester", { ascending: true });

    if (error) {
      toast.error("Failed to fetch CGPA records");
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  const calculateCGPA = () => {
    if (records.length === 0) return 0;
    const totalCredits = records.reduce((sum, r) => sum + (r.credits || 20), 0);
    const weightedSum = records.reduce((sum, r) => sum + r.sgpa * (r.credits || 20), 0);
    return (weightedSum / totalCredits).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const semester = parseInt(formData.semester);
    const sgpa = parseFloat(formData.sgpa);
    const credits = formData.credits ? parseInt(formData.credits) : null;

    if (isNaN(semester) || semester < 1 || semester > 8) {
      toast.error("Semester must be between 1 and 8");
      return;
    }
    if (isNaN(sgpa) || sgpa < 0 || sgpa > 10) {
      toast.error("SGPA must be between 0 and 10");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("cgpa_records")
        .update({ semester, sgpa, credits })
        .eq("id", editingId);

      if (error) {
        toast.error("Failed to update record");
      } else {
        toast.success("Record updated!");
        setEditingId(null);
        fetchRecords();
      }
    } else {
      const exists = records.find(r => r.semester === semester);
      if (exists) {
        toast.error("Record for this semester already exists");
        return;
      }

      const { error } = await supabase
        .from("cgpa_records")
        .insert({ user_id: userId, semester, sgpa, credits });

      if (error) {
        toast.error("Failed to add record");
      } else {
        toast.success("Semester added!");
        fetchRecords();
      }
    }

    setFormData({ semester: "", sgpa: "", credits: "" });
    setShowForm(false);
  };

  const handleEdit = (record: CGPARecord) => {
    setEditingId(record.id);
    setFormData({
      semester: record.semester.toString(),
      sgpa: record.sgpa.toString(),
      credits: record.credits?.toString() || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cgpa_records").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete record");
    } else {
      toast.success("Record deleted!");
      fetchRecords();
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* CGPA Summary */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/70 text-sm">Current CGPA</p>
            <h2 className="text-4xl font-bold">{calculateCGPA()}</h2>
            <p className="text-primary-foreground/70 text-sm mt-1">
              {records.length} semester(s) recorded
            </p>
          </div>
          <TrendingUp className="w-16 h-16 text-primary-foreground/30" />
        </div>
      </motion.div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.form
          className="p-4 rounded-xl bg-secondary/50 border border-border space-y-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Semester (1-8)</Label>
              <Input
                type="number"
                min="1"
                max="8"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                placeholder="1"
                required
              />
            </div>
            <div>
              <Label>SGPA (0-10)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.sgpa}
                onChange={(e) => setFormData({ ...formData, sgpa: e.target.value })}
                placeholder="8.5"
                required
              />
            </div>
            <div>
              <Label>Credits (optional)</Label>
              <Input
                type="number"
                min="1"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                placeholder="20"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              <Check className="w-4 h-4 mr-1" />
              {editingId ? "Update" : "Add"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ semester: "", sgpa: "", credits: "" });
              }}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </motion.form>
      )}

      {/* Records List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Semester Records</h3>
          {!showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Semester
            </Button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No semesters added yet. Start tracking your CGPA!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {records.map((record, index) => (
              <motion.div
                key={record.id}
                className="p-4 rounded-xl bg-card border border-border flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div>
                  <p className="font-semibold">Semester {record.semester}</p>
                  <p className="text-sm text-muted-foreground">
                    {record.credits ? `${record.credits} credits` : "20 credits (default)"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-primary">{record.sgpa}</span>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(record)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(record.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CGPATracker;
