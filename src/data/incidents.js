/**
 * Incident Management Data
 *
 * Generates and manages incident data for the VoltForge energy management system.
 * This module creates realistic incident reports with proper severity levels,
 * status tracking, and assignment information for maintenance and operations teams.
 *
 * Incident categories:
 * - Thermal Issues: Temperature-related safety events
 * - Electrical Problems: Voltage, current, and power anomalies
 * - Communication Failures: Network and connectivity issues
 * - Mechanical Failures: Physical component breakdowns
 * - System Errors: Software and firmware problems
 * - Safety Events: Ground faults and protection triggers
 */

/**
 * Seeded random number generator for consistent incident data generation
 * @param {number} seed - Seed value for reproducible random sequences
 * @returns {Function} Random number generator function
 */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Initialize random generator for consistent incident data
const rand = seededRandom(555);

/**
 * Utility function to select random element from array
 * @param {Array} arr - Array to select from
 * @returns {*} Randomly selected element
 */
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

/**
 * Realistic incident types for energy storage systems
 * These represent common failure modes and operational issues
 */
const incidentTypes = [
  "Thermal Runaway Warning",
  "Cell Voltage Imbalance",
  "Communication Bus Timeout",
  "Fan Failure Detected",
  "Firmware Mismatch",
  "Overcurrent Protection Triggered",
  "Ground Fault Detected",
  "Coolant Flow Rate Low",
  "Inverter Sync Loss",
  "Battery Module Offline",
];

// Severity levels for incident prioritization
const severities = ["critical", "high", "medium", "low"];

// Incident status tracking for workflow management
const statuses = [
  "active",
  "acknowledged",
  "investigating",
  "resolved",
  "closed",
];

/**
 * Generates realistic incident reports with proper metadata
 * @param {number} count - Number of incidents to generate (default: 40)
 * @returns {Array} Array of incident objects
 */
function generateIncidents(count = 40) {
  const incidents = [];
  // Generate asset IDs for incident assignment
  const assetIds = Array.from(
    { length: 60 },
    (_, i) => `VF-${String(i + 1).padStart(5, "0")}`,
  );

  for (let i = 0; i < count; i++) {
    // Generate creation timestamp within the last 6 months
    const created = new Date(
      2025,
      6 + Math.floor(rand() * 6),
      Math.floor(rand() * 28) + 1,
      Math.floor(rand() * 24),
      Math.floor(rand() * 60),
    );
    const severity = pick(severities);
    const status = pick(statuses);

    incidents.push({
      id: `INC-${String(2000 + i)}`, // Unique incident identifier
      assetId: pick(assetIds), // Associated asset
      type: pick(incidentTypes), // Incident category
      severity, // Priority level
      status, // Current workflow status
      createdAt: created.toISOString(), // Incident creation time
      updatedAt: new Date(
        created.getTime() + rand() * 86400000 * 3,
      ).toISOString(), // Last update time
      description: `Automated detection: ${pick(incidentTypes).toLowerCase()} event flagged by onboard diagnostics. Severity assessment: ${severity}.`,
      assignee: pick([
        "J. Martinez",
        "R. Chen",
        "A. Kumar",
        "S. Okafor",
        "M. Petrov",
        null,
      ]), // Assigned technician
    });
  }

  // Sort by creation date (newest first)
  return incidents.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
}

// Generate the main incidents dataset
export const incidents = generateIncidents(40);

/**
 * Retrieves incidents for a specific asset
 * @param {string} assetId - Asset ID to filter incidents by
 * @returns {Array} Array of incidents for the specified asset
 */
export const getIncidentsByAsset = (assetId) =>
  incidents.filter((i) => i.assetId === assetId);

/**
 * Retrieves only active incidents requiring attention
 * Includes incidents that are active, acknowledged, or under investigation
 * @returns {Array} Array of active incidents
 */
export const getActiveIncidents = () =>
  incidents.filter((i) =>
    ["active", "acknowledged", "investigating"].includes(i.status),
  );
