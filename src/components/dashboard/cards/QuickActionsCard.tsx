import { Play, RotateCcw, BookOpen, FileText } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  primary?: boolean;
}

const actions: QuickAction[] = [
  {
    id: "start-quiz",
    label: "Start Quiz",
    description: "Take a new practice quiz",
    icon: Play,
    primary: true,
  },
  {
    id: "review-topics",
    label: "Review Topics",
    description: "Revisit weak areas",
    icon: RotateCcw,
  },
  {
    id: "study-material",
    label: "Study Material",
    description: "Browse subject chapters",
    icon: BookOpen,
  },
  {
    id: "past-papers",
    label: "Past Papers",
    description: "Solve previous papers",
    icon: FileText,
  },
];

const QuickActionsCard = () => {
  return (
    <div id="quick-actions-card" className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              id={`quick-action-${action.id}`}
              className={`
                flex flex-col items-start gap-2 p-3 rounded-lg border text-left
                transition-colors duration-150
                ${
                  action.primary
                    ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                    : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                }
              `}
            >
              <Icon
                className={`w-4 h-4 ${action.primary ? "text-blue-100" : "text-gray-400"}`}
                strokeWidth={1.8}
              />
              <div>
                <p className={`text-sm font-medium ${action.primary ? "text-white" : "text-gray-900"}`}>
                  {action.label}
                </p>
                <p className={`text-xs mt-0.5 ${action.primary ? "text-blue-200" : "text-gray-500"}`}>
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsCard;
