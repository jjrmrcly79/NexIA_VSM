import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { uid, getSkillColor } from '../utils/helpers';
import './Execution.css';

export default function Execution() {
  const { activeProject: p, dispatch } = useApp();
  const [tab, setTab] = useState('kaizen');
  const [showKaizenModal, setShowKaizenModal] = useState(false);
  const [kaizenForm, setKaizenForm] = useState({ title: '', priority: 'medium', assignee: '', dueDate: '', status: 'todo' });

  if (!p) return <div className="page-container"><div className="empty-state"><div className="empty-state-icon">🚀</div><p>Selecciona un proyecto primero</p></div></div>;

  const kaizens = p.kaizen || [];
  const skills = p.skills || { operators: [], tasks: [], matrix: [] };
  const steps = p.steps || [];

  const addKaizen = () => {
    if (!kaizenForm.title.trim()) return;
    dispatch({ type: 'ADD_KAIZEN', payload: { ...kaizenForm, id: uid() } });
    setKaizenForm({ title: '', priority: 'medium', assignee: '', dueDate: '', status: 'todo' });
    setShowKaizenModal(false);
  };

  const updateKaizenStatus = (id, status) => dispatch({ type: 'UPDATE_KAIZEN', payload: { id, status } });
  const deleteKaizen = (id) => dispatch({ type: 'DELETE_KAIZEN', payload: id });

  const statusGroups = { todo: 'Por Hacer', 'in-progress': 'En Progreso', done: 'Completado' };

  const updateSkillLevel = (opIdx, taskIdx) => {
    const newMatrix = skills.matrix.map((row, i) => i === opIdx ? row.map((v, j) => j === taskIdx ? (v + 1) % 5 : v) : [...row]);
    dispatch({ type: 'UPDATE_SKILLS', payload: { matrix: newMatrix } });
  };

  const addOperator = () => {
    const name = prompt('Nombre del operador:');
    if (!name) return;
    dispatch({
      type: 'UPDATE_SKILLS',
      payload: {
        operators: [...skills.operators, name],
        matrix: [...skills.matrix, new Array(skills.tasks.length).fill(0)],
      },
    });
  };

  const addTask = () => {
    const name = prompt('Nombre de la tarea:');
    if (!name) return;
    dispatch({
      type: 'UPDATE_SKILLS',
      payload: {
        tasks: [...skills.tasks, name],
        matrix: skills.matrix.map(row => [...row, 0]),
      },
    });
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>🚀 Ejecución y Gestión Lean</h1>
          <p className="page-subtitle">Eventos Kaizen, roadmap de implementación y matriz de capacitación.</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === 'kaizen' ? 'active' : ''}`} onClick={() => setTab('kaizen')}>⚡ Kaizen</button>
        <button className={`tab-btn ${tab === 'roadmap' ? 'active' : ''}`} onClick={() => setTab('roadmap')}>🗓️ Roadmap</button>
        <button className={`tab-btn ${tab === 'skills' ? 'active' : ''}`} onClick={() => setTab('skills')}>🎯 Habilidades</button>
      </div>

      {/* Kaizen Board */}
      {tab === 'kaizen' && (
        <div className="execution-tabs-content">
          <div style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.85rem' }}>Total: <strong>{kaizens.length}</strong> eventos · Activos: <strong>{kaizens.filter(k => k.status === 'in-progress').length}</strong></p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowKaizenModal(true)}>+ Evento Kaizen</button>
          </div>

          <div className="kanban-board">
            {Object.entries(statusGroups).map(([status, label]) => (
              <div className="kanban-column" key={status}>
                <div className="kanban-column-header">
                  <span>{label}</span>
                  <span className="badge badge-accent">{kaizens.filter(k => k.status === status).length}</span>
                </div>
                {kaizens.filter(k => k.status === status).map(k => (
                  <div className={`kanban-card kaizen-priority-${k.priority}`} key={k.id}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{k.title}</div>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {k.assignee && <span>👤 {k.assignee}</span>}
                      {k.dueDate && <span>📅 {k.dueDate}</span>}
                      <span className={`badge badge-${k.priority === 'high' ? 'red' : k.priority === 'low' ? 'green' : 'amber'}`}>{k.priority}</span>
                    </div>
                    <div style={{ marginTop: 'var(--space-sm)', display: 'flex', gap: 4 }}>
                      {status !== 'todo' && <button className="btn btn-ghost btn-sm" style={{ padding: '2px 6px', fontSize: '0.7rem' }} onClick={() => updateKaizenStatus(k.id, status === 'done' ? 'in-progress' : 'todo')}>←</button>}
                      {status !== 'done' && <button className="btn btn-ghost btn-sm" style={{ padding: '2px 6px', fontSize: '0.7rem' }} onClick={() => updateKaizenStatus(k.id, status === 'todo' ? 'in-progress' : 'done')}>→</button>}
                      <button className="btn btn-ghost btn-sm" style={{ padding: '2px 6px', fontSize: '0.7rem', marginLeft: 'auto', color: 'var(--color-red)' }} onClick={() => deleteKaizen(k.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roadmap */}
      {tab === 'roadmap' && (
        <div className="execution-tabs-content">
          <div className="glass-card">
            <h3 style={{ marginBottom: 'var(--space-xl)' }}>Plan de Implementación por Fases</h3>
            {[
              { phase: 'Fase 1: Estabilización', desc: 'Reducir variabilidad en los cuellos de botella identificados. Estandarizar las operaciones con mayor desperdicio.', duration: '4-6 semanas', items: kaizens.filter(k => k.priority === 'high') },
              { phase: 'Fase 2: Flujo Continuo', desc: 'Implementar sistemas Pull y FIFO entre estaciones. Reducir inventario en proceso (WIP).', duration: '6-8 semanas', items: kaizens.filter(k => k.priority === 'medium') },
              { phase: 'Fase 3: Optimización', desc: 'Ajustar tiempos de ciclo al Takt Time. Capacitación cruzada para flexibilidad operativa.', duration: '8-12 semanas', items: kaizens.filter(k => k.priority === 'low') },
            ].map((ph, i) => (
              <div className="roadmap-phase" key={i}>
                <h4 style={{ color: 'var(--color-accent)' }}>{ph.phase}</h4>
                <p style={{ fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>{ph.desc}</p>
                <span className="badge badge-blue">{ph.duration}</span>
                {ph.items.length > 0 && (
                  <div style={{ marginTop: 'var(--space-sm)' }}>
                    {ph.items.map(k => (
                      <div key={k.id} style={{ fontSize: '0.8rem', padding: '4px 0', color: 'var(--color-text-secondary)' }}>• {k.title} — {k.assignee}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Matrix */}
      {tab === 'skills' && (
        <div className="execution-tabs-content">
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <h3>Matriz de Capacitación</h3>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button className="btn btn-ghost btn-sm" onClick={addOperator}>+ Operador</button>
                <button className="btn btn-ghost btn-sm" onClick={addTask}>+ Tarea</button>
              </div>
            </div>

            <div className="skills-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Operador</th>
                    {skills.tasks.map((t, i) => <th key={i} style={{ textAlign: 'center' }}>{t}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {skills.operators.map((op, opIdx) => (
                    <tr key={opIdx}>
                      <td className="skills-op-name">{op}</td>
                      {(skills.matrix[opIdx] || []).map((level, taskIdx) => (
                        <td key={taskIdx} style={{ textAlign: 'center', padding: 4 }}>
                          <div className={`skill-cell ${getSkillColor(level)}`} onClick={() => updateSkillLevel(opIdx, taskIdx)} style={{ margin: '0 auto', cursor: 'pointer' }} title={`Nivel ${level} — Clic para cambiar`}>
                            {level}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              {[0, 1, 2, 3, 4].map(l => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  <div className={`skill-cell ${getSkillColor(l)}`} style={{ width: 24, height: 24, fontSize: '0.65rem' }}>{l}</div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    {['Sin entrenar', 'Aprendiz', 'Capaz', 'Competente', 'Experto'][l]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Kaizen Modal */}
      {showKaizenModal && (
        <div className="modal-overlay" onClick={() => setShowKaizenModal(false)}>
          <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>+ Nuevo Evento Kaizen</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowKaizenModal(false)}>✕</button>
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">Título</label>
              <input className="form-input" value={kaizenForm.title} onChange={e => setKaizenForm({ ...kaizenForm, title: e.target.value })} placeholder="Ej: Reducir C/O en Bobinado" autoFocus />
            </div>
            <div className="grid-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Prioridad</label>
                <select className="form-select" value={kaizenForm.priority} onChange={e => setKaizenForm({ ...kaizenForm, priority: e.target.value })}>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Responsable</label>
                <input className="form-input" value={kaizenForm.assignee} onChange={e => setKaizenForm({ ...kaizenForm, assignee: e.target.value })} placeholder="Nombre" />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">Fecha Límite</label>
              <input className="form-input" type="date" value={kaizenForm.dueDate} onChange={e => setKaizenForm({ ...kaizenForm, dueDate: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowKaizenModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={addKaizen} disabled={!kaizenForm.title.trim()}>Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
