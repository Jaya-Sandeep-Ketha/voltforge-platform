/**
 * Workflow Management Data
 *
 * Defines maintenance and repair workflows for VoltForge energy assets.
 * This module contains standardized procedures, safety protocols, and tool
 * requirements for common maintenance tasks on energy storage systems.
 *
 * Workflow categories:
 * - Cell Replacement: Battery module replacement procedures
 * - Thermal System Service: Cooling system maintenance
 * - Communication Bus Repair: Network and communication fixes
 * - Fan Assembly Replacement: Cooling fan maintenance
 * - Firmware Update: Software update procedures
 * - Coolant System Flush: Thermal system fluid maintenance
 * - Inverter Board Swap: Power electronics replacement
 * - Contactor Replacement: Switch component maintenance
 * - Full System Diagnostic: Comprehensive system checks
 *
 * @author VoltForge Team
 * @version 1.0.0
 */

// Common issue types that require maintenance workflows
export const issueTypes = [
  "Cell Replacement",
  "Thermal System Service",
  "Communication Bus Repair",
  "Fan Assembly Replacement",
  "Firmware Update",
  "Coolant System Flush",
  "Inverter Board Swap",
  "Contactor Replacement",
  "Full System Diagnostic",
];

// Component families that can be serviced or replaced
export const componentFamilies = [
  "Battery Module",
  "Inverter Board",
  "Thermal Management Unit",
  "BMS Controller",
  "DC-DC Converter",
  "Cooling Fan Assembly",
  "Communication Gateway",
  "Power Electronics Module",
  "Charging Cable Assembly",
];

// Severity levels for maintenance prioritization
export const severityLevels = ["Critical", "High", "Medium", "Low"];

/**
 * Standardized workflow templates for common maintenance procedures
 * Each template includes safety requirements, tools, and step-by-step instructions
 */
