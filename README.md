# Finova Analytics - Financial Insights Dashboard

A comprehensive financial analytics dashboard built for analyzing credit card transactions, user spending patterns, and detecting financial risks. This is a proof-of-concept (PoC) application designed to automate financial data analysis for fintech companies.

## 🚀 Features

### Core Analytics

- **User Spending Overview**: Total spend aggregated for each user with detailed breakdowns
- **Category-Level Spend Breakdown**: Visual representation of spending across merchant categories (MCC codes)
- **Credit Utilization Analysis**: Real-time monitoring of credit card utilization rates with risk alerts
- **Delinquency Detection**: Automated identification of users with overdue payments
- **Monthly Trends**: Spending pattern analysis across time periods

### Dashboard Highlights

- 📊 Interactive charts and visualizations using Recharts
- 🎯 Real-time risk alerts and notifications
- 📱 Responsive design for desktop and mobile
- 🔄 Real-time data refresh capabilities
- 💼 Professional UI/UX designed for financial analysts

## 🛠 Technology Stack

- **Framework**: Next.js 15.5.0 (App Router)
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern, utility-first styling
- **Charts**: Recharts for interactive data visualizations
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for robust date operations

## 📁 Project Architecture

```
src/
├── app/                    # Next.js App Router pages
│   └── api/                       # Secure API endpoints
│       ├── financial-data/        # Raw data access (server-side)
│       └── insights/              # Processed insights API
├── components/             # Reusable UI components
│   ├── SummaryCards.tsx           # Overview metrics cards
│   ├── UserSpendingTable.tsx      # User spending data table
│   ├── CategoryBreakdownChart.tsx # Spending by category visualization
│   ├── CreditUtilizationAlerts.tsx # High utilization warnings
│   ├── DelinquencyAlerts.tsx      # Overdue payment alerts
│   ├── MonthlyTrendsChart.tsx     # Spending trends over time
│   └── FinancialDashboard.tsx     # Main dashboard container
├── lib/                    # Business logic and data processing
│   └── financialAnalysis.ts      # Core analysis algorithms
├── config/                 # Configuration and constants
│   ├── analysisConfig.ts          # Analysis parameters and thresholds
│   └── merchantCategories.ts     # MCC code mappings
├── types/                  # TypeScript type definitions
│   └── index.ts                   # Data structure interfaces
└── data/                   # Sample and actual data files
    ├── users.json                 # User demographic data (actual)
    ├── credit_cards.json          # Credit card information (actual)
    ├── transactions.json          # Transaction history (actual)
    ├── users.example.json         # Sample user data template
    ├── credit_cards.example.json  # Sample credit card template
    └── transactions.example.json  # Sample transaction template
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/iltan987/credit-card-analyzer.git
   cd credit-card-analyzer
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure data source**

   The application supports two data sources that can be configured via environment variables:

   **Option A: Local Data Folder (Default)**

   ```bash
   # .env.local
   DATA_SOURCE=local  # or leave empty/undefined
   ```

   - Uses files in the `data/` directory
   - Requires `users.json`, `credit_cards.json`, `transactions.json`
   - Best for development and when you have files locally

   **Option B: Vercel Blob Storage**

   ```bash
   # .env.local
   DATA_SOURCE=blob
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   ```

   - Fetches data from Vercel Blob storage
   - Requires uploading files to Vercel Blob first
   - Best for production deployments and cloud storage

   **Example Files** (for reference):

   - `data/users.example.json` - Sample user demographics with 5 test users
   - `data/credit_cards.example.json` - Sample credit cards with various limits and statuses
   - `data/transactions.example.json` - Sample transactions across different categories

   **Security Note:**

   - Example files are safe to commit to version control
   - Actual data files are automatically ignored by `.gitignore`
   - Never commit real financial data to repositories

4. **Start the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
pnpm build
pnpm start
```

## ⚙️ Configuration

### Data Source Configuration

The application supports flexible data source configuration via the `DATA_SOURCE` environment variable:

| Value             | Description                    | Use Case                      |
| ----------------- | ------------------------------ | ----------------------------- |
| `local` (default) | Load from local `data/` folder | Development, local testing    |
| `blob`            | Load from Vercel Blob storage  | Production, cloud deployments |

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Data source selection
DATA_SOURCE=local  # or 'blob'

# Required only for DATA_SOURCE=blob
BLOB_READ_WRITE_TOKEN=your_token_here
```

### Analysis Parameters

Edit `src/config/analysisConfig.ts` to customize analysis thresholds:

```typescript
export const ANALYSIS_CONFIG = {
  HIGH_UTILIZATION_THRESHOLD: 0.8, // 80% utilization alert
  CRITICAL_UTILIZATION_THRESHOLD: 0.95, // 95% critical alert
  DEBT_INDICATORS: ["B", "Debt"], // Transaction type indicators
  CREDIT_INDICATORS: ["A", "Credit"], // Payment indicators
  STATEMENT_DUE_GRACE_PERIOD_DAYS: 7, // Days grace period
  // ... more configuration options
};
```

## 📈 Key Insights Generated

### 1. User Spending Analysis

- Total spending per user across all cards
- Average monthly spending patterns
- Number of active cards per user

### 2. Risk Assessment

- **High Utilization**: Users with >80% credit utilization
- **Critical Utilization**: Users with >95% credit utilization
- **Delinquency Alerts**: Overdue payments with severity levels

### 3. Category Intelligence

- Spending distribution across merchant categories
- Top spending categories by volume and frequency
- Visual breakdown with interactive charts

## 🔒 Data Security & API Architecture

- **Secure API Endpoints**: Data is processed server-side through `/api/financial-data` and `/api/insights`
- **No Client Exposure**: Sensitive financial data never reaches the browser
- **Example Data Provided**: Complete sample datasets for testing and development
- **Environment Separation**: Real data files are automatically excluded from version control
- **Server-Side Processing**: All analysis occurs on the backend for enhanced security

## 🆘 Troubleshooting

### Common Issues

#### "Failed to load financial insights"

- Ensure data files exist in the `data/` directory
- Check that JSON files are valid format
- Verify the API endpoints are running (`/api/insights`)
- Check browser network tab for API errors

#### Charts not displaying

- Check browser console for errors
- Ensure data has valid numeric values
- Verify date formats in transaction data
- Confirm API responses contain expected data structure

## 📊 Example Data Structure

The application includes comprehensive example files that demonstrate the expected data format:

- **5 sample users** with varied demographics and professions
- **6 credit cards** with different limits, utilization rates, and statuses
- **19+ transactions** across multiple merchant categories (dining, travel, groceries, etc.)
- **Realistic spending patterns** including both high and low spenders
- **Various risk scenarios** including high utilization and potential delinquency cases

---

Built with ❤️ for Finova Analytics
