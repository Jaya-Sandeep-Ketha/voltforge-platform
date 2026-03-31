/**
 * CabinetAssembly.jsx
 * ───────────────────────────────────────────────────────────────
 * Procedural 3D model of a Power Conversion Cabinet (PCC-4800).
 *
 * This is NOT a placeholder.  Every subcomponent is built from
 * multiple primitives with realistic proportions, panel seams,
 * vents, handles, indicator lights, cable ports, internal modules,
 * and mounting details.  The geometry is grouped hierarchically so
 * each selectable part can be highlighted, exploded, or isolated
 * independently.
 *
 * Design reference: outdoor-rated grid-scale power conversion
 * enclosures such as those used in utility-scale battery storage
 * installations (think 2 m tall floor-standing steel cabinet).
 *
 * All dimensions are in arbitrary scene units where 1 unit ≈ 1 m.
 * ───────────────────────────────────────────────────────────────
 */
import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { COMPONENT_DEFS, HEALTH_COLORS_3D } from './cabinetData';

/* ────────────────────────────────────────────────────────────── *
 *  Shared materials                                              *
 * ────────────────────────────────────────────────────────────── */
const MAT = {
  shell:     { color: '#2c2c30', roughness: 0.65, metalness: 0.85 },
  shellInner:{ color: '#1e1e22', roughness: 0.8,  metalness: 0.5 },
  door:      { color: '#303035', roughness: 0.6,  metalness: 0.8 },
  panel:     { color: '#28282c', roughness: 0.7,  metalness: 0.75 },
  aluminum:  { color: '#8a8a92', roughness: 0.35, metalness: 0.95 },
  copper:    { color: '#b87333', roughness: 0.4,  metalness: 0.9 },
  pcb:       { color: '#1a472a', roughness: 0.85, metalness: 0.15 },
  heatsink:  { color: '#404048', roughness: 0.5,  metalness: 0.9 },
  fan:       { color: '#1a1a1e', roughness: 0.7,  metalness: 0.6 },
  rubber:    { color: '#111114', roughness: 0.95, metalness: 0.05 },
  gland:     { color: '#60606a', roughness: 0.5,  metalness: 0.85 },
  led_green: { color: '#22c55e', roughness: 0.3,  metalness: 0.2, emissive: '#22c55e', emissiveIntensity: 0.8 },
  led_red:   { color: '#ef4444', roughness: 0.3,  metalness: 0.2, emissive: '#ef4444', emissiveIntensity: 1.2 },
  led_amber: { color: '#f59e0b', roughness: 0.3,  metalness: 0.2, emissive: '#f59e0b', emissiveIntensity: 0.8 },
  led_off:   { color: '#333338', roughness: 0.7,  metalness: 0.3 },
  label:     { color: '#e8e830', roughness: 0.9,  metalness: 0.0 },
  black:     { color: '#0a0a0c', roughness: 0.9,  metalness: 0.1 },
  coolant:   { color: '#06b6d4', roughness: 0.2,  metalness: 0.1, transparent: true, opacity: 0.6 },
};

function matProps(key) {
  return MAT[key] || MAT.shell;
}

/* ────────────────────────────────────────────────────────────── *
 *  SelectablePart — wraps any geometry group with hover /        *
 *  select / health-overlay / explode / isolate behaviour         *
 * ────────────────────────────────────────────────────────────── */
