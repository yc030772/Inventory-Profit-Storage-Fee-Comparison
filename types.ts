
export interface GlobalInputs {
  salesPerMonth: number;
  baseMarginPerUnit: number;
  baseStorageFee: number;
}

export interface PlanConfig {
  inventoryMonths: number;
  extraCostPerUnit: number;
}

export interface MonthlyRecord {
  month: number;
  openingStock: number;
  restockAmount: number;
  utilizationWeeks: number;
  rate: number;
  monthlyRevenue: number;
  monthlyExpense: number;
  monthlyProfit: number;
  cumulativeProfit: number;
}

export interface SimulationResult {
  totalGrossMargin: number; // sum of (sales * margin)
  totalExtraCost: number;   // sum of (sales * extraCost)
  totalStorageCost: number; // sum of monthly expenses
  netProfit: number;
  monthlyData: MonthlyRecord[];
}
