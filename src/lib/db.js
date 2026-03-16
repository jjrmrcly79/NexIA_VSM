import { supabase } from './supabase';

// -------------------------------------------------------
// PROJECTS
// -------------------------------------------------------
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createProject(project) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...project, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(id, updates) {
  const { error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function deleteProject(id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------
// PROJECT CONFIG (Módulo 1)
// -------------------------------------------------------
export async function upsertConfig(projectId, config) {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from('project_config')
    .upsert({
      project_id: projectId,
      user_id: user.id,
      demand_units: config.demandUnits,
      demand_period: config.demandPeriod,
      shifts_per_day: config.shiftsPerDay,
      hours_per_shift: config.hoursPerShift,
      break_minutes: config.breakMinutes,
      meeting_minutes: config.meetingMinutes,
    }, { onConflict: 'project_id' });
  if (error) throw error;
}

// -------------------------------------------------------
// STEPS (Módulo 2)
// -------------------------------------------------------
export async function getSteps(projectId) {
  const { data, error } = await supabase
    .from('steps')
    .select('*')
    .eq('project_id', projectId)
    .order('order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function upsertStep(projectId, step) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('steps')
    .upsert({
      id: step.id,
      project_id: projectId,
      user_id: user.id,
      name: step.name,
      cycle_time: step.cycleTime,
      changeover_time: step.changeoverTime,
      quality: step.quality,
      uptime: step.uptime,
      operators: step.operators,
      wait_time: step.waitTime,
      inventory: step.inventory,
      notes: step.notes,
      order: step.order,
    }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStep(id) {
  const { error } = await supabase.from('steps').delete().eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------
// ADKAR (Módulo 3)
// -------------------------------------------------------
export async function upsertAdkar(projectId, adkar) {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from('adkar_scores')
    .upsert({
      project_id: projectId,
      user_id: user.id,
      awareness: adkar.awareness,
      desire: adkar.desire,
      knowledge: adkar.knowledge,
      ability: adkar.ability,
      reinforcement: adkar.reinforcement,
    }, { onConflict: 'project_id' });
  if (error) throw error;
}

// -------------------------------------------------------
// KAIZEN (Módulo 4)
// -------------------------------------------------------
export async function upsertKaizen(projectId, kaizen) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('kaizen_events')
    .upsert({
      id: kaizen.id,
      project_id: projectId,
      user_id: user.id,
      step_id: kaizen.stepId || null,
      title: kaizen.title,
      priority: kaizen.priority,
      assignee: kaizen.assignee,
      due_date: kaizen.dueDate || null,
      status: kaizen.status,
    }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteKaizen(id) {
  const { error } = await supabase.from('kaizen_events').delete().eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------
// SKILLS MATRIX (Módulo 4)
// -------------------------------------------------------
export async function upsertSkills(projectId, skills) {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from('skills_matrix')
    .upsert({
      project_id: projectId,
      user_id: user.id,
      operators: skills.operators,
      tasks: skills.tasks,
      matrix: skills.matrix,
    }, { onConflict: 'project_id' });
  if (error) throw error;
}

// -------------------------------------------------------
// METRICS (Módulo 6)
// -------------------------------------------------------
export async function upsertMetrics(projectId, metrics) {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from('metrics')
    .upsert({
      project_id: projectId,
      user_id: user.id,
      environmental: metrics.environmental || {},
      social: metrics.social || {},
    }, { onConflict: 'project_id' });
  if (error) throw error;
}

// -------------------------------------------------------
// STANDARDS (Módulo 7)
// -------------------------------------------------------
export async function upsertStandard(projectId, standard) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('standards')
    .upsert({
      id: standard.id,
      project_id: projectId,
      user_id: user.id,
      step_id: standard.stepId || null,
      title: standard.title,
      sequence: standard.sequence,
      key_points: standard.keyPoints,
      standard_time: standard.standardTime,
    }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStandard(id) {
  const { error } = await supabase.from('standards').delete().eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------
// TARGETS (Módulo 7)
// -------------------------------------------------------
export async function upsertTarget(projectId, target) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('targets')
    .upsert({
      id: target.id,
      project_id: projectId,
      user_id: user.id,
      metric: target.metric,
      current_value: target.currentValue,
      target_value: target.targetValue,
      deadline: target.deadline || null,
      owner: target.owner,
      status: target.status,
    }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTarget(id) {
  const { error } = await supabase.from('targets').delete().eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------
// LOAD FULL PROJECT (hydrate a project with all modules)
// -------------------------------------------------------
export async function loadFullProject(projectId) {
  const [
    { data: config },
    { data: steps },
    { data: adkar },
    { data: kaizen },
    { data: skills },
    { data: metrics },
    { data: standards },
    { data: targets },
  ] = await Promise.all([
    supabase.from('project_config').select('*').eq('project_id', projectId).maybeSingle(),
    supabase.from('steps').select('*').eq('project_id', projectId).order('order'),
    supabase.from('adkar_scores').select('*').eq('project_id', projectId).maybeSingle(),
    supabase.from('kaizen_events').select('*').eq('project_id', projectId),
    supabase.from('skills_matrix').select('*').eq('project_id', projectId).maybeSingle(),
    supabase.from('metrics').select('*').eq('project_id', projectId).maybeSingle(),
    supabase.from('standards').select('*').eq('project_id', projectId),
    supabase.from('targets').select('*').eq('project_id', projectId),
  ]);

  return {
    config: config ? {
      demandUnits: config.demand_units,
      demandPeriod: config.demand_period,
      shiftsPerDay: config.shifts_per_day,
      hoursPerShift: config.hours_per_shift,
      breakMinutes: config.break_minutes,
      meetingMinutes: config.meeting_minutes,
    } : {},
    steps: (steps || []).map(s => ({
      id: s.id,
      name: s.name,
      cycleTime: s.cycle_time,
      changeoverTime: s.changeover_time,
      quality: s.quality,
      uptime: s.uptime,
      operators: s.operators,
      waitTime: s.wait_time,
      inventory: s.inventory,
      notes: s.notes,
      order: s.order,
    })),
    adkar: adkar ? {
      awareness: adkar.awareness,
      desire: adkar.desire,
      knowledge: adkar.knowledge,
      ability: adkar.ability,
      reinforcement: adkar.reinforcement,
    } : { awareness: 0, desire: 0, knowledge: 0, ability: 0, reinforcement: 0 },
    kaizen: (kaizen || []).map(k => ({
      id: k.id,
      title: k.title,
      priority: k.priority,
      assignee: k.assignee,
      dueDate: k.due_date,
      status: k.status,
      stepId: k.step_id,
    })),
    skills: skills ? {
      operators: skills.operators,
      tasks: skills.tasks,
      matrix: skills.matrix,
    } : { operators: [], tasks: [], matrix: [] },
    metrics: metrics ? {
      environmental: metrics.environmental,
      social: metrics.social,
    } : {},
    standards: (standards || []).map(s => ({
      id: s.id,
      stepId: s.step_id,
      title: s.title,
      sequence: s.sequence,
      keyPoints: s.key_points,
      standardTime: s.standard_time,
      createdAt: s.created_at,
    })),
    targets: (targets || []).map(t => ({
      id: t.id,
      metric: t.metric,
      currentValue: t.current_value,
      targetValue: t.target_value,
      deadline: t.deadline,
      owner: t.owner,
      status: t.status,
    })),
  };
}
