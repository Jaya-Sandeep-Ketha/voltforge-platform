/**
 * Global Application State Management
 *
 * Central state management store using Zustand for the VoltForge application.
 * This store manages global UI state, user preferences, and application-wide
 * data that needs to be shared across components.
 *
 * Features managed:
 * - Sidebar navigation state
 * - Global filters for sites and assets
 * - 3D viewer configuration and state
 * - Notification system
 *
 * @author VoltForge Team
 * @version 1.0.0
 */

import { create } from "zustand";

/**
 * Global application store with Zustand
 *
 * Provides reactive state management for the entire application.
 * All state is managed centrally and can be accessed from any component.
 */
export const useAppStore = create((set) => ({
  // ==================== SIDEBAR STATE ====================
  /** Controls whether the sidebar navigation is collapsed or expanded */
  sidebarCollapsed: false,
  /** Toggles the sidebar collapsed state */
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // ==================== GLOBAL FILTERS ====================
  /** Currently selected site for filtering data across the app */
  selectedSite: null,
  /** Sets the selected site filter */
  setSelectedSite: (siteId) => set({ selectedSite: siteId }),

  /** Currently selected asset for detailed views and filtering */
  selectedAsset: null,
  /** Sets the selected asset filter */
  setSelectedAsset: (assetId) => set({ selectedAsset: assetId }),

  // ==================== 3D VIEWER STATE ====================
  /** Currently selected component in the 3D viewer */
  selectedComponent: null,
  /** Sets the selected component in 3D view */
  setSelectedComponent: (comp) => set({ selectedComponent: comp }),

  /** Controls whether the 3D model is in exploded view mode */
  explodedView: false,
  /** Toggles the exploded view state for 3D models */
  toggleExplodedView: () => set((s) => ({ explodedView: !s.explodedView })),

  /** Currently isolated part in 3D view (null if none isolated) */
  isolatedPart: null,
  /** Sets or toggles an isolated part in 3D view */
  setIsolatedPart: (partId) =>
    set((s) => ({ isolatedPart: s.isolatedPart === partId ? null : partId })),
  /** Clears the isolated part state */
  clearIsolatedPart: () => set({ isolatedPart: null }),

  /** Active layer visibility in 3D viewer */
  activeLayers: {
    electrical: true, // Electrical system components
    thermal: true, // Thermal monitoring systems
    structural: true, // Structural components
    serviceable: true, // Service/maintenance accessible parts
  },
  /** Toggles visibility of a specific layer in 3D view */
  toggleLayer: (layer) =>
    set((s) => ({
      activeLayers: { ...s.activeLayers, [layer]: !s.activeLayers[layer] },
    })),

  // ==================== NOTIFICATION SYSTEM ====================
  /** Array of active notifications (max 20, newest first) */
  notifications: [],
  /** Adds a new notification to the system */
  addNotification: (notification) =>
    set((s) => ({
      notifications: [
        { id: Date.now(), ...notification },
        ...s.notifications,
      ].slice(0, 20), // Keep only the 20 most recent notifications
    })),
  /** Removes a specific notification by ID */
  dismissNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),
}));
