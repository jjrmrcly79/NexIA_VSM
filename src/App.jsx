import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Configuration from './pages/Configuration';
import Canvas from './pages/Canvas';
import Analysis from './pages/Analysis';
import Execution from './pages/Execution';
import Integrations from './pages/Integrations';
import Dashboards from './pages/Dashboards';
import Standards from './pages/Standards';
import Manual from './pages/Manual';

export default function App() {
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
        </Routes>
      </main>
    </div>
  );
}
