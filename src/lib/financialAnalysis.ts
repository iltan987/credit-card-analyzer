import {
  RawDataSets,
  FinancialInsights,
  UserSpendingSummary,
  CategorySpending,
  CreditUtilization,
  DelinquencyAlert,
  MonthlyTrend,
  Transaction,
  CreditCard,
  User,
} from "@/types";
import { ANALYSIS_CONFIG } from "@/config/analysisConfig";
import { getHighLevelCategory } from "@/config/merchantCategories";
import { parseISO, differenceInDays, format } from "date-fns";

/**
 * Main function to analyze financial data and extract insights
 */
export function analyzeFinancialData(data: RawDataSets): FinancialInsights {
  const { users, creditCards, transactions } = data;

  // Calculate all insights
  const userSpending = calculateUserSpending(
    users.Users,
    creditCards.UserCreditCards,
    transactions.CreditCardTransactions
  );
  const categoryBreakdown = calculateCategoryBreakdown(
    transactions.CreditCardTransactions
  );
  const creditUtilization = calculateCreditUtilization(
    users.Users,
    creditCards.UserCreditCards
  );
  const delinquencyAlerts = calculateDelinquencyAlerts(
    users.Users,
    creditCards.UserCreditCards
  );
  const monthlyTrends = calculateMonthlyTrends(
    users.Users,
    creditCards.UserCreditCards,
    transactions.CreditCardTransactions
  );

  // Calculate summary statistics
  const totalTransactions = Object.values(
    transactions.CreditCardTransactions
  ).reduce((sum, cardTransactions) => sum + cardTransactions.length, 0);

  const totalSpending = userSpending.reduce(
    (sum, user) => sum + user.totalSpend,
    0
  );

  const highRiskUsers = creditUtilization.filter(
    (util) => util.isHighRisk
  ).length;
  const delinquentUsers = delinquencyAlerts.length;

  return {
    userSpending,
    categoryBreakdown,
    creditUtilization,
    delinquencyAlerts,
    monthlyTrends,
    summary: {
      totalUsers: users.Users.length,
      totalCards: creditCards.UserCreditCards.length,
      totalTransactions,
      totalSpending,
      highRiskUsers,
      delinquentUsers,
    },
  };
}

/**
 * Calculate total spending per user
 */
function calculateUserSpending(
  users: User[],
  creditCards: CreditCard[],
  transactions: { [assignNo: string]: Transaction[] }
): UserSpendingSummary[] {
  const userSpendingMap = new Map<string, UserSpendingSummary>();

  // Initialize user spending records
  users.forEach((user) => {
    const userCards = creditCards.filter((card) => card.UserID === user.ID);
    userSpendingMap.set(user.ID, {
      userId: user.ID,
      userName: `${user.Name} ${user.Surname}`,
      totalSpend: 0,
      cardCount: userCards.length,
      averageMonthlySpend: 0,
    });
  });

  // Calculate spending from transactions
  Object.entries(transactions).forEach(([assignNo, cardTransactions]) => {
    const card = creditCards.find((c) => c.AssignNo === assignNo);
    if (!card) return;

    const userSpending = userSpendingMap.get(card.UserID);
    if (!userSpending) return;

    const totalSpend = cardTransactions
      .filter((txn) => isDebtTransaction(txn.DebtOrCredit))
      .reduce((sum, txn) => sum + Math.abs(txn.Amount), 0);

    userSpending.totalSpend += totalSpend;
  });

  // Calculate average monthly spending (assuming 6 months of data)
  userSpendingMap.forEach((userSpending) => {
    userSpending.averageMonthlySpend = userSpending.totalSpend / 6;
  });

  return Array.from(userSpendingMap.values())
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, ANALYSIS_CONFIG.MAX_USERS_DISPLAY);
}

/**
 * Calculate spending breakdown by merchant category
 */
