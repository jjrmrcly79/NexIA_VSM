import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { analyzeADKAR, simulateChange, calculateLeadTime, calculateProcessTime, calculatePCE, calculateTaktTime, calculateAvailableMinutes, identifyBottleneck, fmtTime, fmtPercent, fmt } from '../utils/helpers';
import './Analysis.css';

const ADKAR_LABELS = { awareness: 'Conciencia', desire: 'Deseo', knowledge: 'Conocimiento', ability: 'Habilidad', reinforcement: 'Refuerzo' };
const RESISTANCE_MAP = { active: { label: 'Activa', color: 'var(--color-red)', emoji: '🔴' }, passive: { label: 'Pasiva', color: 'var(--color-amber)', emoji: '🟡' }, covert: { label: 'Encubierta', color: 'var(--color-orange)', emoji: '🟠' }, neutral: { label: 'Neutral', color: 'var(--color-green)', emoji: '🟢' } };

export default function Analysis() {
  const { activeProject: p, dispatch } = useApp();
  const [tab, setTab] = useState('adkar');
  const [simMods, setSimMods] = useState({});

  if (!p) return <div className="page-container"><div className="empty-state"><div className="empty-state-icon">🔬</div><p>Selecciona un proyecto primero</p></div></div>;

  const adkar = p.adkar || { awareness: 3, desire: 3, knowledge: 3, ability: 3, reinforcement: 3 };
  const analysis = analyzeADKAR(adkar);
  const resist = RESISTANCE_MAP[analysis.resistanceType];

  const radarData = Object.entries(ADKAR_LABELS).map(([key, label]) => ({ dimension: label, value: adkar[key] || 0 }));

  const updateAdkar = (dim, val) => dispatch({ type: 'UPDATE_ADKAR', payload: { [dim]: Number(val) } });

  // Simulation
  const steps = p.steps || [];
  const config = p.config || {};
  const availMin = calculateAvailableMinutes(config);
  const takt = calculateTaktTime(config.demandUnits, availMin);

  const currentMetrics = useMemo(() => {
    const lt = calculateLeadTime(steps);
    const pt = calculateProcessTime(steps);
    return { leadTime: lt, processTime: pt, pce: calculatePCE(pt, lt), bottleneck: identifyBottleneck(steps, takt)?.name || 'Ninguno' };
  }, [steps, takt]);

  const simSteps = useMemo(() => simulateChange(steps, simMods), [steps, simMods]);
  const simMetrics = useMemo(() => {
    const lt = calculateLeadTime(simSteps);
    const pt = calculateProcessTime(simSteps);
    return { leadTime: lt, processTime: pt, pce: calculatePCE(pt, lt), bottleneck: identifyBottleneck(simSteps, takt)?.name || 'Ninguno' };
  }, [simSteps, takt]);

  const updateSim = (stepId, field, value) => {
    setSimMods(prev => ({ ...prev, [stepId]: { ...prev[stepId], [field]: Number(value) } }));
  };

  const comparisonData = steps.map(s => ({
    name: s.name.length > 12 ? s.name.slice(0, 12) + '…' : s.name,
    'C/T Actual': (s.cycleTime || 0) / (s.operators || 1),
    'C/T Simulado': ((simMods[s.id]?.cycleTime ?? s.cycleTime) || 0) / ((simMods[s.id]?.operators ?? s.operators) || 1),
    takt,
  }));

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>🔬 Análisis Avanzado</h1>
          <p className="page-subtitle">Diagnóstico de resistencia al cambio (ADKAR) y simulación de escenarios (Sombra Digital).</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === 'adkar' ? 'active' : ''}`} onClick={() => setTab('adkar')}>🧠 ADKAR</button>
        <button className={`tab-btn ${tab === 'simulation' ? 'active' : ''}`} onClick={() => setTab('simulation')}>🌐 Sombra Digital</button>
      </div>

      {tab === 'adkar' && (
        <div className="analysis-tabs-content">
          <div className="grid-2">
            {/* Radar Chart */}
            <div className="glass-card">
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Radar de Preparación</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(20,184,166,0.15)" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#8892b0', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#5a6588', fontSize: 10 }} />
                  <Radar name="ADKAR" dataKey="value" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Resistance Card */}
            <div>
              <div className="glass-card resistance-card" style={{ background: `linear-gradient(135deg, ${resist.color}15, transparent)`, border: `1px solid ${resist.color}30`, marginBottom: 'var(--space-lg)' }}>
                <div style={{ fontSize: '2.5rem' }}>{resist.emoji}</div>
                <div className="resistance-type" style={{ color: resist.color }}>{resist.label}</div>
                <p style={{ fontSize: '0.85rem' }}>Promedio ADKAR: <strong className="mono">{fmt(analysis.avg, 1)}/5</strong></p>
                <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Dimensión más débil: <strong>{ADKAR_LABELS[analysis.weakest]}</strong></p>
              </div>
              <div className="glass-card">
                <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-accent)' }}>💡 Recomendación</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{analysis.recommendation}</p>
              </div>
            </div>
          </div>

          {/* ADKAR Sliders */}
          <div className="glass-card" style={{ marginTop: 'var(--space-lg)' }}>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Evaluación ADKAR por Equipo</h3>
            {Object.entries(ADKAR_LABELS).map(([key, label]) => (
              <div className="adkar-grid" key={key} style={{ marginBottom: 'var(--space-md)' }}>
                <div className="adkar-dimension">{label}</div>
                <input type="range" className="range-slider" min="1" max="5" step="1" value={adkar[key] || 3} onChange={e => updateAdkar(key, e.target.value)} />
                <div className="adkar-score" style={{ color: adkar[key] >= 4 ? 'var(--color-green)' : adkar[key] >= 3 ? 'var(--color-amber)' : 'var(--color-red)' }}>{adkar[key] || 3}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'simulation' && (
        <div className="analysis-tabs-content">
          {steps.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📦</div><p>Agrega pasos en el Lienzo VSM para simular escenarios</p></div>
          ) : (
            <>
              {/* Comparison Metrics */}
              <div className="grid-4" style={{ marginBottom: 'var(--space-lg)' }}>
                {[
                  { label: 'Lead Time', curr: fmtTime(currentMetrics.leadTime), sim: fmtTime(simMetrics.leadTime), better: simMetrics.leadTime < currentMetrics.leadTime },
                  { label: 'Proceso', curr: fmtTime(currentMetrics.processTime), sim: fmtTime(simMetrics.processTime), better: simMetrics.processTime < currentMetrics.processTime },
                  { label: 'PCE', curr: fmtPercent(currentMetrics.pce), sim: fmtPercent(simMetrics.pce), better: simMetrics.pce > currentMetrics.pce },
                  { label: 'Cuello Botella', curr: currentMetrics.bottleneck, sim: simMetrics.bottleneck, better: simMetrics.bottleneck === 'Ninguno' },
                ].map(m => (
                  <div key={m.label} className="glass-card stat-card">
                    <div className="stat-label">{m.label}</div>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'baseline' }}>
                      <span className="mono" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textDecoration: 'line-through' }}>{m.curr}</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>→</span>
                      <span className="mono" style={{ color: m.better ? 'var(--color-green)' : 'var(--color-amber)', fontSize: '1.1rem', fontWeight: 700 }}>{m.sim}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulation Parameters */}
              <div className="glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>🎛️ Parámetros de Simulación</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Paso</th>
                        <th>C/T Actual</th>
                        <th>C/T Simulado</th>
                        <th>C/O Actual</th>
                        <th>C/O Simulado</th>
                        <th>Espera</th>
                      </tr>
                    </thead>
                    <tbody>
                      {steps.map(s => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 500 }}>{s.name}</td>
                          <td className="mono text-muted">{fmtTime(s.cycleTime)}</td>
                          <td><input className="form-input" type="number" min="0" value={simMods[s.id]?.cycleTime ?? s.cycleTime} onChange={e => updateSim(s.id, 'cycleTime', e.target.value)} style={{ width: 90, padding: '6px 8px' }} /></td>
                          <td className="mono text-muted">{fmtTime(s.changeoverTime)}</td>
                          <td><input className="form-input" type="number" min="0" value={simMods[s.id]?.changeoverTime ?? s.changeoverTime} onChange={e => updateSim(s.id, 'changeoverTime', e.target.value)} style={{ width: 90, padding: '6px 8px' }} /></td>
                          <td><input className="form-input" type="number" min="0" value={simMods[s.id]?.waitTime ?? s.waitTime} onChange={e => updateSim(s.id, 'waitTime', e.target.value)} style={{ width: 90, padding: '6px 8px' }} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSimMods({})}>Resetear</button>
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="glass-card">
                <h3 style={{ marginBottom: 'var(--space-md)' }}>📊 Comparativa de Ciclos</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,184,166,0.1)" />
                    <XAxis dataKey="name" tick={{ fill: '#8892b0', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#5a6588', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#112240', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 8, color: '#ccd6f6' }} />
                    <Legend />
                    <Bar dataKey="C/T Actual" fill="#8892b0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="C/T Simulado" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
