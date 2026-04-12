import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PerformanceSummaryCard from "@/components/dashboard/cards/PerformanceSummaryCard";
import WeakTopicsCard from "@/components/dashboard/cards/WeakTopicsCard";
import StrongTopicsCard from "@/components/dashboard/cards/StrongTopicsCard";
import PerformanceTrendChart from "@/components/dashboard/cards/PerformanceTrendChart";
import RecentActivityCard from "@/components/dashboard/cards/RecentActivityCard";
import AISuggestionsCard from "@/components/dashboard/cards/AISuggestionsCard";
import QuickActionsCard from "@/components/dashboard/cards/QuickActionsCard";

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  subjects: "Subjects",
  performance: "Performance",
  tools: "Tools",
  settings: "Settings",
};

const DashboardPreview = () => {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <DashboardLayout
      activeNav={activeNav}
      onNavChange={setActiveNav}
      pageTitle={pageTitles[activeNav] || "Dashboard"}
      primaryAction={{
        label: "Start Quiz",
        onClick: () => setActiveNav("tools"),
      }}
      onLogout={() => {}}
      userName="Arjun Mehta"
    >
      {activeNav === "dashboard" && <DashboardContent />}
      {activeNav === "subjects" && <SubjectsPlaceholder />}
      {activeNav === "performance" && <PerformancePlaceholder />}
      {activeNav === "tools" && <ToolsPlaceholder />}
      {activeNav === "settings" && <SettingsPlaceholder />}
    </DashboardLayout>
  );
};

const DashboardContent = () => {
  return (
    <div className="space-y-5">
      {/* Row 1: Performance Summary, Weak Topics, Strong Topics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <PerformanceSummaryCard />
        <WeakTopicsCard />
        <StrongTopicsCard />
      </div>

      {/* Row 2: Performance Trend + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <PerformanceTrendChart />
        </div>
        <div className="lg:col-span-2">
          <RecentActivityCard />
        </div>
      </div>

      {/* Row 3: AI Suggestions + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <AISuggestionsCard />
        </div>
        <div className="lg:col-span-2">
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
};

/* Placeholder sections for non-dashboard navigation items */

const SubjectsPlaceholder = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-8">
    <h2 className="text-lg font-semibold text-gray-900 mb-2">Subjects</h2>
    <p className="text-sm text-gray-500">
      Browse and manage your subjects, chapters, and study materials.
    </p>
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {["Physics", "Chemistry", "Mathematics", "Biology", "English", "Computer Science"].map(
        (subject) => (
          <div
            key={subject}
            className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <p className="text-sm font-medium text-gray-900">{subject}</p>
            <p className="text-xs text-gray-500 mt-1">12 chapters</p>
          </div>
        )
      )}
    </div>
  </div>
);

const PerformancePlaceholder = () => (
  <div className="space-y-5">
    <PerformanceTrendChart />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <WeakTopicsCard />
      <StrongTopicsCard />
    </div>
  </div>
);

const ToolsPlaceholder = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-8">
    <h2 className="text-lg font-semibold text-gray-900 mb-2">Tools</h2>
    <p className="text-sm text-gray-500 mb-6">
      Access quizzes, AI mentor, document summarizer, and more.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { title: "Practice Quiz", desc: "Test your knowledge with adaptive quizzes" },
        { title: "AI Mentor", desc: "Get personalized help from AI" },
        { title: "Document Summarizer", desc: "Summarize PDFs and study material" },
        { title: "Prediction Engine", desc: "Predict your performance in upcoming exams" },
      ].map((tool) => (
        <div
          key={tool.title}
          className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <p className="text-sm font-medium text-gray-900">{tool.title}</p>
          <p className="text-xs text-gray-500 mt-1">{tool.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const SettingsPlaceholder = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-8">
    <h2 className="text-lg font-semibold text-gray-900 mb-2">Settings</h2>
    <p className="text-sm text-gray-500 mb-6">Manage your account and preferences.</p>
    <div className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Class</label>
        <input
          type="text"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Class 12"
        />
      </div>
      <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
        Save Changes
      </button>
    </div>
  </div>
);

export default DashboardPreview;