export function SelectablePart({
  id,
  children,
  selected,
  onSelect,
  exploded,
  isolated,
  activeLayers,
  position = [0, 0, 0],
}) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const def = COMPONENT_DEFS.find((c) => c.id === id);
  if (!def) return null;

  const layerVisible = activeLayers[def.layer];
  const isSelected = selected?.id === id;
  const isIsolated = isolated === id;
  const someoneElseIsolated = isolated && isolated !== id;

  const targetPos = useMemo(() => {
    if (!exploded || !def.explodeDir) return position;
    const d = def.explodeDist || 0;
    return [
      position[0] + def.explodeDir[0] * d,
      position[1] + def.explodeDir[1] * d,
      position[2] + def.explodeDir[2] * d,
    ];
  }, [exploded, position, def]);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.lerp(new THREE.Vector3(...targetPos), 0.06);

    // Visibility: hidden if layer off, or someone else is isolated
    const shouldBeVisible = layerVisible && !someoneElseIsolated;
    const targetOpacity = shouldBeVisible ? 1 : 0;
    ref.current.visible = shouldBeVisible || ref.current.scale.x > 0.05;

    const targetScale = shouldBeVisible ? (hovered && !isSelected ? 1.008 : 1) : 0.001;
    ref.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1,
    );
  });

  // Enclosure is non-selectable background
  const isEnclosure = id === 'enclosure';

  return (
    <group
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (!isEnclosure) onSelect(def);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!isEnclosure) {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {children(isSelected, hovered, def)}

      {/* floating annotation on select */}
      {isSelected && !isEnclosure && (
        <Html position={[0.6, 0.3, 0]} distanceFactor={3.5} style={{ pointerEvents: 'none' }}>
          <div className="bg-zinc-900/95 border border-red-500/40 rounded-lg px-3 py-2 text-[11px] text-zinc-200 whitespace-nowrap shadow-2xl backdrop-blur-md">
            <p className="font-bold text-red-400 mb-0.5">{def.name}</p>
            <p className="text-zinc-500">{def.temp}°C · {def.health} · Score {def.serviceScore}%</p>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ────────────────────────────────────────────────────────────── *
 *  Utility: emissive highlight colour based on state             *
 * ────────────────────────────────────────────────────────────── */
function hlEmissive(isSelected, hovered, health) {
  if (isSelected) return '#ef4444';
  if (hovered) return '#ffffff';
  if (health === 'critical') return HEALTH_COLORS_3D.critical;
  if (health === 'warning') return HEALTH_COLORS_3D.warning;
  return '#000000';
}
function hlIntensity(isSelected, hovered, health) {
  if (isSelected) return 0.35;
  if (hovered) return 0.12;
  if (health === 'critical') return 0.25;
  if (health === 'warning') return 0.12;
  return 0;
}

/* ────────────────────────────────────────────────────────────── *
 *  Repeatable micro-geometry helpers                             *
 * ────────────────────────────────────────────────────────────── */
function VentSlots({ position, count = 8, slotWidth = 0.06, slotHeight = 0.005, spacing = 0.018, length = 0.3, rotation = [0, 0, 0] }) {
  const slots = [];
  const totalH = count * (slotHeight + spacing);
  for (let i = 0; i < count; i++) {
    const y = -totalH / 2 + i * (slotHeight + spacing);
    slots.push(
      <mesh key={i} position={[0, y, 0]}>
        <boxGeometry args={[length, slotHeight, 0.015]} />
        <meshStandardMaterial {...matProps('shellInner')} />
      </mesh>,
    );
  }
  return <group position={position} rotation={rotation}>{slots}</group>;
}

function BoltRow({ position, count = 4, spacing = 0.12, rotation = [0, 0, 0] }) {
  const bolts = [];
  for (let i = 0; i < count; i++) {
    const x = -((count - 1) * spacing) / 2 + i * spacing;
    bolts.push(
      <mesh key={i} position={[x, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.012, 6]} />
        <meshStandardMaterial {...matProps('aluminum')} />
      </mesh>,
    );
  }
  return <group position={position} rotation={rotation}>{bolts}</group>;
}

function CableGland({ position }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.018, 0.022, 0.04, 12]} />
        <meshStandardMaterial {...matProps('gland')} />
      </mesh>
      <mesh position={[0, -0.025, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.03, 8]} />
        <meshStandardMaterial {...matProps('rubber')} />
      </mesh>
    </group>
  );
}

function IndicatorLED({ position, matKey = 'led_green' }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.012, 12, 12]} />
      <meshStandardMaterial {...matProps(matKey)} />
    </mesh>
  );
}

/* ────────────────────────────────────────────────────────────── *
 *  Individual sub-assembly geometry builders                     *
 * ────────────────────────────────────────────────────────────── */

