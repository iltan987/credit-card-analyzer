import { FinancialInsights } from "@/types";
import { CHART_COLORS } from "@/config/analysisConfig";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface CategoryBreakdownChartProps {
  insights: FinancialInsights;
}

export function CategoryBreakdownChart({
  insights,
}: CategoryBreakdownChartProps) {
  const { categoryBreakdown } = insights;

  const chartData = categoryBreakdown.map((category, index) => ({
    name: category.categoryName,
    value: category.totalAmount,
    percentage: category.percentage,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: Array<{ payload: any }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">
            Amount: ₺
            {data.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-gray-600">
            {data.percentage.toFixed(1)}% of total spending
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Category Spending Breakdown
        </h3>
        <p className="text-sm text-gray-600">
          Proportion of total spending across merchant categories
        </p>
      </div>
      <div className="p-6">
        {chartData.length > 0 ? (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) =>
                    `${name}: ${percentage.toFixed(1)}%`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No category data available
          </div>
        )}
      </div>
    </div>
  );
}
