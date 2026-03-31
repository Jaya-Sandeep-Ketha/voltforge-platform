/**
 * 3D Asset Viewer Page
 * 
 * Interactive 3D visualization interface for energy asset inspection and analysis.
 * This page provides a comprehensive 3D model viewer with component selection,
 * layer toggling, exploded views, and detailed component information panels.
 * 
 * 3D Viewer features:
 * - Interactive 3D cabinet assembly with realistic lighting and shadows
 * - Component selection and isolation for detailed inspection
 * - Layer-based visibility controls (electrical, thermal, structural, serviceable)
 * - Exploded view mode for internal component visualization
 * - Component health monitoring and serviceability scoring
 * - Maintenance history and inspection tracking
 * - Integration with workflow management system
 */

import { useState, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Expand,
  Shrink,
  Eye,
  EyeOff,
  Layers,
  Info,
  Thermometer,
  Zap,
  Wind,
  ChevronRight,
  Focus,
  X,
  Wrench,
  CalendarCheck,
  Gauge,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, StatusDot } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { healthBg } from '@/utils/formatters';
import CabinetAssembly from '@/features/viewer/CabinetAssembly';
import { CABINET_META, COMPONENT_DEFS } from '@/features/viewer/cabinetData';

/* ── Layer Configuration ─────────────────────────────────────── */
/**
 * Layer configuration for 3D model visibility controls
 * Defines which components belong to each layer system
 */
const LAYER_CONFIG = [
  { key: 'electrical', label: 'Electrical', icon: Zap, color: 'text-blue-400' },
  { key: 'thermal', label: 'Thermal', icon: Thermometer, color: 'text-cyan-400' },
  { key: 'structural', label: 'Structural', icon: Layers, color: 'text-zinc-400' },
  { key: 'serviceable', label: 'Serviceable', icon: Wind, color: 'text-amber-400' },
];

// Filter out non-selectable components (like enclosure)
const selectableDefs = COMPONENT_DEFS.filter((d) => d.id !== 'enclosure');

/* ── Serviceability Color Helpers ────────────────────────────── */
/**
 * Returns text color based on serviceability score
 * @param {number} score - Serviceability percentage (0-100)
 * @returns {string} CSS color class
 */
function scoreColor(score) {
  if (score >= 90) return 'text-emerald-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-red-400';
}

/**
 * Returns background color based on serviceability score
 * @param {number} score - Serviceability percentage (0-100)
 * @returns {string} CSS background color class
 */
function scoreBg(score) {
  if (score >= 90) return 'bg-emerald-400/10 border-emerald-400/20';
  if (score >= 70) return 'bg-amber-400/10 border-amber-400/20';
  return 'bg-red-400/10 border-red-400/20';
}

/* ── 3D Scene Wrapper Component ────────────────────────────────── */
/**
 * 3D scene component containing lighting, shadows, and the cabinet assembly
 * Provides realistic industrial lighting environment for the 3D model
 * @param {Object} props - Component props
 * @param {Object} props.selected - Currently selected component
 * @param {Function} props.onSelect - Component selection handler
 * @param {boolean} props.exploded - Whether exploded view is active
 * @param {string} props.isolated - Currently isolated component ID
 * @param {Object} props.activeLayers - Active layer visibility settings
 * @returns {JSX.Element} 3D scene component
 */
function Scene({ selected, onSelect, exploded, isolated, activeLayers }) {
  return (
    <>
      {/* Realistic industrial lighting setup */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} castShadow shadow-mapSize={1024} />
      <directionalLight position={[-3, 4, -4]} intensity={0.35} color="#c0c8ff" />
      <pointLight position={[0, 1.5, 1.5]} intensity={0.2} color="#ff6b6b" distance={5} />
      <pointLight position={[0, -0.5, -1]} intensity={0.1} color="#6bc5ff" distance={4} />

      {/* Main 3D cabinet assembly */}
      <CabinetAssembly
        selected={selected}
        onSelect={onSelect}
        exploded={exploded}
        isolated={isolated}
        activeLayers={activeLayers}
      />

      {/* Ground plane shadow catcher */}
      <ContactShadows position={[0, -1.12, 0]} opacity={0.35} scale={4} blur={2.5} far={3} />

      {/* Camera controls with auto-rotation */}
      <OrbitControls
        makeDefault
        minDistance={1.2}
        maxDistance={6}
        enablePan
        autoRotate={!selected}
        autoRotateSpeed={0.4}
        maxPolarAngle={Math.PI * 0.85}
        target={[0, 0, 0]}
      />
      <Environment preset="warehouse" />
    </>
  );
}

