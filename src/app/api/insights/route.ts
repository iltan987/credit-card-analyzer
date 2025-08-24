import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { RawDataSets, FinancialInsights } from "@/types";
import { analyzeFinancialData } from "@/lib/financialAnalysis";

/**
 * API route to get processed financial insights
 * This performs analysis on the server-side and only returns processed insights,
 * not raw sensitive data
 */
export async function GET() {
  try {
    // Read and parse data files on server-side
    const dataDirectory = path.join(process.cwd(), "data");

    const [usersData, creditCardsData, transactionsData] = await Promise.all([
      fs.readFile(path.join(dataDirectory, "users.json"), "utf8"),
      fs.readFile(path.join(dataDirectory, "credit_cards.json"), "utf8"),
      fs.readFile(path.join(dataDirectory, "transactions.json"), "utf8"),
    ]);

    const rawDataSets: RawDataSets = {
      users: JSON.parse(usersData),
      creditCards: JSON.parse(creditCardsData),
      transactions: JSON.parse(transactionsData),
    };

    // Perform analysis on server-side
    const insights: FinancialInsights = analyzeFinancialData(rawDataSets);

    // Return only processed insights, not raw data
    const response = NextResponse.json(insights);

    // Add security headers
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Error generating financial insights:", error);

    return NextResponse.json(
      { error: "Failed to generate financial insights" },
      { status: 500 }
    );
  }
}

/**
 * Handle preflight requests for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
