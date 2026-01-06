import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, CheckCircle, XCircle, ArrowLeft, Trophy, Code2, X, FileText, Download, Award, Save, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

interface Video {
  title: string;
  url: string;
}

interface Course {
  id: string;
  name: string;
  icon: string;
  videos: Video[];
  color: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface Certificate {
  id: string;
  course_id: string;
  course_name: string;
  score: number;
  issued_at: string;
  certificate_number: string;
}

const courses: Course[] = [
  {
    id: "c",
    name: "C Programming",
    icon: "🔵",
    color: "from-blue-500 to-blue-600",
    videos: [
      { title: "C Programming Full Course (Part 1)", url: "https://youtu.be/irqbmMNs2Bo?si=qG2Gc95DKIE8bZpG" },
      { title: "C Programming Full Course (Part 2)", url: "https://youtu.be/aZb0iu4uGwA?si=hMHQS_2iP4kxgdFd" },
      { title: "C Programming Full Course (Part 3)", url: "https://youtu.be/xND0t1pr3KY?si=Yq7TlaVaz-d2diqr" },
    ],
  },
  {
    id: "python",
    name: "Python Programming",
    icon: "🐍",
    color: "from-green-500 to-emerald-600",
    videos: [
      { title: "Python Full Course (Part 1)", url: "https://youtu.be/UrsmFxEIp5k?si=flDZ4iyQU4Gw31AX" },
      { title: "Python Full Course (Part 2)", url: "https://youtu.be/ix9cRaBkVe0?si=7_5h_zCHqX0k2GIu" },
    ],
  },
  {
    id: "java",
    name: "Java Programming",
    icon: "☕",
    color: "from-orange-500 to-red-600",
    videos: [
      { title: "Java Full Course (Part 1)", url: "https://youtu.be/xTtL8E4LzTQ?si=mGCRwnWcmkoKO69I" },
      { title: "Java Full Course (Part 2)", url: "https://youtu.be/UmnCZ7-9yDY?si=XoJKowelMyEe7of2" },
      { title: "Java Full Course (Part 3)", url: "https://youtu.be/A74TOX803D0?si=gkzq9EimCNFOmRLq" },
    ],
  },
  {
    id: "html-css",
    name: "HTML & CSS",
    icon: "🌐",
    color: "from-pink-500 to-purple-600",
    videos: [
      { title: "HTML & CSS Full Course (Part 1)", url: "https://youtu.be/HGTJBPNC-Gw?si=03EWuEzlzyh9w_ZC" },
      { title: "HTML & CSS Full Course (Part 2)", url: "https://youtu.be/HBqWsrqK89U?si=MCTuWMy_d2r0dIes" },
      { title: "HTML & CSS Full Course (Part 3)", url: "https://youtu.be/G3e-cpL7ofc?si=U-_zvyCg4KbEla2p" },
    ],
  },
];

const quizQuestions: Record<string, QuizQuestion[]> = {
  c: [
    { question: "What is the correct syntax to declare a pointer in C?", options: ["int *ptr;", "ptr int*;", "*int ptr;", "pointer int;"], correct: 0 },
    { question: "Which header file is required for printf()?", options: ["stdlib.h", "stdio.h", "string.h", "conio.h"], correct: 1 },
    { question: "What is the size of int in C (32-bit system)?", options: ["2 bytes", "4 bytes", "8 bytes", "1 byte"], correct: 1 },
    { question: "Which operator is used to access structure members through pointer?", options: [".", "->", "*", "&"], correct: 1 },
    { question: "What is the output of 5/2 in C?", options: ["2.5", "2", "3", "Error"], correct: 1 },
    { question: "Which function is used to allocate memory dynamically?", options: ["alloc()", "malloc()", "new()", "create()"], correct: 1 },
    { question: "What is NULL in C?", options: ["A keyword", "A macro", "A data type", "A function"], correct: 1 },
    { question: "What is the correct way to declare a constant?", options: ["const int x = 5;", "constant x = 5;", "int const = 5;", "define x 5"], correct: 0 },
    { question: "Which loop is guaranteed to execute at least once?", options: ["for", "while", "do-while", "none"], correct: 2 },
    { question: "What does sizeof() return?", options: ["Size in bytes", "Size in bits", "Memory address", "Data type"], correct: 0 },
  ],
  python: [
    { question: "Which keyword is used to define a function in Python?", options: ["function", "def", "func", "define"], correct: 1 },
    { question: "What is the output of print(type([]))?", options: ["<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>"], correct: 1 },
    { question: "Which of these is immutable?", options: ["List", "Dictionary", "Set", "Tuple"], correct: 3 },
    { question: "What does 'pip' stand for?", options: ["Python Install Package", "Pip Installs Packages", "Package Installer Python", "Python Index Packages"], correct: 1 },
    { question: "How do you start a comment in Python?", options: ["//", "#", "/*", "--"], correct: 1 },
    { question: "What is __init__ in Python?", options: ["Destructor", "Constructor", "Iterator", "Generator"], correct: 1 },
    { question: "Which method adds an element to a list?", options: ["add()", "append()", "insert()", "push()"], correct: 1 },
    { question: "What is the output of 'Hello'[1:3]?", options: ["He", "el", "ell", "Hel"], correct: 1 },
    { question: "Which is NOT a Python data type?", options: ["int", "float", "char", "str"], correct: 2 },
    { question: "What does len() function return?", options: ["Length", "Last element", "First element", "Type"], correct: 0 },
  ],
  java: [
    { question: "Which keyword is used to inherit a class?", options: ["inherits", "extends", "implements", "super"], correct: 1 },
    { question: "What is the entry point of a Java program?", options: ["start()", "run()", "main()", "init()"], correct: 2 },
    { question: "Which is NOT an access modifier?", options: ["public", "private", "protected", "abstract"], correct: 3 },
    { question: "What is JVM?", options: ["Java Virtual Machine", "Java Variable Memory", "Java Visual Mode", "Java Version Manager"], correct: 0 },
    { question: "Which collection does not allow duplicates?", options: ["List", "Set", "Queue", "ArrayList"], correct: 1 },
    { question: "What is the default value of an int variable?", options: ["0", "null", "undefined", "-1"], correct: 0 },
    { question: "Which keyword is used for exception handling?", options: ["catch", "throw", "try", "All of these"], correct: 3 },
    { question: "What is polymorphism?", options: ["One form", "Many forms", "No form", "Fixed form"], correct: 1 },
    { question: "Which is the parent class of all classes?", options: ["Main", "Object", "Parent", "Root"], correct: 1 },
    { question: "What is encapsulation?", options: ["Hiding data", "Showing data", "Deleting data", "Copying data"], correct: 0 },
  ],
  "html-css": [
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks Text Mark Language", "Home Tool Markup Language"], correct: 0 },
    { question: "Which tag is used for the largest heading?", options: ["<h6>", "<h1>", "<head>", "<header>"], correct: 1 },
    { question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], correct: 1 },
    { question: "Which property changes text color in CSS?", options: ["text-color", "font-color", "color", "text-style"], correct: 2 },
    { question: "Which tag is used for line break?", options: ["<break>", "<br>", "<lb>", "<newline>"], correct: 1 },
    { question: "What is the correct CSS syntax?", options: ["body:color=black;", "{body:color=black}", "body {color: black;}", "{body;color:black}"], correct: 2 },
    { question: "Which is NOT a semantic HTML element?", options: ["<article>", "<section>", "<div>", "<nav>"], correct: 2 },
    { question: "What is flexbox used for?", options: ["Images", "Layout", "Colors", "Fonts"], correct: 1 },
    { question: "Which property makes text bold?", options: ["font-style", "font-weight", "text-decoration", "font-bold"], correct: 1 },
    { question: "What is the default display value of div?", options: ["inline", "block", "flex", "grid"], correct: 1 },
  ],
};

