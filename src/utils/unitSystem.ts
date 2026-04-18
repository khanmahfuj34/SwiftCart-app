/**
 * Grocery Unit System
 * Handles weight/unit conversions and price calculations
 */

export type Unit = "kg" | "g" | "piece" | "liter" | "ml";

export interface ProductUnit {
  value: number;
  unit: Unit;
  pricePerUnit: number; // Price for this unit
}

export interface UnitOption {
  label: string;
  value: number;
  unit: Unit;
}

/**
 * Get available unit options for a product based on base unit
 */
export const getUnitOptions = (
  basePrice: number,
  baseUnit: Unit,
): UnitOption[] => {
  if (baseUnit === "kg") {
    return [
      { label: "1 kg", value: 1000, unit: "g" },
      { label: "500 g", value: 500, unit: "g" },
      { label: "250 g", value: 250, unit: "g" },
      { label: "100 g", value: 100, unit: "g" },
    ];
  }

  if (baseUnit === "liter") {
    return [
      { label: "1 L", value: 1, unit: "liter" },
      { label: "500 ml", value: 500, unit: "ml" },
      { label: "250 ml", value: 250, unit: "ml" },
    ];
  }

  return [
    { label: "1 piece", value: 1, unit: "piece" },
    { label: "2 pieces", value: 2, unit: "piece" },
    { label: "5 pieces", value: 5, unit: "piece" },
  ];
};

/**
 * Calculate price based on selected unit
 */
export const calculatePrice = (
  basePrice: number,
  baseUnit: Unit,
  selectedValue: number,
  selectedUnit: Unit,
  quantity: number,
): number => {
  let pricePerSelectedUnit = basePrice;

  // Convert base price to selected unit
  if (baseUnit === "kg" && selectedUnit === "g") {
    pricePerSelectedUnit = (basePrice / 1000) * selectedValue;
  } else if (baseUnit === "liter" && selectedUnit === "ml") {
    pricePerSelectedUnit = (basePrice / 1000) * selectedValue;
  } else if (selectedValue !== 1) {
    // For piece-based or direct unit conversions
    pricePerSelectedUnit =
      (basePrice / (baseUnit === "kg" ? 1000 : 1)) * selectedValue;
  }

  return pricePerSelectedUnit * quantity;
};

/**
 * Format unit display
 */
export const formatUnit = (value: number, unit: Unit): string => {
  switch (unit) {
    case "kg":
      return `${value} kg`;
    case "g":
      return value >= 1000 ? `${value / 1000} kg` : `${value} g`;
    case "liter":
      return `${value} L`;
    case "ml":
      return value >= 1000 ? `${value / 1000} L` : `${value} ml`;
    case "piece":
      return `${value} ${value === 1 ? "piece" : "pieces"}`;
    default:
      return `${value} ${unit}`;
  }
};

/**
 * Get freshness tag based on product category or metadata
 */
export const getFreshnessTag = (daysOld: number): string => {
  if (daysOld === 0) return "Fresh Today";
  if (daysOld === 1) return "Fresh Yesterday";
  if (daysOld <= 3) return "✓ Fresh";
  if (daysOld <= 7) return "Recently Added";
  return "In Stock";
};
