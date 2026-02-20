'use client';

import { motion } from 'framer-motion';
import { MOCK_SCENARIOS } from '@/lib/mockData';
import { useEmergencyStore } from '@/store/emergencyStore';

export function ScenarioGrid() {
  const { submitEmergency, setEmergencyType, setEmergencyText } = useEmergencyStore();

  const handleScenarioClick = (scenarioId: number, scenarioName: string) => {
    setEmergencyType(scenarioName);
    setEmergencyText(`I need help with a ${scenarioName} emergency`);
    submitEmergency(scenarioId);
    document.getElementById('results-panel')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="coverage"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-heading text-2xl sm:text-3xl tracking-[0.2em] text-white mb-10 text-center"
      >
        EMERGENCY SCENARIOS
      </motion.h2>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {MOCK_SCENARIOS.map((scenario, i) => (
          <motion.button
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleScenarioClick(scenario.id, scenario.name)}
            className="group scenario-card glass-panel rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 text-left"
            style={{ '--glow': scenario.glowColor } as React.CSSProperties}
          >
            <div className="scenario-icon-wrap relative flex items-center justify-center">
              <div
                className="scenario-glow-halo absolute rounded-full"
                style={{ background: `radial-gradient(circle, ${scenario.glowColor}40 0%, ${scenario.glowColor}15 40%, transparent 70%)` }}
              />
              <span className="scenario-icon text-4xl sm:text-5xl relative z-10">{scenario.icon}</span>
            </div>
            <span className="font-heading text-sm sm:text-base tracking-wider text-white">
              {scenario.name}
            </span>
            <span
              className="scenario-cta font-body text-xs opacity-0 group-hover:opacity-100"
              style={{ color: scenario.glowColor }}
            >
              CLICK TO GET GUIDANCE
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
