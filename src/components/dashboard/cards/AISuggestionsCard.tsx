import { Lightbulb, ArrowRight } from "lucide-react";

interface Suggestion {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const suggestions: Suggestion[] = [
  {
    id: 1,
    title: "Focus on Organic Chemistry",
    description:
      "Your accuracy in Organic Chemistry is 42%. Review reaction mechanisms and practice naming conventions.",
    priority: "high",
  },
  {
    id: 2,
    title: "Practice Integration daily",
    description:
      "Solve at least 5 integration problems daily to improve from the current 48% accuracy.",
    priority: "high",
  },
  {
    id: 3,
    title: "Revise Electromagnetic Induction",
    description:
      "Review Faraday's and Lenz's laws. Take a practice quiz to test your understanding.",
    priority: "medium",
  },
];

const priorityColors = {
  high: "bg-red-50 text-red-700 border-red-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  low: "bg-blue-50 text-blue-700 border-blue-100",
};

const AISuggestionsCard = () => {
  return (
    <div id="ai-suggestions-card" className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
          <Lightbulb className="w-3.5 h-3.5 text-blue-600" strokeWidth={2} />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">AI Suggestions</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="group p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-medium text-gray-900">{suggestion.title}</p>
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded border flex-shrink-0 ${
                  priorityColors[suggestion.priority]
                }`}
              >
                {suggestion.priority}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              {suggestion.description}
            </p>
            <div className="flex items-center gap-1 mt-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-medium">Start now</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISuggestionsCard;
