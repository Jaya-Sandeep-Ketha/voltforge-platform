/**
 * Cabinet Assembly Component Metadata
 * ─────────────────────────────────────
 * Defines every selectable subcomponent of the procedural
 * Power Conversion Cabinet (PCC-4800) model.
 *
 * Each entry maps a component ID to:
 *   - display name and engineering description
 *   - layer assignment (structural / electrical / thermal / serviceable)
 *   - health state, operating temperature, and service metadata
 *   - 3D position offset used for exploded-view animation
 *   - part number, last-inspected date, and maintenance notes
 *
 * This file is the single source of truth consumed by both the
 * 3D scene and the side-panel UI.
 */

export const CABINET_META = {
  id: 'PCC-4800',
  name: 'Power Conversion Cabinet PCC-4800',
  description:
    'Outdoor-rated power conversion and distribution cabinet for grid-scale energy storage. Houses inverter modules, DC bus distribution, battery management electronics, thermal management, and grid-tie protection relays. IP55 / NEMA 3R rated.',
  manufacturer: 'VoltForge Energy Systems',
  serialNumber: 'VF-PCC-2024-00471',
  firmwareVersion: '4.9.2-prod',
  installDate: '2024-03-12',
  siteId: 'site-002',
  siteName: 'Lathrop Megapack Depot',
};

