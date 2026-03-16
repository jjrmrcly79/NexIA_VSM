-- =======================================================
-- NexIA_VSM — Migración Supabase
-- Schema: vsm  (independiente, una instancia multi-app)
-- RLS habilitado: cada usuario ve solo SUS datos
-- Tablas: profiles + 9 módulos VSM
-- =======================================================

-- 1. Crear schema
CREATE SCHEMA IF NOT EXISTS vsm;

-- 2. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;

-- -------------------------------------------------------
-- TABLA: profiles (perfil extendido — SaaS-ready)
-- Se crea automáticamente al registrar un usuario.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS vsm.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  company      TEXT,
  role         TEXT NOT NULL DEFAULT 'analyst',
  -- role values: 'admin' | 'analyst' | 'viewer'
  avatar_url   TEXT,
  plan         TEXT NOT NULL DEFAULT 'free',
  -- plan values: 'free' | 'pro' | 'enterprise'
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE vsm.profiles ENABLE ROW LEVEL SECURITY;

-- El propio usuario ve y edita su perfil
CREATE POLICY "profile_owner_all" ON vsm.profiles
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Otros usuarios autenticados pueden leer el nombre (útil para asignación de tareas)
CREATE POLICY "profile_read_by_authenticated" ON vsm.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Trigger: crear perfil vacío automáticamente al registrarse
CREATE OR REPLACE FUNCTION vsm.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO vsm.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION vsm.handle_new_user();

-- -------------------------------------------------------
-- TABLA: projects (raíz de cada proyecto VSM)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS vsm.projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE vsm.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_projects" ON vsm.projects
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- TABLA: project_config (Módulo 1 — Configuración)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS vsm.project_config (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        UUID NOT NULL REFERENCES vsm.projects(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  demand_units      INTEGER NOT NULL DEFAULT 100,
  demand_period     TEXT NOT NULL DEFAULT 'day',
  shifts_per_day    INTEGER NOT NULL DEFAULT 2,
  hours_per_shift   NUMERIC NOT NULL DEFAULT 8,
  break_minutes     INTEGER NOT NULL DEFAULT 60,
  meeting_minutes   INTEGER NOT NULL DEFAULT 15,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id)
);

ALTER TABLE vsm.project_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_config" ON vsm.project_config
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- TABLA: steps (Módulo 2 — Pasos del proceso)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS vsm.steps (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID NOT NULL REFERENCES vsm.projects(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  cycle_time       NUMERIC NOT NULL DEFAULT 0,
  changeover_time  NUMERIC NOT NULL DEFAULT 0,
  quality          NUMERIC NOT NULL DEFAULT 1,
  uptime           NUMERIC NOT NULL DEFAULT 1,
  operators        INTEGER NOT NULL DEFAULT 1,
  wait_time        NUMERIC NOT NULL DEFAULT 0,
  inventory        INTEGER NOT NULL DEFAULT 0,
  notes            TEXT,
  "order"          INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE vsm.steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_steps" ON vsm.steps
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- TABLA: adkar_scores (Módulo 3 — ADKAR)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS vsm.adkar_scores (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID NOT NULL REFERENCES vsm.projects(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  awareness        INTEGER NOT NULL DEFAULT 0,
  desire           INTEGER NOT NULL DEFAULT 0,
  knowledge        INTEGER NOT NULL DEFAULT 0,
  ability          INTEGER NOT NULL DEFAULT 0,
  reinforcement    INTEGER NOT NULL DEFAULT 0,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id)
);

ALTER TABLE vsm.adkar_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_adkar" ON vsm.adkar_scores
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- TABLA: kaizen_events (Módulo 4 — Eventos Kaizen)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS vsm.kaizen_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES vsm.projects(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id     UUID,
  title       TEXT NOT NULL,
  priority    TEXT NOT NULL DEFAULT 'medium',
  assignee    TEXT,
  due_date    DATE,
  status      TEXT NOT NULL DEFAULT 'todo',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE vsm.kaizen_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_kaizen" ON vsm.kaizen_events
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- TABLA: skills_matrix (Módulo 4 — Matriz de habilidades)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS vsm.skills_matrix (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES vsm.projects(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  operators   JSONB NOT NULL DEFAULT '[]',
  tasks       JSONB NOT NULL DEFAULT '[]',
  matrix      JSONB NOT NULL DEFAULT '[]',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id)
);

ALTER TABLE vsm.skills_matrix ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_skills" ON vsm.skills_matrix
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- TABLA: metrics (Módulo 6 — Métricas)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS vsm.metrics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES vsm.projects(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  environmental JSONB NOT NULL DEFAULT '{}',
  social        JSONB NOT NULL DEFAULT '{}',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id)
);

ALTER TABLE vsm.metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_metrics" ON vsm.metrics
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- TABLA: standards (Módulo 7 — Trabajo estándar)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS vsm.standards (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES vsm.projects(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id       UUID,
  title         TEXT NOT NULL,
  sequence      TEXT,
  key_points    TEXT,
  standard_time NUMERIC,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE vsm.standards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_standards" ON vsm.standards
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- TABLA: targets (Módulo 7 — Objetivos)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS vsm.targets (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID NOT NULL REFERENCES vsm.projects(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric         TEXT NOT NULL,
  current_value  TEXT,
  target_value   TEXT,
  deadline       DATE,
  owner          TEXT,
  status         TEXT NOT NULL DEFAULT 'todo',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE vsm.targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_targets" ON vsm.targets
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- Trigger: updated_at automático en todas las tablas
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION vsm.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles','projects','project_config','steps','adkar_scores',
    'kaizen_events','skills_matrix','metrics','standards','targets'
  ] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_updated_at ON vsm.%I;
       CREATE TRIGGER trg_updated_at
       BEFORE UPDATE ON vsm.%I
       FOR EACH ROW EXECUTE FUNCTION vsm.set_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;

-- -------------------------------------------------------
-- Exponer schema vsm en la API REST de Supabase
-- (Ejecutar también: agregar "vsm" en API > Extra Search Path)
-- -------------------------------------------------------
GRANT USAGE ON SCHEMA vsm TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA vsm TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA vsm TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA vsm TO anon;
-- El trigger corre como SECURITY DEFINER, necesita acceso al schema
GRANT EXECUTE ON FUNCTION vsm.handle_new_user() TO service_role;
