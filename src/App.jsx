import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Configuration from './pages/Configuration';
import Canvas from './pages/Canvas';
import Analysis from './pages/Analysis';
import Execution from './pages/Execution';
import Integrations from './pages/Integrations';
import Dashboards from './pages/Dashboards';
import Standards from './pages/Standards';
import Manual from './pages/Manual';

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'hsl(230 20% 8%)', color: 'hsl(220 20% 60%)',
        fontSize: '0.9rem', gap: '0.75rem'
      }}>
        <span style={{
          width: 20, height: 20, border: '2px solid hsl(245 70% 60% / 0.3)',
          borderTopColor: 'hsl(245 70% 60%)', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite', display: 'inline-block'
        }} />
        Cargando...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'hsl(230 20% 8%)', color: 'hsl(220 20% 60%)',
        fontSize: '0.9rem', gap: '0.75rem'
      }}>
        <span style={{
          width: 20, height: 20, border: '2px solid hsl(245 70% 60% / 0.3)',
          borderTopColor: 'hsl(245 70% 60%)', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite', display: 'inline-block'
        }} />
        Iniciando NexIA VSM...
      </div>
    );
  }

  // Mostrar Auth si no hay sesión
  if (!session) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/config" element={<Configuration />} />
          <Route path="/canvas" element={<Canvas />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/execution" element={<Execution />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/standards" element={<Standards />} />
          <Route path="/manual" element={<Manual />} />
          <Route path="/auth" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
