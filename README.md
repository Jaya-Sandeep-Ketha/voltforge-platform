# VoltForge — Service Tooling Platform

> A polished, production-style frontend demo of an internal engineering platform for energy storage and charging infrastructure service operations.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?style=flat-square&logo=threedotjs)

---

## Overview

**VoltForge** is a demo internal service tooling platform designed for teams maintaining energy storage systems (battery packs, inverters, thermal controllers) and EV charging infrastructure. It simulates the kind of mission-critical operational tooling used by field technicians, reliability engineers, and service operations leads.

This is a **frontend-only demo** with fully mocked data — no backend, database, or authentication required. The architecture is structured so that backend integration could be added later with minimal refactoring.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Code Documentation

This project includes comprehensive JSDoc-style documentation throughout the entire codebase:

### Documentation Coverage

- **Application Files**: Entry points, routing configuration, and main app structure
- **State Management**: Zustand store with detailed property and method documentation
- **Service Layer**: Mock API services with async method documentation
- **Data Layer**: Mock data generators with parameter descriptions and return types
- **Page Components**: All 7 main pages with component-level and inline documentation
- **Layout Components**: App shell, sidebar, and topbar with interaction documentation
- **Configuration Files**: Vite and ESLint configuration with explanatory comments

### Documentation Standards

- **JSDoc Format**: Standard JSDoc syntax for functions and components
- **Component Documentation**: Props, return values, and usage examples
- **Inline Comments**: Explanatory comments for complex logic and domain-specific concepts
- **File Headers**: Comprehensive file-level documentation explaining purpose and features
- **Domain Context**: Energy storage and EV charging terminology explanations

---

## Architecture

```
src/
├── app/            # Router configuration with route definitions
├── components/     # Reusable UI components (Card, Badge, KpiCard, DataTable, Loading)
├── data/           # Mock data generators (assets, sites, telemetry, QC, incidents, alerts, workflows)
├── hooks/          # Custom React hooks (useAsync for async operation handling)
├── layouts/        # App shell — Sidebar, Topbar, AppLayout with responsive design
├── pages/          # Page-level components (7 main screens with full documentation)
├── services/       # Mock API service layer with simulated latency and error handling
├── store/          # Zustand global state (sidebar, 3D viewer, filters, notifications)
├── styles/         # Tailwind CSS entry point with custom theme tokens and design system
└── utils/          # Formatting helpers, color mappers, classname utilities
```

### Key Architectural Decisions

| Decision                                 | Rationale                                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mock API service layer**               | All data flows through `services/api.js` with async functions + simulated latency. Swap in real `fetch`/`axios` calls later with zero page-level changes.           |
| **Zustand for state**                    | Lightweight, minimal boilerplate. Perfect for cross-cutting concerns like sidebar state, 3D viewer selections, and layer toggles.                                   |
| **Seeded random data generators**        | Deterministic mock data — same output every run. Realistic asset IDs, engineering-specific naming, domain-accurate telemetry ranges.                                |
| **Tailwind CSS v4 with custom `@theme`** | Design tokens for brand colors (`volt-*` red accents, `surface-*` dark grays). Consistent theming without CSS-in-JS overhead.                                       |
| **React Three Fiber for 3D**             | Declarative Three.js in React. Supports click-to-select, hover highlights, exploded view, layer toggles, and HTML annotations — all composable as React components. |
| **Recharts for data visualization**      | Lightweight, composable chart library. Custom tooltips, gradient fills, anomaly dot rendering, and responsive containers.                                           |
| **Comprehensive Documentation**          | JSDoc-style documentation throughout ensures maintainability and clear understanding of complex domain logic and component interactions.                            |

---

## Features

### 1. Executive Dashboard

- Fleet-wide KPI summary cards (total assets, active incidents, QC pass rate, fleet uptime)
- Assets by health score bar chart
- Ingestion pipeline throughput area chart
- Recent alerts feed with severity indicators
- Recent QC failure list
- System status panel with live status dots
- Activity stream

### 2. Asset Inventory

- Searchable, filterable, sortable asset table (120 mock assets)
- Filters: site, health state, model type, service status
- Columns: asset ID, site, firmware, uptime, health, service status
- Click any row → asset detail page

### 3. Asset Detail

- Summary KPI cards (temp, voltage, uptime, cycles, firmware)
- Mini telemetry sparkline charts (temperature, voltage, current)
- Component health summary table
- Active incidents list with severity badges
- Service history timeline
- Recommended actions based on health state
- Button to open asset in 3D Viewer

### 4. 3D Service Viewer — Procedural Industrial Cabinet

The centrepiece of the demo: a fully procedural **Power Conversion Cabinet (PCC-4800)** built from ~500 primitives arranged into 16 selectable subcomponents. No external GLTF/GLB models required — the entire asset is generated in code using React Three Fiber.