/** Main outer enclosure shell */
function EnclosureGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 0, -0.39]}>
        <boxGeometry args={[0.88, 2.08, 0.02]} />
        <meshStandardMaterial {...matProps('shell')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-0.44, 0, 0]}>
        <boxGeometry args={[0.02, 2.08, 0.78]} />
        <meshStandardMaterial {...matProps('shell')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Right wall */}
      <mesh position={[0.44, 0, 0]}>
        <boxGeometry args={[0.02, 2.08, 0.78]} />
        <meshStandardMaterial {...matProps('shell')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Top plate */}
      <mesh position={[0, 1.04, 0]}>
        <boxGeometry args={[0.88, 0.02, 0.78]} />
        <meshStandardMaterial {...matProps('shell')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Panel seam lines on sides */}
      <mesh position={[-0.451, 0.2, 0]}><boxGeometry args={[0.002, 1.2, 0.6]} /><meshStandardMaterial color="#1a1a1e" /></mesh>
      <mesh position={[0.451, 0.2, 0]}><boxGeometry args={[0.002, 1.2, 0.6]} /><meshStandardMaterial color="#1a1a1e" /></mesh>
      {/* Side vent arrays */}
      <VentSlots position={[-0.45, 0.7, 0.15]} count={10} length={0.005} rotation={[0, Math.PI / 2, 0]} />
      <VentSlots position={[-0.45, 0.7, -0.15]} count={10} length={0.005} rotation={[0, Math.PI / 2, 0]} />
      <VentSlots position={[0.45, 0.7, 0.15]} count={10} length={0.005} rotation={[0, Math.PI / 2, 0]} />
      <VentSlots position={[0.45, 0.7, -0.15]} count={10} length={0.005} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

/** Front access door */
function FrontDoorGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group>
      {/* Door panel */}
      <mesh position={[0, 0, 0.39]}>
        <boxGeometry args={[0.86, 2.06, 0.025]} />
        <meshStandardMaterial {...matProps('door')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Raised frame around door edge */}
      <mesh position={[0, 0, 0.405]}>
        <boxGeometry args={[0.88, 2.08, 0.005]} />
        <meshStandardMaterial color="#222226" roughness={0.7} metalness={0.8} transparent opacity={0.5} emissive={e} emissiveIntensity={ei * 0.3} />
      </mesh>
      {/* Gasket line */}
      <mesh position={[0, 0, 0.403]}>
        <boxGeometry args={[0.84, 2.04, 0.002]} />
        <meshStandardMaterial {...matProps('rubber')} />
      </mesh>
      {/* Hinge straps — left side */}
      {[-0.65, 0, 0.65].map((y, i) => (
        <mesh key={`hinge-${i}`} position={[-0.41, y, 0.4]}>
          <boxGeometry args={[0.04, 0.08, 0.015]} />
          <meshStandardMaterial {...matProps('aluminum')} />
        </mesh>
      ))}
      {/* Warning placard area */}
      <mesh position={[0, 0.75, 0.408]}>
        <planeGeometry args={[0.22, 0.12]} />
        <meshStandardMaterial {...matProps('label')} />
      </mesh>
      <mesh position={[0, 0.75, 0.409]}>
        <planeGeometry args={[0.20, 0.10]} />
        <meshStandardMaterial color="#111111" roughness={0.9} metalness={0} />
      </mesh>
      {/* View window */}
      <mesh position={[0.15, 0.35, 0.408]}>
        <planeGeometry args={[0.16, 0.10]} />
        <meshStandardMaterial color="#1a3040" roughness={0.1} metalness={0.2} transparent opacity={0.4} />
      </mesh>
      {/* Drip rail at top */}
      <mesh position={[0, 1.02, 0.42]}>
        <boxGeometry args={[0.88, 0.015, 0.03]} />
        <meshStandardMaterial {...matProps('aluminum')} />
      </mesh>
      {/* Bolt rows */}
      <BoltRow position={[0, 0.98, 0.41]} count={6} spacing={0.12} />
      <BoltRow position={[0, -0.98, 0.41]} count={6} spacing={0.12} />
    </group>
  );
}

/** Rear service panel */
function RearPanelGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group>
      <mesh position={[0, 0.1, -0.39]}>
        <boxGeometry args={[0.76, 1.5, 0.018]} />
        <meshStandardMaterial {...matProps('panel')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Quarter-turn fastener marks */}
      {[[-0.32, 0.7], [0.32, 0.7], [-0.32, -0.5], [0.32, -0.5]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -0.40]}>
          <cylinderGeometry args={[0.015, 0.015, 0.008, 8]} />
          <meshStandardMaterial {...matProps('aluminum')} />
        </mesh>
      ))}
      <BoltRow position={[0, 0.82, -0.40]} count={5} spacing={0.14} />
    </group>
  );
}

