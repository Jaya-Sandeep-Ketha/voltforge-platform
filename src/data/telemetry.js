/**
 * Telemetry Data Generation
 *
 * Generates realistic time-series telemetry data for VoltForge energy assets.
 * This module creates simulated sensor readings with proper noise, trends,
 * and occasional anomalies to represent real-world monitoring data.
 *
 * Metrics supported:
 * - Temperature: Thermal monitoring for safety and performance
 * - Voltage: Electrical system health monitoring
 * - Current: Power flow and load monitoring
 * - Fault Count: System reliability tracking
 * - Power Output: Energy generation/consumption tracking
 * - SOC (State of Charge): Battery charge level monitoring
 * - Humidity: Environmental condition monitoring
 *
 * @author VoltForge Team
 * @version 1.0.0
 */

/**
 * Seeded random number generator for reproducible telemetry data
 * @param {number} seed - Seed value for consistent random sequences
 * @returns {Function} Random number generator function
 */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Generates time-series telemetry data for a specific metric
 * Creates realistic data with base values, noise, trends, and occasional anomalies
 *
 * @param {string} assetId - Unique asset identifier for data consistency
 * @param {string} metric - Type of metric to generate (temperature, voltage, current, etc.)
 * @param {number} hours - Number of hours of historical data to generate (default: 24)
 * @returns {Object} Telemetry data object with metadata and data points
 */
export function generateTelemetrySeries(assetId, metric, hours = 24) {
  // Create seed based on asset ID and metric for consistent data
  const seed =
    assetId.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + metric.length;
  const rand = seededRandom(seed);
  const now = Date.now();
  const points = [];

  // Metric configuration parameters for realistic data generation
  const configs = {
    temperature: { base: 28, variance: 12, unit: "°C", anomalyThreshold: 42 }, // Operating temp: 16-40°C, anomaly >42°C
    voltage: { base: 395, variance: 20, unit: "V", anomalyThreshold: 415 }, // System voltage: 375-415V, anomaly >415V
    current: { base: 120, variance: 40, unit: "A", anomalyThreshold: 165 }, // Current draw: 80-160A, anomaly >165A
    faultCount: { base: 0, variance: 3, unit: "events", anomalyThreshold: 4 }, // Fault events: 0-3, anomaly >4
    powerOutput: { base: 250, variance: 80, unit: "kW", anomalyThreshold: 340 }, // Power: 170-330kW, anomaly >340kW
    soc: { base: 65, variance: 30, unit: "%", anomalyThreshold: 95 }, // State of charge: 35-95%, anomaly >95%
    humidity: { base: 40, variance: 15, unit: "%", anomalyThreshold: 70 }, // Humidity: 25-55%, anomaly >70%
  };

  const cfg = configs[metric] || configs.temperature;
  // Generate 200 data points evenly distributed over the time period
  const interval = (hours * 3600 * 1000) / 200;

  for (let i = 0; i < 200; i++) {
    const ts = now - (200 - i) * interval;

    // Add realistic noise and sinusoidal trend patterns
    const noise = (rand() - 0.5) * cfg.variance;
    const trend = Math.sin((i / 200) * Math.PI * 2) * (cfg.variance * 0.3);
    let value = cfg.base + noise + trend;

    // Inject occasional anomaly spikes (3% probability)
    if (rand() < 0.03) {
      value = cfg.anomalyThreshold + rand() * cfg.variance * 0.5;
    }

    // Ensure non-negative values and proper precision
    value = Math.max(0, parseFloat(value.toFixed(2)));

    points.push({
      timestamp: new Date(ts).toISOString(),
      value,
      isAnomaly: value >= cfg.anomalyThreshold,
    });
  }

  return { assetId, metric, unit: cfg.unit, points };
}

/**
 * Generates multi-metric telemetry data for comprehensive asset monitoring
 * Returns a collection of all key metrics for a single asset
 *
 * @param {string} assetId - Unique asset identifier
 * @param {number} hours - Number of hours of historical data (default: 24)
 * @returns {Object} Object containing telemetry series for all metrics
 */
export function generateMultiMetricTelemetry(assetId, hours = 24) {
  return {
    temperature: generateTelemetrySeries(assetId, "temperature", hours),
    voltage: generateTelemetrySeries(assetId, "voltage", hours),
    current: generateTelemetrySeries(assetId, "current", hours),
    faultCount: generateTelemetrySeries(assetId, "faultCount", hours),
    powerOutput: generateTelemetrySeries(assetId, "powerOutput", hours),
    soc: generateTelemetrySeries(assetId, "soc", hours),
  };
}
