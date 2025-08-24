import { FinancialInsights } from "@/types";
import { ANALYSIS_CONFIG } from "@/config/analysisConfig";

interface UserSpendingTableProps {
  insights: FinancialInsights;
}

export function UserSpendingTable({ insights }: UserSpendingTableProps) {
  const { userSpending } = insights;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          User Spending Overview
        </h3>
        <p className="text-sm text-gray-600">
          Total spend aggregated for each user
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spend
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cards
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Monthly
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userSpending.map((user, index) => (
              <tr
                key={user.userId}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.userName}
                  </div>
                  <div className="text-sm text-gray-500">ID: {user.userId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {ANALYSIS_CONFIG.CURRENCY_SYMBOL}
                    {user.totalSpend.toLocaleString(undefined, {
                      minimumFractionDigits: ANALYSIS_CONFIG.DECIMAL_PLACES,
                      maximumFractionDigits: ANALYSIS_CONFIG.DECIMAL_PLACES,
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.cardCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ANALYSIS_CONFIG.CURRENCY_SYMBOL}
                  {user.averageMonthlySpend.toLocaleString(undefined, {
                    minimumFractionDigits: ANALYSIS_CONFIG.DECIMAL_PLACES,
                    maximumFractionDigits: ANALYSIS_CONFIG.DECIMAL_PLACES,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {userSpending.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No spending data available
        </div>
      )}
    </div>
  );
}
