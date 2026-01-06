import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Loader2, Sparkles, X, File, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAIChat } from "@/hooks/useAIChat";

interface DocumentSummarizerProps {
  profile: any;
}

const DocumentSummarizer = ({ profile }: DocumentSummarizerProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [extractedText, setExtractedText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { summarizeDocument, isLoading } = useAIChat({
    onError: (error) => toast.error(error),
  });

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Please upload a PDF, PPT, DOC, or TXT file");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setSummary("");

    try {
      let text = "";
      
      if (selectedFile.type === "text/plain") {
        text = await selectedFile.text();
      } else {
        // For PDF and other documents, we'll read as text (basic extraction)
        // In production, you'd use a proper PDF parsing library
        const reader = new FileReader();
        text = await new Promise((resolve, reject) => {
          reader.onload = (e) => {
            const content = e.target?.result as string;
            // Basic text extraction - for PDFs this will get basic text
            resolve(content || "");
          };
          reader.onerror = reject;
          reader.readAsText(selectedFile);
        });
      }

      if (!text || text.length < 50) {
        // If we couldn't extract text, show a message
        text = `Document: ${selectedFile.name}\nType: ${selectedFile.type}\nSize: ${(selectedFile.size / 1024).toFixed(2)} KB\n\nPlease describe what this document is about, and I'll help summarize key concepts for you.`;
      }

      setExtractedText(text.slice(0, 15000)); // Limit to ~15k chars for API
    } catch (error) {
      toast.error("Failed to read file. Please try again.");
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleSummarize = async () => {
    if (!extractedText) {
      toast.error("Please upload a document first");
      return;
    }

    try {
      const result = await summarizeDocument(extractedText);
      setSummary(result);
    } catch (error) {
      // Error handled by hook
    }
  };

  const clearFile = () => {
    setFile(null);
    setSummary("");
    setExtractedText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="w-12 h-12 text-muted-foreground" />;
    if (file.type.includes("pdf")) return <FileText className="w-12 h-12 text-destructive" />;
    if (file.type.includes("presentation") || file.type.includes("powerpoint")) {
      return <FileImage className="w-12 h-12 text-warning" />;
    }
    return <File className="w-12 h-12 text-primary" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <motion.div
        className="p-6 rounded-2xl bg-card border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Document Summarizer</h3>
            <p className="text-sm text-muted-foreground">Upload PDF, PPT, or DOC files to get AI-powered summaries</p>
          </div>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          {file ? (
            <div className="space-y-3">
              <div className="flex justify-center">{getFileIcon()}</div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  clearFile();
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <Upload className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Drop your document here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports PDF, PPT, PPTX, DOC, DOCX, TXT (max 10MB)
              </p>
            </div>
          )}
        </div>

        {file && (
          <Button 
            className="w-full mt-4" 
            onClick={handleSummarize}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Document...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Summary
              </>
            )}
          </Button>
        )}
      </motion.div>

      {/* Summary Result */}
      {summary && (
        <motion.div
          className="p-6 rounded-2xl bg-card border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">AI Summary</h4>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
            {summary}
          </div>
        </motion.div>
      )}

      {/* Quick Tips */}
      <motion.div
        className="p-4 rounded-xl bg-secondary/50 border border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="font-medium text-sm mb-2">💡 Tips for best results:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Upload clear, text-based documents for accurate summaries</li>
          <li>• NCERT PDFs and class notes work great</li>
          <li>• Use the summary alongside the AI Mentor for deeper understanding</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default DocumentSummarizer;
