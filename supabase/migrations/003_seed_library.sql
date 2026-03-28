-- PenguinPals Question Library Seed
-- Migration 003: Pre-built question templates from App_plan.md §6

-- ── Pain Questions ──
INSERT INTO question_library (text, type, config, category, tags) VALUES
  ('How would you rate your pain right now?', 'scale_10', '{"anchorLow": "No pain", "anchorHigh": "Worst imaginable"}', 'pain', '{"pain", "nrs"}'),
  ('Where is your pain located today?', 'multi_select', '{"options": ["Head", "Neck", "Back", "Chest", "Abdomen", "Joints", "Limbs", "Other"]}', 'pain', '{"pain", "location"}'),
  ('Has your pain changed since yesterday?', 'scale_5', '{"variant": "faces", "anchorLow": "Much worse", "anchorHigh": "Much better"}', 'pain', '{"pain", "trend"}'),
  ('Did you take pain medication today?', 'yes_no', '{}', 'pain', '{"pain", "medication"}'),
  ('How much did pain interfere with daily activities?', 'scale_7', '{"anchorLow": "Not at all", "anchorHigh": "Completely"}', 'pain', '{"pain", "function"}');

-- ── Sleep Questions ──
INSERT INTO question_library (text, type, config, category, tags) VALUES
  ('How would you rate your sleep quality last night?', 'scale_7', '{"anchorLow": "Very poor", "anchorHigh": "Excellent"}', 'sleep', '{"sleep", "quality"}'),
  ('How long did it take you to fall asleep?', 'duration', '{}', 'sleep', '{"sleep", "latency"}'),
  ('Did you wake up during the night?', 'yes_no', '{}', 'sleep', '{"sleep", "disruption"}'),
  ('How rested do you feel right now?', 'scale_5', '{"variant": "faces"}', 'sleep', '{"sleep", "rest"}'),
  ('Did you use any sleep aids last night?', 'yes_no', '{}', 'sleep', '{"sleep", "aids"}');

-- ── Mood Questions ──
INSERT INTO question_library (text, type, config, category, tags) VALUES
  ('How would you describe your mood today?', 'mood_grid', '{}', 'mood', '{"mood", "general"}'),
  ('How would you rate your overall mood?', 'scale_7', '{"anchorLow": "Very low", "anchorHigh": "Very high"}', 'mood', '{"mood", "rating"}'),
  ('Have you felt hopeful about your future today?', 'scale_5', '{"variant": "faces"}', 'mood', '{"mood", "hope"}'),
  ('Have you been able to enjoy things you usually enjoy?', 'yes_no', '{}', 'mood', '{"mood", "anhedonia"}');

-- ── Medication Questions ──
INSERT INTO question_library (text, type, config, category, tags) VALUES
  ('Did you take all of your medications as prescribed today?', 'yes_no', '{}', 'medication', '{"medication", "adherence"}'),
  ('Did you skip any doses today?', 'yes_no', '{}', 'medication', '{"medication", "missed"}'),
  ('Did you experience any side effects from your medication?', 'multi_select', '{"options": ["Nausea", "Dizziness", "Fatigue", "Headache", "Stomach pain", "None"]}', 'medication', '{"medication", "side-effects"}'),
  ('How effective do you feel your medication is?', 'scale_5', '{"variant": "stars"}', 'medication', '{"medication", "efficacy"}');

-- ── Anxiety Questions ──
INSERT INTO question_library (text, type, config, category, tags) VALUES
  ('How anxious have you felt today?', 'scale_7', '{"anchorLow": "Not at all", "anchorHigh": "Extremely"}', 'anxiety', '{"anxiety", "severity"}'),
  ('How often did you feel nervous or on edge today?', 'frequency', '{}', 'anxiety', '{"anxiety", "frequency"}'),
  ('Were you able to manage your anxiety today?', 'yes_no', '{}', 'anxiety', '{"anxiety", "coping"}'),
  ('What helped you manage anxiety today?', 'multi_select', '{"options": ["Breathing exercises", "Meditation", "Exercise", "Talking to someone", "Medication", "Nothing helped"]}', 'anxiety', '{"anxiety", "strategies"}');

-- ── Activity Questions ──
INSERT INTO question_library (text, type, config, category, tags) VALUES
  ('How active were you today?', 'scale_5', '{"variant": "stars", "anchorLow": "Sedentary", "anchorHigh": "Very active"}', 'activity', '{"activity", "level"}'),
  ('How long did you exercise or move today?', 'duration', '{}', 'activity', '{"activity", "duration"}'),
  ('Were you able to do your normal daily activities?', 'yes_no', '{}', 'activity', '{"activity", "function"}');

-- ── Social Questions ──
INSERT INTO question_library (text, type, config, category, tags) VALUES
  ('Did you spend meaningful time with others today?', 'yes_no', '{}', 'social', '{"social", "interaction"}'),
  ('How socially connected did you feel today?', 'scale_5', '{"variant": "faces"}', 'social', '{"social", "connection"}'),
  ('How often did you feel lonely today?', 'frequency', '{}', 'social', '{"social", "loneliness"}');

-- ── Appetite Questions ──
INSERT INTO question_library (text, type, config, category, tags) VALUES
  ('How was your appetite today?', 'scale_5', '{"variant": "faces", "anchorLow": "No appetite", "anchorHigh": "Very hungry"}', 'appetite', '{"appetite", "level"}'),
  ('How many full meals did you eat today?', 'multi_choice', '{"options": ["0", "1", "2", "3+"]}', 'appetite', '{"appetite", "meals"}'),
  ('Did you experience nausea today?', 'yes_no', '{}', 'appetite', '{"appetite", "nausea"}');

-- ── Cognition Questions ──
INSERT INTO question_library (text, type, config, category, tags) VALUES
  ('How well were you able to concentrate today?', 'scale_7', '{"anchorLow": "Very poorly", "anchorHigh": "Excellent"}', 'cognition', '{"cognition", "concentration"}'),
  ('Did you experience brain fog or memory issues today?', 'yes_no', '{}', 'cognition', '{"cognition", "fog"}'),
  ('How clear-headed do you feel right now?', 'scale_5', '{"variant": "faces"}', 'cognition', '{"cognition", "clarity"}');

-- ── Open/Custom Questions ──
INSERT INTO question_library (text, type, config, category, tags) VALUES
  ('Is there anything you''d like your doctor to know about today?', 'text_short', '{}', 'custom', '{"open", "notes"}'),
  ('Did anything notable happen today that affected how you feel?', 'text_short', '{}', 'custom', '{"open", "events"}'),
  ('Overall, how was today compared to yesterday?', 'scale_5', '{"variant": "faces", "anchorLow": "Much worse", "anchorHigh": "Much better"}', 'custom', '{"open", "comparison"}');
