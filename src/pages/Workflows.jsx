/**
 * Maintenance Workflows Page
 * 
 * Interactive workflow management interface for maintenance and repair procedures.
 * This page provides guided step-by-step instructions for resolving common issues
 * with safety protocols, required tools, and integration with 3D component visualization.
 * 
 * Workflow features:
 * - Issue type and component family filtering
 * - Step-by-step repair procedures with timing estimates
 * - Critical step identification and safety warnings
 * - Required tools and equipment lists
 * - Safety notes and hazard warnings
 * - Integration with 3D viewer for component visualization
 * - Procedure metadata and duration tracking
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Shield,
  Clock,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Rotate3d,
  ListChecks,
  Hammer,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, LoadingPage } from '@/components/ui';
import { workflowService } from '@/services/api';
import { issueTypes, componentFamilies, severityLevels } from '@/data/workflows';

/**
 * Individual workflow step card component
 * Displays step information with interactive selection and visual feedback
 * @param {Object} props - Component props
 * @param {Object} props.step - Step object with title, description, duration, and critical flag
 * @param {number} props.index - Step index in the workflow sequence
 * @param {boolean} props.isActive - Whether this step is currently selected/active
 * @param {Function} props.onClick - Click handler for step selection
 * @returns {JSX.Element} Step card component
 */
function StepCard({ step, index, isActive, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`relative pl-10 pr-4 py-4 rounded-lg border cursor-pointer transition-all ${
        isActive
          ? 'bg-red-500/5 border-red-500/20'
          : 'bg-zinc-900/40 border-zinc-800/40 hover:bg-zinc-800/30'
      }`}
    >
      {/* Step number indicator */}
      <div className={`absolute left-3 top-4 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
        isActive ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-500'
      }`}>
        {step.order}
      </div>

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-zinc-200">{step.title}</h4>
            {step.critical && (
              <Badge variant="danger" className="text-[9px]">CRITICAL</Badge>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{step.description}</p>
        </div>
        <div className="flex items-center gap-1 text-zinc-600 ml-3 flex-shrink-0">
          <Clock className="h-3 w-3" />
          <span className="text-[10px]">{step.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Workflows Management Component
 * 
 * Main workflows page providing interactive maintenance procedure guidance
 * with filtering, step-by-step instructions, safety information, and 3D viewer integration.
 * 
 * @returns {JSX.Element} Workflows management page component
 */
export function Workflows() {
  const navigate = useNavigate();
  
  // State management for workflow selection and display
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  /**
   * Load workflow templates on component mount
   */
  useEffect(() => {
    workflowService.getTemplates().then((t) => {
      setTemplates(t);
      setLoading(false);
    });
  }, []);

  /**
   * Update active workflow when issue type changes
   * Resets step selection and finds matching workflow template
   */
  useEffect(() => {
    if (selectedIssue) {
      const wf = templates.find((t) => t.issueType === selectedIssue);
      setActiveWorkflow(wf || null);
      setActiveStep(0);
    } else {
      setActiveWorkflow(null);
    }
  }, [selectedIssue, templates]);

  // Loading state handling
  if (loading) return <LoadingPage />;

  return (
    <div className="space-y-6">
      {/* Workflow Selection Controls */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Issue Type Selection */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Issue Type</label>
          <select
            value={selectedIssue}
            onChange={(e) => setSelectedIssue(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 focus:outline-none focus:border-red-500/50"
          >
            <option value="">Select issue type…</option>
            {issueTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Component Family Selection */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Component Family</label>
          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 focus:outline-none focus:border-red-500/50"
          >
            <option value="">Select component…</option>
            {componentFamilies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Severity Level Selection */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Severity</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 focus:outline-none focus:border-red-500/50"
          >
            <option value="">Select severity…</option>
            {severityLevels.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Workflow Content Display */}
      <AnimatePresence mode="wait">
        {activeWorkflow ? (
          <motion.div
            key={activeWorkflow.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Main Workflow Steps Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Workflow Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-100">{activeWorkflow.issueType}</h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm text-zinc-400">{activeWorkflow.estimatedDuration}</span>
                </div>
              </div>

              {/* Step Cards */}
              <div className="space-y-2">
                {activeWorkflow.steps.map((step, idx) => (
                  <StepCard
                    key={step.order}
                    step={step}
                    index={idx}
                    isActive={activeStep === idx}
                    onClick={() => setActiveStep(idx)}
                  />
                ))}
              </div>

              {/* 3D Viewer Integration */}
              {activeWorkflow.linkedComponent && (
                <button
                  onClick={() => navigate('/viewer')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 transition-colors text-sm font-medium"
                >
                  <Rotate3d className="h-4 w-4" />
                  View {activeWorkflow.linkedComponent} in 3D Viewer
                </button>
              )}
            </div>

            {/* Side Information Panel */}
            <div className="space-y-4">
              {/* Safety Notes Section */}
              <Card hover={false}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-400" />
                    <CardTitle>Safety Notes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {activeWorkflow.safetyNotes.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded bg-amber-500/5 border border-amber-500/10">
                      <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Required Tools Section */}
              <Card hover={false}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Hammer className="h-4 w-4 text-zinc-400" />
                    <CardTitle>Required Tools</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {activeWorkflow.requiredTools.map((tool, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-zinc-400">
                        <div className="h-1 w-1 rounded-full bg-zinc-600 flex-shrink-0" />
                        {tool}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Procedure Metadata */}
              <Card hover={false}>
                <CardHeader>
                  <CardTitle>Procedure Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Component Family</span>
                    <span className="text-zinc-300">{activeWorkflow.componentFamily}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Total Steps</span>
                    <span className="text-zinc-300">{activeWorkflow.steps.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Critical Steps</span>
                    <span className="text-red-400">{activeWorkflow.steps.filter((s) => s.critical).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Est. Duration</span>
                    <span className="text-zinc-300">{activeWorkflow.estimatedDuration}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          // Empty state when no workflow is selected
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ListChecks className="h-16 w-16 text-zinc-800 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-400 mb-2">Select a Workflow</h3>
            <p className="text-sm text-zinc-600 max-w-md mx-auto">
              Choose an issue type from the dropdowns above to view guided repair procedures,
              required tools, and safety protocols.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedIssue(t.issueType)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all"
                >
                  {t.issueType}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
