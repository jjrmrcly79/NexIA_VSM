import { createContext, useContext, useReducer, useEffect } from 'react';
import { DEMO_PROJECT } from '../utils/demoData';

const AppContext = createContext();
const STORAGE_KEY = 'nexia-vsm-data';

const initialState = {
  projects: [DEMO_PROJECT],
  activeProjectId: DEMO_PROJECT.id,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...initialState, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
  return initialState;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

function updateProject(state, id, updater) {
  return {
    ...state,
    projects: state.projects.map(p => p.id === id ? updater(p) : p),
  };
}

function appReducer(state, action) {
  const pid = state.activeProjectId;
  switch (action.type) {
    /* --- Projects --- */
    case 'CREATE_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
        activeProjectId: action.payload.id,
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        activeProjectId: state.activeProjectId === action.payload
          ? (state.projects.find(p => p.id !== action.payload)?.id || null)
          : state.activeProjectId,
      };
    case 'SET_ACTIVE_PROJECT':
      return { ...state, activeProjectId: action.payload };
    case 'UPDATE_PROJECT':
      return updateProject(state, action.payload.id, p => ({ ...p, ...action.payload }));

    /* --- Configuration (Module 1) --- */
    case 'UPDATE_CONFIG':
      return updateProject(state, pid, p => ({ ...p, config: { ...p.config, ...action.payload } }));

    /* --- Steps (Module 2) --- */
    case 'ADD_STEP':
      return updateProject(state, pid, p => ({ ...p, steps: [...p.steps, action.payload] }));
    case 'UPDATE_STEP':
      return updateProject(state, pid, p => ({
        ...p,
        steps: p.steps.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s),
      }));
    case 'DELETE_STEP':
      return updateProject(state, pid, p => ({
        ...p,
        steps: p.steps.filter(s => s.id !== action.payload),
      }));
    case 'SET_STEPS':
      return updateProject(state, pid, p => ({ ...p, steps: action.payload }));

    /* --- ADKAR (Module 3) --- */
    case 'UPDATE_ADKAR':
      return updateProject(state, pid, p => ({ ...p, adkar: { ...p.adkar, ...action.payload } }));

    /* --- Kaizen (Module 4) --- */
    case 'ADD_KAIZEN':
      return updateProject(state, pid, p => ({ ...p, kaizen: [...(p.kaizen || []), action.payload] }));
    case 'UPDATE_KAIZEN':
      return updateProject(state, pid, p => ({
        ...p,
        kaizen: (p.kaizen || []).map(k => k.id === action.payload.id ? { ...k, ...action.payload } : k),
      }));
    case 'DELETE_KAIZEN':
      return updateProject(state, pid, p => ({
        ...p,
        kaizen: (p.kaizen || []).filter(k => k.id !== action.payload),
      }));

    /* --- Skills Matrix (Module 4) --- */
    case 'UPDATE_SKILLS':
      return updateProject(state, pid, p => ({ ...p, skills: { ...p.skills, ...action.payload } }));

    /* --- Integrations (Module 5) --- */
    case 'UPDATE_INTEGRATION':
      return updateProject(state, pid, p => ({
        ...p,
        integrations: {
          ...p.integrations,
          [action.payload.key]: { ...(p.integrations?.[action.payload.key] || {}), ...action.payload.data },
        },
      }));

    /* --- Metrics (Module 6) --- */
    case 'UPDATE_METRICS':
      return updateProject(state, pid, p => ({
        ...p,
        metrics: {
          ...p.metrics,
          [action.payload.category]: { ...(p.metrics?.[action.payload.category] || {}), ...action.payload.data },
        },
      }));

    /* --- Standards (Module 7) --- */
    case 'ADD_STANDARD':
      return updateProject(state, pid, p => ({ ...p, standards: [...(p.standards || []), action.payload] }));
    case 'UPDATE_STANDARD':
      return updateProject(state, pid, p => ({
        ...p,
        standards: (p.standards || []).map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s),
      }));
    case 'DELETE_STANDARD':
      return updateProject(state, pid, p => ({
        ...p,
        standards: (p.standards || []).filter(s => s.id !== action.payload),
      }));

    /* --- Targets (Module 7) --- */
    case 'ADD_TARGET':
      return updateProject(state, pid, p => ({ ...p, targets: [...(p.targets || []), action.payload] }));
    case 'UPDATE_TARGET':
      return updateProject(state, pid, p => ({
        ...p,
        targets: (p.targets || []).map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t),
      }));
    case 'DELETE_TARGET':
      return updateProject(state, pid, p => ({
        ...p,
        targets: (p.targets || []).filter(t => t.id !== action.payload),
      }));

    /* --- Reset --- */
    case 'RESET_ALL':
      return initialState;

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeProject = state.projects.find(p => p.id === state.activeProjectId) || null;

  return (
    <AppContext.Provider value={{ state, dispatch, activeProject }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
