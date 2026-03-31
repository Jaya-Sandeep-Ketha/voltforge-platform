/**
 * API Service Layer
 *
 * Mock API service layer that simulates backend data fetching for the VoltForge application.
 * This layer provides a consistent interface for data operations and simulates realistic
 * network latency to prepare for production backend integration.
 *
 * When a real backend is available, replace these mock implementations with actual
 * fetch/axios calls to the appropriate API endpoints.
 *
 * Services provided:
 * - Asset management (inventory, details, filtering)
 * - Site management (locations, facilities)
 * - Telemetry data (real-time metrics, historical data)
 * - Quality Control (QC runs, validation results)
 * - Incident management (alerts, issues, resolution)
 * - Workflow automation (templates, issue-based workflows)
 * - Platform health monitoring (performance, metrics, logs)
 *
 * @author VoltForge Team
 * @version 1.0.0
 */
import * as data from "@/data";

/**
 * Simulates network delay for API calls
 * @param {number} ms - Base delay in milliseconds (default: 300)
 * @returns {Promise<void} - Promise that resolves after delay
 */
const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200));

// ==================== ASSET MANAGEMENT SERVICE ====================
export const assetService = {
  /**
   * Retrieves all assets with optional filtering
   * @param {Object} filters - Filter criteria
   * @param {string} filters.siteId - Filter by site ID
   * @param {string} filters.health - Filter by health status
   * @param {string} filters.type - Filter by asset type
   * @param {string} filters.serviceStatus - Filter by service status
   * @param {string} filters.search - Search query for ID, type, or serial number
   * @returns {Promise<Array>} Array of filtered assets
   */
  async getAll(filters = {}) {
    await delay();
    let result = [...data.assets];
    if (filters.siteId)
      result = result.filter((a) => a.siteId === filters.siteId);
    if (filters.health)
      result = result.filter((a) => a.health === filters.health);
    if (filters.type) result = result.filter((a) => a.type === filters.type);
    if (filters.serviceStatus)
      result = result.filter((a) => a.serviceStatus === filters.serviceStatus);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.serialNumber.toLowerCase().includes(q),
      );
    }
    return result;
  },

  /**
   * Retrieves a specific asset by ID
   * @param {string} id - Asset ID to retrieve
   * @returns {Promise<Object|null>} Asset object or null if not found
   */
  async getById(id) {
    await delay(200);
    return data.getAssetById(id) || null;
  },
};

// ==================== SITE MANAGEMENT SERVICE ====================
export const siteService = {
  /**
   * Retrieves all sites/facilities
   * @returns {Promise<Array>} Array of all sites
   */
  async getAll() {
    await delay(150);
    return [...data.sites];
  },

  /**
   * Retrieves a specific site by ID
   * @param {string} id - Site ID to retrieve
   * @returns {Promise<Object|null>} Site object or null if not found
   */
  async getById(id) {
    await delay(100);
    return data.getSiteById(id) || null;
  },
};

// ==================== TELEMETRY SERVICE ====================
export const telemetryService = {
  /**
   * Retrieves multi-metric telemetry data for an asset
   * @param {string} assetId - Asset ID to get telemetry for
   * @param {number} hours - Number of hours of historical data (default: 24)
   * @returns {Promise<Array>} Array of telemetry data points
   */
  async getForAsset(assetId, hours = 24) {
    await delay(400);
    return data.generateMultiMetricTelemetry(assetId, hours);
  },

  /**
   * Retrieves time series data for a specific metric
   * @param {string} assetId - Asset ID to get telemetry for
   * @param {string} metric - Metric name to retrieve
   * @param {number} hours - Number of hours of historical data (default: 24)
   * @returns {Promise<Array>} Array of time series data points
   */
  async getSeries(assetId, metric, hours = 24) {
    await delay(300);
    return data.generateTelemetrySeries(assetId, metric, hours);
  },
};

// ==================== QUALITY CONTROL SERVICE ====================
export const qcService = {
  /**
   * Retrieves all QC runs
   * @returns {Promise<Array>} Array of QC run records
   */
  async getAll() {
    await delay(250);
    return [...data.qcRuns];
  },

  /**
   * Retrieves a specific QC run by ID
   * @param {string} id - QC run ID to retrieve
   * @returns {Promise<Object|null>} QC run object or null if not found
   */
  async getById(id) {
    await delay(150);
    return data.getQCRunById(id) || null;
  },

  /**
   * Retrieves QC runs for a specific asset
   * @param {string} assetId - Asset ID to get QC runs for
   * @returns {Promise<Array>} Array of QC runs for the asset
   */
  async getByAsset(assetId) {
    await delay(200);
    return data.getQCRunsByAsset(assetId);
  },
};

// ==================== INCIDENT MANAGEMENT SERVICE ====================
export const incidentService = {
  /**
   * Retrieves all incidents
   * @returns {Promise<Array>} Array of all incident records
   */
  async getAll() {
    await delay(200);
    return [...data.incidents];
  },

  /**
   * Retrieves only active (unresolved) incidents
   * @returns {Promise<Array>} Array of active incidents
   */
  async getActive() {
    await delay(150);
    return data.getActiveIncidents();
  },

  /**
   * Retrieves incidents for a specific asset
   * @param {string} assetId - Asset ID to get incidents for
   * @returns {Promise<Array>} Array of incidents for the asset
   */
  async getByAsset(assetId) {
    await delay(150);
    return data.getIncidentsByAsset(assetId);
  },
};

// ==================== ALERT SERVICE ====================
export const alertService = {
  /**
   * Retrieves recent alerts
   * @param {number} limit - Maximum number of alerts to return (default: 10)
   * @returns {Promise<Array>} Array of recent alerts
   */
  async getRecent(limit = 10) {
    await delay(100);
    return data.getRecentAlerts(limit);
  },

  /**
   * Retrieves only critical alerts
   * @returns {Promise<Array>} Array of critical alerts
   */
  async getCritical() {
    await delay(100);
    return data.getCriticalAlerts();
  },
};

// ==================== WORKFLOW SERVICE ====================
export const workflowService = {
  /**
   * Retrieves all workflow templates
   * @returns {Promise<Array>} Array of workflow templates
   */
  async getTemplates() {
    await delay(200);
    return [...data.workflowTemplates];
  },

  /**
   * Retrieves workflow template for a specific issue type
   * @param {string} issueType - Type of issue to get workflow for
   * @returns {Promise<Object|null>} Workflow template or null if not found
   */
  async getByIssue(issueType) {
    await delay(150);
    return data.getWorkflowByIssue(issueType) || null;
  },
};

// ==================== PLATFORM HEALTH SERVICE ====================
export const platformHealthService = {
  /**
   * Retrieves API latency metrics
   * @returns {Promise<Array>} Array of latency data points
   */
  async getLatency() {
    await delay(100);
    return data.generateApiLatencyData();
  },

  /**
   * Retrieves ingestion queue status
   * @returns {Promise<Array>} Array of queue status objects
   */
  async getQueues() {
    await delay(100);
    return [...data.ingestionQueues];
  },

  /**
   * Retrieves recent job execution status
   * @returns {Promise<Array>} Array of recent job records
   */
  async getJobs() {
    await delay(100);
    return [...data.recentJobs];
  },

  /**
   * Retrieves CI/CD build status
   * @returns {Promise<Array>} Array of build records
   */
  async getBuilds() {
    await delay(100);
    return [...data.cicdBuilds];
  },

  /**
   * Retrieves recent log entries
   * @returns {Promise<Array>} Array of log entries
   */
  async getLogs() {
    await delay(50);
    return [...data.logStream];
  },
};