/** Mounting base / skid frame */
function BaseFrameGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group>
      {/* C-channels */}
      <mesh position={[-0.35, -1.06, 0]}>
        <boxGeometry args={[0.06, 0.06, 0.82]} />
        <meshStandardMaterial {...matProps('aluminum')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      <mesh position={[0.35, -1.06, 0]}>
        <boxGeometry args={[0.06, 0.06, 0.82]} />
        <meshStandardMaterial {...matProps('aluminum')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Cross members */}
      <mesh position={[0, -1.06, 0.3]}>
        <boxGeometry args={[0.76, 0.04, 0.04]} />
        <meshStandardMaterial {...matProps('aluminum')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      <mesh position={[0, -1.06, -0.3]}>
        <boxGeometry args={[0.76, 0.04, 0.04]} />
        <meshStandardMaterial {...matProps('aluminum')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Floor plate */}
      <mesh position={[0, -1.02, 0]}>
        <boxGeometry args={[0.86, 0.015, 0.78]} />
        <meshStandardMaterial {...matProps('shell')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Forklift pocket indicators */}
      <mesh position={[-0.2, -1.085, 0.42]}>
        <boxGeometry args={[0.12, 0.03, 0.02]} />
        <meshStandardMaterial {...matProps('label')} />
      </mesh>
      <mesh position={[0.2, -1.085, 0.42]}>
        <boxGeometry args={[0.12, 0.03, 0.02]} />
        <meshStandardMaterial {...matProps('label')} />
      </mesh>
      {/* Anchor bolt pads */}
      {[[-0.35, 0.35], [-0.35, -0.35], [0.35, 0.35], [0.35, -0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, -1.09, z]}>
          <cylinderGeometry args={[0.025, 0.025, 0.01, 8]} />
          <meshStandardMaterial {...matProps('aluminum')} />
        </mesh>
      ))}
    </group>
  );
}

/** Inverter module (used twice: A & B) */
function InverterModuleGeometry(sel, hov, def, yOffset = 0) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group position={[0, yOffset, 0]}>
      {/* Module housing */}
      <mesh>
        <boxGeometry args={[0.35, 0.32, 0.55]} />
        <meshStandardMaterial {...matProps('heatsink')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Heat sink fins on sides */}
      {Array.from({ length: 10 }, (_, i) => {
        const z = -0.22 + i * 0.05;
        return (
          <group key={`fin-${i}`}>
            <mesh position={[-0.185, 0, z]}>
              <boxGeometry args={[0.008, 0.28, 0.003]} />
              <meshStandardMaterial {...matProps('aluminum')} emissive={e} emissiveIntensity={ei * 0.5} />
            </mesh>
            <mesh position={[0.185, 0, z]}>
              <boxGeometry args={[0.008, 0.28, 0.003]} />
              <meshStandardMaterial {...matProps('aluminum')} emissive={e} emissiveIntensity={ei * 0.5} />
            </mesh>
          </group>
        );
      })}
      {/* Blind-mate DC connector */}
      <mesh position={[0, -0.12, -0.28]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 10]} />
        <meshStandardMaterial {...matProps('copper')} emissive={e} emissiveIntensity={ei * 0.3} />
      </mesh>
      <mesh position={[0, 0.05, -0.28]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 10]} />
        <meshStandardMaterial {...matProps('copper')} emissive={e} emissiveIntensity={ei * 0.3} />
      </mesh>
      {/* Face plate label area */}
      <mesh position={[0, 0.08, 0.278]}>
        <planeGeometry args={[0.18, 0.04]} />
        <meshStandardMaterial {...matProps('label')} />
      </mesh>
      {/* Status LED */}
      <IndicatorLED position={[0.12, 0.12, 0.278]} matKey={def.health === 'healthy' ? 'led_green' : def.health === 'warning' ? 'led_amber' : 'led_red'} />
      {/* Extraction handle */}
      <mesh position={[0, -0.14, 0.285]}>
        <boxGeometry args={[0.12, 0.02, 0.015]} />
        <meshStandardMaterial {...matProps('aluminum')} />
      </mesh>
    </group>
  );
}

