'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [doctorName, setDoctorName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/');
      } else {
        // Fetch doctor name
        supabase.from('doctors').select('name').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data) setDoctorName(data.name);
          });
      }
    });
  }, [router]);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Patients', path: '/patients', icon: '👥' },
    { label: 'Library', path: '/library', icon: '📚' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-placeholder">P</div>
        <h2>PenguinPals</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path} className={`nav-item ${pathname.startsWith(item.path) ? 'active' : ''}`}>
            <span className="icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="doctor-avatar">{doctorName ? doctorName.charAt(0).toUpperCase() : 'Dr'}</div>
        <div className="doctor-info">
          <div className="doctor-name">Dr. {doctorName || 'Loading...'}</div>
          <button onClick={() => supabase.auth.signOut().then(() => router.replace('/'))} className="logout-btn">
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}
