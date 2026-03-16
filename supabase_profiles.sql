-- =======================================================
-- NexIA_VSM — Migración Adicional: Profiles
-- Ejecutar DESPUÉS de supabase_migration.sql
-- Schema: vsm
-- =======================================================

-- -------------------------------------------------------
-- TABLA: profiles (perfil extendido — SaaS-ready)
-- Se crea automáticamente cuando un usuario se registra.
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

-- -------------------------------------------------------
-- RLS
-- -------------------------------------------------------
ALTER TABLE vsm.profiles ENABLE ROW LEVEL SECURITY;

-- El dueño del perfil puede leer y editar el suyo
CREATE POLICY "profile_owner_all" ON vsm.profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Cualquier usuario autenticado puede leer el nombre y empresa
-- (útil para mostrar el asignado en eventos Kaizen, etc.)
CREATE POLICY "profile_read_by_authenticated" ON vsm.profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- -------------------------------------------------------
-- Trigger updated_at
-- -------------------------------------------------------
DROP TRIGGER IF EXISTS trg_updated_at ON vsm.profiles;
CREATE TRIGGER trg_updated_at
  BEFORE UPDATE ON vsm.profiles
  FOR EACH ROW EXECUTE FUNCTION vsm.set_updated_at();

-- -------------------------------------------------------
-- Trigger: auto-crear perfil al registrarse un usuario
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION vsm.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO vsm.profiles (id, full_name)
  VALUES (
    NEW.id,
    -- Usa full_name si viene en metadata (p.ej. signUp con opciones),
    -- si no, toma la parte local del email como nombre inicial.
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
-- Backfill: crear perfil para usuarios ya existentes
-- (seguro ejecutar aunque la tabla esté vacía)
-- -------------------------------------------------------
INSERT INTO vsm.profiles (id, full_name)
SELECT
  id,
  split_part(email, '@', 1)
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------
-- Permisos
-- -------------------------------------------------------
GRANT ALL ON vsm.profiles TO authenticated;
GRANT SELECT ON vsm.profiles TO anon;
GRANT EXECUTE ON FUNCTION vsm.handle_new_user() TO service_role;
