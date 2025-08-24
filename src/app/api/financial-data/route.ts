import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { RawDataSets } from "@/types";

/**
 * API route to securely serve financial data
 * This keeps sensitive data on the server-side
 */
export async function GET() {
  try {
    // Read data files from the data directory
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

    // Add response headers for security
    const response = NextResponse.json(rawDataSets);
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Error loading financial data:", error);

    // Don't expose internal file system errors to clients
    return NextResponse.json(
      { error: "Failed to load financial data" },
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