interface SkillCoursesProps {
  userId: string;
}

const getYouTubeEmbedUrl = (url: string): string => {
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&]+)/)?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const generateCertificateNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CERT-${timestamp}-${random}`;
};

const SkillCourses = ({ userId }: SkillCoursesProps) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<Record<string, number[]>>({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<{ video: Video; index: number } | null>(null);
  const [videoNotes, setVideoNotes] = useState<Record<string, Record<number, string>>>({});
  const [currentNote, setCurrentNote] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showCertificate, setShowCertificate] = useState<Certificate | null>(null);
  const [savingNote, setSavingNote] = useState(false);
  const [studentName, setStudentName] = useState<string>("");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      // Load user profile for name
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", userId)
        .single();
      
      if (profileData?.full_name) {
        setStudentName(profileData.full_name);
      }

      // Load watched videos
      const { data: watchedData } = await supabase
        .from("skill_watched_videos")
        .select("*")
        .eq("user_id", userId);
      
      if (watchedData) {
        const watched: Record<string, number[]> = {};
        watchedData.forEach((item: { course_id: string; video_index: number }) => {
          if (!watched[item.course_id]) watched[item.course_id] = [];
          watched[item.course_id].push(item.video_index);
        });
        setWatchedVideos(watched);
      }

      // Load notes
      const { data: notesData } = await supabase
        .from("skill_video_notes")
        .select("*")
        .eq("user_id", userId);
      
      if (notesData) {
        const notes: Record<string, Record<number, string>> = {};
        notesData.forEach((item: { course_id: string; video_index: number; notes: string }) => {
          if (!notes[item.course_id]) notes[item.course_id] = {};
          notes[item.course_id][item.video_index] = item.notes || "";
        });
        setVideoNotes(notes);
      }

      // Load certificates
      const { data: certsData } = await supabase
        .from("skill_certificates")
        .select("*")
        .eq("user_id", userId);
      
      if (certsData) {
        setCertificates(certsData as Certificate[]);
      }
    };

    loadData();
  }, [userId]);

  // Load current note when video changes
  useEffect(() => {
    if (currentVideo && selectedCourse) {
      const note = videoNotes[selectedCourse.id]?.[currentVideo.index] || "";
      setCurrentNote(note);
    }
  }, [currentVideo, selectedCourse, videoNotes]);

  const saveWatchedVideo = async (courseId: string, videoIndex: number) => {
    await supabase.from("skill_watched_videos").upsert({
      user_id: userId,
      course_id: courseId,
      video_index: videoIndex,
    }, { onConflict: "user_id,course_id,video_index" });
  };

  const saveNote = async () => {
    if (!currentVideo || !selectedCourse) return;
    setSavingNote(true);
    
    const { error } = await supabase.from("skill_video_notes").upsert({
      user_id: userId,
      course_id: selectedCourse.id,
      video_index: currentVideo.index,
      notes: currentNote,
    }, { onConflict: "user_id,course_id,video_index" });
    
    if (!error) {
      setVideoNotes(prev => ({
        ...prev,
        [selectedCourse.id]: {
          ...prev[selectedCourse.id],
          [currentVideo.index]: currentNote,
        },
      }));
      toast.success("Notes saved!");
    }
    setSavingNote(false);
  };

  const saveCertificate = async (courseId: string, courseName: string, score: number) => {
    const certNumber = generateCertificateNumber();
    const { data, error } = await supabase.from("skill_certificates").upsert({
      user_id: userId,
      course_id: courseId,
      course_name: courseName,
      score,
      certificate_number: certNumber,
    }, { onConflict: "user_id,course_id" }).select().single();
    
    if (!error && data) {
      setCertificates(prev => {
        const existing = prev.findIndex(c => c.course_id === courseId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = data as Certificate;
          return updated;
        }
        return [...prev, data as Certificate];
      });
      return data as Certificate;
    }
    return null;
  };

  const handleWatchVideo = (courseId: string, videoIndex: number, video: Video) => {
    setCurrentVideo({ video, index: videoIndex });
    setShowNotes(false);
  };

  const handleCloseVideo = () => {
    if (currentVideo && selectedCourse) {
      setWatchedVideos((prev) => ({
        ...prev,
        [selectedCourse.id]: [...(prev[selectedCourse.id] || []), currentVideo.index].filter((v, i, a) => a.indexOf(v) === i),
      }));
      saveWatchedVideo(selectedCourse.id, currentVideo.index);
    }
    setCurrentVideo(null);
    setShowNotes(false);
  };

  const handleMarkComplete = () => {
    if (currentVideo && selectedCourse) {
      setWatchedVideos((prev) => ({
        ...prev,
        [selectedCourse.id]: [...(prev[selectedCourse.id] || []), currentVideo.index].filter((v, i, a) => a.indexOf(v) === i),
      }));
      saveWatchedVideo(selectedCourse.id, currentVideo.index);
      toast.success("Video marked as complete!");
    }
  };

  const getCourseProgress = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return 0;
    const watched = watchedVideos[courseId]?.length || 0;
    return Math.round((watched / course.videos.length) * 100);
  };

  const isQuizUnlocked = (courseId: string) => {
    return getCourseProgress(courseId) === 100;
  };

  const getCertificate = (courseId: string) => {
    return certificates.find(c => c.course_id === courseId);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleSubmitQuiz = async () => {
    if (!selectedCourse) return;
    const questions = quizQuestions[selectedCourse.id];
    let score = 0;
    questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    
    const percentage = Math.round((score / questions.length) * 100);
    if (percentage >= 70) {
      toast.success(`Congratulations! You passed with ${percentage}%`);
      const cert = await saveCertificate(selectedCourse.id, selectedCourse.name, score);
      if (cert) {
        setShowCertificate(cert);
      }
    } else {
      toast.error(`You scored ${percentage}%. Need 70% to pass.`);
    }
  };

  const downloadCertificate = async (cert: Certificate) => {
    setGeneratingPdf(true);
    
    try {
      // Create verification URL
      const verificationUrl = `${window.location.origin}/verify/${cert.certificate_number}`;
      
      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 100,
        margin: 1,
        color: {
          dark: "#1a365d",
          light: "#ffffff",
        },
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Background gradient effect (using rectangles)
      pdf.setFillColor(26, 54, 93); // Dark blue
      pdf.rect(0, 0, pageWidth, 15, "F");
      pdf.rect(0, pageHeight - 15, pageWidth, 15, "F");

      // Gold accent lines
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(1);
      pdf.line(10, 20, pageWidth - 10, 20);
      pdf.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20);

      // Decorative corners
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(2);
      // Top left
      pdf.line(10, 25, 10, 40);
      pdf.line(10, 25, 25, 25);
      // Top right
      pdf.line(pageWidth - 10, 25, pageWidth - 10, 40);
      pdf.line(pageWidth - 10, 25, pageWidth - 25, 25);
      // Bottom left
      pdf.line(10, pageHeight - 25, 10, pageHeight - 40);
      pdf.line(10, pageHeight - 25, 25, pageHeight - 25);
      // Bottom right
      pdf.line(pageWidth - 10, pageHeight - 25, pageWidth - 10, pageHeight - 40);
      pdf.line(pageWidth - 10, pageHeight - 25, pageWidth - 25, pageHeight - 25);

      // Header badge
      pdf.setFillColor(212, 175, 55);
      pdf.circle(pageWidth / 2, 35, 8, "F");
      pdf.setTextColor(26, 54, 93);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("✓", pageWidth / 2, 37, { align: "center" });

      // Title
      pdf.setTextColor(26, 54, 93);
      pdf.setFontSize(32);
      pdf.setFont("helvetica", "bold");
      pdf.text("CERTIFICATE OF COMPLETION", pageWidth / 2, 55, { align: "center" });

      // Subtitle
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text("This is to certify that", pageWidth / 2, 70, { align: "center" });

      // Student Name
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(26, 54, 93);
      const displayName = studentName || "Student";
      pdf.text(displayName, pageWidth / 2, 85, { align: "center" });

      // Decorative line under name
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.5);
      const nameWidth = pdf.getTextWidth(displayName);
      pdf.line((pageWidth - nameWidth) / 2 - 10, 90, (pageWidth + nameWidth) / 2 + 10, 90);

      // Course completion text
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text("has successfully completed the course", pageWidth / 2, 100, { align: "center" });

      // Course Name
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(41, 128, 185);
      pdf.text(cert.course_name, pageWidth / 2, 115, { align: "center" });

      // Score badge
      pdf.setFillColor(39, 174, 96);
      pdf.roundedRect(pageWidth / 2 - 25, 122, 50, 15, 3, 3, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Score: ${cert.score}/10 (${Math.round(cert.score * 10)}%)`, pageWidth / 2, 132, { align: "center" });

      // Certificate details - left side
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text("Certificate Number:", 30, 155);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(26, 54, 93);
      pdf.text(cert.certificate_number, 30, 162);

      // Date - center
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text("Date of Issue:", pageWidth / 2, 155, { align: "center" });
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(26, 54, 93);
      const issueDate = new Date(cert.issued_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      pdf.text(issueDate, pageWidth / 2, 162, { align: "center" });

      // QR Code - right side
      pdf.addImage(qrCodeDataUrl, "PNG", pageWidth - 55, 145, 25, 25);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text("Scan to verify", pageWidth - 42.5, 173, { align: "center" });

      // Footer
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      pdf.text("EduTrack Learning Platform", pageWidth / 2, pageHeight - 7, { align: "center" });

      // Platform signature line
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.3);
      pdf.line(pageWidth / 2 - 40, 175, pageWidth / 2 + 40, 175);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont("helvetica", "italic");
      pdf.text("Authorized Digital Certificate", pageWidth / 2, 180, { align: "center" });

      // Save PDF
      pdf.save(`certificate-${cert.course_name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
      toast.success("Certificate PDF downloaded!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF certificate");
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Certificate Modal
  if (showCertificate) {
    return (
      <div className="space-y-6">
        <motion.div
          className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border-2 border-amber-500/50 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Award className="w-20 h-20 mx-auto text-amber-500 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
          <p className="text-muted-foreground mb-6">
            You have successfully completed {showCertificate.course_name}
          </p>
          
          <div className="p-6 rounded-xl bg-card border border-border mb-6">
            <p className="text-sm text-muted-foreground mb-1">Certificate Number</p>
            <p className="font-mono font-bold text-lg">{showCertificate.certificate_number}</p>
            <p className="text-sm text-muted-foreground mt-4 mb-1">Score</p>
            <p className="font-bold text-2xl text-green-500">
              {showCertificate.score}/10 ({Math.round(showCertificate.score * 10)}%)
            </p>
            <p className="text-sm text-muted-foreground mt-4 mb-1">Issued On</p>
            <p className="font-medium">
              {new Date(showCertificate.issued_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setShowCertificate(null)}>
              Close
            </Button>
            <Button onClick={() => downloadCertificate(showCertificate)} disabled={generatingPdf}>
              {generatingPdf ? (
                <>Generating...</>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Certificate
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz View
  if (showQuiz && selectedCourse) {
    const questions = quizQuestions[selectedCourse.id];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setShowQuiz(false)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold">{selectedCourse.name} Quiz</h2>
        </div>

        {!quizSubmitted ? (
          <>
            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <motion.div
                  key={qIndex}
                  className="p-4 rounded-xl bg-card border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qIndex * 0.05 }}
                >
                  <p className="font-semibold mb-3">
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className="grid gap-2">
                    {q.options.map((opt, optIndex) => (
                      <button
                        key={optIndex}
                        className={`p-3 rounded-lg text-left transition-all ${
                          quizAnswers[qIndex] === optIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/50 hover:bg-secondary"
                        }`}
                        onClick={() => {
                          const newAnswers = [...quizAnswers];
                          newAnswers[qIndex] = optIndex;
                          setQuizAnswers(newAnswers);
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <Button
              className="w-full"
              size="lg"
              disabled={quizAnswers.length !== questions.length}
              onClick={handleSubmitQuiz}
            >
              Submit Quiz
            </Button>
          </>
        ) : (
          <motion.div
            className="p-6 rounded-2xl bg-card border border-border text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
              quizScore >= 7 ? "bg-green-500/20" : "bg-red-500/20"
            }`}>
              {quizScore >= 7 ? (
                <CheckCircle className="w-10 h-10 text-green-500" />
              ) : (
                <XCircle className="w-10 h-10 text-red-500" />
              )}
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {quizScore >= 7 ? "Congratulations!" : "Keep Learning!"}
            </h3>
            <p className="text-muted-foreground mb-4">
              You scored {quizScore}/{questions.length} ({Math.round((quizScore / questions.length) * 100)}%)
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {quizScore >= 7 
                ? "You've passed! Your certificate has been generated." 
                : "You need 70% to pass. Review the videos and try again!"}
            </p>
            
            <div className="text-left space-y-3 mt-6 pt-6 border-t border-border">
              <h4 className="font-semibold">Answers Review:</h4>
              {questions.map((q, i) => (
                <div key={i} className="flex items-start gap-2">
                  {quizAnswers[i] === q.correct ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm">{q.question}</p>
                    <p className="text-xs text-muted-foreground">
                      Correct: {q.options[q.correct]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowQuiz(false)}>
                Back to Course
              </Button>
              {quizScore >= 7 && showCertificate && (
                <Button onClick={() => downloadCertificate(showCertificate)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
              )}
              {quizScore < 7 && (
                <Button onClick={handleStartQuiz}>Retry Quiz</Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Video Player with Notes
  if (currentVideo && selectedCourse) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleCloseVideo}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-lg font-bold">{currentVideo.video.title}</h2>
              <p className="text-sm text-muted-foreground">{selectedCourse.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={showNotes ? "default" : "outline"}
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
            >
              <FileText className="w-4 h-4 mr-1" />
              Notes
            </Button>
            <Button variant="outline" size="sm" onClick={handleCloseVideo}>
              <X className="w-4 h-4 mr-1" />
              Close
            </Button>
          </div>
        </div>

        <div className={`grid gap-4 ${showNotes ? "lg:grid-cols-3" : ""}`}>
          {/* Video Player */}
          <motion.div
            className={`relative w-full rounded-xl overflow-hidden bg-black ${showNotes ? "lg:col-span-2" : ""}`}
            style={{ paddingBottom: showNotes ? "40%" : "56.25%" }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={getYouTubeEmbedUrl(currentVideo.video.url)}
              title={currentVideo.video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </motion.div>

          {/* Notes Panel */}
          {showNotes && (
            <motion.div
              className="p-4 rounded-xl bg-card border border-border flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Video Notes
              </h3>
              <Textarea
                placeholder="Take notes while watching..."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                className="flex-1 min-h-[200px] resize-none"
              />
              <Button
                className="mt-3"
                size="sm"
                onClick={saveNote}
                disabled={savingNote}
              >
                <Save className="w-4 h-4 mr-1" />
                {savingNote ? "Saving..." : "Save Notes"}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Video Controls */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-2">
            {watchedVideos[selectedCourse.id]?.includes(currentVideo.index) ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Play className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-sm">
              Video {currentVideo.index + 1} of {selectedCourse.videos.length}
            </span>
          </div>
          <div className="flex gap-2">
            {!watchedVideos[selectedCourse.id]?.includes(currentVideo.index) && (
              <Button size="sm" onClick={handleMarkComplete}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark Complete
              </Button>
            )}
            {currentVideo.index < selectedCourse.videos.length - 1 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  handleMarkComplete();
                  setCurrentVideo({
                    video: selectedCourse.videos[currentVideo.index + 1],
                    index: currentVideo.index + 1,
                  });
                }}
              >
                Next Video
              </Button>
            )}
          </div>
        </div>

        {/* Video List */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground">All Videos</h3>
          {selectedCourse.videos.map((video, index) => {
            const isWatched = watchedVideos[selectedCourse.id]?.includes(index);
            const isCurrent = index === currentVideo.index;
            const hasNotes = !!videoNotes[selectedCourse.id]?.[index];
            return (
              <button
                key={index}
                className={`w-full p-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isWatched
                    ? "bg-green-500/10 border border-green-500/30"
                    : "bg-card border border-border hover:bg-secondary/50"
                }`}
                onClick={() => setCurrentVideo({ video, index })}
              >
                {isWatched && !isCurrent ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span className="text-sm font-medium flex-1">{video.title}</span>
                {hasNotes && <FileText className="w-4 h-4 opacity-50" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Course Detail View
  if (selectedCourse) {
    const progress = getCourseProgress(selectedCourse.id);
    const cert = getCertificate(selectedCourse.id);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedCourse(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">{selectedCourse.name}</h2>
            <p className="text-sm text-muted-foreground">{selectedCourse.videos.length} videos</p>
          </div>
        </div>

        {/* Certificate Banner */}
        {cert && (
          <motion.div
            className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/50 flex items-center justify-between"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-500" />
              <div>
                <p className="font-semibold">Certificate Earned!</p>
                <p className="text-sm text-muted-foreground">Score: {cert.score}/10</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => downloadCertificate(cert)} disabled={generatingPdf}>
              <Download className="w-4 h-4 mr-1" />
              {generatingPdf ? "..." : "Download PDF"}
            </Button>
          </motion.div>
        )}

        {/* Progress */}
        <div className="p-4 rounded-xl bg-secondary/50">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Videos */}
        <div className="space-y-3">
          {selectedCourse.videos.map((video, index) => {
            const isWatched = watchedVideos[selectedCourse.id]?.includes(index);
            const hasNotes = !!videoNotes[selectedCourse.id]?.[index];
            return (
              <motion.div
                key={index}
                className={`p-4 rounded-xl border ${
                  isWatched ? "bg-green-500/10 border-green-500/30" : "bg-card border-border"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isWatched ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Play className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="font-medium">{video.title}</span>
                    {hasNotes && <FileText className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <Button
                    size="sm"
                    variant={isWatched ? "outline" : "default"}
                    onClick={() => handleWatchVideo(selectedCourse.id, index, video)}
                  >
                    {isWatched ? "Rewatch" : "Watch"}
                    <Play className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quiz Section */}
        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold">Quick Quiz</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {isQuizUnlocked(selectedCourse.id)
              ? cert
                ? "You've already passed! Retake to improve your score."
                : "All videos completed! Take the quiz to earn your certificate."
              : "Watch all videos to unlock the quiz."}
          </p>
          <Button
            disabled={!isQuizUnlocked(selectedCourse.id)}
            onClick={handleStartQuiz}
          >
            {isQuizUnlocked(selectedCourse.id)
              ? cert
                ? "Retake Quiz"
                : "Start Quiz"
              : "Complete Videos First"}
          </Button>
        </div>
      </div>
    );
  }

  // Course List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Skill Courses</p>
            <h2 className="text-4xl font-bold">{courses.length}</h2>
            <p className="text-white/70 text-sm mt-1">
              Learn, Practice, Get Certified
            </p>
          </div>
          <Code2 className="w-16 h-16 text-white/30" />
        </div>
      </motion.div>

      {/* My Certificates */}
      {certificates.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold">My Certificates ({certificates.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {certificates.map(cert => (
              <Button
                key={cert.id}
                variant="outline"
                size="sm"
                onClick={() => downloadCertificate(cert)}
                disabled={generatingPdf}
              >
                {cert.course_name}
                <Download className="w-3 h-3 ml-1" />
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {courses.map((course, index) => {
          const progress = getCourseProgress(course.id);
          const cert = getCertificate(course.id);
          return (
            <motion.div
              key={course.id}
              className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCourse(course)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`text-3xl p-3 rounded-xl bg-gradient-to-br ${course.color}`}>
                  {course.icon}
                </div>
                <div className="flex gap-1">
                  {cert && <Award className="w-6 h-6 text-amber-500" />}
                  {progress === 100 && <CheckCircle className="w-6 h-6 text-green-500" />}
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-1">{course.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {course.videos.length} video lessons
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillCourses;
