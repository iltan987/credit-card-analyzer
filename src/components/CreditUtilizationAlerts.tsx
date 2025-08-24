import { FinancialInsights } from "@/types";
import { ANALYSIS_CONFIG } from "@/config/analysisConfig";
import { AlertTriangle, AlertCircle } from "lucide-react";

interface CreditUtilizationAlertsProps {
  insights: FinancialInsights;
}

export function CreditUtilizationAlerts({
  insights,
}: CreditUtilizationAlertsProps) {
  const { creditUtilization } = insights;

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= ANALYSIS_CONFIG.CRITICAL_UTILIZATION_THRESHOLD) {
      return "bg-red-100 border-red-300 text-red-800";
    } else if (utilization >= ANALYSIS_CONFIG.HIGH_UTILIZATION_THRESHOLD) {
      return "bg-orange-100 border-orange-300 text-orange-800";
    }
    return "bg-yellow-100 border-yellow-300 text-yellow-800";
  };

  const getUtilizationIcon = (utilization: number) => {
    if (utilization >= ANALYSIS_CONFIG.CRITICAL_UTILIZATION_THRESHOLD) {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
    return <AlertTriangle className="h-5 w-5 text-orange-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          High Credit Utilization Alerts
        </h3>
        <p className="text-sm text-gray-600">
          Users with credit cards above{" "}
          {(ANALYSIS_CONFIG.HIGH_UTILIZATION_THRESHOLD * 100).toFixed(0)}%
          utilization
        </p>
      </div>
      <div className="p-6">
        {creditUtilization.length > 0 ? (
          <div className="space-y-4">
            {creditUtilization.map((util) => (
              <div
                key={`${util.userId}-${util.assignNo}`}
                className={`p-4 rounded-lg border-2 ${getUtilizationColor(
                  util.utilization
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getUtilizationIcon(util.utilization)}
                    <div>
                      <h4 className="font-medium">{util.userName}</h4>
                      <p className="text-sm opacity-75">
                        Card: {util.cardName}
                      </p>
                      <p className="text-xs opacity-75">
                        Limit: {ANALYSIS_CONFIG.CURRENCY_SYMBOL}
                        {util.limit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {(util.utilization * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm opacity-75">Utilization</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Credit Utilization</span>
                    <span>{(util.utilization * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        util.utilization >=
                        ANALYSIS_CONFIG.CRITICAL_UTILIZATION_THRESHOLD
                          ? "bg-red-500"
                          : "bg-orange-500"
                      }`}
                      style={{
                        width: `${Math.min(util.utilization * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No high credit utilization alerts</p>
            <p className="text-sm">
              All users are below the{" "}
              {(ANALYSIS_CONFIG.HIGH_UTILIZATION_THRESHOLD * 100).toFixed(0)}%
              threshold
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
