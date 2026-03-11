import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { uid, fmtTime, fmtPercent, calculateTaktTime, calculateAvailableMinutes, calculateLeadTime, calculateProcessTime, calculateTotalWait, calculatePCE, identifyBottleneck, fmt } from '../utils/helpers';
import './Canvas.css';

const emptyStep = { name: '', cycleTime: 0, changeoverTime: 0, quality: 0.95, uptime: 0.90, operators: 1, waitTime: 0, inventory: 0, notes: '' };

export default function Canvas() {
  const { activeProject: p, dispatch } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyStep);
  const [view, setView] = useState('current');

  if (!p) return <div className="page-container"><div className="empty-state"><div className="empty-state-icon">🗺️</div><p>Selecciona un proyecto primero</p></div></div>;

  const steps = (p.steps || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  const config = p.config || {};
  const availMin = calculateAvailableMinutes(config);
  const takt = calculateTaktTime(config.demandUnits, availMin);
  const leadTime = calculateLeadTime(steps);
  const processTime = calculateProcessTime(steps);
  const totalWait = calculateTotalWait(steps);
  const pce = calculatePCE(processTime, leadTime);
  const bottleneck = identifyBottleneck(steps, takt);

  const openAdd = () => { setEditing('new'); setForm({ ...emptyStep, id: uid(), order: steps.length }); };
  const openEdit = (step) => { setEditing(step.id); setForm({ ...step }); };
  const save = () => {
    const payload = { ...form, cycleTime: Number(form.cycleTime), changeoverTime: Number(form.changeoverTime), quality: Number(form.quality), uptime: Number(form.uptime), operators: Number(form.operators), waitTime: Number(form.waitTime), inventory: Number(form.inventory) };
    if (editing === 'new') dispatch({ type: 'ADD_STEP', payload });
    else dispatch({ type: 'UPDATE_STEP', payload });
    setEditing(null);
  };
  const remove = (id) => { dispatch({ type: 'DELETE_STEP', payload: id }); setEditing(null); };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>🗺️ Lienzo de Mapeo VSM</h1>
          <p className="page-subtitle">Mapa del flujo de valor con cajas de datos por cada estación de trabajo.</p>
        </div>
        <div className="page-header-actions">
          <div className="toggle-row">
            <button className={`toggle-btn ${view === 'current' ? 'active' : ''}`} onClick={() => setView('current')}>Estado Actual</button>
            <button className={`toggle-btn ${view === 'future' ? 'active' : ''}`} onClick={() => setView('future')}>Estado Futuro</button>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Agregar Paso</button>
        </div>
      </div>

      {/* Flow Visualization */}
      <div className="canvas-flow">
        {/* Supplier */}
        <div className="canvas-endpoint">
          <div className="canvas-endpoint-icon">🏭</div>
          <div className="canvas-endpoint-label">Proveedor</div>
        </div>
        <div className="flow-arrow">→</div>

        {steps.map((step, i) => (
          <div className="step-block-wrapper" key={step.id}>
            {/* Inventory triangle before step */}
            {step.inventory > 0 && (
              <div className="inventory-marker">
                <div className="inventory-triangle" />
                <div className="inventory-count">{step.inventory}</div>
                <div className="inventory-days">{step.waitTime > 0 ? fmtTime(step.waitTime) : ''}</div>
              </div>
            )}

            {/* Process Block */}
            <div className={`process-block ${bottleneck?.id === step.id ? 'bottleneck' : ''}`} onClick={() => openEdit(step)} style={{ animation: `fadeIn ${300 + i * 100}ms ease-out` }}>
              <div className="process-block-header">
                <span>{step.name}</span>
                {bottleneck?.id === step.id && <span title="Cuello de botella" style={{ color: 'var(--color-red)' }}>🔴</span>}
              </div>
              <div className="process-block-data">
                <div className="data-field">
                  <span className="data-field-label">C/T</span>
                  <span className="data-field-value">{fmtTime(step.cycleTime)}</span>
                </div>
                <div className="data-field">
                  <span className="data-field-label">C/O</span>
                  <span className="data-field-value">{fmtTime(step.changeoverTime)}</span>
                </div>
                <div className="data-field">
                  <span className="data-field-label">%C&A</span>
                  <span className="data-field-value">{fmtPercent(step.quality)}</span>
                </div>
                <div className="data-field">
                  <span className="data-field-label">Uptime</span>
                  <span className="data-field-value">{fmtPercent(step.uptime)}</span>
                </div>
                <div className="data-field">
                  <span className="data-field-label">Ops</span>
                  <span className="data-field-value">{step.operators}</span>
                </div>
              </div>
            </div>

            {i < steps.length - 1 && <div className="flow-arrow">→</div>}
          </div>
        ))}

        {steps.length === 0 && (
          <div className="empty-state" style={{ flex: 1 }}>
            <div className="empty-state-icon">📦</div>
            <p>Agrega pasos de proceso para construir el mapa</p>
          </div>
        )}

        <div className="flow-arrow">→</div>
        {/* Customer */}
        <div className="canvas-endpoint">
          <div className="canvas-endpoint-icon">👤</div>
          <div className="canvas-endpoint-label">Cliente</div>
        </div>
      </div>

      {/* Timeline Bar */}
      {steps.length > 0 && (
        <div className="glass-card">
          <h3 style={{ marginBottom: 'var(--space-md)' }}>📏 Línea de Tiempo</h3>
          <div className="timeline-bar">
            {steps.map((step, i) => (
              <div key={step.id} style={{ display: 'flex', flex: 1 }}>
                {step.waitTime > 0 && (
                  <div className="timeline-segment">
                    <div className="timeline-value wait">{fmtTime(step.waitTime)}</div>
                    <div className="timeline-label">Espera</div>
                  </div>
                )}
                <div className="timeline-segment">
                  <div className="timeline-value value-add">{fmtTime(step.cycleTime)}</div>
                  <div className="timeline-label">VA</div>
                </div>
              </div>
            ))}
          </div>
          <div className="timeline-total">
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Lead Time Total: </span>
              <strong className="mono" style={{ color: 'var(--color-text-bright)' }}>{fmtTime(leadTime)}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Tiempo de Proceso: </span>
              <strong className="mono" style={{ color: 'var(--color-green)' }}>{fmtTime(processTime)}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Tiempo de Espera: </span>
              <strong className="mono" style={{ color: 'var(--color-amber)' }}>{fmtTime(totalWait)}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>PCE: </span>
              <strong className="mono" style={{ color: 'var(--color-accent)' }}>{fmtPercent(pce)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Takt vs Cycle Chart */}
      {steps.length > 0 && (
        <div className="glass-card" style={{ marginTop: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>📊 Comparativa Ciclo vs Takt</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-md)', height: 200, padding: 'var(--space-md)' }}>
            {steps.map(step => {
              const ct = (step.cycleTime || 0) / (step.operators || 1);
              const maxH = Math.max(takt, ...steps.map(s => (s.cycleTime || 0) / (s.operators || 1)));
              const barH = maxH > 0 ? (ct / maxH) * 160 : 0;
              const color = ct > takt ? 'var(--color-red)' : ct > takt * 0.85 ? 'var(--color-amber)' : 'var(--color-green)';
              return (
                <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4 }}>
                  <div className="mono" style={{ fontSize: '0.7rem', color }}>{fmtTime(ct)}</div>
                  <div style={{ width: '100%', maxWidth: 40, height: barH, background: color, borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', transition: 'height 0.5s ease' }} />
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textAlign: 'center', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.name}</div>
                </div>
              );
            })}
          </div>
          {takt > 0 && (
            <div style={{ borderTop: '2px dashed var(--color-accent)', marginTop: '-' + (takt / Math.max(takt, ...steps.map(s => (s.cycleTime || 0) / (s.operators || 1))) * 160 + 40) + 'px', position: 'relative' }}>
              <span className="badge badge-accent" style={{ position: 'absolute', right: 0, top: -12 }}>Takt: {fmtTime(takt)}</span>
            </div>
          )}
        </div>
      )}

      {/* Edit/Add Modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing === 'new' ? '+ Nuevo Paso de Proceso' : 'Editar Paso'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>✕</button>
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">Nombre de la Estación</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Soldadura, Ensamble..." autoFocus />
            </div>

            <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-accent)' }}>📦 Caja de Datos (Data Box)</h4>
            <div className="step-modal-grid">
              <div className="form-group">
                <label className="form-label">Tiempo de Ciclo C/T (seg)</label>
                <input className="form-input" type="number" min="0" value={form.cycleTime} onChange={e => setForm({ ...form, cycleTime: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Cambio/Preparación C/O (seg)</label>
                <input className="form-input" type="number" min="0" value={form.changeoverTime} onChange={e => setForm({ ...form, changeoverTime: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Calidad %C&A (0-1)</label>
                <input className="form-input" type="number" min="0" max="1" step="0.01" value={form.quality} onChange={e => setForm({ ...form, quality: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Uptime (0-1)</label>
                <input className="form-input" type="number" min="0" max="1" step="0.01" value={form.uptime} onChange={e => setForm({ ...form, uptime: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Nº Operadores</label>
                <input className="form-input" type="number" min="1" value={form.operators} onChange={e => setForm({ ...form, operators: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Inventario (unidades)</label>
                <input className="form-input" type="number" min="0" value={form.inventory} onChange={e => setForm({ ...form, inventory: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Tiempo de Espera (seg)</label>
                <input className="form-input" type="number" min="0" value={form.waitTime} onChange={e => setForm({ ...form, waitTime: e.target.value })} />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
              <label className="form-label">Notas</label>
              <textarea className="form-textarea" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Observaciones, equipos, condiciones..." />
            </div>

            <div className="modal-actions">
              {editing !== 'new' && <button className="btn btn-danger btn-sm" onClick={() => remove(form.id)} style={{ marginRight: 'auto' }}>Eliminar</button>}
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={save} disabled={!form.name.trim()}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