export const workflowTemplates = [
  {
    id: "wf-001",
    issueType: "Cell Replacement",
    componentFamily: "Battery Module",
    estimatedDuration: "2.5 hours",
    safetyNotes: [
      "De-energize all DC bus connections before proceeding",
      "Wear Class 0 insulating gloves rated for 1000V DC",
      "Verify zero-energy state with multimeter before contact",
      "Keep Class D fire extinguisher within arm's reach",
    ],
    requiredTools: [
      "Insulated torque wrench set (10-45 Nm)",
      "Battery module lifting fixture (rated 85 kg)",
      "Digital multimeter (CAT III rated)",
      "Thermal imaging camera",
      "Torque-angle gauge",
      "Anti-static wrist strap",
    ],
    steps: [
      {
        order: 1,
        title: "Isolate Energy Source",
        description:
          "Open DC disconnect switch. Verify <1V residual on bus bars using CAT III multimeter. Apply LOTO tag.",
        duration: "15 min",
        critical: true,
      },
      {
        order: 2,
        title: "Remove Module Cover",
        description:
          "Remove 12x M6 fasteners from module cover plate. Note torque sequence marking for reinstallation.",
        duration: "10 min",
        critical: false,
      },
      {
        order: 3,
        title: "Disconnect Module Harness",
        description:
          "Disconnect CAN bus, thermistor leads, and power terminals. Label all connections per wiring diagram VF-WD-2024-03.",
        duration: "15 min",
        critical: true,
      },
      {
        order: 4,
        title: "Extract Faulty Module",
        description:
          "Attach lifting fixture to module guide rails. Slide module out on service rails. Place on ESD-safe work surface.",
        duration: "20 min",
        critical: false,
      },
      {
        order: 5,
        title: "Install Replacement Module",
        description:
          "Verify replacement module S/N matches work order. Slide into bay. Torque mounting bolts to 25 Nm ± 2 Nm.",
        duration: "20 min",
        critical: true,
      },
      {
        order: 6,
        title: "Reconnect Harness",
        description:
          "Reconnect all leads per wiring diagram. Verify terminal torques: power 15 Nm, signal 1.5 Nm.",
        duration: "15 min",
        critical: true,
      },
      {
        order: 7,
        title: "Run Post-Install Validation",
        description:
          "Execute QC check: voltage_consistency, thermal_spread, comm_bus. All must pass before energizing.",
        duration: "20 min",
        critical: true,
      },
      {
        order: 8,
        title: "Energize and Monitor",
        description:
          "Close DC disconnect. Monitor for 15 min. Verify cell balancing initiates within 5 min. Check thermal profile.",
        duration: "25 min",
        critical: false,
      },
    ],
    linkedComponent: "Battery Module A",
  },
  {
    id: "wf-002",
    issueType: "Thermal System Service",
    componentFamily: "Thermal Management Unit",
    estimatedDuration: "1.5 hours",
    safetyNotes: [
      "Coolant may be under pressure — release slowly via service valve",
      "Wear chemical-resistant gloves when handling glycol coolant",
      "Ensure adequate ventilation in enclosed spaces",
    ],
    requiredTools: [
      "Coolant pressure gauge (0-30 PSI)",
      "Refractometer for glycol concentration",
      "Vacuum pump for coolant evacuation",
      "Replacement O-ring kit (FK-TM-2024)",
      "Infrared thermometer",
    ],
    steps: [
      {
        order: 1,
        title: "Shut Down Thermal Loop",
        description:
          "Disable thermal management via BMS interface. Wait for pump to fully stop. Verify zero flow on gauge.",
        duration: "5 min",
        critical: true,
      },
      {
        order: 2,
        title: "Drain Coolant Loop",
        description:
          "Connect drain line to service port. Open drain valve. Collect coolant in approved container for proper disposal.",
        duration: "15 min",
        critical: false,
      },
      {
        order: 3,
        title: "Inspect Heat Exchanger",
        description:
          "Remove heat exchanger access panel. Inspect for scale buildup, corrosion, or debris. Clean with approved solvent.",
        duration: "20 min",
        critical: false,
      },
      {
        order: 4,
        title: "Replace O-Rings and Seals",
        description:
          "Replace all coolant loop O-rings with kit FK-TM-2024. Apply thin coat of silicone lubricant to each seal.",
        duration: "15 min",
        critical: false,
      },
      {
        order: 5,
        title: "Refill and Bleed",
        description:
          "Fill loop with 50/50 propylene glycol mix. Run pump at low speed for 10 min to purge air. Verify no bubbles at sight glass.",
        duration: "20 min",
        critical: true,
      },
      {
        order: 6,
        title: "Pressure Test",
        description:
          "Pressurize to 20 PSI. Hold for 10 min. Acceptable leak rate: <0.5 PSI drop. Inspect all fittings.",
        duration: "15 min",
        critical: true,
      },
    ],
    linkedComponent: "Thermal Management Unit",
  },
  {
    id: "wf-003",
    issueType: "Fan Assembly Replacement",
    componentFamily: "Cooling Fan Assembly",
    estimatedDuration: "45 min",
    safetyNotes: [
      "Verify fan power circuit is de-energized",
      "Watch for sharp fan blade edges during removal",
    ],
    requiredTools: [
      "Phillips #2 screwdriver",
      "Fan speed tester",
      "Replacement fan unit",
      "Cable ties",
      "Multimeter",
    ],
    steps: [
      {
        order: 1,
        title: "De-energize Fan Circuit",
        description:
          "Disable fan power at BMS controller. Verify 0V at fan connector with multimeter.",
        duration: "5 min",
        critical: true,
      },
      {
        order: 2,
        title: "Remove Failed Fan",
        description:
          "Remove 4x mounting screws. Disconnect PWM signal and power leads. Extract fan from housing.",
        duration: "10 min",
        critical: false,
      },
      {
        order: 3,
        title: "Install Replacement",
        description:
          "Seat new fan in housing. Verify airflow arrow matches system direction. Secure with mounting screws.",
        duration: "10 min",
        critical: false,
      },
      {
        order: 4,
        title: "Connect and Test",
        description:
          "Reconnect leads. Run fan speed test: verify 1200-3600 RPM range across PWM duty cycle.",
        duration: "10 min",
        critical: true,
      },
      {
        order: 5,
        title: "Verify Thermal Response",
        description:
          "Run controlled heat cycle. Confirm fan engages within 5s of threshold crossing.",
        duration: "10 min",
        critical: false,
      },
    ],
    linkedComponent: "Cooling Fan Assembly",
  },
];

/**
 * Retrieves workflow template for a specific issue type
 * @param {string} issueType - Type of issue to find workflow for
 * @returns {Object|undefined} Workflow template or undefined if not found
 */
export const getWorkflowByIssue = (issueType) =>
  workflowTemplates.find((w) => w.issueType === issueType);
