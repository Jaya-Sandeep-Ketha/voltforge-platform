/**
 * Asset Data Management
 *
 * Generates and manages asset data for the VoltForge energy management platform.
 * This module creates realistic energy storage and charging infrastructure assets
 * with proper metadata, health status, and component information.
 *
 * Asset types supported:
 * - Megapack 2XL/2: Large-scale battery storage systems
 * - Powerwall 3: Residential battery storage
 * - Supercharger V3/V4: Electric vehicle charging stations
 * - Grid Inverter GX-9: Power conversion equipment
 * - Thermal Controller TC-4: Thermal management systems
 */

// Asset type definitions for different energy infrastructure equipment
const assetTypes = [
  "Megapack 2XL",
  "Megapack 2",
  "Powerwall 3",
  "Supercharger V4",
  "Supercharger V3",
  "Grid Inverter GX-9",
  "Thermal Controller TC-4",
];

// Firmware version strings for realistic software management
const firmwareVersions = [
  "4.8.1",
  "4.7.3",
  "4.6.0",
  "5.0.0-rc2",
  "4.9.2",
  "3.12.8",
];

// Health status indicators for asset monitoring
const healthStates = [
  "healthy",
  "warning",
  "critical",
  "offline",
  "maintenance",
];

// Service status indicators for operational state tracking
const serviceStatuses = [
  "in-service",
  "pending-repair",
  "under-maintenance",
  "decommissioned",
  "newly-deployed",
];

/**
 * Seeded random number generator for consistent test data generation
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

// Initialize random generator with fixed seed for consistent data
const rand = seededRandom(42);

/**
 * Utility function to select random element from array
 * @param {Array} arr - Array to select from
 * @returns {*} Randomly selected element
 */
function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}

/**
 * Generates a collection of realistic energy assets
 * @param {number} count - Number of assets to generate (default: 120)
 * @returns {Array} Array of asset objects with metadata and components
 */
function generateAssets(count = 120) {
  // Site identifiers where assets are deployed
  const siteIds = [
    "site-001",
    "site-002",
    "site-003",
    "site-004",
    "site-005",
    "site-006",
  ];
  const assets = [];

  for (let i = 1; i <= count; i++) {
    const id = `VF-${String(i).padStart(5, "0")}`; // Unique asset identifier
    const type = pick(assetTypes); // Asset type
    const siteId = pick(siteIds); // Deployment site
    const health = pick(healthStates); // Current health status
    const uptime = (90 + rand() * 10).toFixed(2); // Uptime percentage (90-100%)
    const fw = pick(firmwareVersions); // Firmware version
    const status = pick(serviceStatuses); // Service status
    const installDate = new Date(
      2022,
      Math.floor(rand() * 36),
      Math.floor(rand() * 28) + 1,
    )
      .toISOString()
      .split("T")[0]; // Installation date (2022-2025)
    const lastService = new Date(
      2025,
      Math.floor(rand() * 12),
      Math.floor(rand() * 28) + 1,
    )
      .toISOString()
      .split("T")[0]; // Last service date (2025)
    const cycleCount = Math.floor(rand() * 4000) + 200; // Charge/discharge cycles (200-4200)
    const temperature = (18 + rand() * 25).toFixed(1); // Operating temperature (18-43°C)
    const voltage = (380 + rand() * 40).toFixed(1); // Operating voltage (380-420V)

    assets.push({
      id, // Asset identifier
      type, // Asset type/model
      siteId, // Deployment location
      health, // Health status
      uptime: parseFloat(uptime), // Uptime percentage
      firmware: fw, // Current firmware version
      serviceStatus: status, // Operational status
      installDate, // Installation date
      lastServiceDate: lastService, // Last maintenance date
      cycleCount, // Total charge/discharge cycles
      temperature: parseFloat(temperature), // Current temperature
      voltage: parseFloat(voltage), // Current voltage
      serialNumber: `SN-${Math.floor(rand() * 900000 + 100000)}`, // Unique serial number
      components: generateComponents(type), // Component health data
    });
  }
  return assets;
}

/**
 * Generates component health data for a specific asset type
 * Components represent major subsystems within each asset with individual health monitoring
 * @param {string} assetType - Type of asset to generate components for
 * @returns {Array} Array of component objects with health and temperature data
 */
function generateComponents(assetType) {
  // Base components common to most energy assets
  const baseComponents = [
    {
      name: "Battery Module A",
      health: pick(healthStates),
      temp: (20 + rand() * 15).toFixed(1),
    },
    {
      name: "Battery Module B",
      health: pick(healthStates),
      temp: (20 + rand() * 15).toFixed(1),
    },
    {
      name: "Inverter Board",
      health: pick(healthStates),
      temp: (25 + rand() * 20).toFixed(1),
    },
    {
      name: "Thermal Management Unit",
      health: pick(healthStates),
      temp: (22 + rand() * 10).toFixed(1),
    },
    {
      name: "BMS Controller",
      health: pick(healthStates),
      temp: (20 + rand() * 8).toFixed(1),
    },
    {
      name: "DC-DC Converter",
      health: pick(healthStates),
      temp: (30 + rand() * 15).toFixed(1),
    },
    {
      name: "Cooling Fan Assembly",
      health: pick(healthStates),
      temp: (18 + rand() * 5).toFixed(1),
    },
    {
      name: "Communication Gateway",
      health: pick(healthStates),
      temp: (22 + rand() * 6).toFixed(1),
    },
  ];

  // Add Supercharger-specific components for charging stations
  if (assetType.includes("Supercharger")) {
    baseComponents.push(
      {
        name: "Charging Cable Assembly",
        health: pick(healthStates),
        temp: (25 + rand() * 20).toFixed(1),
      },
      {
        name: "Power Electronics Module",
        health: pick(healthStates),
        temp: (30 + rand() * 25).toFixed(1),
      },
    );
  }

  return baseComponents;
}

// Generate the main assets dataset
export const assets = generateAssets(120);

/**
 * Retrieves a specific asset by its unique identifier
 * @param {string} id - Asset ID to search for
 * @returns {Object|undefined} Asset object or undefined if not found
 */
export const getAssetById = (id) => assets.find((a) => a.id === id);

/**
 * Retrieves all assets deployed at a specific site
 * @param {string} siteId - Site identifier to filter by
 * @returns {Array} Array of assets at the specified site
 */
export const getAssetsBySite = (siteId) =>
  assets.filter((a) => a.siteId === siteId);