/* ── Main 3D Viewer Component ─────────────────────────────────────── */
/**
 * Main 3D viewer page component providing interactive asset visualization
 * Combines 3D rendering with component information panels and controls
 * 
 * @returns {JSX.Element} 3D viewer page component
 */
export function Viewer3D() {
  const { assetId } = useParams();
  const [selected, setSelected] = useState(null);

  // Global state management for viewer settings
  const exploded = useAppStore((s) => s.explodedView);
  const toggleExploded = useAppStore((s) => s.toggleExplodedView);
  const isolated = useAppStore((s) => s.isolatedPart);
  const setIsolated = useAppStore((s) => s.setIsolatedPart);
  const clearIsolated = useAppStore((s) => s.clearIsolatedPart);
  const activeLayers = useAppStore((s) => s.activeLayers);
  const toggleLayer = useAppStore((s) => s.toggleLayer);

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* ── 3D Canvas Container ──────────────────────────────────────── */}
      <div className="flex-1 relative rounded-xl border border-zinc-800/60 bg-zinc-950 overflow-hidden">

        {/* Top-left toolbar with view controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={toggleExploded}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border backdrop-blur-md transition-all ${
              exploded
                ? 'bg-red-500/15 text-red-400 border-red-500/30'
                : 'bg-zinc-900/90 text-zinc-400 border-zinc-700 hover:text-zinc-200'
            }`}
          >
            {exploded ? <Shrink className="h-3.5 w-3.5" /> : <Expand className="h-3.5 w-3.5" />}
            {exploded ? 'Collapse' : 'Exploded View'}
          </button>

          {isolated && (
            <button
              onClick={clearIsolated}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30 backdrop-blur-md transition-all hover:bg-amber-500/25"
            >
              <X className="h-3 w-3" />
              Exit Isolate
            </button>
          )}
        </div>

        {/* Top-right layer visibility toggles */}
        <div className="absolute top-4 right-4 z-10 space-y-1.5">
          {LAYER_CONFIG.map((l) => (
            <button
              key={l.key}
              onClick={() => toggleLayer(l.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border backdrop-blur-md transition-all w-full ${
                activeLayers[l.key]
                  ? 'bg-zinc-900/90 border-zinc-700 text-zinc-200'
                  : 'bg-zinc-900/50 border-zinc-800/40 text-zinc-600'
              }`}
            >
              {activeLayers[l.key] ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              <l.icon className={`h-3 w-3 ${activeLayers[l.key] ? l.color : 'text-zinc-600'}`} />
              {l.label}
            </button>
          ))}
        </div>

        {/* Bottom-left asset information labels */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">Asset</p>
            <p className="text-xs font-mono text-zinc-300">{assetId || CABINET_META.serialNumber}</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">Model</p>
            <p className="text-xs text-zinc-300">{CABINET_META.id}</p>
          </div>
        </div>

        {/* 3D Canvas with loading fallback */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full bg-zinc-950">
              <div className="text-center space-y-3">
                <motion.div
                  className="h-10 w-10 border-2 border-zinc-700 border-t-red-500 rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-sm text-zinc-600 font-medium">Loading 3D assembly…</p>
              </div>
            </div>
          }
        >
          <Canvas
            camera={{ position: [1.8, 1.2, 2.0], fov: 40 }}
            gl={{ antialias: true, alpha: true, toneMapping: 3 }}
            shadows
            dpr={[1, 2]}
          >
            <Scene
              selected={selected}
              onSelect={setSelected}
              exploded={exploded}
              isolated={isolated}
              activeLayers={activeLayers}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* ── Side Information Panel ─────────────────────────────────────── */}
      <div className="w-[340px] flex-shrink-0 space-y-3 overflow-y-auto pr-1">

        {/* Assembly Overview Card */}
        <Card hover={false}>
          <CardHeader>
            <CardTitle>{CABINET_META.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-zinc-500 leading-relaxed">{CABINET_META.description}</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-lg bg-zinc-800/30 border border-zinc-800/40">
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider">S/N</p>
                <p className="text-[11px] font-mono text-zinc-300 mt-0.5">{CABINET_META.serialNumber}</p>
              </div>
              <div className="p-2 rounded-lg bg-zinc-800/30 border border-zinc-800/40">
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Firmware</p>
                <p className="text-[11px] font-mono text-zinc-300 mt-0.5">{CABINET_META.firmwareVersion}</p>
              </div>
              <div className="p-2 rounded-lg bg-zinc-800/30 border border-zinc-800/40">
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Site</p>
                <p className="text-[11px] text-zinc-300 mt-0.5">{CABINET_META.siteName}</p>
              </div>
              <div className="p-2 rounded-lg bg-zinc-800/30 border border-zinc-800/40">
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Components</p>
                <p className="text-[11px] text-zinc-300 mt-0.5">{selectableDefs.length} selectable</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Component Detail Panel */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              <Card hover={false} glow>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle>{selected.name}</CardTitle>
                    <p className="text-[10px] font-mono text-zinc-600 mt-0.5">{selected.partNumber}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize flex-shrink-0 ${healthBg(selected.health)}`}>
                    {selected.health}
                  </span>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-zinc-400 leading-relaxed">{selected.description}</p>

                  {/* Component Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg bg-zinc-800/30 border border-zinc-800/40 text-center">
                      <Thermometer className="h-3 w-3 text-zinc-600 mx-auto mb-1" />
                      <p className="text-xs font-mono text-zinc-200">{selected.temp}°C</p>
                      <p className="text-[8px] text-zinc-600 uppercase mt-0.5">Temp</p>
                    </div>
                    <div className={`p-2 rounded-lg border text-center ${scoreBg(selected.serviceScore)}`}>
                      <Gauge className="h-3 w-3 mx-auto mb-1 opacity-70" />
                      <p className={`text-xs font-bold tabular-nums ${scoreColor(selected.serviceScore)}`}>{selected.serviceScore}%</p>
                      <p className="text-[8px] uppercase mt-0.5 opacity-60">Service</p>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-800/30 border border-zinc-800/40 text-center">
                      <Layers className="h-3 w-3 text-zinc-600 mx-auto mb-1" />
                      <p className="text-xs text-zinc-200 capitalize">{selected.layer}</p>
                      <p className="text-[8px] text-zinc-600 uppercase mt-0.5">Layer</p>
                    </div>
                  </div>

                  {/* Last Inspection Information */}
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <CalendarCheck className="h-3 w-3 text-zinc-600" />
                    Last inspected: <span className="font-mono text-zinc-400">{selected.lastInspected}</span>
                  </div>

                  {/* Maintenance Notes Section */}
                  <div className="pt-2 border-t border-zinc-800/30">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Wrench className="h-3 w-3 text-zinc-600" />
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Maintenance Notes</p>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${selected.health === 'critical' ? 'text-red-400' : selected.health === 'warning' ? 'text-amber-400/80' : 'text-zinc-500'}`}>
                      {selected.maintenanceNote}
                    </p>
                  </div>

                  {/* Health Warning Alerts */}
                  {(selected.health === 'critical' || selected.health === 'warning') && (
                    <div className={`flex items-start gap-2 p-2.5 rounded-lg border ${
                      selected.health === 'critical'
                        ? 'bg-red-500/5 border-red-500/20'
                        : 'bg-amber-500/5 border-amber-500/20'
                    }`}>
                      <AlertTriangle className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${
                        selected.health === 'critical' ? 'text-red-400' : 'text-amber-400'
                      }`} />
                      <p className="text-[11px] text-zinc-400">
                        {selected.health === 'critical'
                          ? 'IMMEDIATE ATTENTION REQUIRED. De-energize and schedule field inspection within 24 hours.'
                          : 'Elevated condition detected. Monitor closely. If no improvement within 48h, escalate to Tier 2.'}
                      </p>
                    </div>
                  )}

                  {/* Component Isolation Button */}
                  <button
                    onClick={() => setIsolated(selected.id)}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      isolated === selected.id
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-zinc-800/40 text-zinc-400 border-zinc-800/60 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <Focus className="h-3.5 w-3.5" />
                    {isolated === selected.id ? 'Exit Isolated View' : 'Isolate Part'}
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // Empty state when no component is selected
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card hover={false}>
                <CardContent>
                  <div className="text-center py-6">
                    <Info className="h-8 w-8 text-zinc-800 mx-auto mb-2" />
                    <p className="text-xs text-zinc-600">Click a component in the 3D view to inspect its details, serviceability score, and maintenance notes.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Component List Section */}
        <Card hover={false}>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Components</CardTitle>
            <span className="text-[10px] text-zinc-600">{selectableDefs.length} parts</span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800/30 max-h-[320px] overflow-y-auto">
              {selectableDefs.map((def) => (
                <button
                  key={def.id}
                  onClick={() => setSelected(def)}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                    selected?.id === def.id
                      ? 'bg-red-500/5 border-l-2 border-l-red-500'
                      : 'hover:bg-zinc-800/20 border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <StatusDot status={def.health} />
                    <div className="min-w-0">
                      <p className="text-[11px] text-zinc-300 truncate">{def.name}</p>
                      <p className="text-[9px] font-mono text-zinc-600">{def.partNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-bold tabular-nums ${scoreColor(def.serviceScore)}`}>
                      {def.serviceScore}%
                    </span>
                    <ChevronRight className="h-3 w-3 text-zinc-700" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
