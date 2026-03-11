import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { uid } from '../utils/helpers';
import './Standards.css';

const AUDIT_ITEMS = [
  '¿Se siguen los SOPs actualizados en cada estación?',
  '¿Los tiempos de ciclo se mantienen dentro del ±10% del estándar?',
  '¿El WIP no excede los límites definidos?',
  '¿El área de trabajo cumple con 5S?',
  '¿Se registran las desviaciones en el tablero Kaizen?',
  '¿Los operadores rotan según la matriz de habilidades?',
];

export default function Standards() {
  const { activeProject: p, dispatch } = useApp();
  const [tab, setTab] = useState('sop');
  const [showSopModal, setShowSopModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [editingStandard, setEditingStandard] = useState(null);
  const [editingTarget, setEditingTarget] = useState(null);
  const [auditChecks, setAuditChecks] = useState(() => new Array(AUDIT_ITEMS.length).fill(false));

  const [sopForm, setSopForm] = useState({ title: '', process: '', sequence: '', timing: '', keyPoints: '', safetyNotes: '' });
  const [targetForm, setTargetForm] = useState({ metric: '', currentValue: '', targetValue: '', deadline: '', owner: '', status: 'pending' });

  if (!p) return <div className="page-container"><div className="empty-state"><div className="empty-state-icon">📋</div><p>Selecciona un proyecto primero</p></div></div>;

  const standards = p.standards || [];
  const targets = p.targets || [];

  /* --- SOPs --- */
  const openSopEdit = (s) => {
    setEditingStandard(s.id);
    setSopForm({ title: s.title, process: s.process || '', sequence: s.sequence || '', timing: s.timing || '', keyPoints: s.keyPoints || '', safetyNotes: s.safetyNotes || '' });
    setShowSopModal(true);
  };

  const saveSop = () => {
    if (!sopForm.title.trim()) return;
    if (editingStandard) {
      dispatch({ type: 'UPDATE_STANDARD', payload: { id: editingStandard, ...sopForm } });
    } else {
      dispatch({ type: 'ADD_STANDARD', payload: { id: uid(), ...sopForm, createdAt: new Date().toISOString() } });
    }
    setSopForm({ title: '', process: '', sequence: '', timing: '', keyPoints: '', safetyNotes: '' });
    setEditingStandard(null);
    setShowSopModal(false);
  };

  const deleteSop = (id) => dispatch({ type: 'DELETE_STANDARD', payload: id });

  /* --- Targets --- */
  const openTargetEdit = (t) => {
    setEditingTarget(t.id);
    setTargetForm({ metric: t.metric, currentValue: t.currentValue || '', targetValue: t.targetValue || '', deadline: t.deadline || '', owner: t.owner || '', status: t.status || 'pending' });
    setShowTargetModal(true);
  };

  const saveTarget = () => {
    if (!targetForm.metric.trim()) return;
    if (editingTarget) {
      dispatch({ type: 'UPDATE_TARGET', payload: { id: editingTarget, ...targetForm } });
    } else {
      dispatch({ type: 'ADD_TARGET', payload: { id: uid(), ...targetForm, createdAt: new Date().toISOString() } });
    }
    setTargetForm({ metric: '', currentValue: '', targetValue: '', deadline: '', owner: '', status: 'pending' });
    setEditingTarget(null);
    setShowTargetModal(false);
  };

  const deleteTarget = (id) => dispatch({ type: 'DELETE_TARGET', payload: id });

  const toggleAudit = (i) => setAuditChecks(prev => prev.map((v, idx) => idx === i ? !v : v));
  const auditScore = auditChecks.filter(Boolean).length;
  const auditTotal = AUDIT_ITEMS.length;
  const auditPct = auditTotal > 0 ? Math.round((auditScore / auditTotal) * 100) : 0;

  const getTargetStatusBadge = (status) => {
    const map = {
      pending: { label: 'Pendiente', cls: 'badge-amber' },
      'in-progress': { label: 'En Progreso', cls: 'badge-blue' },
      achieved: { label: 'Alcanzado', cls: 'badge-green' },
      overdue: { label: 'Vencido', cls: 'badge-red' },
    };
    return map[status] || map.pending;
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>📋 Estandarización y Mejora Continua</h1>
          <p className="page-subtitle">Documentación de trabajo estándar, condiciones objetivo y auditorías de sostenimiento.</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === 'sop' ? 'active' : ''}`} onClick={() => setTab('sop')}>📄 SOPs</button>
        <button className={`tab-btn ${tab === 'targets' ? 'active' : ''}`} onClick={() => setTab('targets')}>🎯 Condiciones Objetivo</button>
        <button className={`tab-btn ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>✅ Auditoría</button>
      </div>

      {/* SOPs Tab */}
      {tab === 'sop' && (
        <div className="standards-tabs-content">
          <div style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.85rem' }}>Total SOPs: <strong>{standards.length}</strong></p>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditingStandard(null); setSopForm({ title: '', process: '', sequence: '', timing: '', keyPoints: '', safetyNotes: '' }); setShowSopModal(true); }}>+ Nuevo SOP</button>
          </div>

          {standards.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📄</div><p>No hay SOPs definidos. Crea el primer Trabajo Estándar para documentar las operaciones críticas.</p></div>
          ) : (
            <div className="sop-grid">
              {standards.map(s => (
                <div className="sop-card" key={s.id}>
                  <div className="sop-card-header">
                    <h4>{s.title}</h4>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => openSopEdit(s)}>✏️</button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem', color: 'var(--color-red)' }} onClick={() => deleteSop(s.id)}>✕</button>
                    </div>
                  </div>
                  {s.process && <div className="sop-field"><span className="sop-field-label">Proceso</span><span>{s.process}</span></div>}
                  {s.sequence && <div className="sop-field"><span className="sop-field-label">Secuencia</span><span className="mono">{s.sequence}</span></div>}
                  {s.timing && <div className="sop-field"><span className="sop-field-label">Tiempos</span><span className="mono">{s.timing}</span></div>}
                  {s.keyPoints && <div className="sop-field"><span className="sop-field-label">Puntos Clave</span><span>{s.keyPoints}</span></div>}
                  {s.safetyNotes && (
                    <div className="sop-safety">⚠️ {s.safetyNotes}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Targets Tab */}
      {tab === 'targets' && (
        <div className="standards-tabs-content">
          <div style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.85rem' }}>Condiciones Objetivo: <strong>{targets.length}</strong> · Alcanzadas: <strong>{targets.filter(t => t.status === 'achieved').length}</strong></p>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditingTarget(null); setTargetForm({ metric: '', currentValue: '', targetValue: '', deadline: '', owner: '', status: 'pending' }); setShowTargetModal(true); }}>+ Nueva Meta</button>
          </div>

          {targets.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">🎯</div><p>Define condiciones objetivo para guiar la mejora continua del flujo de valor.</p></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Métrica</th>
                    <th>Valor Actual</th>
                    <th>Objetivo</th>
                    <th>Fecha Límite</th>
                    <th>Responsable</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {targets.map(t => {
                    const badge = getTargetStatusBadge(t.status);
                    return (
                      <tr key={t.id}>
                        <td style={{ fontWeight: 600 }}>{t.metric}</td>
                        <td className="mono">{t.currentValue}</td>
                        <td className="mono" style={{ color: 'var(--color-accent)' }}>{t.targetValue}</td>
                        <td>{t.deadline || '—'}</td>
                        <td>{t.owner || '—'}</td>
                        <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => openTargetEdit(t)}>✏️</button>
                            {t.status === 'achieved' && (
                              <button className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '0.7rem' }} onClick={() => { setEditingTarget(null); setTargetForm({ metric: t.metric, currentValue: t.targetValue, targetValue: '', deadline: '', owner: t.owner, status: 'pending' }); setShowTargetModal(true); }}>🔄 Nuevo Ciclo</button>
                            )}
                            <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem', color: 'var(--color-red)' }} onClick={() => deleteTarget(t.id)}>✕</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {targets.some(t => t.status === 'achieved') && (
            <div className="target-achieved-alert">
              <p>🎉 <strong>¡Meta(s) alcanzada(s)!</strong> Usa el botón "🔄 Nuevo Ciclo" para definir un nuevo objetivo más ambicioso y continuar la mejora (Kata de Coaching).</p>
            </div>
          )}
        </div>
      )}

      {/* Audit Tab */}
      {tab === 'audit' && (
        <div className="standards-tabs-content">
          <div className="grid-2">
            <div className="glass-card">
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Checklist de Auditoría Diaria</h3>
              {AUDIT_ITEMS.map((item, i) => (
                <div className="audit-item" key={i} onClick={() => toggleAudit(i)}>
                  <div className={`audit-checkbox ${auditChecks[i] ? 'checked' : ''}`}>
                    {auditChecks[i] && '✓'}
                  </div>
                  <span style={{ fontSize: '0.85rem', textDecoration: auditChecks[i] ? 'line-through' : 'none', opacity: auditChecks[i] ? 0.6 : 1 }}>{item}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="glass-card audit-score-card">
                <div className="audit-ring" style={{
                  border: `4px solid ${auditPct >= 80 ? 'var(--color-green)' : auditPct >= 50 ? 'var(--color-amber)' : 'var(--color-red)'}`,
                  color: auditPct >= 80 ? 'var(--color-green)' : auditPct >= 50 ? 'var(--color-amber)' : 'var(--color-red)',
                }}>
                  {auditPct}%
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Cumplimiento de Auditoría</div>
                <div style={{ fontSize: '0.8rem', marginTop: 'var(--space-sm)' }} className="mono">{auditScore}/{auditTotal} ítems</div>
              </div>

              <div className="glass-card" style={{ marginTop: 'var(--space-lg)' }}>
                <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--color-accent)' }}>📊 Recomendación</h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {auditPct >= 80
                    ? '✅ Excelente cumplimiento. Mantén la disciplina y busca nuevas oportunidades de mejora dentro de los estándares actuales.'
                    : auditPct >= 50
                      ? '⚠️ Cumplimiento parcial. Revisa las áreas no cumplidas con los líderes de equipo y programa acciones correctivas esta semana.'
                      : '🔴 Cumplimiento bajo. Convoca una reunión urgente del equipo de mejora para abordar las brechas sistémicas y reforzar la capacitación.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOP Modal */}
      {showSopModal && (
        <div className="modal-overlay" onClick={() => setShowSopModal(false)}>
          <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingStandard ? 'Editar SOP' : 'Nuevo Trabajo Estándar (SOP)'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowSopModal(false)}>✕</button>
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">Título del SOP</label>
              <input className="form-input" value={sopForm.title} onChange={e => setSopForm({ ...sopForm, title: e.target.value })} placeholder="Ej: Procedimiento de Ensamble Final" autoFocus />
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">Proceso / Estación</label>
              <input className="form-input" value={sopForm.process} onChange={e => setSopForm({ ...sopForm, process: e.target.value })} placeholder="Ej: Estación de Soldadura" />
            </div>
            <div className="grid-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Secuencia de Trabajo</label>
                <textarea className="form-input" rows="3" value={sopForm.sequence} onChange={e => setSopForm({ ...sopForm, sequence: e.target.value })} placeholder="1. Preparar materiales&#10;2. Verificar posición&#10;3. Soldar juntas" />
              </div>
              <div className="form-group">
                <label className="form-label">Tiempos por Pasada</label>
                <textarea className="form-input" rows="3" value={sopForm.timing} onChange={e => setSopForm({ ...sopForm, timing: e.target.value })} placeholder="Paso 1: 30s&#10;Paso 2: 15s&#10;Paso 3: 45s" />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">Puntos Clave</label>
              <textarea className="form-input" rows="2" value={sopForm.keyPoints} onChange={e => setSopForm({ ...sopForm, keyPoints: e.target.value })} placeholder="Consejos de calidad, tips, verificaciones críticas" />
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">Notas de Seguridad ⚠️</label>
              <input className="form-input" value={sopForm.safetyNotes} onChange={e => setSopForm({ ...sopForm, safetyNotes: e.target.value })} placeholder="Equipo de protección requerido, riesgos a evitar" />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowSopModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={saveSop} disabled={!sopForm.title.trim()}>
                {editingStandard ? 'Guardar Cambios' : 'Crear SOP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Target Modal */}
      {showTargetModal && (
        <div className="modal-overlay" onClick={() => setShowTargetModal(false)}>
          <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTarget ? 'Editar Condición Objetivo' : 'Nueva Condición Objetivo'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowTargetModal(false)}>✕</button>
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">Métrica</label>
              <input className="form-input" value={targetForm.metric} onChange={e => setTargetForm({ ...targetForm, metric: e.target.value })} placeholder="Ej: Lead Time de Soldadura → Empaque" autoFocus />
            </div>
            <div className="grid-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Valor Actual</label>
                <input className="form-input" value={targetForm.currentValue} onChange={e => setTargetForm({ ...targetForm, currentValue: e.target.value })} placeholder="Ej: 120 min" />
              </div>
              <div className="form-group">
                <label className="form-label">Valor Objetivo</label>
                <input className="form-input" value={targetForm.targetValue} onChange={e => setTargetForm({ ...targetForm, targetValue: e.target.value })} placeholder="Ej: 90 min" />
              </div>
            </div>
            <div className="grid-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Fecha Límite</label>
                <input className="form-input" type="date" value={targetForm.deadline} onChange={e => setTargetForm({ ...targetForm, deadline: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Responsable</label>
                <input className="form-input" value={targetForm.owner} onChange={e => setTargetForm({ ...targetForm, owner: e.target.value })} placeholder="Nombre" />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">Estado</label>
              <select className="form-select" value={targetForm.status} onChange={e => setTargetForm({ ...targetForm, status: e.target.value })}>
                <option value="pending">Pendiente</option>
                <option value="in-progress">En Progreso</option>
                <option value="achieved">Alcanzado</option>
                <option value="overdue">Vencido</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowTargetModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={saveTarget} disabled={!targetForm.metric.trim()}>
                {editingTarget ? 'Guardar Cambios' : 'Crear Meta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
