import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, ExternalLink, Calendar, MapPin, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Hackathon {
  id: string;
  name: string;
  platform: string;
  url: string;
  deadline?: string;
  location: string;
  prize?: string;
  teamSize?: string;
  status: "live" | "upcoming" | "ending_soon";
}

const NotificationsPanel = () => {
  const [filter, setFilter] = useState<"all" | "hackathons" | "internships" | "events">("all");

  // Real hackathons from Unstop and Hack2Skill
  const hackathons: Hackathon[] = [
    {
      id: "1",
      name: "Google Cloud Agentic AI Day 2025",
      platform: "Hack2Skill",
      url: "https://vision.hack2skill.com/event/googlecloudagenticaiday2025",
      deadline: "July 27, 2025",
      location: "Bengaluru, India",
      prize: "₹39 Lakhs",
      teamSize: "2-5 members",
      status: "upcoming",
    },
    {
      id: "2",
      name: "CodeVerse Hackathon 2025",
      platform: "Hack2Skill",
      url: "https://vision.hack2skill.com/event/codeverse2025",
      deadline: "Part of Colosseum 2025",
      location: "DBIT Mumbai",
      prize: "Cash Prizes",
      teamSize: "Team event",
      status: "upcoming",
    },
    {
      id: "3",
      name: "Autonomous Hacks AI Hackathon",
      platform: "Unstop",
      url: "https://unstop.com/hackathons/autonomous-hacks-ai-hackathon-google-developers-group-gandhinagar-1610562",
      location: "Gandhinagar",
      status: "live",
    },
    {
      id: "4",
      name: "Integration for AI/GenAI Hackathon 2025",
      platform: "Hack2Skill",
      url: "https://vision.hack2skill.com/event/informatica2025",
      location: "Online",
      prize: "Cash Prizes",
      status: "upcoming",
    },
    {
      id: "5",
      name: "HacXerve: National Level Hackathon 2025",
      platform: "Unstop",
      url: "https://unstop.com/hackathons/hacxerve-national-level-hackathon-2025-vidyavardhaka-college-of-engineering-1340736",
      location: "Karnataka",
      status: "live",
    },
    {
      id: "6",
      name: "HumanAIze Hackathon - Ed-Tech Edition",
      platform: "Hack2Skill",
      url: "https://hack2skill.com/hack/humanaize-education",
      location: "Online",
      status: "upcoming",
    },
    {
      id: "7",
      name: "KU Hackathon 2026",
      platform: "Unstop",
      url: "https://unstop.com/hackathons/ku-hackathon-2026-kalinga-university-1557959",
      location: "Kalinga University",
      status: "upcoming",
    },
  ];

  const internshipOpportunities = [
    {
      id: "i1",
      title: "Software Development Intern",
      company: "Various Startups",
      link: "https://unstop.com/internships",
      type: "internship",
    },
    {
      id: "i2",
      title: "Data Science Intern",
      company: "Multiple Companies",
      link: "https://unstop.com/internships",
      type: "internship",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live</Badge>;
      case "ending_soon":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Ending Soon</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Upcoming</Badge>;
    }
  };

  const getPlatformColor = (platform: string) => {
    return platform === "Unstop" 
      ? "bg-purple-500/20 text-purple-400" 
      : "bg-cyan-500/20 text-cyan-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Active Opportunities</p>
            <h2 className="text-4xl font-bold">{hackathons.length + internshipOpportunities.length}</h2>
            <p className="text-white/70 text-sm mt-1">
              Hackathons, internships & events
            </p>
          </div>
          <Bell className="w-16 h-16 text-white/30" />
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "hackathons", "internships", "events"].map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f as any)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Hackathons List */}
      {(filter === "all" || filter === "hackathons") && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Live Hackathons
          </h3>
          <div className="space-y-3">
            {hackathons.map((hackathon, index) => (
              <motion.div
                key={hackathon.id}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{hackathon.name}</h4>
                      {getStatusBadge(hackathon.status)}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPlatformColor(hackathon.platform)}`}>
                      {hackathon.platform}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hackathon.location}
                  </div>
                  {hackathon.deadline && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {hackathon.deadline}
                    </div>
                  )}
                  {hackathon.prize && (
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      {hackathon.prize}
                    </div>
                  )}
                  {hackathon.teamSize && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {hackathon.teamSize}
                    </div>
                  )}
                </div>

                <Button
                  className="mt-3 w-full"
                  size="sm"
                  onClick={() => window.open(hackathon.url, "_blank")}
                >
                  Apply Now <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Internships */}
      {(filter === "all" || filter === "internships") && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Internship Opportunities
          </h3>
          <div className="space-y-3">
            {internshipOpportunities.map((intern, index) => (
              <motion.div
                key={intern.id}
                className="p-4 rounded-xl bg-card border border-border"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <h4 className="font-semibold">{intern.title}</h4>
                <p className="text-sm text-muted-foreground">{intern.company}</p>
                <Button
                  className="mt-2"
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(intern.link, "_blank")}
                >
                  Explore <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <h4 className="font-semibold mb-3">Quick Links</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://unstop.com/hackathons", "_blank")}
          >
            Unstop Hackathons
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://hack2skill.com", "_blank")}
          >
            Hack2Skill
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://devfolio.co/hackathons", "_blank")}
          >
            Devfolio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
