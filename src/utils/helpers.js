/* --- Unique ID --- */
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

/* --- Formatting --- */
export const fmt = (n, decimals = 1) => {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toFixed(decimals);
};

export const fmtTime = (seconds) => {
  if (!seconds || seconds <= 0) return '0s';
  if (seconds < 60) return `${fmt(seconds, 0)}s`;
  if (seconds < 3600) return `${fmt(seconds / 60, 1)} min`;
  return `${fmt(seconds / 3600, 1)} hrs`;
};

export const fmtPercent = (value) => {
  if (value == null || isNaN(value)) return '—';
  return `${fmt(value * 100, 1)}%`;
};

/* --- Takt Time Calculation --- */
export const calculateTaktTime = (demand, availableMinutes) => {
  if (!demand || demand <= 0 || !availableMinutes || availableMinutes <= 0) return 0;
  return (availableMinutes * 60) / demand; // seconds per unit
};

/* --- Available Time Calculation --- */
export const calculateAvailableMinutes = (config) => {
  const { shiftsPerDay = 1, hoursPerShift = 8, breakMinutes = 0, meetingMinutes = 0 } = config;
  const totalMinutes = shiftsPerDay * hoursPerShift * 60;
  return totalMinutes - breakMinutes - meetingMinutes;
};

/* --- Lead Time (total time including waits) --- */
export const calculateLeadTime = (steps) => {
  if (!steps || steps.length === 0) return 0;
  let leadTime = 0;
  steps.forEach(step => {
    leadTime += (step.cycleTime || 0);
    leadTime += (step.waitTime || 0);
  });
  return leadTime; // seconds
};

/* --- Process Time (value-add only) --- */
export const calculateProcessTime = (steps) => {
  if (!steps || steps.length === 0) return 0;
  return steps.reduce((sum, step) => sum + (step.cycleTime || 0), 0);
};

/* --- Total Wait Time --- */
export const calculateTotalWait = (steps) => {
  if (!steps || steps.length === 0) return 0;
  return steps.reduce((sum, step) => sum + (step.waitTime || 0), 0);
};

/* --- Process Cycle Efficiency --- */
export const calculatePCE = (processTime, leadTime) => {
  if (!leadTime || leadTime <= 0) return 0;
  return processTime / leadTime; // 0-1
};

/* --- OEE (Overall Equipment Effectiveness) --- */
export const calculateOEE = (availability, performance, quality) => {
  return (availability || 0) * (performance || 0) * (quality || 0); // 0-1
};

/* --- Identify Bottleneck --- */
export const identifyBottleneck = (steps, taktTime) => {
  if (!steps || steps.length === 0 || !taktTime) return null;
  let maxCycleTime = 0;
  let bottleneck = null;
  steps.forEach(step => {
    const effectiveCT = (step.cycleTime || 0) / (step.operators || 1);
    if (effectiveCT > maxCycleTime) {
      maxCycleTime = effectiveCT;
      bottleneck = { ...step, effectiveCT };
    }
  });
  if (bottleneck && bottleneck.effectiveCT > taktTime) {
    return bottleneck;
  }
  return null;
};

/* --- Simulate Change (Digital Shadow) --- */
export const simulateChange = (steps, modifications) => {
  return steps.map(step => {
    const mod = modifications[step.id];
    if (!mod) return { ...step };
    return {
      ...step,
      cycleTime: mod.cycleTime ?? step.cycleTime,
      changeoverTime: mod.changeoverTime ?? step.changeoverTime,
      quality: mod.quality ?? step.quality,
      uptime: mod.uptime ?? step.uptime,
      operators: mod.operators ?? step.operators,
      waitTime: mod.waitTime ?? step.waitTime,
    };
  });
};

/* --- ADKAR Score Analysis --- */
export const analyzeADKAR = (scores) => {
  const dimensions = ['awareness', 'desire', 'knowledge', 'ability', 'reinforcement'];
  const avg = dimensions.reduce((s, d) => s + (scores[d] || 0), 0) / 5;
  const weakest = dimensions.reduce((w, d) =>
    (scores[d] || 0) < (scores[w] || 0) ? d : w
  , dimensions[0]);

  let resistanceType = 'neutral';
  if (avg < 2) resistanceType = 'active';
  else if (avg < 3) resistanceType = 'passive';
  else if (scores[weakest] < 2) resistanceType = 'covert';

  const recommendations = {
    awareness: 'Comunicar el "porqué" del cambio con datos y casos reales.',
    desire: 'Involucrar líderes como sponsors. Mostrar beneficios individuales.',
    knowledge: 'Capacitar al equipo con talleres prácticos y mentoría.',
    ability: 'Proveer coaching, recursos y tiempo para practicar.',
    reinforcement: 'Celebrar logros, medir resultados y dar reconocimiento.',
  };

  return { avg, weakest, resistanceType, recommendation: recommendations[weakest] };
};

/* --- Color helpers --- */
export const getStatusColor = (status) => {
  const map = {
    todo: 'var(--color-text-muted)',
    'in-progress': 'var(--color-amber)',
    done: 'var(--color-green)',
    blocked: 'var(--color-red)',
  };
  return map[status] || 'var(--color-text-muted)';
};

export const getSkillColor = (level) => {
  return `skill-level-${Math.min(Math.max(level || 0, 0), 4)}`;
};
