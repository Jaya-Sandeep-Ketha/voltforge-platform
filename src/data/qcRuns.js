/**
 * Quality Control Validation Data
 *
 * Generates and manages quality control validation data for VoltForge energy assets.
 * This module creates realistic QC test results with multiple validation categories,
 * scoring metrics, and corrective action recommendations.
 *
 * QC validation categories:
 * - Voltage Consistency: Cell-level voltage balance checks
 * - Thermal Spread: Temperature distribution validation
 * - Communication Bus: Network integrity testing
 * - Firmware Compatibility: Software version validation
 * - Fan Response: Cooling system performance tests
 *
 * @author VoltForge Team
 * @version 1.0.0
 */

/**
 * Quality control validation categories with descriptions
 * Each category represents a specific aspect of asset health validation
 */
const categories = [
  {
    key: "voltage_consistency",
    label: "Voltage Consistency",
    description: "Cell-level voltage delta across module strings",
  },
  {
    key: "thermal_spread",
    label: "Thermal Spread",
    description: "Temperature differential across thermal zones",
  },
  {
    key: "comm_bus",
    label: "Communication Bus",
    description: "CAN/RS-485 bus integrity and packet loss rate",
  },
  {
    key: "firmware_compat",
    label: "Firmware Compatibility",
    description: "Firmware version matrix validation against fleet baseline",
  },
  {
    key: "fan_response",
    label: "Fan Response",
    description: "Cooling fan spin-up latency and RPM consistency",
  },
];

/**
 * Seeded random number generator for consistent QC data generation
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

/**
 * Generates realistic QC validation runs with detailed results
 * @param {number} count - Number of QC runs to generate (default: 25)
 * @returns {Array} Array of QC run objects with test results and logs
 */
function generateQCRuns(count = 25) {
  const rand = seededRandom(777);
  const runs = [];
  // Generate asset IDs for QC run assignment
  const assetIds = Array.from(
    { length: 30 },
    (_, i) => `VF-${String(i + 1).padStart(5, "0")}`,
  );

  for (let i = 0; i < count; i++) {
    const assetId = assetIds[Math.floor(rand() * assetIds.length)];
    // Generate run date within the last 4 months
    const runDate = new Date(
      2025,
      8 + Math.floor(rand() * 4),
      Math.floor(rand() * 28) + 1,
    );

    // Generate results for each QC category
    const results = categories.map((cat) => {
      const passed = rand() > 0.2; // 80% pass rate
      const score = passed ? 85 + rand() * 15 : 30 + rand() * 40;
      return {
        category: cat.key,
        label: cat.label,
        description: cat.description,
        passed,
        score: parseFloat(score.toFixed(1)),
        baseline: parseFloat((88 + rand() * 10).toFixed(1)),
        details: passed
          ? `All checks within tolerance. Score: ${score.toFixed(1)}%`
          : `Deviation detected. Measured delta exceeds threshold by ${(rand() * 8 + 2).toFixed(1)}%. Recommend re-calibration.`,
      };
    });

    // Overall pass status requires all categories to pass
    const overallPass = results.every((r) => r.passed);

    runs.push({
      id: `QC-${String(1000 + i)}`, // Unique QC run identifier
      assetId, // Tested asset
      runDate: runDate.toISOString(), // Test execution timestamp
      status: overallPass ? "passed" : "failed", // Overall result status
      results, // Detailed category results
      logs: generateLogs(rand, results), // Execution log entries
      correctiveActions: overallPass
        ? [] // No actions needed for passed tests
        : results
            .filter((r) => !r.passed)
            .map((r) => ({
              category: r.label,
              action: getCorrectiveAction(r.category),
              priority: rand() > 0.5 ? "high" : "medium",
            })),
    });
  }

  return runs;
}

/**
 * Generates realistic execution logs for QC validation runs
 * @param {Function} rand - Random number generator function
 * @param {Array} results - QC test results to generate logs for
 * @returns {Array} Array of log entries with timestamps and messages
 */
function generateLogs(rand, results) {
  const logs = [
    {
      ts: "00:00.000",
      level: "INFO",
      message: "QC validation sequence initiated",
    },
    {
      ts: "00:00.120",
      level: "INFO",
      message: "Connecting to asset telemetry bus...",
    },
    {
      ts: "00:01.450",
      level: "INFO",
      message: "Telemetry handshake complete. Sampling rate: 100 Hz",
    },
  ];

  // Generate logs for each test category
  results.forEach((r, idx) => {
    const sec = 2 + idx * 3;
    logs.push({
      ts: `00:${String(sec).padStart(2, "0")}.000`,
      level: "INFO",
      message: `Running check: ${r.label}...`,
    });
    if (r.passed) {
      logs.push({
        ts: `00:${String(sec + 2).padStart(2, "0")}.800`,
        level: "PASS",
        message: `${r.label}: PASSED (${r.score}%)`,
      });
    } else {
      logs.push({
        ts: `00:${String(sec + 1).padStart(2, "0")}.200`,
        level: "WARN",
        message: `${r.label}: threshold exceeded`,
      });
      logs.push({
        ts: `00:${String(sec + 2).padStart(2, "0")}.800`,
        level: "FAIL",
        message: `${r.label}: FAILED (${r.score}%)`,
      });
    }
  });

  logs.push({
    ts: "00:18.000",
    level: "INFO",
    message: "QC validation sequence complete",
  });
  return logs;
}

/**
 * Provides corrective action recommendations for failed QC tests
 * @param {string} category - QC category that failed
 * @returns {string} Recommended corrective action
 */
function getCorrectiveAction(category) {
  const actions = {
    voltage_consistency:
      "Re-balance cell strings. If delta persists >5mV after 3 cycles, replace affected module.",
    thermal_spread:
      "Inspect thermal paste application. Verify coolant flow rate. Clean heat exchanger fins.",
    comm_bus:
      "Check CAN bus termination resistors. Inspect wiring harness for chafing. Run loopback test.",
    firmware_compat:
      "Flash latest firmware from approved release channel. Verify boot sequence post-update.",
    fan_response:
      "Inspect fan bearings and blade clearance. Test PWM signal from controller. Replace if RPM <1200.",
  };
  return actions[category] || "Perform standard diagnostic procedure.";
}

// Export QC categories for reference
export const qcCategories = categories;

// Generate the main QC runs dataset
export const qcRuns = generateQCRuns(25);

/**
 * Retrieves a specific QC run by its unique identifier
 * @param {string} id - QC run ID to search for
 * @returns {Object|undefined} QC run object or undefined if not found
 */
export const getQCRunById = (id) => qcRuns.find((r) => r.id === id);

/**
 * Retrieves all QC runs for a specific asset
 * @param {string} assetId - Asset ID to filter QC runs by
 * @returns {Array} Array of QC runs for the specified asset
 */
export const getQCRunsByAsset = (assetId) =>
  qcRuns.filter((r) => r.assetId === assetId);
