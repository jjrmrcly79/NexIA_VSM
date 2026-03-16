import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as db from '../lib/db';

const AppContext = createContext();

const initialState = {
  projects: [],
  activeProjectId: null,
  loading: true,
};

function updateProject(state, id, updater) {
  return {
    ...state,
    projects: state.projects.map(p => p.id === id ? updater(p) : p),
  };
}

function appReducer(state, action) {
  const pid = state.activeProjectId;
  switch (action.type) {
    /* --- Loading --- */
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOAD_PROJECTS':
      return {
        ...state,
        projects: action.payload,
        activeProjectId: action.payload[0]?.id || null,
        loading: false,
      };
    case 'LOAD_PROJECT_DATA':
      return updateProject(state, action.payload.id, p => ({ ...p, ...action.payload.data, _loaded: true }));

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

    /* --- Configuration (Módulo 1) --- */
    case 'UPDATE_CONFIG':
      return updateProject(state, pid, p => ({ ...p, config: { ...p.config, ...action.payload } }));

    /* --- Steps (Módulo 2) --- */
    case 'ADD_STEP':
      return updateProject(state, pid, p => ({ ...p, steps: [...(p.steps || []), action.payload] }));
    case 'UPDATE_STEP':
      return updateProject(state, pid, p => ({
        ...p,
        steps: (p.steps || []).map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s),
      }));
    case 'DELETE_STEP':
      return updateProject(state, pid, p => ({
        ...p,
        steps: (p.steps || []).filter(s => s.id !== action.payload),
      }));
    case 'SET_STEPS':
      return updateProject(state, pid, p => ({ ...p, steps: action.payload }));

    /* --- ADKAR (Módulo 3) --- */
    case 'UPDATE_ADKAR':
      return updateProject(state, pid, p => ({ ...p, adkar: { ...p.adkar, ...action.payload } }));

    /* --- Kaizen (Módulo 4) --- */
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

    /* --- Skills Matrix (Módulo 4) --- */
    case 'UPDATE_SKILLS':
      return updateProject(state, pid, p => ({ ...p, skills: { ...p.skills, ...action.payload } }));

    /* --- Integrations (Módulo 5) --- */
    case 'UPDATE_INTEGRATION':
      return updateProject(state, pid, p => ({
        ...p,
        integrations: {
          ...p.integrations,
          [action.payload.key]: { ...(p.integrations?.[action.payload.key] || {}), ...action.payload.data },
        },
      }));

    /* --- Metrics (Módulo 6) --- */
    case 'UPDATE_METRICS':
      return updateProject(state, pid, p => ({
        ...p,
        metrics: {
          ...p.metrics,
          [action.payload.category]: { ...(p.metrics?.[action.payload.category] || {}), ...action.payload.data },
        },
      }));

    /* --- Standards (Módulo 7) --- */
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

    /* --- Targets (Módulo 7) --- */
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
  const { user } = useAuth();
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ---- Cargar proyectos cuando el usuario hace login ----
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'RESET_ALL' });
      return;
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    db.getProjects()
      .then(projects => dispatch({ type: 'LOAD_PROJECTS', payload: projects }))
      .catch(err => {
        console.error('Error loading projects:', err);
        dispatch({ type: 'SET_LOADING', payload: false });
      });
  }, [user]);

  // ---- Cargar datos del proyecto activo cuando cambia ----
  useEffect(() => {
    if (!state.activeProjectId) return;
    const project = state.projects.find(p => p.id === state.activeProjectId);
    if (!project || project._loaded) return;
    db.loadFullProject(state.activeProjectId)
      .then(data => dispatch({ type: 'LOAD_PROJECT_DATA', payload: { id: state.activeProjectId, data } }))
      .catch(err => console.error('Error loading project data:', err));
  }, [state.activeProjectId, state.projects]);

  // ---- Sincronización automática con Supabase ----
  // Envuelve dispatch con side-effects de persistencia
  const syncDispatch = useCallback(async (action) => {
    dispatch(action);
    if (!user) return;

    const pid = state.activeProjectId;
    const project = state.projects.find(p => p.id === pid);

    try {
      switch (action.type) {
        case 'CREATE_PROJECT': {
          const { id, name, description, createdAt } = action.payload;
          await db.createProject({ id, name, description, created_at: createdAt });
          break;
        }
        case 'DELETE_PROJECT':
          await db.deleteProject(action.payload);
          break;
        case 'UPDATE_PROJECT':
          await db.updateProject(action.payload.id, {
            name: action.payload.name,
            description: action.payload.description,
          });
          break;
        case 'UPDATE_CONFIG': {
          const merged = { ...(project?.config || {}), ...action.payload };
          await db.upsertConfig(pid, merged);
          break;
        }
        case 'ADD_STEP':
        case 'UPDATE_STEP':
          await db.upsertStep(pid, action.payload);
          break;
        case 'DELETE_STEP':
          await db.deleteStep(action.payload);
          break;
        case 'SET_STEPS':
          await Promise.all(action.payload.map(s => db.upsertStep(pid, s)));
          break;
        case 'UPDATE_ADKAR': {
          const merged = { ...(project?.adkar || {}), ...action.payload };
          await db.upsertAdkar(pid, merged);
          break;
        }
        case 'ADD_KAIZEN':
        case 'UPDATE_KAIZEN':
          await db.upsertKaizen(pid, action.payload);
          break;
        case 'DELETE_KAIZEN':
          await db.deleteKaizen(action.payload);
          break;
        case 'UPDATE_SKILLS': {
          const merged = { ...(project?.skills || {}), ...action.payload };
          await db.upsertSkills(pid, merged);
          break;
        }
        case 'UPDATE_METRICS': {
          const merged = {
            ...(project?.metrics || {}),
            [action.payload.category]: {
              ...(project?.metrics?.[action.payload.category] || {}),
              ...action.payload.data,
            },
          };
          await db.upsertMetrics(pid, merged);
          break;
        }
        case 'ADD_STANDARD':
        case 'UPDATE_STANDARD':
          await db.upsertStandard(pid, action.payload);
          break;
        case 'DELETE_STANDARD':
          await db.deleteStandard(action.payload);
          break;
        case 'ADD_TARGET':
        case 'UPDATE_TARGET':
          await db.upsertTarget(pid, action.payload);
          break;
        case 'DELETE_TARGET':
          await db.deleteTarget(action.payload);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`[Supabase sync error] action=${action.type}`, err);
    }
  }, [user, state.activeProjectId, state.projects]);

  const activeProject = state.projects.find(p => p.id === state.activeProjectId) || null;

  return (
    <AppContext.Provider value={{ state, dispatch: syncDispatch, activeProject }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
