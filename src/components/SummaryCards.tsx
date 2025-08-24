import { FinancialInsights } from "@/types";
import { ANALYSIS_CONFIG } from "@/config/analysisConfig";

interface SummaryCardsProps {
  insights: FinancialInsights;
}

export function SummaryCards({ insights }: SummaryCardsProps) {
  const { summary } = insights;

  const cards = [
    {
      title: "Total Users",
      value: summary.totalUsers.toLocaleString(),
      subtitle: "Active customers",
      color: "bg-blue-500",
    },
    {
      title: "Total Spending",
      value: `${
        ANALYSIS_CONFIG.CURRENCY_SYMBOL
      }${summary.totalSpending.toLocaleString()}`,
      subtitle: "Across all cards",
      color: "bg-green-500",
    },
    {
      title: "High Risk Users",
      value: summary.highRiskUsers.toString(),
      subtitle: "High utilization",
      color: "bg-red-500",
    },
    {
      title: "Delinquent Users",
      value: summary.delinquentUsers.toString(),
      subtitle: "Overdue payments",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500">{card.subtitle}</p>
            </div>
            <div
              className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}
            >
              <div className="w-6 h-6 bg-white rounded opacity-80"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
