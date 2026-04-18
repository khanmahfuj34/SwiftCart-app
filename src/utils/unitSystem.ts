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
  display: string;
  value: number;
  unit: Unit;
  price: number;
}

/**
 * Get available unit options for a product based on base unit
 */
export const getUnitOptions = (
  basePrice: number,
  baseUnit: Unit,
): UnitOption[] => {
  const price = basePrice || 0;

  if (baseUnit === "kg") {
    return [
      { label: "1 kg", display: "1 kg", value: 1000, unit: "g", price: price },
      {
        label: "500 g",
        display: "500 g",
        value: 500,
        unit: "g",
        price: price * 0.5,
      },
      {
        label: "250 g",
        display: "250 g",
        value: 250,
        unit: "g",
        price: price * 0.25,
      },
      {
        label: "100 g",
        display: "100 g",
        value: 100,
        unit: "g",
        price: price * 0.1,
      },
    ];
  }

  if (baseUnit === "liter") {
    return [
      { label: "1 L", display: "1 L", value: 1, unit: "liter", price: price },
      {
        label: "500 ml",
        display: "500 ml",
        value: 500,
        unit: "ml",
        price: price * 0.5,
      },
      {
        label: "250 ml",
        display: "250 ml",
        value: 250,
        unit: "ml",
        price: price * 0.25,
      },
    ];
  }

  return [
    {
      label: "1 piece",
      display: "1 pc",
      value: 1,
      unit: "piece",
      price: price,
    },
    {
      label: "2 pieces",
      display: "2 pcs",
      value: 2,
      unit: "piece",
      price: price * 2,
    },
    {
      label: "5 pieces",
      display: "5 pcs",
      value: 5,
      unit: "piece",
      price: price * 5,
    },
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
