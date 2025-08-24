import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finova Analytics - Financial Insights Dashboard",
  description:
    "Comprehensive financial analytics dashboard for credit card transactions, user spending analysis, and risk monitoring. Built with Next.js and TypeScript.",
  keywords:
    "financial analytics, credit card analysis, spending insights, risk monitoring, fintech dashboard",
  authors: [{ name: "Finova Analytics Team" }],
  openGraph: {
    title: "Finova Analytics - Financial Insights Dashboard",
    description:
      "Comprehensive financial analytics dashboard for credit card transactions and spending analysis",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
