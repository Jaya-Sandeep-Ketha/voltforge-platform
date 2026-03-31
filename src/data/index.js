/**
 * Data Module Exports
 *
 * Central export point for all data management modules in the VoltForge platform.
 * This file provides a unified interface for accessing all data generation,
 * management, and utility functions across the application.
 *
 * Data modules included:
 * - Sites: Facility and location management
 * - Assets: Energy infrastructure inventory
 * - Telemetry: Real-time sensor data generation
 * - QC Runs: Quality control validation data
 * - Incidents: Issue tracking and management
 * - Alerts: System notifications and warnings
 * - Workflows: Maintenance procedure templates
 * - Platform Health: System monitoring metrics
 *
 * @author VoltForge Team
 * @version 1.0.0
 */

// ==================== SITE MANAGEMENT ====================
export { sites, getSiteById } from "./sites";

// ==================== ASSET MANAGEMENT ====================
export { assets, getAssetById, getAssetsBySite } from "./assets";

// ==================== TELEMETRY DATA ====================
export {
  generateTelemetrySeries,
  generateMultiMetricTelemetry,
} from "./telemetry";

// ==================== QUALITY CONTROL ====================
export { qcCategories, qcRuns, getQCRunById, getQCRunsByAsset } from "./qcRuns";

// ==================== INCIDENT MANAGEMENT ====================
export {
  incidents,
  getIncidentsByAsset,
  getActiveIncidents,
} from "./incidents";

// ==================== ALERT SYSTEM ====================
export { alerts, getRecentAlerts, getCriticalAlerts } from "./alerts";

// ==================== WORKFLOW MANAGEMENT ====================
export {
  issueTypes,
  componentFamilies,
  severityLevels,
  workflowTemplates,
  getWorkflowByIssue,
} from "./workflows";

// ==================== PLATFORM HEALTH MONITORING ====================
export {
  generateApiLatencyData,
  ingestionQueues,
  recentJobs,
  cicdBuilds,
  logStream,
} from "./platformHealth";
