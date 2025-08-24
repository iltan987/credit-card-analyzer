import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { RawDataSets } from "@/types";

/**
 * Load data from local data folder
 */
async function loadFromLocalFolder(): Promise<RawDataSets> {
  const dataDirectory = path.join(process.cwd(), "data");

  const [usersData, creditCardsData, transactionsData] = await Promise.all([
    fs.readFile(path.join(dataDirectory, "users.json"), "utf8"),
    fs.readFile(path.join(dataDirectory, "credit_cards.json"), "utf8"),
    fs.readFile(path.join(dataDirectory, "transactions.json"), "utf8"),
  ]);

  return {
    users: JSON.parse(usersData),
    creditCards: JSON.parse(creditCardsData),
    transactions: JSON.parse(transactionsData),
  };
}

/**
 * Load data from Vercel Blob storage
 */
async function loadFromVercelBlob(): Promise<RawDataSets> {
  // List all blobs to find our data files
  const { blobs } = await list();

  // Find the specific data files we need
  const usersBlob = blobs.find((blob) => blob.pathname.includes("users.json"));
  const creditCardsBlob = blobs.find((blob) =>
    blob.pathname.includes("credit_cards.json")
  );
  const transactionsBlob = blobs.find((blob) =>
    blob.pathname.includes("transactions.json")
  );

  if (!usersBlob || !creditCardsBlob || !transactionsBlob) {
    throw new Error("Required data files not found in Vercel Blob");
  }

  // Fetch data from Vercel Blob URLs
  const [usersResponse, creditCardsResponse, transactionsResponse] =
    await Promise.all([
      fetch(usersBlob.url),
      fetch(creditCardsBlob.url),
      fetch(transactionsBlob.url),
    ]);

  if (
    !usersResponse.ok ||
    !creditCardsResponse.ok ||
    !transactionsResponse.ok
  ) {
    throw new Error("Failed to fetch data from Vercel Blob");
  }

  const [usersData, creditCardsData, transactionsData] = await Promise.all([
    usersResponse.json(),
    creditCardsResponse.json(),
    transactionsResponse.json(),
  ]);

  return {
    users: usersData,
    creditCards: creditCardsData,
    transactions: transactionsData,
  };
}

/**
 * API route to securely serve financial data
 * Data source is determined by DATA_SOURCE environment variable:
 * - 'blob' = Vercel Blob storage
 * - 'local' or undefined = Local data folder (default)
 */
export async function GET() {
  try {
    const dataSource = process.env.DATA_SOURCE?.toLowerCase() || "local";
    let rawDataSets: RawDataSets;

    console.log(`Loading financial data from: ${dataSource}`);

    if (dataSource === "blob") {
      rawDataSets = await loadFromVercelBlob();
    } else {
      rawDataSets = await loadFromLocalFolder();
    }

    // Add response headers for security
    const response = NextResponse.json(rawDataSets);
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("X-Data-Source", dataSource);

    return response;
  } catch (error) {
    console.error("Error loading financial data:", error);

    // Don't expose internal errors to clients
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
