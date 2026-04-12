import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { week: "Week 1", score: 62, accuracy: 58 },
  { week: "Week 2", score: 65, accuracy: 61 },
  { week: "Week 3", score: 68, accuracy: 64 },
  { week: "Week 4", score: 71, accuracy: 68 },
  { week: "Week 5", score: 69, accuracy: 66 },
  { week: "Week 6", score: 74, accuracy: 72 },
  { week: "Week 7", score: 78, accuracy: 75 },
  { week: "Week 8", score: 82, accuracy: 78 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2">
        <p className="text-xs font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-xs text-gray-500">
            {entry.name === "score" ? "Score" : "Accuracy"}:{" "}
            <span className="font-medium text-gray-900">
              {entry.value}
              {entry.name === "accuracy" ? "%" : ""}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PerformanceTrendChart = () => {
  return (
    <div id="performance-trend-chart" className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900">Performance Trend</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-xs text-gray-500">Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-xs text-gray-500">Accuracy</span>
          </div>
        </div>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              dx={-8}
              domain={[50, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ r: 3, fill: "#2563EB", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#2563EB", strokeWidth: 2, stroke: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#9CA3AF"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={{ r: 2.5, fill: "#9CA3AF", strokeWidth: 0 }}
              activeDot={{ r: 4, fill: "#9CA3AF", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceTrendChart;
