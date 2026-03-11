import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/', label: 'Inicio', icon: '🏠' },
  { path: '/config', label: 'Configuración', icon: '⚙️' },
  { path: '/canvas', label: 'Lienzo VSM', icon: '🗺️' },
  { path: '/analysis', label: 'Análisis', icon: '🔬' },
  { path: '/execution', label: 'Ejecución', icon: '🚀' },
  { path: '/integrations', label: 'Integraciones', icon: '🔗' },
  { path: '/dashboards', label: 'Dashboards', icon: '📊' },
  { path: '/standards', label: 'Estándares', icon: '📋' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span className="logo-icon">🏭</span>
        </div>
        <div className="sidebar-brand-text">
          <span className="brand-name">NexIA</span>
          <span className="brand-sub">Value Stream</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {location.pathname === item.path && <span className="nav-indicator" />}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-version">v1.0.0</div>
        <div className="sidebar-tagline">Flujo de Valor</div>
      </div>
    </aside>
  );
}
