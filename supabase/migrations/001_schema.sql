-- PenguinPals Database Schema
-- Migration 001: Core tables

-- ── Doctors ──
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  specialty text,
  clinic text,
  created_at timestamptz DEFAULT now()
);

-- ── Patients ──
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  doctor_id uuid REFERENCES doctors(id),
  pairing_code char(6) UNIQUE,
  pairing_code_expires_at timestamptz,
  timezone text DEFAULT 'America/New_York',
  check_in_time time DEFAULT '21:00',
  streak int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ── Decks ──
CREATE TABLE IF NOT EXISTS decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  name text DEFAULT 'Check-In Deck',
  status text CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
  check_in_frequency text DEFAULT 'daily',
  active_from date,
  active_to date,
  created_at timestamptz DEFAULT now()
);

-- ── Questions ──
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid REFERENCES decks(id) ON DELETE CASCADE NOT NULL,
  "order" int NOT NULL,
  text text NOT NULL,
  type text NOT NULL,
  config jsonb DEFAULT '{}',
  tags text[] DEFAULT '{}',
  is_required boolean DEFAULT false,
  created_from text DEFAULT 'custom'
);

-- ── Check-In Sessions ──
CREATE TABLE IF NOT EXISTS check_in_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  deck_id uuid REFERENCES decks(id) NOT NULL,
  questions_total int NOT NULL,
  questions_answered int DEFAULT 0,
  completed_at timestamptz DEFAULT now()
);

-- ── Responses ──
CREATE TABLE IF NOT EXISTS responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  deck_id uuid REFERENCES decks(id) NOT NULL,
  session_id uuid REFERENCES check_in_sessions(id) NOT NULL,
  value jsonb NOT NULL,
  skipped boolean DEFAULT false,
  answered_at timestamptz DEFAULT now()
);

-- ── Question Library (global templates) ──
CREATE TABLE IF NOT EXISTS question_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  type text NOT NULL,
  config jsonb DEFAULT '{}',
  category text,
  tags text[] DEFAULT '{}',
  use_count int DEFAULT 0
);

-- ── Indexes ──
CREATE INDEX idx_patients_doctor ON patients(doctor_id);
CREATE INDEX idx_patients_pairing_code ON patients(pairing_code);
CREATE INDEX idx_decks_patient ON decks(patient_id);
CREATE INDEX idx_decks_status ON decks(status);
CREATE INDEX idx_questions_deck ON questions(deck_id);
CREATE INDEX idx_responses_session ON responses(session_id);
CREATE INDEX idx_responses_patient ON responses(patient_id);
CREATE INDEX idx_sessions_patient ON check_in_sessions(patient_id);
