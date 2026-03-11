import { uid } from './helpers';

const stepIds = [uid(), uid(), uid(), uid(), uid(), uid()];

export const DEMO_PROJECT = {
  id: uid(),
  name: 'Línea de Ensamble — Motor Eléctrico',
  description: 'Mapeo del flujo de valor actual para la línea de ensamble de motores eléctricos de baja tensión.',
  createdAt: new Date().toISOString(),

  // Module 1: Configuration
  config: {
    demandUnits: 120,
    demandPeriod: 'day',
    shiftsPerDay: 2,
    hoursPerShift: 8,
    breakMinutes: 60,
    meetingMinutes: 15,
  },

  // Module 2: Process Steps
  steps: [
    {
      id: stepIds[0],
      name: 'Corte de Laminaciones',
      cycleTime: 45,
      changeoverTime: 1800,
      quality: 0.97,
      uptime: 0.88,
      operators: 1,
      waitTime: 14400,
      inventory: 500,
      notes: 'Prensa hidráulica CNC',
      order: 0,
    },
    {
      id: stepIds[1],
      name: 'Apilado de Estator',
      cycleTime: 120,
      changeoverTime: 600,
      quality: 0.99,
      uptime: 0.92,
      operators: 2,
      waitTime: 7200,
      inventory: 200,
      notes: 'Proceso manual con guías',
      order: 1,
    },
    {
      id: stepIds[2],
      name: 'Bobinado',
      cycleTime: 300,
      changeoverTime: 2400,
      quality: 0.93,
      uptime: 0.85,
      operators: 3,
      waitTime: 28800,
      inventory: 100,
      notes: 'Bobinadora automática + inspección visual',
      order: 2,
    },
    {
      id: stepIds[3],
      name: 'Impregnación y Curado',
      cycleTime: 180,
      changeoverTime: 900,
      quality: 0.98,
      uptime: 0.90,
      operators: 1,
      waitTime: 43200,
      inventory: 80,
      notes: 'Horno de curado por lotes',
      order: 3,
    },
    {
      id: stepIds[4],
      name: 'Ensamble Final',
      cycleTime: 240,
      changeoverTime: 300,
      quality: 0.96,
      uptime: 0.95,
      operators: 4,
      waitTime: 3600,
      inventory: 50,
      notes: 'Línea de ensamble con estaciones fijas',
      order: 4,
    },
    {
      id: stepIds[5],
      name: 'Pruebas y Empaque',
      cycleTime: 150,
      changeoverTime: 120,
      quality: 0.995,
      uptime: 0.98,
      operators: 2,
      waitTime: 1800,
      inventory: 30,
      notes: 'Banco de pruebas eléctricas + embalaje',
      order: 5,
    },
  ],

  // Module 3: ADKAR Scores
  adkar: {
    awareness: 4,
    desire: 3,
    knowledge: 3,
    ability: 2,
    reinforcement: 2,
  },

  // Module 4: Kaizen Events
  kaizen: [
    { id: uid(), title: 'Reducir C/O en Bobinado', priority: 'high', assignee: 'Carlos M.', dueDate: '2026-04-15', status: 'in-progress', stepId: stepIds[2] },
    { id: uid(), title: 'Implementar FIFO entre Estator y Bobinado', priority: 'medium', assignee: 'Ana R.', dueDate: '2026-04-30', status: 'todo', stepId: stepIds[1] },
    { id: uid(), title: 'Mejora de Uptime en Corte', priority: 'high', assignee: 'Luis P.', dueDate: '2026-04-20', status: 'todo', stepId: stepIds[0] },
  ],

  // Module 4: Skills Matrix
  skills: {
    operators: ['Carlos M.', 'Ana R.', 'Luis P.', 'María G.', 'Pedro S.'],
    tasks: ['Corte', 'Apilado', 'Bobinado', 'Impregnación', 'Ensamble', 'Pruebas'],
    matrix: [
      [4, 3, 2, 1, 0, 0],
      [2, 4, 3, 2, 1, 0],
      [3, 2, 4, 3, 2, 1],
      [1, 1, 2, 4, 3, 2],
      [0, 0, 1, 2, 4, 3],
    ],
  },

  // Module 5: Integrations
  integrations: {
    scada: { enabled: false, endpoint: '', status: 'disconnected' },
    erp: { enabled: false, endpoint: '', status: 'disconnected' },
    jira: { enabled: false, apiKey: '', project: '', status: 'disconnected' },
    gitlab: { enabled: false, apiKey: '', project: '', status: 'disconnected' },
  },

  // Module 6: Metrics
  metrics: {
    environmental: { energyKwh: 450, co2Kg: 120, waterLiters: 800, wasteKg: 35 },
    social: { safetyIncidents: 1, ergonomicRisk: 'medium', turnoverRate: 0.08, wellbeingScore: 3.5 },
  },

  // Module 7: Standard Work
  standards: [
    { id: uid(), stepId: stepIds[4], title: 'SOP — Ensamble Final', sequence: '1. Montar estator\n2. Insertar rotor\n3. Fijar tapas\n4. Conectar terminales\n5. Inspección visual', keyPoints: 'Verificar torque en paso 3. Usar galga en paso 4.', standardTime: 240, createdAt: new Date().toISOString() },
  ],
  targets: [
    { id: uid(), metric: 'Lead Time', currentValue: '27.5 hrs', targetValue: '16 hrs', deadline: '2026-06-30', owner: 'Carlos M.', status: 'in-progress' },
    { id: uid(), metric: 'PCE', currentValue: '3.1%', targetValue: '8%', deadline: '2026-06-30', owner: 'Ana R.', status: 'todo' },
  ],
};
