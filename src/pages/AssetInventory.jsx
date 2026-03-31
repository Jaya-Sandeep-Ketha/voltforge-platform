/**
 * Asset Inventory Page Component
 * 
 * Comprehensive asset management interface for browsing and filtering the entire
 * VoltForge energy asset fleet. This page provides searchable, filterable access to
 * all assets with detailed information and navigation to individual asset details.
 * 
 * Features provided:
 * - Search across asset IDs, models, and serial numbers
 * - Multi-criteria filtering by site, health, type, and service status
 * - Sortable data table with key asset metrics
 * - Real-time asset count and filtering statistics
 * - Direct navigation to detailed asset views
 * - Responsive design for mobile and desktop viewing
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTable, LoadingPage, Badge, StatusDot, EmptyState } from '@/components/ui';
import { assetService, siteService } from '@/services/api';
import { healthBg, formatPercent } from '@/utils/formatters';

/**
 * Asset Inventory Component
 * 
 * Loads and displays all energy assets with comprehensive filtering and search capabilities.
 * Provides a centralized interface for asset management and monitoring with direct
 * access to detailed asset information.
 * 
 * @returns {JSX.Element} Asset inventory page component
 */
export function AssetInventory() {
  const navigate = useNavigate();
  
  // State management for assets and filtering
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState('');
  const [filterSite, setFilterSite] = useState('');
  const [filterHealth, setFilterHealth] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  /**
   * Load assets and sites data on component mount
   * Fetches data in parallel for optimal performance
   */
  useEffect(() => {
    async function load() {
      const [a, s] = await Promise.all([assetService.getAll(), siteService.getAll()]);
      setAssets(a);
      setSites(s);
      setLoading(false);
    }
    load();
  }, []);

  /**
   * Memoized filtered assets based on search and filter criteria
   * Optimizes performance by only recalculating when dependencies change
   */
  const filtered = useMemo(() => {
    let result = [...assets];
    
    // Apply search filter across ID, type, and serial number
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.id.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) || a.serialNumber.toLowerCase().includes(q)
      );
    }
    
    // Apply individual filter criteria
    if (filterSite) result = result.filter((a) => a.siteId === filterSite);
    if (filterHealth) result = result.filter((a) => a.health === filterHealth);
    if (filterType) result = result.filter((a) => a.type === filterType);
    if (filterStatus) result = result.filter((a) => a.serviceStatus === filterStatus);
    
    return result;
  }, [assets, search, filterSite, filterHealth, filterType, filterStatus]);

  // Extract unique values for filter dropdowns
  const assetTypes = [...new Set(assets.map((a) => a.type))];
  const serviceStatuses = [...new Set(assets.map((a) => a.serviceStatus))];

  /**
   * Table column definitions for asset data display
   * Each column includes rendering logic and formatting
   */
  const columns = [
    {
      key: 'id',
      label: 'Asset ID',
      render: (val) => <span className="font-mono text-xs text-zinc-200">{val}</span>,
    },
    {
      key: 'siteId',
      label: 'Site',
      render: (val) => {
        const site = sites.find((s) => s.id === val);
        return <span className="text-xs text-zinc-400">{site?.name || val}</span>;
      },
    },
    {
      key: 'type',
      label: 'Model Type',
      render: (val) => <span className="text-xs text-zinc-300">{val}</span>,
    },
    {
      key: 'firmware',
      label: 'Firmware',
      render: (val) => <span className="font-mono text-xs text-zinc-500">{val}</span>,
    },
    {
      key: 'uptime',
      label: 'Uptime',
      render: (val) => <span className="text-xs tabular-nums text-zinc-400">{formatPercent(val)}</span>,
    },
    {
      key: 'health',
      label: 'Health',
      render: (val) => (
        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${healthBg(val)}`}>
          <StatusDot status={val} />
          <span className="capitalize">{val}</span>
        </span>
      ),
    },
    {
      key: 'serviceStatus',
      label: 'Service Status',
      render: (val) => <span className="text-xs capitalize text-zinc-400">{val.replace(/-/g, ' ')}</span>,
    },
  ];

  // Loading state handling
  if (loading) return <LoadingPage />;

  return (
    <div className="space-y-5">
      {/* Filters and Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by ID, model, serial…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
          />
        </div>

        {/* Filter Icon */}
        <div className="flex items-center gap-2 text-zinc-500">
          <Filter className="h-4 w-4" />
        </div>

        {/* Site Filter Dropdown */}
        <select value={filterSite} onChange={(e) => setFilterSite(e.target.value)} className="px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 focus:outline-none focus:border-red-500/50">
          <option value="">All Sites</option>
          {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        {/* Health Filter Dropdown */}
        <select value={filterHealth} onChange={(e) => setFilterHealth(e.target.value)} className="px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 focus:outline-none focus:border-red-500/50">
          <option value="">All Health</option>
          {['healthy', 'warning', 'critical', 'offline', 'maintenance'].map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        {/* Asset Type Filter Dropdown */}
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 focus:outline-none focus:border-red-500/50">
          <option value="">All Types</option>
          {assetTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Service Status Filter Dropdown */}
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 focus:outline-none focus:border-red-500/50">
          <option value="">All Statuses</option>
          {serviceStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Results Count Badge */}
        <div className="ml-auto">
          <Badge variant="default">{filtered.length} assets</Badge>
        </div>
      </motion.div>

      {/* Asset Data Table */}
      {filtered.length > 0 ? (
        <DataTable
          columns={columns}
          data={filtered.slice(0, 50)}
          onRowClick={(row) => navigate(`/assets/${row.id}`)}
        />
      ) : (
        <EmptyState icon={Box} title="No assets found" description="Try adjusting your search or filters." />
      )}

      {/* Results Count Indicator */}
      {filtered.length > 50 && (
        <p className="text-xs text-zinc-600 text-center">Showing first 50 of {filtered.length} results</p>
      )}
    </div>
  );
}
