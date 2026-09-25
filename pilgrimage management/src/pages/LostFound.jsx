import React, { useState } from 'react';
import { UserCheck, Search, Plus, Phone, CheckCircle, MapPin, AlertCircle, Camera } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';

export default function LostFound() {
  const { lostPersons, addLostPerson } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New missing person form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [clothing, setClothing] = useState('');
  const [lastSeenLocation, setLastSeenLocation] = useState('Zone C — Festival Ground');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const activeSearchingCount = lostPersons.filter(p => p.status === 'SEARCHING').length;
  const reunitedCount = lostPersons.filter(p => p.status === 'MATCH FOUND' || p.status === 'REUNITED').length;

  const filteredPersons = lostPersons.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          person.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          person.clothing.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || person.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRegisterMissing = (e) => {
    e.preventDefault();
    if (!name || !contactPhone) return;

    addLostPerson({
      name,
      age: Number(age) || 10,
      gender,
      clothing,
      lastSeenLocation,
      lastSeenTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contactName,
      contactPhone,
      photoUrl: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=150&q=80"
    });

    setName('');
    setAge('');
    setClothing('');
    setContactName('');
    setContactPhone('');
    setIsModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <UserCheck size={24} style={{ color: 'var(--accent-saffron)' }} />
            PILGRIM REUNITING & LOST PERSONS DESK
          </h1>
          <p className="page-subtitle">Central registry for lost elderly, children, and facial recognition checkpoint alerts.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={14} /> Register Missing Person
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="SEARCHING CASES" value={activeSearchingCount} subtitle="Active field alerts" icon={AlertCircle} accentColor="var(--status-medium)" />
        </div>
        <div className="col-span-3">
          <StatCard title="REUNITED / MATCHED" value={reunitedCount} subtitle="Successfully reunited" icon={CheckCircle} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="CHECKPOINT CCTV" value="14 Gates" subtitle="Facial scanning active" icon={Camera} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="AVG REUNION TIME" value="24 mins" subtitle="Target: <45 mins" icon={UserCheck} accentColor="var(--accent-gold)" />
        </div>
      </div>

      {/* Controls & Search Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '340px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name, ID, or clothing description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '32px', width: '100%', fontSize: '0.8rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status Filter:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
            <option value="ALL">All Records ({lostPersons.length})</option>
            <option value="SEARCHING">Searching Only</option>
            <option value="MATCH FOUND">Match Found</option>
          </select>
        </div>
      </div>

      {/* Grid of Missing Persons */}
      <div className="grid-cols-12">
        {filteredPersons.map(person => (
          <div key={person.id} className="col-span-6">
            <div className="card" style={{ display: 'flex', gap: '16px', borderLeft: person.status === 'SEARCHING' ? '4px solid var(--status-medium)' : '4px solid var(--status-low)' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                background: 'var(--bg-secondary)',
                flexShrink: 0
              }}>
                <img src={person.photoUrl} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-saffron)' }}>
                    {person.id}
                  </span>
                  <span className={`badge ${person.status === 'SEARCHING' ? 'badge-medium' : 'badge-low'}`}>
                    {person.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '2px 0 4px' }}>
                  {person.name}, <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>{person.age} yrs ({person.gender})</span>
                </h4>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <strong>Clothing:</strong> {person.clothing}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Last seen: {person.lastSeenLocation} ({person.lastSeenTime})
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} /> {person.contactName}</span>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{person.contactPhone}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Register Missing Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Missing Pilgrim Case">
        <form onSubmit={handleRegisterMissing} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>FULL NAME</label>
              <input type="text" placeholder="e.g. Ramesh Kumar" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>AGE</label>
              <input type="number" placeholder="e.g. 8 or 72" value={age} onChange={(e) => setAge(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>GENDER</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Child">Child</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CLOTHING DESCRIPTION</label>
              <input type="text" placeholder="e.g. Yellow kurta, white pyjama" value={clothing} onChange={(e) => setClothing(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>LAST SEEN LOCATION</label>
            <input type="text" placeholder="e.g. Zone B — Main Sanctum Queue" value={lastSeenLocation} onChange={(e) => setLastSeenLocation(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>GUARDIAN / CONTACT NAME</label>
              <input type="text" placeholder="e.g. Sunita Devi" value={contactName} onChange={(e) => setContactName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CONTACT PHONE NUMBER</label>
              <input type="tel" placeholder="+91 98765 43210" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Transmit Broadcast to Checkpoints</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
