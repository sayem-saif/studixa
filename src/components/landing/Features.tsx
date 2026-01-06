import { motion } from "framer-motion";
import { 
  Brain, 
  FileText, 
  BarChart3, 
  Award, 
  Bell, 
  Code2, 
  Sparkles,
  Crown
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Mentor",
    description: "Interactive Q&A with personalized study planning powered by advanced AI.",
    color: "primary",
    premium: false,
  },
  {
    icon: FileText,
    title: "Smart Summarizer",
    description: "Upload PDFs and PPTs to get instant summaries and ask questions.",
    color: "accent",
    premium: false,
  },
  {
    icon: BarChart3,
    title: "Daily Quizzes",
    description: "Test your knowledge daily with NCERT-based questions and track progress.",
    color: "success",
    premium: false,
  },
  {
    icon: Award,
    title: "Certificate Tracker",
    description: "Store and organize all your certificates in one place.",
    color: "warning",
    premium: true,
  },
  {
    icon: Bell,
    title: "Event Notifications",
    description: "Stay updated on hackathons, webinars, and internship opportunities.",
    color: "subject-purple",
    premium: true,
  },
  {
    icon: Code2,
    title: "Skill Courses",
    description: "Learn C, Python, Java, and web development with internship recommendations.",
    color: "subject-blue",
    premium: true,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Powerful Features
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Everything You Need to{" "}
            <span className="text-gradient">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From school to college, Studixa provides comprehensive tools for every stage of your academic journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-lg transition-all duration-300 h-full">
                {feature.premium && (
                  <div className="absolute -top-3 -right-3 p-2 rounded-full bg-gradient-premium shadow-premium">
                    <Crown className="w-4 h-4 text-premium-foreground" />
                  </div>
                )}
                
                <div className={`inline-flex p-3 rounded-xl bg-${feature.color}/10 mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                </div>
                
                <h3 className="font-display text-xl font-semibold mb-2 flex items-center gap-2">
                  {feature.title}
                  {feature.premium && (
                    <span className="text-xs font-medium text-premium bg-premium/10 px-2 py-0.5 rounded-full">
                      Premium
                    </span>
                  )}
                </h3>
                
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
