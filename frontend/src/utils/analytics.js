/**
 * Analytics Utility
 * Handles KPI calculations and Data Integrity checks.
 */

// 1. Water Usage Efficiency (WUE)
export const calculateWUE = (dailyNeed, waterTable) => {
  if (!waterTable || waterTable <= 0) return "0.00";
  // KPI: Percentage of current supply needed for today's growth
  return ((dailyNeed / waterTable) * 100).toFixed(2);
};

// 2. Data Health Guardrail (Auditing data quality)
export const checkDataHealth = (temp, humidity) => {
  const issues = [];
  if (temp > 50 || temp < 5) issues.push("Temp Outlier");
  if (humidity <= 0 || humidity > 100) issues.push("Invalid Humidity");
  
  return {
    isHealthy: issues.length === 0,
    message: issues.join(", ")
  };
};