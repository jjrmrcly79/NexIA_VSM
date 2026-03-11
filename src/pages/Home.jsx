import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { uid, calculateTaktTime, calculateAvailableMinutes, calculateLeadTime, calculateProcessTime, calculatePCE, fmtTime, fmtPercent } from '../utils/helpers';
import './Home.css';

export default function Home() {
  const { state, dispatch, activeProject } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');

  const createProject = () => {
    if (!newName.trim()) return;
    dispatch({
      type: 'CREATE_PROJECT',
      payload: {
        id: uid(),
        name: newName.trim(),
        description: '',
        createdAt: new Date().toISOString(),
        config: { demandUnits: 100, demandPeriod: 'day', shiftsPerDay: 1, hoursPerShift: 8, breakMinutes: 30, meetingMinutes: 15 },
        steps: [],
        adkar: { awareness: 3, desire: 3, knowledge: 3, ability: 3, reinforcement: 3 },
        kaizen: [],
        skills: { operators: [], tasks: [], matrix: [] },
        integrations: {},
        metrics: { environmental: {}, social: {} },
        standards: [],
        targets: [],
      },
    });
    setNewName('');
    setShowNew(false);
  };

  const p = activeProject;
  const availMin = p ? calculateAvailableMinutes(p.config || {}) : 0;
  const takt = p ? calculateTaktTime(p.config?.demandUnits, availMin) : 0;
  const lead = p ? calculateLeadTime(p.steps || []) : 0;
  const proc = p ? calculateProcessTime(p.steps || []) : 0;
  const pce = calculatePCE(proc, lead);

  const modules = [
    { path: '/config', icon: '⚙️', title: 'Configuración', desc: 'Demanda, tiempo disponible y Takt Time' },
    { path: '/canvas', icon: '🗺️', title: 'Lienzo VSM', desc: 'Mapeo de bloques de proceso con Data Box' },
    { path: '/analysis', icon: '🔬', title: 'Análisis', desc: 'Diagnóstico ADKAR y Sombra Digital' },
    { path: '/execution', icon: '🚀', title: 'Ejecución', desc: 'Kaizen, roadmap y matriz de habilidades' },
    { path: '/integrations', icon: '🔗', title: 'Integraciones', desc: 'IoT, SCADA, Jira, GitLab' },
    { path: '/dashboards', icon: '📊', title: 'Dashboards', desc: 'Métricas operativas, ambientales y sociales' },
    { path: '/standards', icon: '📋', title: 'Estándares', desc: 'SOPs y condiciones objetivo' },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Hero */}
      <div className="home-hero">
        <h1>🏭 NexIA Value Stream Mapping</h1>
        <p>Plataforma integral de Mapeo de Flujo de Valor — del diagnóstico a la mejora continua.</p>
        <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ Nuevo Proyecto</button>
        </div>
      </div>

      {/* Quick Stats */}
      {p && (
        <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="glass-card quick-stat">
            <div className="quick-stat-value">{fmtTime(takt)}</div>
            <div className="quick-stat-label">Takt Time</div>
          </div>
          <div className="glass-card quick-stat">
            <div className="quick-stat-value">{fmtTime(lead)}</div>
            <div className="quick-stat-label">Lead Time</div>
          </div>
          <div className="glass-card quick-stat">
            <div className="quick-stat-value">{(p.steps || []).length}</div>
            <div className="quick-stat-label">Pasos</div>
          </div>
          <div className="glass-card quick-stat">
            <div className="quick-stat-value">{fmtPercent(pce)}</div>
            <div className="quick-stat-label">PCE</div>
          </div>
        </div>
      )}

      {/* Projects */}
      <h2 style={{ marginBottom: 'var(--space-md)' }}>Proyectos</h2>
      <div className="grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        {state.projects.map(proj => (
          <div
            key={proj.id}
            className={`glass-card project-card ${proj.id === state.activeProjectId ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_PROJECT', payload: proj.id })}
          >
            {proj.id === state.activeProjectId && <div className="active-dot" />}
            <h4>{proj.name}</h4>
            <p style={{ fontSize: '0.8rem', marginTop: 4 }}>{proj.description || 'Sin descripción'}</p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
              <span className="badge badge-accent">{(proj.steps || []).length} pasos</span>
              <span className="badge badge-blue">{(proj.kaizen || []).length} kaizen</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <h2 style={{ marginBottom: 'var(--space-md)' }}>Módulos</h2>
      <div className="module-grid">
        {modules.map(m => (
          <Link key={m.path} to={m.path} className="glass-card module-card">
            <div className="module-icon">{m.icon}</div>
            <h4>{m.title}</h4>
            <p>{m.desc}</p>
          </Link>
        ))}
      </div>

      {/* New Project Modal */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nuevo Proyecto VSM</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowNew(false)}>✕</button>
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">Nombre del Proyecto</label>
              <input className="form-input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ej: Línea de Producción X" autoFocus />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={createProject} disabled={!newName.trim()}>Crear Proyecto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
