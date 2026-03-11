import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Integrations.css';

const INTEGRATIONS = [
  { key: 'scada', icon: '🏗️', title: 'SCADA / PLC', desc: 'Conexión con sistemas de control y supervisión de planta para métricas en tiempo real.', fields: [{ name: 'endpoint', label: 'URL del Endpoint', placeholder: 'wss://scada.planta.local/api' }] },
  { key: 'erp', icon: '📦', title: 'ERP / MRP', desc: 'Integración con sistema de planificación de recursos para sincronizar demanda e inventarios.', fields: [{ name: 'endpoint', label: 'URL del Endpoint', placeholder: 'https://erp.empresa.com/api/v2' }] },
  { key: 'iot', icon: '📡', title: 'Sensores IoT', desc: 'Recopilación de datos de sensores de temperatura, vibración, consumo energético en cada estación.', fields: [{ name: 'endpoint', label: 'Broker MQTT', placeholder: 'mqtt://broker.iot.local:1883' }] },
  { key: 'jira', icon: '📋', title: 'Jira', desc: 'Seguimiento de historias de usuario y tiempo de ciclo de desarrollo de software.', fields: [{ name: 'apiKey', label: 'API Key', placeholder: 'jira-api-key-xxxx' }, { name: 'project', label: 'Proyecto', placeholder: 'PROJ-KEY' }] },
  { key: 'gitlab', icon: '🦊', title: 'GitLab', desc: 'Métricas de desarrollo: lead time de merge requests, frecuencia de despliegue, MTTR.', fields: [{ name: 'apiKey', label: 'Token de Acceso', placeholder: 'glpat-xxxx' }, { name: 'project', label: 'Proyecto ID', placeholder: '12345' }] },
  { key: 'servicenow', icon: '🔧', title: 'ServiceNow', desc: 'Gestión de incidentes y solicitudes de cambio IT para flujos de valor de servicios.', fields: [{ name: 'apiKey', label: 'API Key', placeholder: 'sn-api-key-xxxx' }, { name: 'instance', label: 'Instancia', placeholder: 'empresa.service-now.com' }] },
];

export default function Integrations() {
  const { activeProject: p, dispatch } = useApp();
  const [testing, setTesting] = useState(null);

  if (!p) return <div className="page-container"><div className="empty-state"><div className="empty-state-icon">🔗</div><p>Selecciona un proyecto primero</p></div></div>;

  const integrations = p.integrations || {};

  const update = (key, field, value) => {
    dispatch({ type: 'UPDATE_INTEGRATION', payload: { key, data: { [field]: value } } });
  };

  const toggleEnabled = (key) => {
    const current = integrations[key]?.enabled || false;
    dispatch({ type: 'UPDATE_INTEGRATION', payload: { key, data: { enabled: !current } } });
  };

  const testConnection = (key) => {
    setTesting(key);
    setTimeout(() => {
      const success = Math.random() > 0.3;
      dispatch({ type: 'UPDATE_INTEGRATION', payload: { key, data: { status: success ? 'connected' : 'error' } } });
      setTesting(null);
    }, 1500);
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>🔗 Hub de Integraciones</h1>
          <p className="page-subtitle">Conecta tu VSM con los sistemas de la planta y herramientas de desarrollo para datos en tiempo real.</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>🏭 Manufactura</h3>
          <p style={{ fontSize: '0.85rem' }}>Sistemas de control, ERP y sensores IoT para actualización automática de métricas OEE y uptime.</p>
        </div>
        <div className="glass-card">
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>💻 Software & TI</h3>
          <p style={{ fontSize: '0.85rem' }}>Jira, GitLab, ServiceNow para medir el flujo de valor en desarrollo de software y servicios IT.</p>
        </div>
      </div>

      <div className="grid-2">
        {INTEGRATIONS.map(intg => {
          const data = integrations[intg.key] || {};
          const status = data.status || 'disconnected';
          return (
            <div className="integration-card" key={intg.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                  <span style={{ fontSize: '2rem' }}>{intg.icon}</span>
                  <div>
                    <h4>{intg.title}</h4>
                    <div className="integration-status">
                      <div className={`status-dot ${status}`} />
                      <span>{status === 'connected' ? 'Conectado' : status === 'error' ? 'Error' : 'Desconectado'}</span>
                    </div>
                  </div>
                </div>
                <button className={`btn btn-sm ${data.enabled ? 'btn-primary' : 'btn-ghost'}`} onClick={() => toggleEnabled(intg.key)}>
                  {data.enabled ? 'Activo' : 'Inactivo'}
                </button>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{intg.desc}</p>

              {data.enabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {intg.fields.map(f => (
                    <div className="form-group" key={f.name}>
                      <label className="form-label">{f.label}</label>
                      <input className="form-input" value={data[f.name] || ''} onChange={e => update(intg.key, f.name, e.target.value)} placeholder={f.placeholder} />
                    </div>
                  ))}
                  <button className="btn btn-secondary btn-sm" onClick={() => testConnection(intg.key)} disabled={testing === intg.key}>
                    {testing === intg.key ? '⏳ Probando…' : '🔌 Probar Conexión'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