/** DC Bus assembly */
function DCBusGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group>
      {/* Main bus bar */}
      <mesh>
        <boxGeometry args={[0.08, 0.7, 0.04]} />
        <meshStandardMaterial {...matProps('copper')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Negative rail */}
      <mesh position={[0.06, 0, 0]}>
        <boxGeometry args={[0.03, 0.65, 0.03]} />
        <meshStandardMaterial color="#4444cc" roughness={0.4} metalness={0.9} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Fuse holders */}
      {[-0.2, 0, 0.2].map((y, i) => (
        <group key={i} position={[-0.06, y, 0]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 0.08, 8]} />
            <meshStandardMaterial {...matProps('black')} emissive={e} emissiveIntensity={ei * 0.3} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <cylinderGeometry args={[0.008, 0.008, 0.09, 6]} />
            <meshStandardMaterial {...matProps('aluminum')} />
          </mesh>
        </group>
      ))}
      {/* Contactor */}
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.08]} />
        <meshStandardMaterial {...matProps('black')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      <IndicatorLED position={[0.04, -0.37, 0.04]} matKey="led_green" />
    </group>
  );
}

/** BMS Controller */
function BMSGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group>
      {/* PCB board */}
      <mesh>
        <boxGeometry args={[0.22, 0.18, 0.025]} />
        <meshStandardMaterial {...matProps('pcb')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Processor heat spreader */}
      <mesh position={[-0.03, 0.02, 0.018]}>
        <boxGeometry args={[0.04, 0.04, 0.012]} />
        <meshStandardMaterial {...matProps('aluminum')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Connector headers */}
      {[-0.06, 0, 0.06].map((x, i) => (
        <mesh key={i} position={[x, -0.08, 0.018]}>
          <boxGeometry args={[0.03, 0.015, 0.01]} />
          <meshStandardMaterial {...matProps('black')} />
        </mesh>
      ))}
      {/* DIN-rail clip */}
      <mesh position={[0, 0.1, -0.018]}>
        <boxGeometry args={[0.22, 0.025, 0.015]} />
        <meshStandardMaterial {...matProps('aluminum')} />
      </mesh>
      {/* Heartbeat LED */}
      <IndicatorLED position={[0.08, 0.04, 0.02]} matKey="led_green" />
    </group>
  );
}

/** Grid relay panel */
function GridRelayGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group>
      {/* Panel back plate */}
      <mesh>
        <boxGeometry args={[0.28, 0.22, 0.02]} />
        <meshStandardMaterial {...matProps('panel')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Relay modules */}
      {[-0.08, 0.08].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.025]}>
          <boxGeometry args={[0.1, 0.16, 0.04]} />
          <meshStandardMaterial {...matProps('black')} emissive={e} emissiveIntensity={ei} />
        </mesh>
      ))}
      {/* CTs */}
      <mesh position={[0, -0.13, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.03, 0.01, 8, 16]} />
        <meshStandardMaterial {...matProps('black')} emissive={e} emissiveIntensity={ei * 0.5} />
      </mesh>
      <IndicatorLED position={[0.1, 0.08, 0.05]} matKey="led_green" />
    </group>
  );
}