function calculateCategoryBreakdown(transactions: {
  [assignNo: string]: Transaction[];
}): CategorySpending[] {
  const categoryMap = new Map<string, { amount: number; count: number }>();
  let totalSpending = 0;

  Object.values(transactions).forEach((cardTransactions) => {
    cardTransactions
      .filter((txn) => isDebtTransaction(txn.DebtOrCredit))
      .forEach((txn) => {
        const category = getHighLevelCategory(txn.MerchantCategoryCode);
        const amount = Math.abs(txn.Amount);

        const existing = categoryMap.get(category) || { amount: 0, count: 0 };
        categoryMap.set(category, {
          amount: existing.amount + amount,
          count: existing.count + 1,
        });

        totalSpending += amount;
      });
  });

  return Array.from(categoryMap.entries())
    .map(([categoryCode, data]) => ({
      categoryCode,
      categoryName: categoryCode,
      totalAmount: data.amount,
      transactionCount: data.count,
      percentage: (data.amount / totalSpending) * 100,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, ANALYSIS_CONFIG.MAX_CATEGORY_DISPLAY);
}

/**
 * Calculate credit utilization for each card
 */
function calculateCreditUtilization(
  users: User[],
  creditCards: CreditCard[]
): CreditUtilization[] {
  return creditCards
    .map((card) => {
      const user = users.find((u) => u.ID === card.UserID);
      const currentBalance = card.Limit - card.AvailableLimit;
      const utilization = card.Limit > 0 ? currentBalance / card.Limit : 0;

      return {
        userId: card.UserID,
        userName: user ? `${user.Name} ${user.Surname}` : card.CardName,
        assignNo: card.AssignNo,
        cardName: card.CardName,
        limit: card.Limit,
        utilization,
        isHighRisk: utilization >= ANALYSIS_CONFIG.HIGH_UTILIZATION_THRESHOLD,
      };
    })
    .filter((util) => util.isHighRisk)
    .sort((a, b) => b.utilization - a.utilization);
}

/**
 * Detect users with potential delinquency issues
 */
function calculateDelinquencyAlerts(
  users: User[],
  creditCards: CreditCard[]
): DelinquencyAlert[] {
  const alerts: DelinquencyAlert[] = [];
  const today = new Date();

  creditCards.forEach((card) => {
    if (card.RemainingStatementAmount <= 0) return; // No outstanding balance

    const user = users.find((u) => u.ID === card.UserID);
    const dueDate = parseISO(card.StatementDueDate);
    const daysOverdue = differenceInDays(today, dueDate);

    // Check if payment is overdue
    if (daysOverdue > 0) {
      const severity: "warning" | "critical" =
        daysOverdue > ANALYSIS_CONFIG.STATEMENT_DUE_GRACE_PERIOD_DAYS
          ? "critical"
          : "warning";

      alerts.push({
        userId: card.UserID,
        userName: user ? `${user.Name} ${user.Surname}` : card.CardName,
        assignNo: card.AssignNo,
        statementAmount: card.StatementAmount,
        statementDueDate: card.StatementDueDate,
        remainingAmount: card.RemainingStatementAmount,
        daysOverdue,
        severity,
      });
    }
  });

  return alerts.sort((a, b) => b.daysOverdue - a.daysOverdue);
}

/**
 * Calculate monthly spending trends
 */
function calculateMonthlyTrends(
  users: User[],
  creditCards: CreditCard[],
  transactions: { [assignNo: string]: Transaction[] }
): MonthlyTrend[] {
  const userMonthlySpending = new Map<string, Map<string, number>>();

  // Initialize user maps
  users.forEach((user) => {
    userMonthlySpending.set(user.ID, new Map());
  });

  // Calculate monthly spending for each user
  Object.entries(transactions).forEach(([assignNo, cardTransactions]) => {
    // Find which user this card belongs to
    const card = creditCards.find((c) => c.AssignNo === assignNo);
    if (!card) return;

    const userSpendingMap = userMonthlySpending.get(card.UserID);
    if (!userSpendingMap) return;

    // Process transactions for this card
    cardTransactions
      .filter((txn) => isDebtTransaction(txn.DebtOrCredit))
      .forEach((txn) => {
        try {
          const transactionDate = parseISO(txn.Date);
          const monthKey = format(transactionDate, "yyyy-MM");

          const currentSpending = userSpendingMap.get(monthKey) || 0;
          userSpendingMap.set(monthKey, currentSpending + Math.abs(txn.Amount));
        } catch {
          // Skip invalid dates
          console.warn("Invalid date in transaction:", txn.Date);
        }
      });
  });

  // Convert to MonthlyTrend array
  const monthlyTrends: MonthlyTrend[] = [];

  userMonthlySpending.forEach((monthlyData, userId) => {
    const user = users.find((u) => u.ID === userId);
    if (!user) return;

    const sortedMonths = Array.from(monthlyData.keys()).sort();

    sortedMonths.forEach((month, index) => {
      const spending = monthlyData.get(month) || 0;
      let trendDirection: "increasing" | "decreasing" | "stable" = "stable";
      let percentageChange = 0;

      // Calculate trend direction if we have previous month data
      if (index > 0) {
        const prevMonth = sortedMonths[index - 1];
        const prevSpending = monthlyData.get(prevMonth) || 0;

        if (prevSpending > 0) {
          percentageChange = ((spending - prevSpending) / prevSpending) * 100;

          if (
            Math.abs(percentageChange) >=
            ANALYSIS_CONFIG.SIGNIFICANT_CHANGE_THRESHOLD * 100
          ) {
            trendDirection = percentageChange > 0 ? "increasing" : "decreasing";
          }
        }
      }

      monthlyTrends.push({
        userId,
        userName: `${user.Name} ${user.Surname}`,
        month: format(parseISO(month + "-01"), "MMM yyyy"),
        spending,
        trendDirection,
        percentageChange,
      });
    });
  });

  return monthlyTrends.sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Helper function to determine if a transaction is a debt (spending) transaction
 */
function isDebtTransaction(debtOrCredit: string): boolean {
  return ANALYSIS_CONFIG.DEBT_INDICATORS.some(
    (indicator) => indicator === debtOrCredit
  );
}

/**
 * Load and parse JSON data files from secure API endpoint
 */
export async function loadFinancialData(): Promise<RawDataSets> {
  try {
    // Call our secure API endpoint
    const response = await fetch("/api/financial-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data on each request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawDataSets: RawDataSets = await response.json();
    return rawDataSets;
  } catch (error) {
    console.error("Error loading financial data:", error);
    throw new Error("Failed to load financial data");
  }
}

/**
 * Load processed financial insights directly from API
 * This approach performs all analysis on the server-side and only returns
 * processed insights, not raw sensitive data
 */
export async function loadFinancialInsights(): Promise<FinancialInsights> {
  try {
    const response = await fetch("/api/insights", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data on each request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const insights: FinancialInsights = await response.json();
    return insights;
  } catch (error) {
    console.error("Error loading financial insights:", error);
    throw new Error("Failed to load financial insights");
  }
}
