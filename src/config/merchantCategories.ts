/**
 * Merchant Category Code mappings for better categorization
 * Based on standard MCC codes used in the financial industry
 */

export const MCC_CATEGORIES: Record<string, string> = {
  // Grocery and Food
  "5411": "Grocery Stores",
  "5422": "Meat and Fish Markets",
  "5441": "Candy, Nut, and Confectionery Stores",
  "5499": "Miscellaneous Food Stores",
  "5812": "Eating Places, Restaurants",
  "5814": "Fast Food Restaurants",

  // Retail and Shopping
  "5611": "Men's and Boys' Clothing",
  "5621": "Women's Ready-to-Wear Stores",
  "5631": "Women's Accessory Stores",
  "5641": "Children's and Infants' Wear Stores",
  "5651": "Family Clothing Stores",
  "5661": "Shoe Stores",
  "5691": "Men's and Women's Clothing Stores",
  "5399": "Miscellaneous General Merchandise",
  "5732": "Electronics Stores",
  "5912": "Drug Stores and Pharmacies",
  "5945": "Hobby, Toy, and Game Shops",

  // Transportation
  "4111": "Transportation - Suburban/Local Commuter",
  "4121": "Taxicabs and Limousines",
  "4131": "Bus Lines",
  "4722": "Travel Agencies",
  "5542": "Automated Fuel Dispensers",
  "5541": "Service Stations",
  "7523": "Parking Lots and Garages",

  // Entertainment and Recreation
  "7832": "Motion Picture Theaters",
  "7991": "Tourist Attractions and Exhibits",
  "7992": "Public Golf Courses",
  "7993": "Video Amusement Game Supplies",
  "7994": "Video Game Arcades",
  "7995": "Betting, Casino Gambling",

  // Financial Services
  "6010": "Manual Cash Disbursements",
  "6011": "Automated Cash Disbursements",
  "6012": "Financial Institutions",
  "6050": "Quasi Cash - Member Financial Institution",
  "6051": "Quasi Cash - Merchant",

  // Utilities and Services
  "4814": "Telecommunication Equipment",
  "4816": "Computer Network Services",
  "4899": "Cable and Pay Television",
  "4900": "Utilities",
  "5261": "Nurseries, Lawn and Garden Supply Stores",
  "5712": "Furniture, Home Furnishings",
  "5713": "Floor Covering Stores",
  "5714": "Drapery, Window Covering, and Upholstery",
  "5718": "Fireplaces, Fireplace Screens, and Accessories",

  // Healthcare
  "8011": "Doctors",
  "8021": "Dentists and Orthodontists",
  "8031": "Osteopaths",
  "8041": "Chiropractors",
  "8042": "Optometrists, Ophthalmologists",
  "8043": "Opticians, Eyeglasses",
  "8049": "Podiatrists, Chiropodists",
  "8050": "Nursing/Personal Care",
  "8062": "Hospitals",
  "8071": "Medical and Dental Labs",
  "8099": "Medical Services",

  // Professional Services
  "8111": "Legal Services",
  "8211": "Elementary, Secondary Schools",
  "8220": "Colleges, Universities",
  "8241": "Correspondence Schools",
  "8244": "Business/Secretarial Schools",
  "8249": "Vocational/Trade Schools",
  "8299": "Educational Services",
  "8351": "Child Care Services",
  "8398": "Organizations, Charitable and Social Service",

  // Government Services
  "9211": "Court Costs, Including Alimony and Child Support",
  "9222": "Fines - Government Administrative Entities",
  "9311": "Tax Payments - Government Agencies",
  "9399": "Government Services",
  "9401": "Government Services",
  "9402": "Postal Services - Government Only",
};

/**
 * Get category name for a given MCC code
 */
export function getCategoryName(mccCode: string): string {
  return MCC_CATEGORIES[mccCode] || `Unknown Category (${mccCode})`;
}

/**
 * Get high-level category grouping
 */
export function getHighLevelCategory(mccCode: string): string {
  const code = mccCode;

  // Food & Dining
  if (["5411", "5422", "5441", "5499", "5812", "5814"].includes(code)) {
    return "Food & Dining";
  }

  // Shopping & Retail
  if (
    [
      "5611",
      "5621",
      "5631",
      "5641",
      "5651",
      "5661",
      "5691",
      "5399",
      "5732",
      "5912",
      "5945",
    ].includes(code)
  ) {
    return "Shopping & Retail";
  }

  // Transportation
  if (["4111", "4121", "4131", "4722", "5542", "5541", "7523"].includes(code)) {
    return "Transportation";
  }

  // Entertainment
  if (["7832", "7991", "7992", "7993", "7994", "7995"].includes(code)) {
    return "Entertainment";
  }

  // Financial Services
  if (["6010", "6011", "6012", "6050", "6051"].includes(code)) {
    return "Financial Services";
  }

  // Utilities & Home
  if (
    [
      "4814",
      "4816",
      "4899",
      "4900",
      "5261",
      "5712",
      "5713",
      "5714",
      "5718",
    ].includes(code)
  ) {
    return "Utilities & Home";
  }

  // Healthcare
  if (code.startsWith("80") || code.startsWith("81")) {
    return "Healthcare";
  }

  // Professional Services
  if (
    [
      "8111",
      "8211",
      "8220",
      "8241",
      "8244",
      "8249",
      "8299",
      "8351",
      "8398",
    ].includes(code)
  ) {
    return "Professional Services";
  }

  // Government
  if (code.startsWith("92") || code.startsWith("93") || code.startsWith("94")) {
    return "Government";
  }

  return "Other";
}
