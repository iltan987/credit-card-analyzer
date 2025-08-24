import { FinancialInsights } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MonthlyTrendsChartProps {
  insights: FinancialInsights;
}

export function MonthlyTrendsChart({ insights }: MonthlyTrendsChartProps) {
  const { monthlyTrends } = insights;

  // Group trends by user and prepare chart data
  const chartData = monthlyTrends.reduce((acc, trend) => {
    const existingMonth = acc.find((item) => item.month === trend.month);
    if (existingMonth) {
      existingMonth.totalSpending += trend.spending;
      existingMonth.userCount += 1;
    } else {
      acc.push({
        month: trend.month,
        totalSpending: trend.spending,
        userCount: 1,
        averageSpending: trend.spending,
      });
    }
    return acc;
  }, [] as Array<{ month: string; totalSpending: number; userCount: number; averageSpending: number }>);

  // Calculate averages
  chartData.forEach((item) => {
    item.averageSpending = item.totalSpending / item.userCount;
  });

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Total: ₺
            {payload[0].value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-green-600">
            Average: ₺
            {payload[1]?.value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
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
          Monthly Spending Trends
        </h3>
        <p className="text-sm text-gray-600">
          Spending patterns across months (increasing, decreasing, seasonal)
        </p>
      </div>
      <div className="p-6">
        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="totalSpending"
                  fill="#3b82f6"
                  name="Total Spending"
                />
                <Bar
                  dataKey="averageSpending"
                  fill="#10b981"
                  name="Average Spending"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-gray-400 mb-3">📊</div>
            <p>Monthly trend analysis coming soon</p>
            <p className="text-sm">
              Requires historical transaction data spanning multiple months
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
