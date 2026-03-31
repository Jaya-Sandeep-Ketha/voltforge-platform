/**
 * Sidebar Navigation Component
 * 
 * Main navigation sidebar for the VoltForge application providing access to all
 * major sections. Features collapsible design, animated transitions, and responsive
 * navigation with active state indicators.
 * 
 * Sidebar features:
 * - Collapsible design with smooth width animations
 * - Navigation items with icons and labels
 * - Active route highlighting with visual feedback
 * - VoltForge branding and logo display
 * - Responsive behavior for different screen sizes
 * - Hover effects and transition animations
 */

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Box,
  Rotate3d,
  ClipboardCheck,
  Activity,
  Wrench,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

/**
 * Navigation items configuration
 * Defines the main navigation structure with routes, icons, and labels
 * Each item represents a major section of the VoltForge application
 */
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assets', icon: Box, label: 'Asset Inventory' },
  { to: '/viewer', icon: Rotate3d, label: '3D Viewer' },
  { to: '/qc', icon: ClipboardCheck, label: 'QC Validation' },
  { to: '/telemetry', icon: Activity, label: 'Telemetry' },
  { to: '/workflows', icon: Wrench, label: 'Workflows' },
  { to: '/health', icon: HeartPulse, label: 'Platform Health' },
];

/**
 * Sidebar Navigation Component
 * 
 * Renders the main navigation sidebar with collapsible functionality,
 * branding, and navigation items. Manages active states and provides
 * smooth animations for all interactions.
 * 
 * @returns {JSX.Element} Sidebar navigation component
 */
export function Sidebar() {
  // Get sidebar state and toggle function from global store
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggle = useAppStore((s) => s.toggleSidebar);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed top-0 left-0 h-screen z-40 flex flex-col border-r border-zinc-800/60 bg-zinc-950/95 backdrop-blur-md"
    >
      {/* VoltForge Branding Section */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-zinc-800/60">
        {/* VoltForge Logo */}
        <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
          <Zap className="h-5 w-5 text-white" />
        </div>
        
        {/* Brand Text - Hidden when collapsed */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-base font-bold tracking-tight text-zinc-100">VoltForge</span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500 -mt-0.5">Service Platform</span>
          </motion.div>
        )}
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
              ${isActive
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
              }
              ${collapsed ? 'justify-center' : ''}
              `
            }
          >
            {/* Navigation Icon */}
            <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
            
            {/* Navigation Label - Hidden when collapsed */}
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Collapse Toggle */}
      <div className="p-3 border-t border-zinc-800/60">
        <button
          onClick={toggle}
          className="flex items-center justify-center w-full py-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
