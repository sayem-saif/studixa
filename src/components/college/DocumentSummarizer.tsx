import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Loader2, Sparkles, X, File } from "lucide-react";
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
        const reader = new FileReader();
        text = await new Promise((resolve, reject) => {
          reader.onload = (e) => {
            const content = e.target?.result as string;
            resolve(content || "");
          };
          reader.onerror = reject;
          reader.readAsText(selectedFile);
        });
      }

      if (!text || text.length < 50) {
        text = `Document: ${selectedFile.name}\nType: ${selectedFile.type}\nSize: ${(selectedFile.size / 1024).toFixed(2)} KB\n\nPlease describe what this document is about, and I'll help summarize key concepts for you.`;
      }

      setExtractedText(text.slice(0, 15000));
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

  return (
    <div className="space-y-6">
      <motion.div
        className="p-6 rounded-2xl bg-card border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Document Summarizer</h3>
            <p className="text-sm text-muted-foreground">Upload PDFs, docs, or study materials for AI-powered summaries</p>
          </div>
        </div>

        {!file ? (
          <div
            className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="font-semibold mb-2">Drop your document here</h4>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, PPT, DOC, TXT (max 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) handleFileSelect(selected);
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearFile}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {!summary && (
              <Button
                onClick={handleSummarize}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </motion.div>

      {summary && (
        <motion.div
          className="p-6 rounded-2xl bg-card border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Summary</h3>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {summary.split('\n').map((line, i) => {
              if (line.includes('**')) {
                const parts = line.split('**');
                return (
                  <p key={i} className="mb-2">
                    {parts.map((part, j) => 
                      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                    )}
                  </p>
                );
              }
              if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                return (
                  <li key={i} className="ml-4 mb-1">{line.trim().substring(2)}</li>
                );
              }
              if (/^\d+\./.test(line.trim())) {
                return (
                  <li key={i} className="ml-4 mb-1">{line.trim().replace(/^\d+\.\s*/, '')}</li>
                );
              }
              return line.trim() ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
            })}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => { setSummary(""); clearFile(); }} variant="outline">
              Summarize Another
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentSummarizer;
