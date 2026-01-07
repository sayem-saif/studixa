import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Plus, Trash2, Edit2, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Project {
  id: string;
  repo_url: string;
  title: string;
  description: string | null;
  created_at: string;
}

interface ProjectTrackerProps {
  userId: string;
}

const ProjectTracker = ({ userId }: ProjectTrackerProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newProject, setNewProject] = useState({
    repo_url: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects" as any)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects((data as any) || []);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const validateGitHubUrl = (url: string): boolean => {
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return githubPattern.test(url);
  };

  const extractRepoInfo = (url: string) => {
    const match = url.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ''),
      };
    }
    return null;
  };

  const handleAdd = async () => {
    if (!newProject.repo_url.trim()) {
      toast.error("Please enter a repository URL");
      return;
    }

    if (!validateGitHubUrl(newProject.repo_url)) {
      toast.error("Please enter a valid GitHub repository URL");
      return;
    }

    if (!newProject.title.trim()) {
      toast.error("Please enter a project title");
      return;
    }

    try {
      setAdding(true);
      const { error } = await supabase.from("projects" as any).insert({
        user_id: userId,
        repo_url: newProject.repo_url.trim(),
        title: newProject.title.trim(),
        description: newProject.description.trim() || null,
      });

      if (error) throw error;

      toast.success("Project added successfully!");
      setNewProject({ repo_url: "", title: "", description: "" });
      fetchProjects();
    } catch (error) {
      toast.error("Failed to add project");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this project?")) return;

    try {
      const { error } = await supabase.from("projects" as any).delete().eq("id", id);
      if (error) throw error;
      toast.success("Project removed");
      fetchProjects();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary-foreground/20">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Project Tracker</h2>
            <p className="text-primary-foreground/80">Manage your GitHub projects and showcase your work</p>
          </div>
        </div>
      </motion.div>

      {/* Add New Project */}
      <motion.div
        className="p-6 rounded-2xl bg-card border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Project
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">
              GitHub Repository URL <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="https://github.com/username/repo-name"
              value={newProject.repo_url}
              onChange={(e) => setNewProject({ ...newProject, repo_url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Example: https://github.com/facebook/react
            </p>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Project Title <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="My Awesome Project"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Description (Optional)
            </label>
            <Input
              placeholder="A brief description of your project..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <Button onClick={handleAdd} disabled={adding} className="w-full">
            {adding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <motion.div
          className="p-12 rounded-2xl bg-card border border-dashed border-border text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Github className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-2">No projects added yet</p>
          <p className="text-sm text-muted-foreground">
            Add your GitHub repositories to showcase your work
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, index) => {
            const repoInfo = extractRepoInfo(project.repo_url);
            
            return (
              <motion.div
                key={project.id}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Github className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold">{project.title}</h4>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {repoInfo ? `${repoInfo.owner}/${repoInfo.repo}` : project.repo_url}
                      </a>
                      <span className="text-xs text-muted-foreground">
                        Added {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(project.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <motion.div
        className="p-4 rounded-xl bg-primary/10 border border-primary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-foreground">
          💡 <strong>Tip:</strong> Your projects are saved to your profile and can be viewed by recruiters and potential employers.
        </p>
      </motion.div>
    </div>
  );
};

export default ProjectTracker;
