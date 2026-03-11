import { useApp } from '../context/AppContext';
import { calculateTaktTime, calculateAvailableMinutes, calculateProcessTime, fmtTime, fmt } from '../utils/helpers';
import './Configuration.css';

export default function Configuration() {
  const { activeProject: p, dispatch } = useApp();
  if (!p) return <div className="page-container"><div className="empty-state"><div className="empty-state-icon">⚙️</div><p>Selecciona un proyecto primero</p></div></div>;

  const c = p.config || {};
  const update = (field, value) => dispatch({ type: 'UPDATE_CONFIG', payload: { [field]: value } });

  const availMin = calculateAvailableMinutes(c);
  const takt = calculateTaktTime(c.demandUnits, availMin);
  const avgCT = p.steps.length > 0 ? calculateProcessTime(p.steps) / p.steps.length : 0;
  const maxCT = p.steps.length > 0 ? Math.max(...p.steps.map(s => (s.cycleTime || 0) / (s.operators || 1))) : 0;

  let taktStatus = 'ok';
  if (maxCT > takt) taktStatus = 'danger';
  else if (maxCT > takt * 0.85) taktStatus = 'warn';

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>⚙️ Configuración de Demanda</h1>
          <p className="page-subtitle">Define la demanda del cliente y el tiempo de trabajo disponible para calcular el Takt Time.</p>
        </div>
      </div>

      {/* Takt Time Display */}
      <div className="config-takt-display animate-scale-in">
        <div className="takt-value">{fmtTime(takt)}</div>
        <div className="takt-label">Takt Time — ritmo de producción requerido por unidad</div>
        {p.steps.length > 0 && (
          <div className={`takt-comparison takt-${taktStatus}`}>
            {taktStatus === 'ok' && '✅ Todos los ciclos están dentro del Takt Time'}
            {taktStatus === 'warn' && `⚠️ Ciclo máximo (${fmtTime(maxCT)}) se acerca al Takt Time`}
            {taktStatus === 'danger' && `🔴 Cuello de botella: ciclo máximo (${fmtTime(maxCT)}) excede el Takt Time`}
          </div>
        )}
      </div>

      <div className="grid-2">
        {/* Demand Section */}
        <div className="glass-card config-section">
          <h3>📦 Demanda del Cliente</h3>
          <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
            <label className="form-label">Cantidad demandada</label>
            <input className="form-input" type="number" min="1" value={c.demandUnits || ''} onChange={e => update('demandUnits', Number(e.target.value))} placeholder="Ej: 120" />
          </div>
          <div className="form-group">
            <label className="form-label">Período</label>
            <select className="form-select" value={c.demandPeriod || 'day'} onChange={e => update('demandPeriod', e.target.value)}>
              <option value="day">Por Día</option>
              <option value="week">Por Semana</option>
              <option value="month">Por Mes</option>
            </select>
          </div>
          <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontSize: '0.85rem' }}>Demanda efectiva: <strong className="mono text-accent">{c.demandUnits || 0} unidades/{c.demandPeriod === 'day' ? 'día' : c.demandPeriod === 'week' ? 'semana' : 'mes'}</strong></p>
          </div>
        </div>

        {/* Available Time Section */}
        <div className="glass-card config-section">
          <h3>🕐 Tiempo de Trabajo Disponible</h3>
          <div className="grid-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Turnos por día</label>
              <input className="form-input" type="number" min="1" max="3" value={c.shiftsPerDay || ''} onChange={e => update('shiftsPerDay', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Horas por turno</label>
              <input className="form-input" type="number" min="1" max="12" value={c.hoursPerShift || ''} onChange={e => update('hoursPerShift', Number(e.target.value))} />
            </div>
          </div>
          <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Descansos (min)</label>
              <input className="form-input" type="number" min="0" value={c.breakMinutes || ''} onChange={e => update('breakMinutes', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Reuniones (min)</label>
              <input className="form-input" type="number" min="0" value={c.meetingMinutes || ''} onChange={e => update('meetingMinutes', Number(e.target.value))} />
            </div>
          </div>

          {/* Time Breakdown */}
          <div className="time-breakdown">
            <div className="time-segment">
              <div className="time-segment-value">{(c.shiftsPerDay || 1) * (c.hoursPerShift || 8) * 60} min</div>
              <div className="time-segment-label">Total Bruto</div>
            </div>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>−</span>
            <div className="time-segment">
              <div className="time-segment-value" style={{ color: 'var(--color-red)' }}>{(c.breakMinutes || 0) + (c.meetingMinutes || 0)} min</div>
              <div className="time-segment-label">Deducciones</div>
            </div>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>=</span>
            <div className="time-segment">
              <div className="time-segment-value" style={{ color: 'var(--color-accent)' }}>{fmt(availMin, 0)} min</div>
              <div className="time-segment-label">Disponible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Summary */}
      <div className="glass-card" style={{ marginTop: 'var(--space-xl)' }}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>📐 Resumen del Cálculo</h3>
        <div className="grid-4">
          <div className="stat-card">
            <div className="stat-label">Tiempo Disponible</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{fmt(availMin, 0)}<span className="stat-unit"> min</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Demanda</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{c.demandUnits || 0}<span className="stat-unit"> uds</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Takt Time</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }}>{fmtTime(takt)}<span className="stat-unit">/ud</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Fórmula</div>
            <div className="stat-sub mono" style={{ fontSize: '0.85rem', marginTop: 8 }}>{fmt(availMin, 0)}min × 60 ÷ {c.demandUnits || 0} = {fmt(takt, 1)}s</div>
          </div>
        </div>
      </div>
    </div>
  );
}