/** Cooling fan array */
function FanArrayGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  const FanUnit = ({ pos }) => (
    <group position={pos}>
      {/* Shroud */}
      <mesh>
        <cylinderGeometry args={[0.085, 0.085, 0.04, 20]} />
        <meshStandardMaterial {...matProps('fan')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Grill */}
      <mesh position={[0, 0.022, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.003, 20]} />
        <meshStandardMaterial color="#2a2a2e" roughness={0.5} metalness={0.8} transparent opacity={0.6} emissive={e} emissiveIntensity={ei * 0.3} />
      </mesh>
      {/* Hub */}
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.015, 10]} />
        <meshStandardMaterial {...matProps('black')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Blades (simplified 5-blade) */}
      {[0, 72, 144, 216, 288].map((deg) => (
        <mesh key={deg} position={[0, 0.018, 0]} rotation={[0, (deg * Math.PI) / 180, Math.PI / 12]}>
          <boxGeometry args={[0.06, 0.002, 0.018]} />
          <meshStandardMaterial color="#333338" roughness={0.6} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <FanUnit pos={[-0.11, 0, -0.11]} />
      <FanUnit pos={[0.11, 0, -0.11]} />
      <FanUnit pos={[-0.11, 0, 0.11]} />
      <FanUnit pos={[0.11, 0, 0.11]} />
      {/* Mounting bracket */}
      <mesh position={[0, -0.025, 0]}>
        <boxGeometry args={[0.42, 0.008, 0.42]} />
        <meshStandardMaterial {...matProps('aluminum')} emissive={e} emissiveIntensity={ei * 0.3} />
      </mesh>
    </group>
  );
}

/** Heat exchanger */
function HeatExchangerGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group>
      {/* Core block */}
      <mesh>
        <boxGeometry args={[0.3, 0.25, 0.06]} />
        <meshStandardMaterial {...matProps('aluminum')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Fin pattern (front face) */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} position={[-0.13 + i * 0.02, 0, 0.032]}>
          <boxGeometry args={[0.002, 0.22, 0.004]} />
          <meshStandardMaterial color="#9a9aa2" roughness={0.3} metalness={0.95} />
        </mesh>
      ))}
      {/* Inlet / outlet ports */}
      <mesh position={[-0.1, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
        <meshStandardMaterial {...matProps('copper')} />
      </mesh>
      <mesh position={[0.1, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
        <meshStandardMaterial {...matProps('copper')} />
      </mesh>
    </group>
  );
}

/** Coolant pump */
function CoolantPumpGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group>
      {/* Pump body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 16]} />
        <meshStandardMaterial {...matProps('black')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Inlet */}
      <mesh position={[0, 0, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.015, 0.03, 8]} />
        <meshStandardMaterial {...matProps('gland')} />
      </mesh>
      {/* Outlet */}
      <mesh position={[0, 0.04, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.015, 0.03, 8]} />
        <meshStandardMaterial {...matProps('gland')} />
      </mesh>
      {/* Mounting bracket */}
      <mesh position={[0, -0.04, -0.02]}>
        <boxGeometry args={[0.08, 0.006, 0.06]} />
        <meshStandardMaterial {...matProps('aluminum')} />
      </mesh>
    </group>
  );
}

/** Cable entry gland plate */
function CableEntryGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group>
      {/* Plate */}
      <mesh>
        <boxGeometry args={[0.7, 0.015, 0.5]} />
        <meshStandardMaterial {...matProps('panel')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* M40 glands */}
      {Array.from({ length: 6 }, (_, i) => (
        <CableGland key={`m40-${i}`} position={[-0.25 + i * 0.1, -0.01, 0.12]} />
      ))}
      {/* M25 glands */}
      {Array.from({ length: 4 }, (_, i) => (
        <CableGland key={`m25-${i}`} position={[-0.15 + i * 0.1, -0.01, -0.12]} />
      ))}
    </group>
  );
}

/** Status indicator panel */
function IndicatorPanelGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  const leds = [
    { label: 'PWR', mat: 'led_green' },
    { label: 'GRID', mat: 'led_green' },
    { label: 'INV-A', mat: 'led_green' },
    { label: 'INV-B', mat: 'led_amber' },
    { label: 'THERM', mat: 'led_green' },
    { label: 'BMS', mat: 'led_green' },
    { label: 'COMM', mat: 'led_green' },
    { label: 'FAULT', mat: 'led_red' },
  ];
  return (
    <group>
      {/* Bezel */}
      <mesh>
        <boxGeometry args={[0.32, 0.05, 0.012]} />
        <meshStandardMaterial {...matProps('black')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* LED row */}
      {leds.map((led, i) => (
        <IndicatorLED key={i} position={[-0.13 + i * 0.038, 0, 0.01]} matKey={led.mat} />
      ))}
    </group>
  );
}

