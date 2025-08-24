"use client";

import { useState, useEffect } from "react";
import { FinancialInsights } from "@/types";
import { loadFinancialInsights } from "@/lib/financialAnalysis";
import { SummaryCards } from "@/components/SummaryCards";
import { UserSpendingTable } from "@/components/UserSpendingTable";
import { CategoryBreakdownChart } from "@/components/CategoryBreakdownChart";
import { CreditUtilizationAlerts } from "@/components/CreditUtilizationAlerts";
import { DelinquencyAlerts } from "@/components/DelinquencyAlerts";
import { MonthlyTrendsChart } from "@/components/MonthlyTrendsChart";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

export default function FinancialDashboard() {
  const [insights, setInsights] = useState<FinancialInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the secure insights API
      const insights = await loadFinancialInsights();

      setInsights(insights);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load financial insights"
      );
      console.error("Error loading financial insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Financial Insights
          </h2>
          <p className="text-gray-600">
            Retrieving processed analytics and insights...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Insights
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Finova Analytics
              </h1>
              <p className="text-gray-600">Financial Insights Dashboard</p>
            </div>
            <div className="text-right">
              <button
                onClick={loadData}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <SummaryCards insights={insights} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Spending Table */}
          <div className="lg:col-span-2">
            <UserSpendingTable insights={insights} />
          </div>

          {/* Category Breakdown Chart */}
          <CategoryBreakdownChart insights={insights} />

          {/* Monthly Trends Chart */}
          <MonthlyTrendsChart insights={insights} />
        </div>

        {/* Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Credit Utilization Alerts */}
          <CreditUtilizationAlerts insights={insights} />

          {/* Delinquency Alerts */}
          <DelinquencyAlerts insights={insights} />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500">
            <p className="text-sm">
              Finova Analytics Dashboard - Automated Financial Analysis
            </p>
            <p className="text-xs mt-1">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
