/**
 * Application Router Configuration
 * 
 * Defines the routing structure for the VoltForge application using React Router.
 * This component sets up all the routes and navigation paths for the energy
 * management platform, organizing different pages and features.
 * 
 * @author VoltForge Team
 * @version 1.0.0
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { AssetInventory } from '@/pages/AssetInventory';
import { AssetDetail } from '@/pages/AssetDetail';
import { Viewer3D } from '@/pages/Viewer3D';
import { QCValidation } from '@/pages/QCValidation';
import { Telemetry } from '@/pages/Telemetry';
import { Workflows } from '@/pages/Workflows';
import { PlatformHealth } from '@/pages/PlatformHealth';

/**
 * Router configuration object
 * 
 * Creates a browser router with nested routes under the main AppLayout.
 * All pages share the same layout structure with navigation and common UI elements.
 * 
 * Routes:
 * - /: Main dashboard with overview of all systems
 * - /assets: Asset inventory listing all energy assets
 * - /assets/:assetId: Detailed view of a specific asset
 * - /viewer: 3D visualization interface for assets
 * - /viewer/:assetId: 3D view of a specific asset
 * - /qc: Quality control and validation tools
 * - /telemetry: Real-time telemetry data monitoring
 * - /workflows: Workflow management and automation
 * - /health: Platform health and system status
 */
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/assets', element: <AssetInventory /> },
      { path: '/assets/:assetId', element: <AssetDetail /> },
      { path: '/viewer', element: <Viewer3D /> },
      { path: '/viewer/:assetId', element: <Viewer3D /> },
      { path: '/qc', element: <QCValidation /> },
      { path: '/telemetry', element: <Telemetry /> },
      { path: '/workflows', element: <Workflows /> },
      { path: '/health', element: <PlatformHealth /> },
    ],
  },
], {
  // Set basename for GitHub Pages subpath deployment
  basename: import.meta.env.BASE_URL,
});

/**
 * AppRouter Component
 * 
 * Provides the router context to the entire application using RouterProvider.
 * This component is exported and used in main.jsx as the root component.
 * 
 * @returns {JSX.Element} Router provider with configured routes
 */
export function AppRouter() {
  return <RouterProvider router={router} />;
}
