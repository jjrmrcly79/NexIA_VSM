import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { calculateLeadTime, calculateProcessTime, calculatePCE, calculateTaktTime, calculateAvailableMinutes, fmtTime, fmtPercent, fmt } from '../utils/helpers';
import './Dashboards.css';

const COLORS = ['#14b8a6', '#22d3ee', '#60a5fa', '#a78bfa', '#f59e0b', '#f87171'];

export default function Dashboards() {
  const { activeProject: p, dispatch } = useApp();
  const [tab, setTab] = useState('operational');

  if (!p) return <div className="page-container"><div className="empty-state"><div className="empty-state-icon">📊</div><p>Selecciona un proyecto primero</p></div></div>;

  const steps = p.steps || [];
  const config = p.config || {};
  const availMin = calculateAvailableMinutes(config);
  const takt = calculateTaktTime(config.demandUnits, availMin);
  const leadTime = calculateLeadTime(steps);
  const processTime = calculateProcessTime(steps);
  const pce = calculatePCE(processTime, leadTime);
  const env = p.metrics?.environmental || {};
  const social = p.metrics?.social || {};

  const updateEnv = (field, val) => dispatch({ type: 'UPDATE_METRICS', payload: { category: 'environmental', data: { [field]: Number(val) } } });
  const updateSocial = (field, val) => dispatch({ type: 'UPDATE_METRICS', payload: { category: 'social', data: { [field]: field === 'ergonomicRisk' ? val : Number(val) } } });

  const cycleData = steps.map(s => ({ name: s.name.length > 10 ? s.name.slice(0, 10) + '…' : s.name, 'C/T': s.cycleTime || 0, 'C/O': s.changeoverTime || 0 }));
  const qualityData = steps.map(s => ({ name: s.name.length > 10 ? s.name.slice(0, 10) + '…' : s.name, Calidad: (s.quality || 0) * 100 }));
  const inventoryData = steps.map(s => ({ name: s.name.length > 10 ? s.name.slice(0, 10) + '…' : s.name, Inventario: s.inventory || 0 }));

  const wasteTotal = (env.wasteKg || 0);
  const envData = [
    { name: 'Energía', value: env.energyKwh || 0 },
    { name: 'CO₂', value: env.co2Kg || 0 },
    { name: 'Agua', value: env.waterLiters || 0 },
    { name: 'Residuos', value: env.wasteKg || 0 },
  ];

  // Simple sustainability score
  const susScore = Math.max(0, 100 - (env.co2Kg || 0) / 5 - (env.wasteKg || 0) / 2 - (env.waterLiters || 0) / 50);

  const ergoColor = social.ergonomicRisk === 'low' ? 'var(--color-green)' : social.ergonomicRisk === 'medium' ? 'var(--color-amber)' : 'var(--color-red)';

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>📊 Dashboards 360°</h1>
          <p className="page-subtitle">Métricas operativas, ambientales y sociales para un sistema sostenible.</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === 'operational' ? 'active' : ''}`} onClick={() => setTab('operational')}>⚙️ Operativas</button>
        <button className={`tab-btn ${tab === 'environmental' ? 'active' : ''}`} onClick={() => setTab('environmental')}>🌿 Green VSM</button>
        <button className={`tab-btn ${tab === 'social' ? 'active' : ''}`} onClick={() => setTab('social')}>👥 Social</button>
      </div>

      {/* Operational */}
      {tab === 'operational' && (
        <div className="dashboards-tabs-content">
          <div className="grid-4" style={{ marginBottom: 'var(--space-lg)' }}>
            {[
              { label: 'Lead Time', value: fmtTime(leadTime), color: 'var(--color-text-bright)' },
              { label: 'Tiempo Proceso', value: fmtTime(processTime), color: 'var(--color-green)' },
              { label: 'PCE', value: fmtPercent(pce), color: 'var(--color-accent)' },
              { label: 'Takt Time', value: fmtTime(takt), color: 'var(--color-cyan)' },
            ].map(m => (
              <div key={m.label} className="glass-card stat-card">
                <div className="stat-label">{m.label}</div>
                <div className="stat-value" style={{ fontSize: '1.5rem', color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          <div className="grid-2">
            <div className="glass-card">
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Tiempos de Ciclo y Cambio</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={cycleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,184,166,0.1)" />
                  <XAxis dataKey="name" tick={{ fill: '#8892b0', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#5a6588', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#112240', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 8, color: '#ccd6f6' }} />
                  <Legend />
                  <Bar dataKey="C/T" fill="#14b8a6" radius={[4,4,0,0]} />
                  <Bar dataKey="C/O" fill="#f59e0b" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card">
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Calidad % (First Pass Yield)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,184,166,0.1)" />
                  <XAxis dataKey="name" tick={{ fill: '#8892b0', fontSize: 10 }} />
                  <YAxis domain={[80, 100]} tick={{ fill: '#5a6588', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#112240', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 8, color: '#ccd6f6' }} />
                  <Bar dataKey="Calidad" fill="#34d399" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card" style={{ marginTop: 'var(--space-lg)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Inventario en Proceso (WIP)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,184,166,0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#8892b0', fontSize: 10 }} />
                <YAxis tick={{ fill: '#5a6588', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#112240', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 8, color: '#ccd6f6' }} />
                <Bar dataKey="Inventario" fill="#60a5fa" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Environmental / Green VSM */}
      {tab === 'environmental' && (
        <div className="dashboards-tabs-content">
          <div className="grid-2">
            <div className="glass-card">
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>🌍 Métricas Ambientales</h3>
              {[
                { label: '⚡ Energía (kWh)', field: 'energyKwh', value: env.energyKwh },
                { label: '🌫️ CO₂ (kg)', field: 'co2Kg', value: env.co2Kg },
                { label: '💧 Agua (litros)', field: 'waterLiters', value: env.waterLiters },
                { label: '🗑️ Residuos (kg)', field: 'wasteKg', value: env.wasteKg },
              ].map(m => (
                <div className="metric-input-row" key={m.field}>
                  <div className="metric-input-label">{m.label}</div>
                  <input className="form-input metric-input-value" type="number" min="0" value={m.value || ''} onChange={e => updateEnv(m.field, e.target.value)} />
                </div>
              ))}
            </div>

            <div>
              <div className="glass-card sustainability-score" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="sustainability-ring" style={{ border: `4px solid ${susScore > 70 ? 'var(--color-green)' : susScore > 40 ? 'var(--color-amber)' : 'var(--color-red)'}`, color: susScore > 70 ? 'var(--color-green)' : susScore > 40 ? 'var(--color-amber)' : 'var(--color-red)' }}>
                  {fmt(susScore, 0)}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Índice de Sostenibilidad</div>
              </div>
              <div className="glass-card">
                <h4 style={{ marginBottom: 'var(--space-md)' }}>Distribución de Impacto</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={envData.filter(d => d.value > 0)} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {envData.filter(d => d.value > 0).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#112240', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 8, color: '#ccd6f6' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social */}
      {tab === 'social' && (
        <div className="dashboards-tabs-content">
          <div className="grid-4" style={{ marginBottom: 'var(--space-lg)' }}>
            {[
              { label: 'Incidentes Seguridad', value: social.safetyIncidents ?? 0, icon: '🛡️', color: (social.safetyIncidents || 0) === 0 ? 'var(--color-green)' : 'var(--color-red)' },
              { label: 'Riesgo Ergonómico', value: (social.ergonomicRisk || 'medium').toUpperCase(), icon: '🦴', color: ergoColor },
              { label: 'Rotación Personal', value: fmtPercent(social.turnoverRate || 0), icon: '🔄', color: (social.turnoverRate || 0) < 0.1 ? 'var(--color-green)' : 'var(--color-amber)' },
              { label: 'Bienestar Equipo', value: `${fmt(social.wellbeingScore || 0, 1)}/5`, icon: '😊', color: (social.wellbeingScore || 0) >= 4 ? 'var(--color-green)' : (social.wellbeingScore || 0) >= 3 ? 'var(--color-amber)' : 'var(--color-red)' },
            ].map(m => (
              <div key={m.label} className="glass-card stat-card">
                <div className="stat-label">{m.icon} {m.label}</div>
                <div className="stat-value" style={{ fontSize: '1.5rem', color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Ajustar Métricas Sociales</h3>
            {[
              { label: '🛡️ Incidentes de Seguridad', field: 'safetyIncidents', type: 'number', value: social.safetyIncidents },
              { label: '🔄 Tasa de Rotación (0-1)', field: 'turnoverRate', type: 'number', value: social.turnoverRate, step: '0.01' },
              { label: '😊 Bienestar del Equipo (1-5)', field: 'wellbeingScore', type: 'number', value: social.wellbeingScore, step: '0.5', min: 1, max: 5 },
            ].map(m => (
              <div className="metric-input-row" key={m.field}>
                <div className="metric-input-label">{m.label}</div>
                <input className="form-input metric-input-value" type={m.type} min={m.min || 0} max={m.max} step={m.step} value={m.value ?? ''} onChange={e => updateSocial(m.field, e.target.value)} />
              </div>
            ))}
            <div className="metric-input-row">
              <div className="metric-input-label">🦴 Riesgo Ergonómico</div>
              <select className="form-select metric-input-value" value={social.ergonomicRisk || 'medium'} onChange={e => updateSocial('ergonomicRisk', e.target.value)}>
                <option value="low">Bajo</option>
                <option value="medium">Medio</option>
                <option value="high">Alto</option>
              </select>
            </div>

            {(social.wellbeingScore || 0) < 3 && (
              <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-red-dim)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-red)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-red)' }}>⚠️ <strong>Alerta de Burnout</strong>: El bienestar del equipo está por debajo del umbral saludable. Un proceso demasiado rápido que "quema" a los empleados no es Lean sostenible.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