/** Wiring harness */
function WiringHarnessGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group>
      {/* Main trunk */}
      <mesh>
        <cylinderGeometry args={[0.018, 0.018, 0.8, 8]} />
        <meshStandardMaterial {...matProps('black')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Branch runs */}
      {[-0.25, -0.1, 0.1, 0.25].map((y, i) => (
        <mesh key={i} position={[0.08, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.16, 6]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#333388' : '#883333'} roughness={0.8} metalness={0.1} emissive={e} emissiveIntensity={ei * 0.5} />
        </mesh>
      ))}
      {/* Cable ties */}
      {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
        <mesh key={`tie-${i}`} position={[0, y, 0]}>
          <torusGeometry args={[0.022, 0.003, 4, 12]} />
          <meshStandardMaterial color="#eeeeee" roughness={0.8} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

/** Door handle / latch */
function DoorHandleGeometry(sel, hov, def) {
  const e = hlEmissive(sel, hov, def.health);
  const ei = hlIntensity(sel, hov, def.health);
  return (
    <group>
      {/* Escutcheon plate */}
      <mesh>
        <boxGeometry args={[0.05, 0.12, 0.01]} />
        <meshStandardMaterial {...matProps('aluminum')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* T-handle shaft */}
      <mesh position={[0, 0, 0.025]}>
        <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
        <meshStandardMaterial {...matProps('aluminum')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* T-handle cross */}
      <mesh position={[0, 0, 0.048]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.06, 6]} />
        <meshStandardMaterial {...matProps('aluminum')} emissive={e} emissiveIntensity={ei} />
      </mesh>
      {/* Padlock hasp */}
      <mesh position={[0, -0.07, 0.015]}>
        <torusGeometry args={[0.012, 0.003, 6, 12, Math.PI]} />
        <meshStandardMaterial {...matProps('aluminum')} />
      </mesh>
    </group>
  );
}

/* ────────────────────────────────────────────────────────────── *
 *  CabinetAssembly — the full scene model                       *
 * ────────────────────────────────────────────────────────────── */
export default function CabinetAssembly({ selected, onSelect, exploded, isolated, activeLayers }) {
  const common = { selected, onSelect, exploded, isolated, activeLayers };
  return (
    <group>
      <SelectablePart id="enclosure" position={[0, 0, 0]} {...common}>
        {(sel, hov, def) => EnclosureGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="front-door" position={[0, 0, 0]} {...common}>
        {(sel, hov, def) => FrontDoorGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="rear-panel" position={[0, 0, 0]} {...common}>
        {(sel, hov, def) => RearPanelGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="base-frame" position={[0, 0, 0]} {...common}>
        {(sel, hov, def) => BaseFrameGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="inverter-module-a" position={[-0.12, 0.4, 0.05]} {...common}>
        {(sel, hov, def) => InverterModuleGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="inverter-module-b" position={[-0.12, -0.05, 0.05]} {...common}>
        {(sel, hov, def) => InverterModuleGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="dc-bus" position={[0.3, 0.15, -0.1]} {...common}>
        {(sel, hov, def) => DCBusGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="bms-controller" position={[0.25, -0.55, -0.05]} {...common}>
        {(sel, hov, def) => BMSGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="grid-relay" position={[0.22, 0.7, -0.15]} {...common}>
        {(sel, hov, def) => GridRelayGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="cooling-fans" position={[0, 0.88, 0.2]} {...common}>
        {(sel, hov, def) => FanArrayGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="heat-exchanger" position={[0, 0.65, 0.25]} {...common}>
        {(sel, hov, def) => HeatExchangerGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="coolant-pump" position={[-0.25, -0.7, 0.2]} {...common}>
        {(sel, hov, def) => CoolantPumpGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="cable-entry" position={[0, -1.01, 0]} {...common}>
        {(sel, hov, def) => CableEntryGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="indicator-panel" position={[0, 0.95, 0.41]} {...common}>
        {(sel, hov, def) => IndicatorPanelGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="wiring-harness" position={[-0.35, 0, -0.2]} {...common}>
        {(sel, hov, def) => WiringHarnessGeometry(sel, hov, def)}
      </SelectablePart>

      <SelectablePart id="door-handle" position={[0.35, 0, 0.42]} {...common}>
        {(sel, hov, def) => DoorHandleGeometry(sel, hov, def)}
      </SelectablePart>
    </group>
  );
}
