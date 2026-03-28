'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Deck, Patient, Question } from '@shared/types';

export default function PatientDetail({ params }: { params: { id: string } }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [library, setLibrary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadData = async () => {
    setLoading(true);
    
    // 1. Load Patient
    const { data: pData } = await supabase.from('patients').select('*').eq('id', params.id).single();
    if (pData) setPatient(pData);

    // 2. Load Active Deck
    const { data: dData } = await supabase
      .from('decks')
      .select('*')
      .eq('patient_id', params.id)
      .eq('status', 'active')
      .single();

    let currentDeck = dData;
    if (!currentDeck) {
      // Create one if none exists
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: newD } = await supabase.from('decks').insert([{
          patient_id: params.id,
          doctor_id: session.user.id,
          status: 'active'
        }]).select().single();
        currentDeck = newD;
      }
    }
    
    setDeck(currentDeck);

    // 3. Load Deck Questions
    if (currentDeck) {
      const { data: qData } = await supabase
        .from('questions')
        .select('*')
        .eq('deck_id', currentDeck.id)
        .order('order', { ascending: true });
      if (qData) setQuestions(qData);
    }

    // 4. Load Library
    const { data: libData } = await supabase.from('question_library').select('*');
    if (libData) setLibrary(libData);

    setLoading(false);
  };

  const addFromLibrary = async (template: any) => {
    if (!deck) return;
    const newOrder = questions.length;
    const { data: newQ } = await supabase.from('questions').insert([{
      deck_id: deck.id,
      order: newOrder,
      text: template.text,
      type: template.type,
      config: template.config,
      tags: template.tags,
      is_required: true,
      created_from: 'library'
    }]).select().single();

    if (newQ) {
      setQuestions([...questions, newQ]);
    }
  };

  const removeQuestion = async (qId: string) => {
    await supabase.from('questions').delete().eq('id', qId);
    setQuestions(questions.filter(q => q.id !== qId));
    // Optionally: re-order remaining
  };

  const moveQuestion = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newQuestions = [...questions];
    
    // Swap
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[newIndex];
    newQuestions[newIndex] = temp;

    // Update state immediately for UX
    setQuestions(newQuestions.map((q, i) => ({ ...q, order: i })));

    // Sync to DB
    await Promise.all([
      supabase.from('questions').update({ order: newIndex }).eq('id', newQuestions[newIndex].id),
      supabase.from('questions').update({ order: index }).eq('id', newQuestions[index].id),
    ]);
  };

  if (loading) return <div className="dashboard-page"><div className="loading">Loading patient...</div></div>;
  if (!patient) return <div className="dashboard-page">Patient not found.</div>;

  return (
    <div className="dashboard-page deck-editor">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <button className="text-btn" onClick={() => router.back()} style={{ marginBottom: '8px' }}>← Back to Patients</button>
          <h1>{patient.name}</h1>
          <p>Manage the check-in questions for this patient.</p>
        </div>
      </header>

      <div className="deck-container">
        {/* Left Side: Active Questions */}
        <section className="active-deck">
          <h2>Active Deck ({questions.length})</h2>
          {questions.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <h3>No questions</h3>
              <p>Add questions from the library on the right.</p>
            </div>
          ) : (
            <div className="questions-list">
              {questions.map((q, i) => (
                <div key={q.id} className="question-row">
                  <div className="order-controls">
                    <button onClick={() => moveQuestion(i, 'up')} disabled={i === 0}>▲</button>
                    <button onClick={() => moveQuestion(i, 'down')} disabled={i === questions.length - 1}>▼</button>
                  </div>
                  <div className="q-content">
                    <div className="q-text">{q.text}</div>
                    <div className="q-type">{q.type.replace('_', ' ')}</div>
                  </div>
                  <button className="del-btn" onClick={() => removeQuestion(q.id)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Side: Library */}
        <section className="library-panel">
          <h2>Question Library</h2>
          <div className="library-list">
            {library.map(template => (
              <div key={template.id} className="library-card">
                <div className="card-top">
                  <span className="badge">{template.category}</span>
                  <button className="add-btn" onClick={() => addFromLibrary(template)}>+</button>
                </div>
                <div className="q-text">{template.text}</div>
                <div className="q-type">{template.type.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
