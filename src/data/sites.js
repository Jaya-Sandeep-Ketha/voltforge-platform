/**
 * Site Data Management
 *
 * Defines site locations and facility information for the VoltForge energy management platform.
 * This module contains metadata for deployment sites including geographic coordinates,
 * operational status, asset counts, and storage capacity information.
 *
 * Site types represented:
 * - Energy Parks: Large-scale battery storage installations
 * - Megapack Depots: Tesla Megapack deployment facilities
 * - Supercharger Hubs: Electric vehicle charging stations
 * - Grid Stations: Grid-connected energy storage facilities
 * - Storage Facilities: Dedicated energy storage sites
 * - Energy Annexes: Supplementary energy installations
 *
 * @author VoltForge Team
 * @version 1.0.0
 */

/**
 * Collection of energy facility sites across different regions
 * Each site represents a physical location where VoltForge assets are deployed
 */
export const sites = [
  {
    id: "site-001",
    name: "Mojave Energy Park",
    region: "US-West",
    lat: 35.0523,
    lng: -118.1725,
    status: "operational",
    assetCount: 48,
    capacity: "250 MWh",
  },
  {
    id: "site-002",
    name: "Lathrop Megapack Depot",
    region: "US-West",
    lat: 37.8227,
    lng: -121.2766,
    status: "operational",
    assetCount: 72,
    capacity: "480 MWh",
  },
  {
    id: "site-003",
    name: "Katy Supercharger Hub",
    region: "US-South",
    lat: 29.7858,
    lng: -95.8585,
    status: "operational",
    assetCount: 36,
    capacity: "120 MWh",
  },
  {
    id: "site-004",
    name: "Reno Grid Station Alpha",
    region: "US-West",
    lat: 39.5296,
    lng: -119.8138,
    status: "degraded",
    assetCount: 24,
    capacity: "160 MWh",
  },
  {
    id: "site-005",
    name: "Buffalo Ridge Storage",
    region: "US-East",
    lat: 42.8864,
    lng: -78.8784,
    status: "operational",
    assetCount: 56,
    capacity: "340 MWh",
  },
  {
    id: "site-006",
    name: "Giga Austin Energy Annex",
    region: "US-South",
    lat: 30.2235,
    lng: -97.6195,
    status: "maintenance",
    assetCount: 18,
    capacity: "90 MWh",
  },
];

/**
 * Retrieves a specific site by its unique identifier
 * @param {string} id - Site ID to search for
 * @returns {Object|undefined} Site object or undefined if not found
 */
export const getSiteById = (id) => sites.find((s) => s.id === id);
