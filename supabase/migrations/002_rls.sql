-- PenguinPals Row-Level Security
-- Migration 002: RLS policies for data isolation

-- Enable RLS on all tables
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_library ENABLE ROW LEVEL SECURITY;

-- ── Doctors ──
-- Doctors can read/update their own profile
CREATE POLICY "doctors_read_own" ON doctors
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "doctors_update_own" ON doctors
  FOR UPDATE USING (id = auth.uid());

-- ── Patients ──
-- Doctors see only their linked patients
CREATE POLICY "doctors_see_own_patients" ON patients
  FOR SELECT USING (doctor_id = auth.uid());

-- Patients see their own record
CREATE POLICY "patients_see_own" ON patients
  FOR SELECT USING (id = auth.uid());

-- Patients can update their own settings
CREATE POLICY "patients_update_own" ON patients
  FOR UPDATE USING (id = auth.uid());

-- Allow pairing lookup (anyone with valid code)
CREATE POLICY "pairing_lookup" ON patients
  FOR SELECT USING (
    pairing_code IS NOT NULL
    AND pairing_code_expires_at > now()
  );

-- ── Decks ──
-- Doctors manage decks they created
CREATE POLICY "doctors_manage_own_decks" ON decks
  FOR ALL USING (doctor_id = auth.uid());

-- Patients can read their active deck only
CREATE POLICY "patients_read_active_deck" ON decks
  FOR SELECT USING (patient_id = auth.uid() AND status = 'active');

-- ── Questions ──
-- Doctors manage questions in their decks
CREATE POLICY "doctors_manage_questions" ON questions
  FOR ALL USING (
    deck_id IN (SELECT id FROM decks WHERE doctor_id = auth.uid())
  );

-- Patients read questions from their active deck
CREATE POLICY "patients_read_questions" ON questions
  FOR SELECT USING (
    deck_id IN (SELECT id FROM decks WHERE patient_id = auth.uid() AND status = 'active')
  );

-- ── Check-In Sessions ──
-- Patients manage their own sessions
CREATE POLICY "patients_manage_sessions" ON check_in_sessions
  FOR ALL USING (patient_id = auth.uid());

-- Doctors read sessions from their patients
CREATE POLICY "doctors_read_sessions" ON check_in_sessions
  FOR SELECT USING (
    patient_id IN (SELECT id FROM patients WHERE doctor_id = auth.uid())
  );

-- ── Responses ──
-- Patients create/read their own responses
CREATE POLICY "patients_manage_responses" ON responses
  FOR ALL USING (patient_id = auth.uid());

-- Doctors read responses from their patients
CREATE POLICY "doctors_read_responses" ON responses
  FOR SELECT USING (
    patient_id IN (SELECT id FROM patients WHERE doctor_id = auth.uid())
  );

-- ── Question Library (read-only for all authenticated users) ──
CREATE POLICY "library_read_all" ON question_library
  FOR SELECT USING (auth.role() = 'authenticated');
