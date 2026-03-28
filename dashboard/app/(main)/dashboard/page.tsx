'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Patient, CheckInSession } from '@shared/types';
import { Flame, Inbox } from 'lucide-react';

export default function DashboardHome() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch patients
      const { data: pts } = await supabase
        .from('patients')
        .select(`
          id, name, streak,
          check_in_sessions (
            completed_at, questions_total, questions_answered
          )
        `)
        .eq('doctor_id', session.user.id)
        .order('name');
      
      if (pts) setPatients(pts);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Good morning.</h1>
        <p>Overview of your patients’ activity.</p>
      </header>

      <section className="dashboard-section">
        <h2>Patient Status</h2>
        
        {loading ? (
          <div className="loading">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" style={{ display: 'flex', justifyContent: 'center' }}>
              <Inbox size={64} className="text-slate" />
            </div>
            <h3>No patients yet</h3>
            <p>Go to the Patients tab to add your first patient.</p>
          </div>
        ) : (
          <div className="patient-grid">
            {patients.map((p) => {
              const sessions = p.check_in_sessions || [];
              const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
              
              return (
                <div key={p.id} className="patient-card">
                  <div className="card-header">
                    <div className="avatar">{p.name ? p.name.charAt(0) : '?'}</div>
                    <h3>{p.name || 'Unnamed Patient'}</h3>
                  </div>
                  <div className="card-stats">
                    <div className="stat">
                      <span className="label">Streak</span>
                      <span className="value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {p.streak} days <Flame size={16} />
                      </span>
                    </div>
                    <div className="stat">
                      <span className="label">Last Check-In</span>
                      <span className="value">
                        {lastSession 
                          ? new Date(lastSession.completed_at).toLocaleDateString()
                          : 'Never'}
                      </span>
                    </div>
                  </div>
                  <button className="view-btn">View Report</button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
