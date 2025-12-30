
import { GlobalInputs, PlanConfig, SimulationResult, MonthlyRecord } from '../types';

export const runSimulation = (
  global: GlobalInputs,
  plan: PlanConfig
): SimulationResult => {
  const { salesPerMonth, baseMarginPerUnit, baseStorageFee } = global;
  const { inventoryMonths, extraCostPerUnit } = plan;

  if (salesPerMonth <= 0 || inventoryMonths <= 0) {
    return { 
      totalGrossMargin: 0, 
      totalExtraCost: 0, 
      totalStorageCost: 0, 
      netProfit: 0, 
      monthlyData: [] 
    };
  }

  const simulationMonths = 12;
  const monthlyData: MonthlyRecord[] = [];
  let currentStock = 0;
  let totalStorageCost = 0;
  let totalGrossMargin = 0;
  let totalExtraCost = 0;
  let cumulativeProfit = 0;
  
  const ratio = baseStorageFee / 0.78;
  const replenishmentAmount = salesPerMonth * inventoryMonths;

  for (let m = 1; m <= simulationMonths; m++) {
    let restockAmount = 0;
    
    // Check replenishment: if current stock can't cover this month's sales
    if (currentStock < salesPerMonth) {
      restockAmount = replenishmentAmount;
      currentStock += restockAmount;
    }

    const openingStock = currentStock;
    const utilizationWeeks = (openingStock / salesPerMonth) * 4.33;
    
    // Dynamic Stepped Fee Rate Calculation
    let rate = baseStorageFee;
    if (utilizationWeeks >= 52) {
      rate += 1.88 * ratio;
    } else if (utilizationWeeks >= 44) {
      rate += 1.58 * ratio;
    } else if (utilizationWeeks >= 36) {
      rate += 1.16 * ratio;
    } else if (utilizationWeeks >= 28) {
      rate += 0.76 * ratio;
    } else if (utilizationWeeks >= 22) {
      rate += 0.44 * ratio;
    }

    // Calculations based on requirements:
    // Income = Sales * (Margin - Extra Cost)
    // Expenditure = Opening Stock * Rate
    const revenuePart = salesPerMonth * (baseMarginPerUnit - extraCostPerUnit);
    const expensePart = openingStock * rate;
    const monthlyProfit = revenuePart - expensePart;

    totalGrossMargin += salesPerMonth * baseMarginPerUnit;
    totalExtraCost += salesPerMonth * extraCostPerUnit;
    totalStorageCost += expensePart;
    cumulativeProfit += monthlyProfit;

    monthlyData.push({
      month: m,
      openingStock: Math.round(openingStock),
      restockAmount,
      utilizationWeeks: Number(utilizationWeeks.toFixed(2)),
      rate: Number(rate.toFixed(4)),
      monthlyRevenue: Number(revenuePart.toFixed(2)),
      monthlyExpense: Number(expensePart.toFixed(2)),
      monthlyProfit: Number(monthlyProfit.toFixed(2)),
      cumulativeProfit: Number(cumulativeProfit.toFixed(2)),
    });

    // Update stock for the next month
    currentStock -= salesPerMonth;
    if (currentStock < 0) currentStock = 0;
  }

  return {
    totalGrossMargin,
    totalExtraCost,
    totalStorageCost,
    netProfit: cumulativeProfit,
    monthlyData,
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val);
};
