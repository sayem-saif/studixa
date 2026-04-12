import { TrendingUp, Target, Flame } from "lucide-react";

const PerformanceSummaryCard = () => {
  const stats = [
    {
      label: "Accuracy",
      value: "78%",
      change: "+3.2%",
      positive: true,
      icon: Target,
    },
    {
      label: "Avg. Score",
      value: "82/100",
      change: "+5 pts",
      positive: true,
      icon: TrendingUp,
    },
    {
      label: "Study Streak",
      value: "12 days",
      change: "Best: 18",
      positive: true,
      icon: Flame,
    },
  ];

  return (
    <div id="performance-summary-card" className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Performance Summary</h3>

      <div className="space-y-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-500" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  stat.positive
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-red-700 bg-red-50"
                }`}
              >
                {stat.change}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceSummaryCard;
