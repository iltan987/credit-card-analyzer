/**
 * Type definitions for the financial data structures
 */

export interface User {
  ID: string;
  CustomerNumber: string;
  Name: string;
  Surname: string;
  Email: string;
  Phone: string;
  Address: string;
  City: string;
  Gender: string;
  BirthDate: string;
  Profession: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface CreditCard {
  UserID: string;
  CustomerNumber: string;
  AssignNo: string;
  CardName: string;
  ProductCode: string;
  Limit: number;
  AvailableLimit: number;
  AvailableCashLimit: number;
  Points: number;
  StatementDate: string;
  StatementDueDate: string;
  StatementAmount: number;
  StatementMinAmount: number;
  CanMakeLimitChangeRequest: boolean;
  IsSupCardUsageIncreaseAllowed: boolean;
  IsAutoPaymentAvailable: boolean;
  IsActive: boolean;
  RemainingStatementAmount: number;
  RemainingStatementMinAmount: number;
}

export interface Transaction {
  AssignNo: string;
  Amount: number;
  Description: string;
  Date: string;
  CanPostInstallment: boolean;
  DebtOrCredit: string;
  ForeignCurrencyAmount: number;
  AuthorizationCode: string;
  MerchantCategoryCode: string;
  RewardPoints: number;
  TransactionId: string;
  TransactionType: string;
  ProcessingStage: string;
}

export interface RawDataSets {
  users: { Users: User[] };
  creditCards: { UserCreditCards: CreditCard[] };
  transactions: {
    CreditCardTransactions: { [assignNo: string]: Transaction[] };
  };
}

// Analysis result types
export interface UserSpendingSummary {
  userId: string;
  userName: string;
  totalSpend: number;
  cardCount: number;
  averageMonthlySpend: number;
}

export interface CategorySpending {
  categoryCode: string;
  categoryName: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface CreditUtilization {
  userId: string;
  userName: string;
  assignNo: string;
  cardName: string;
  limit: number;
  utilization: number;
  isHighRisk: boolean;
}

export interface DelinquencyAlert {
  userId: string;
  userName: string;
  assignNo: string;
  statementAmount: number;
  statementDueDate: string;
  remainingAmount: number;
  daysOverdue: number;
  severity: "warning" | "critical";
}

export interface MonthlyTrend {
  userId: string;
  userName: string;
  month: string;
  spending: number;
  trendDirection: "increasing" | "decreasing" | "stable";
  percentageChange: number;
}

export interface FinancialInsights {
  userSpending: UserSpendingSummary[];
  categoryBreakdown: CategorySpending[];
  creditUtilization: CreditUtilization[];
  delinquencyAlerts: DelinquencyAlert[];
  monthlyTrends: MonthlyTrend[];
  summary: {
    totalUsers: number;
    totalCards: number;
    totalTransactions: number;
    totalSpending: number;
    highRiskUsers: number;
    delinquentUsers: number;
  };
}
