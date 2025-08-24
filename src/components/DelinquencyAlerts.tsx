import { FinancialInsights } from "@/types";
import { ANALYSIS_CONFIG } from "@/config/analysisConfig";
import { AlertTriangle, Clock, DollarSign } from "lucide-react";
import { format, parseISO } from "date-fns";

interface DelinquencyAlertsProps {
  insights: FinancialInsights;
}

export function DelinquencyAlerts({ insights }: DelinquencyAlertsProps) {
  const { delinquencyAlerts } = insights;

  const getSeverityColor = (severity: "warning" | "critical") => {
    return severity === "critical"
      ? "bg-red-100 border-red-300 text-red-800"
      : "bg-orange-100 border-orange-300 text-orange-800";
  };

  const getSeverityIcon = (severity: "warning" | "critical") => {
    return severity === "critical" ? (
      <AlertTriangle className="h-5 w-5 text-red-600" />
    ) : (
      <Clock className="h-5 w-5 text-orange-600" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Delinquency Detection
        </h3>
        <p className="text-sm text-gray-600">
          Users who have failed to pay their statement balance by the due date
        </p>
      </div>
      <div className="p-6">
        {delinquencyAlerts.length > 0 ? (
          <div className="space-y-4">
            {delinquencyAlerts.map((alert) => (
              <div
                key={`${alert.userId}-${alert.assignNo}`}
                className={`p-4 rounded-lg border-2 ${getSeverityColor(
                  alert.severity
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <h4 className="font-medium">{alert.userName}</h4>
                      <p className="text-sm opacity-75">
                        Due:{" "}
                        {format(
                          parseISO(alert.statementDueDate),
                          "MMM dd, yyyy"
                        )}
                      </p>
                      <p className="text-xs opacity-75">
                        Card: {alert.assignNo.slice(-6)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {alert.daysOverdue} days
                    </div>
                    <div className="text-sm opacity-75">Overdue</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 opacity-75" />
                    <div>
                      <p className="text-xs opacity-75">Statement Amount</p>
                      <p className="text-sm font-medium">
                        {ANALYSIS_CONFIG.CURRENCY_SYMBOL}
                        {alert.statementAmount.toLocaleString(undefined, {
                          minimumFractionDigits: ANALYSIS_CONFIG.DECIMAL_PLACES,
                          maximumFractionDigits: ANALYSIS_CONFIG.DECIMAL_PLACES,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 opacity-75" />
                    <div>
                      <p className="text-xs opacity-75">Remaining Amount</p>
                      <p className="text-sm font-medium">
                        {ANALYSIS_CONFIG.CURRENCY_SYMBOL}
                        {alert.remainingAmount.toLocaleString(undefined, {
                          minimumFractionDigits: ANALYSIS_CONFIG.DECIMAL_PLACES,
                          maximumFractionDigits: ANALYSIS_CONFIG.DECIMAL_PLACES,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-3 text-green-400" />
            <p className="text-green-600 font-medium">No delinquency alerts</p>
            <p className="text-sm">All users are current on their payments</p>
          </div>
        )}
      </div>
    </div>
  );
}
