/**
 * Configuration constants for financial analysis
 * These values can be easily modified without changing the core analysis logic
 */

export const ANALYSIS_CONFIG = {
  // Credit utilization thresholds
  HIGH_UTILIZATION_THRESHOLD: 0.8, // 80%
  CRITICAL_UTILIZATION_THRESHOLD: 0.95, // 95%

  // Transaction type indicators
  DEBT_INDICATORS: ["B", "Debt"], // Values that indicate a debt transaction
  CREDIT_INDICATORS: ["A", "Credit"], // Values that indicate a credit/payment transaction

  // Delinquency analysis
  STATEMENT_DUE_GRACE_PERIOD_DAYS: 7, // Days after due date to consider overdue
  MINIMUM_PAYMENT_THRESHOLD: 0.1, // 10% of remaining amount to consider adequate payment

  // Trend analysis
  MONTHS_FOR_TREND_ANALYSIS: 6, // Number of months to analyze for trends
  SIGNIFICANT_CHANGE_THRESHOLD: 0.15, // 15% change to consider significant

  // Display limits
  MAX_CATEGORY_DISPLAY: 10, // Maximum categories to show in breakdown
  MAX_USERS_DISPLAY: 50, // Maximum users to show in various lists

  // Formatting
  CURRENCY_SYMBOL: "₺", // Turkish Lira symbol
  DECIMAL_PLACES: 2,
} as const;

export const CARD_PRODUCT_NAMES: Record<string, string> = {
  crd01: "Standard Card",
  crd02: "Silver Card",
  crdGold: "Gold Card",
  crdPlatinum: "Platinum Card",
} as const;

export const SEVERITY_COLORS = {
  low: "#22c55e", // green
  medium: "#f59e0b", // amber
  high: "#ef4444", // red
  critical: "#dc2626", // dark red
} as const;

export const CHART_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#22c55e", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#ec4899", // pink
  "#6366f1", // indigo
] as const;
