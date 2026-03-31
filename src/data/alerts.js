/**
 * Alert Data Management
 *
 * Generates and manages alert data for the VoltForge energy management system.
 * This module creates realistic alert messages with proper timestamps, severity levels,
 * and acknowledgment status for testing and demonstration purposes.
 *
 * Alert types include:
 * - Battery cell voltage issues
 * - Thermal threshold violations
 * - Communication failures
 * - Mechanical component failures
 * - Firmware issues
 * - Power quality problems
 */

/**
 * Seeded random number generator for consistent test data
 * @param {number} seed - Seed value for random number generation
 * @returns {Function} Random number generator function
 */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Initialize seeded random generator for consistent data
const rand = seededRandom(999);

/**
 * Utility function to pick random element from array
 * @param {Array} arr - Array to pick from
 * @returns {*} Random element from array
 */
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

/**
 * Realistic alert messages for energy storage systems
 * These messages cover common failure modes and operational issues
 * in battery storage and charging infrastructure
 */
const alertMessages = [
  "Cell voltage delta >15mV detected on string B3",
  "Thermal zone 4 exceeding 45°C threshold",
  "CAN bus packet loss rate >2% sustained 5 min",
  "Fan RPM below minimum threshold (800 RPM)",
  "Firmware v4.6.0 deprecated — upgrade required",
  "Ground fault impedance below 500kΩ",
  "Coolant pressure drop detected in loop 2",
  "Inverter power factor deviation >0.03",
  "Battery SOC estimation drift >5%",
  "DC contactor weld-check failed on cycle 3247",
  "Ambient humidity sensor offline",
  "Grid frequency deviation alert — 59.8 Hz",
];

/**
 * Generates a collection of realistic alerts
 * @param {number} count - Number of alerts to generate (default: 50)
 * @returns {Array} Array of alert objects
 */
function generateAlerts(count = 50) {
  const alerts = [];
  // Generate asset IDs for the alert assignment
  const assetIds = Array.from(
    { length: 40 },
    (_, i) => `VF-${String(i + 1).padStart(5, "0")}`,
  );

  for (let i = 0; i < count; i++) {
    // Generate timestamp within the last 7 days
    const ts = new Date(Date.now() - rand() * 86400000 * 7);
    alerts.push({
      id: `ALT-${String(3000 + i)}`, // Unique alert identifier
      assetId: pick(assetIds), // Associated asset
      message: pick(alertMessages), // Alert description
      severity: pick(["critical", "warning", "info"]), // Alert priority
      timestamp: ts.toISOString(), // ISO timestamp
      acknowledged: rand() > 0.4, // 60% chance of being unacknowledged
    });
  }

  // Sort by timestamp (newest first)
  return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Generate the main alerts dataset
export const alerts = generateAlerts(50);

/**
 * Retrieves the most recent alerts
 * @param {number} limit - Maximum number of alerts to return (default: 10)
 * @returns {Array} Array of recent alerts
 */
export const getRecentAlerts = (limit = 10) => alerts.slice(0, limit);

/**
 * Retrieves only critical, unacknowledged alerts
 * These are the highest priority alerts requiring immediate attention
 * @returns {Array} Array of critical alerts
 */
export const getCriticalAlerts = () =>
  alerts.filter((a) => a.severity === "critical" && !a.acknowledged);
