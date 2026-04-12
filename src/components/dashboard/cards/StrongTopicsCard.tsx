import { CheckCircle } from "lucide-react";

interface StrongTopic {
  topic: string;
  subject: string;
  accuracy: number;
}

const strongTopics: StrongTopic[] = [
  { topic: "Kinematics", subject: "Physics", accuracy: 94 },
  { topic: "Matrices", subject: "Mathematics", accuracy: 91 },
  { topic: "Chemical Bonding", subject: "Chemistry", accuracy: 88 },
  { topic: "Thermodynamics", subject: "Physics", accuracy: 85 },
];

const StrongTopicsCard = () => {
  return (
    <div id="strong-topics-card" className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Strong Areas</h3>
        <span className="text-xs text-gray-400">Above 80% accuracy</span>
      </div>

      <div className="space-y-3">
        {strongTopics.map((topic) => (
          <div key={topic.topic} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{topic.topic}</p>
              <p className="text-xs text-gray-500">{topic.subject}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${topic.accuracy}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-500 w-8 text-right">
                {topic.accuracy}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrongTopicsCard;
