import { AlertTriangle } from "lucide-react";

interface WeakTopic {
  topic: string;
  subject: string;
  accuracy: number;
}

const weakTopics: WeakTopic[] = [
  { topic: "Organic Chemistry", subject: "Chemistry", accuracy: 42 },
  { topic: "Integration", subject: "Mathematics", accuracy: 48 },
  { topic: "Electromagnetic Induction", subject: "Physics", accuracy: 51 },
  { topic: "Probability", subject: "Mathematics", accuracy: 55 },
];

const WeakTopicsCard = () => {
  return (
    <div id="weak-topics-card" className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Weak Areas</h3>
        <span className="text-xs text-gray-400">Below 60% accuracy</span>
      </div>

      <div className="space-y-3">
        {weakTopics.map((topic) => (
          <div key={topic.topic} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{topic.topic}</p>
              <p className="text-xs text-gray-500">{topic.subject}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full"
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

export default WeakTopicsCard;
