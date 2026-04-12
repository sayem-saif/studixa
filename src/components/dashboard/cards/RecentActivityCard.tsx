import { Clock, CheckCircle, XCircle } from "lucide-react";

interface Activity {
  id: number;
  title: string;
  subject: string;
  score: number | null;
  status: "completed" | "in-progress" | "missed";
  time: string;
}

const activities: Activity[] = [
  {
    id: 1,
    title: "Kinematics Quiz",
    subject: "Physics",
    score: 92,
    status: "completed",
    time: "2h ago",
  },
  {
    id: 2,
    title: "Organic Chemistry Review",
    subject: "Chemistry",
    score: null,
    status: "in-progress",
    time: "4h ago",
  },
  {
    id: 3,
    title: "Integration Practice",
    subject: "Mathematics",
    score: 68,
    status: "completed",
    time: "Yesterday",
  },
  {
    id: 4,
    title: "Thermodynamics Test",
    subject: "Physics",
    score: 85,
    status: "completed",
    time: "Yesterday",
  },
  {
    id: 5,
    title: "Probability Assignment",
    subject: "Mathematics",
    score: null,
    status: "missed",
    time: "2 days ago",
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    label: "Completed",
  },
  "in-progress": {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "In Progress",
  },
  missed: {
    icon: XCircle,
    color: "text-gray-400",
    bg: "bg-gray-50",
    label: "Missed",
  },
};

const RecentActivityCard = () => {
  return (
    <div id="recent-activity-card" className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => {
          const config = statusConfig[activity.status];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 py-1"
            >
              <div
                className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-3.5 h-3.5 ${config.color}`} strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">{activity.subject}</p>
              </div>

              <div className="text-right flex-shrink-0">
                {activity.score !== null ? (
                  <p className="text-sm font-medium text-gray-900">{activity.score}%</p>
                ) : (
                  <p className="text-xs text-gray-400">{config.label}</p>
                )}
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityCard;