**Why procedural?** Avoids licensing ambiguity from third-party models, keeps the project zero-dependency and self-contained, and demonstrates advanced Three.js/R3F composition skills. Every subcomponent is a realistic industrial part with proper proportions, materials, and engineering detail.

**Model architecture** (`src/features/viewer/`):

- `cabinetData.js` — metadata for all 16 components: part numbers, health states, service scores, temperatures, maintenance notes, layer assignments, explode vectors
- `CabinetAssembly.jsx` — procedural geometry builders for each subcomponent + `SelectablePart` wrapper handling hover/select/isolate/explode/layer-visibility

**Subcomponents modelled:**

- Outer enclosure shell with panel seams, side vent arrays
- Front access door with hinges, gasket line, warning placard, view window, drip rail, bolt rows
- Rear service panel with quarter-turn fasteners
- Mounting base / skid frame with forklift pockets and anchor bolt pads
- 2× Inverter modules (primary + redundant) with heatsink fins, blind-mate DC connectors, extraction handles, status LEDs
- DC bus distribution assembly with copper bus bars, fuse holders, main contactor
- BMS controller PCB with processor heat spreader, connector headers, DIN-rail clip
- Grid protection relay panel with relay modules and current transformers
- 4× Cooling fan array with shrouds, grills, blades, mounting bracket
- Liquid-to-air heat exchanger with fin pattern and inlet/outlet ports
- Coolant circulation pump with inlet/outlet and mounting bracket
- Cable entry gland plate with M40/M25 glands
- Status indicator panel with 8 LEDs (POWER, GRID, INV-A, INV-B, THERMAL, BMS, COMM, FAULT)
- Internal wiring harness with trunk, branches, and cable ties
- Door handle & latch assembly with T-handle, escutcheon, and padlock hasp

**3D interactions:**

- Click-to-select with red emissive glow highlight
- Hover effects with cursor change and subtle scale
- HTML annotations pinned to selected component in 3D space
- Exploded view toggle (smooth lerp animation per-component with custom explode vectors)
- Layer visibility toggles: electrical, thermal, structural, serviceable
- **Isolate mode** — focus on a single part, all others fade out
- Auto-rotate orbit when nothing selected

**Side panel UI:**

- Assembly overview card with serial number, firmware, site, component count
- Selected part detail card with health badge, temperature, serviceability score, part number, last-inspected date
- Detailed maintenance notes per component (domain-accurate engineering instructions)
- Health warning callouts for critical/warning states
- Isolate Part button
- Scrollable component list with service scores and status dots

**Materials & lighting:**

- PBR materials: steel, aluminum, copper, PCB green, rubber, coolant blue — each with realistic roughness/metalness
- Emissive LEDs (green, amber, red) for status indicators
- Industrial warehouse HDR environment
- Multi-directional lighting with subtle red accent point light
- Contact shadows on ground plane

### 5. QC Validation

- 25 mock validation runs with pass/fail results
- 5 validation categories: voltage consistency, thermal spread, communication bus, firmware compatibility, fan response
- Animated score bars with pass/fail color coding
- Current vs baseline comparison bar chart
- Corrective action recommendations for failed checks
- Expandable validation log viewer (terminal-style)
- Run list sidebar with status indicators

### 6. Telemetry Analytics

- 6 telemetry metrics: temperature, voltage, current, power output, SOC, fault events
- Anomaly detection with red dot indicators
- Stat summaries (avg, min, max) per metric
- Filters: site, asset, time range (6h/12h/24h/48h)
- Gradient area charts with grid lines

### 7. Service Workflows

- Guided repair procedures with step-by-step instructions
- 3 workflow templates: Cell Replacement, Thermal System Service, Fan Assembly Replacement
- Dropdown selectors for issue type, component family, severity
- Step cards with duration estimates and critical step badges
- Safety notes with warning icons
- Required tools checklist
- Link to view affected component in 3D Viewer

### 8. Platform Health

- API latency chart with SLA reference line (150ms)
- Ingestion queue health cards (depth, throughput, lag)
- Recent job status (completed, failed, running)
- CI/CD build history with branch/commit info
- Live log stream (terminal-style) with color-coded log levels

---

## Tech Stack

| Tool                | Purpose                                                       |
| ------------------- | ------------------------------------------------------------- |
| React 18            | UI framework                                                  |
| Vite 5              | Build tool + dev server                                       |
| Tailwind CSS 4      | Utility-first styling                                         |
| React Router 7      | Client-side routing                                           |
| Zustand 5           | Lightweight global state                                      |
| React Three Fiber 8 | Declarative 3D (Three.js)                                     |
| @react-three/drei   | 3D helpers (OrbitControls, Environment, Html, ContactShadows) |
| Recharts 3          | Data visualization                                            |
| Framer Motion 12    | Animations + transitions                                      |
| Lucide React        | Icon library                                                  |
| ESLint              | Code linting and quality assurance                            |
| JSDoc               | Code documentation standards                                  |

---

## License

This project is a portfolio demo and is not affiliated with any company. All data is synthetic.