export const COMPONENT_DEFS = [
  // ── Structural ──────────────────────────────────────────────
  {
    id: 'enclosure',
    name: 'Main Enclosure Shell',
    layer: 'structural',
    health: 'healthy',
    temp: 21.4,
    serviceScore: 98,
    partNumber: 'VF-ENC-4800-A',
    lastInspected: '2025-10-28',
    description:
      'Powder-coated galvanized steel enclosure, 2.1 m × 0.9 m × 0.8 m. IP55-rated with continuous weld seams. UV-stable RAL 7016 anthracite finish. Seismic Zone 4 certified mounting base.',
    maintenanceNote: 'Inspect powder coat annually for chips or corrosion. Verify gasket integrity on all access panels. Torque base bolts to 45 Nm.',
    explodeDir: [0, 0, 0],
    explodeDist: 0,
  },
  {
    id: 'front-door',
    name: 'Front Access Door',
    layer: 'serviceable',
    health: 'healthy',
    temp: 22.0,
    serviceScore: 95,
    partNumber: 'VF-DR-4800-F1',
    lastInspected: '2025-10-28',
    description:
      'Full-height hinged front door with three-point latching, EPDM gasket seal, and integrated drip rail. Features a document holder, warning placard, and a view window with polycarbonate glazing.',
    maintenanceNote: 'Lubricate hinge pins every 6 months. Replace gasket if compression set >20%. Verify latch engagement at all three points.',
    explodeDir: [0, 0, 1],
    explodeDist: 1.2,
  },
  {
    id: 'rear-panel',
    name: 'Rear Service Panel',
    layer: 'serviceable',
    health: 'healthy',
    temp: 23.1,
    serviceScore: 92,
    partNumber: 'VF-PNL-4800-R1',
    lastInspected: '2025-09-15',
    description:
      'Removable rear access panel secured with quarter-turn fasteners. Provides access to cable terminations, ground bus, and cooling manifold connections.',
    maintenanceNote: 'Check quarter-turn fastener engagement. Inspect cable glands for proper strain relief. Verify ground bus torque: 12 Nm.',
    explodeDir: [0, 0, -1],
    explodeDist: 1.0,
  },
  {
    id: 'base-frame',
    name: 'Mounting Base / Skid Frame',
    layer: 'structural',
    health: 'healthy',
    temp: 19.8,
    serviceScore: 99,
    partNumber: 'VF-BASE-4800-S',
    lastInspected: '2025-10-28',
    description:
      'Hot-dip galvanized C-channel skid frame with forklift pockets and four M16 anchor bolt locations. Integrated cable entry from below via knockouts.',
    maintenanceNote: 'Inspect anchor bolts annually. Check for galvanic corrosion at dissimilar metal junctions. Verify level within 3 mm over full span.',
    explodeDir: [0, -1, 0],
    explodeDist: 0.6,
  },

  // ── Electrical ──────────────────────────────────────────────
  {
    id: 'inverter-module-a',
    name: 'Inverter Module A (Primary)',
    layer: 'electrical',
    health: 'healthy',
    temp: 38.2,
    serviceScore: 91,
    partNumber: 'VF-INV-250K-A',
    lastInspected: '2025-10-15',
    description:
      'SiC MOSFET-based 250 kW inverter module. Three-phase grid-tie with >98.5% CEC efficiency. Hot-swappable with blind-mate DC bus connectors. Active gate drive with desaturation protection.',
    maintenanceNote: 'Inspect DC bus connector pins for pitting. Verify gate driver LED indicators. Clean air-side heat sink fins with compressed air (<30 PSI).',
    explodeDir: [-0.4, 0.3, 0.5],
    explodeDist: 1.0,
  },
  {
    id: 'inverter-module-b',
    name: 'Inverter Module B (Redundant)',
    layer: 'electrical',
    health: 'warning',
    temp: 44.1,
    serviceScore: 72,
    partNumber: 'VF-INV-250K-B',
    lastInspected: '2025-11-01',
    description:
      'Redundant 250 kW inverter module. Elevated junction temperature detected on phase-C MOSFET bridge. Efficiency has degraded to 97.8%. Derate to 200 kW recommended until serviced.',
    maintenanceNote: 'PRIORITY: Thermal imaging required on phase-C bridge. Schedule replacement module if ΔT >12°C above baseline. Do not exceed 200 kW until cleared.',
    explodeDir: [-0.4, -0.2, 0.5],
    explodeDist: 1.0,
  },
  {
    id: 'dc-bus',
    name: 'DC Bus Distribution Assembly',
    layer: 'electrical',
    health: 'healthy',
    temp: 33.5,
    serviceScore: 94,
    partNumber: 'VF-DCBUS-800V',
    lastInspected: '2025-10-15',
    description:
      'Laminated copper bus bar assembly rated 800 VDC / 600 A continuous. Includes pre-charge circuit, main DC contactor (Kilovac EV200), current transducers, and fused battery string inputs.',
    maintenanceNote: 'Torque bus bar connections to 25 Nm. Inspect contactor contact resistance (<100 µΩ). Verify pre-charge resistor integrity.',
    explodeDir: [0.5, 0.2, 0],
    explodeDist: 0.8,
  },
  {
    id: 'bms-controller',
    name: 'BMS Controller Unit',
    layer: 'electrical',
    health: 'healthy',
    temp: 29.4,
    serviceScore: 96,
    partNumber: 'VF-BMS-CTL-R3',
    lastInspected: '2025-10-15',
    description:
      'Centralized battery management controller. Monitors 16 battery strings via isolated CAN. Performs cell balancing, SOC/SOH estimation, and contactor sequencing. Dual-redundant processor with watchdog.',
    maintenanceNote: 'Verify CAN bus termination (120 Ω). Check heartbeat LED cadence (1 Hz = normal). Download event log quarterly.',
    explodeDir: [0.5, -0.3, 0],
    explodeDist: 0.9,
  },
  {
    id: 'grid-relay',
    name: 'Grid Protection Relay Panel',
    layer: 'electrical',
    health: 'healthy',
    temp: 27.0,
    serviceScore: 97,
    partNumber: 'VF-RELAY-IEEE1547',
    lastInspected: '2025-09-20',
    description:
      'IEEE 1547 / UL 1741-SA compliant grid protection relay assembly. Includes anti-islanding, frequency/voltage ride-through settings, and utility-grade metering CTs.',
    maintenanceNote: 'Functional test annually per utility interconnection agreement. Verify CT ratio and burden. Confirm trip settings match site configuration sheet.',
    explodeDir: [0.5, 0.5, 0],
    explodeDist: 0.7,
  },

  // ── Thermal ─────────────────────────────────────────────────
  {
    id: 'cooling-fans',
    name: 'Cooling Fan Array',
    layer: 'thermal',
    health: 'healthy',
    temp: 24.6,
    serviceScore: 88,
    partNumber: 'VF-FAN-172-4X',
    lastInspected: '2025-10-01',
    description:
      'Four × 172 mm axial fans in 2+2 redundant configuration. EC motor, PWM speed control 600–3200 RPM. Total airflow 1,400 CFM at system impedance. Replaceable filter media behind intake grilles.',
    maintenanceNote: 'Replace intake filters every 3 months (dusty sites: monthly). Check fan bearing noise. Verify all four fans spin up during self-test.',
    explodeDir: [0, 0.6, 0.6],
    explodeDist: 0.8,
  },
  {
    id: 'heat-exchanger',
    name: 'Liquid-to-Air Heat Exchanger',
    layer: 'thermal',
    health: 'healthy',
    temp: 30.8,
    serviceScore: 85,
    partNumber: 'VF-HX-15K',
    lastInspected: '2025-08-22',
    description:
      'Brazed-plate liquid-to-air heat exchanger. 15 kW rejection capacity. Propylene glycol loop, 8 LPM flow rate. Mounted behind fan array for forced convection.',
    maintenanceNote: 'Flush glycol loop annually. Check glycol concentration (target 50%). Inspect for external fin damage or blockage. Pressure test to 30 PSI.',
    explodeDir: [0, 0.3, 0.8],
    explodeDist: 0.9,
  },
  {
    id: 'coolant-pump',
    name: 'Coolant Circulation Pump',
    layer: 'thermal',
    health: 'healthy',
    temp: 26.3,
    serviceScore: 90,
    partNumber: 'VF-PUMP-EC8',
    lastInspected: '2025-10-01',
    description:
      'Brushless DC circulation pump, 8 LPM @ 2 bar. Wet-rotor design for silent operation. PWM speed input from thermal management controller. Integrated dry-run protection.',
    maintenanceNote: 'Listen for cavitation noise. Verify flow rate sensor reads within ±10% of setpoint. Replace every 40,000 hours or 5 years.',
    explodeDir: [0, -0.5, 0.7],
    explodeDist: 0.7,
  },

  // ── Serviceable ─────────────────────────────────────────────
  {
    id: 'cable-entry',
    name: 'Cable Entry Gland Plate',
    layer: 'serviceable',
    health: 'healthy',
    temp: 20.5,
    serviceScore: 93,
    partNumber: 'VF-CGP-4800-B',
    lastInspected: '2025-10-28',
    description:
      'Bottom-entry cable gland plate with 8× M40 and 4× M25 entries. IP55 rated compression glands. Supports power, control, communications, and grounding conductors.',
    maintenanceNote: 'Verify gland compression on all cables. Unused knockouts must remain sealed. Check for moisture ingress at each entry point.',
    explodeDir: [0, -1, 0],
    explodeDist: 0.5,
  },
  {
    id: 'indicator-panel',
    name: 'Status Indicator Panel',
    layer: 'serviceable',
    health: 'critical',
    temp: 25.8,
    serviceScore: 45,
    partNumber: 'VF-IND-8LED-R2',
    lastInspected: '2025-11-10',
    description:
      'Front-facing LED indicator array: POWER, GRID, INV-A, INV-B, THERMAL, BMS, COMM, FAULT. Fault LED is currently illuminated solid red — investigate inverter module B thermal anomaly.',
    maintenanceNote: 'FAULT indicator active. Cross-reference with BMS event log. Likely root cause: INV-B thermal exceedance. Do NOT silence alarm until root cause confirmed.',
    explodeDir: [0, 0.6, 0.6],
    explodeDist: 0.4,
  },
  {
    id: 'wiring-harness',
    name: 'Internal Wiring Harness',
    layer: 'electrical',
    health: 'healthy',
    temp: 28.0,
    serviceScore: 89,
    partNumber: 'VF-WH-4800-R5',
    lastInspected: '2025-10-15',
    description:
      'Pre-terminated wiring harness for signal, control, and low-voltage power distribution. Includes CAN bus trunk, thermistor leads, fan power, and BMS communication cables. Labeled per VF-WD-2024-03.',
    maintenanceNote: 'Inspect for chafing at cable tie points. Verify connector seating on all Molex/TE connectors. Replace any cable with visible insulation damage.',
    explodeDir: [0.3, 0, 0.3],
    explodeDist: 0.5,
  },
  {
    id: 'door-handle',
    name: 'Door Handle & Latch Assembly',
    layer: 'serviceable',
    health: 'healthy',
    temp: 21.0,
    serviceScore: 97,
    partNumber: 'VF-LATCH-3PT',
    lastInspected: '2025-10-28',
    description:
      'Three-point cam latch with T-handle and padlock provision. 316 stainless steel mechanism. NEMA 3R rated. Allows single-hand operation with quarter-turn engagement.',
    maintenanceNote: 'Lubricate cam mechanism with white lithium grease every 6 months. Verify all three latch rods engage flush. Replace if handle free-play exceeds 5°.',
    explodeDir: [0, 0, 1.2],
    explodeDist: 0.3,
  },
];

/**
 * Returns the hex colour used for 3D health-state overlays.
 */
export const HEALTH_COLORS_3D = {
  healthy: '#34d399',
  warning: '#fbbf24',
  critical: '#f87171',
  offline: '#71717a',
  maintenance: '#60a5fa',
};

export const getComponentById = (id) => COMPONENT_DEFS.find((c) => c.id === id);
