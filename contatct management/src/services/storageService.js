// LocalStorage Persistence & Sample Data Provider for OmniCall

const CONTACTS_STORAGE_KEY = 'omnicall_contacts_data';
const HISTORY_STORAGE_KEY = 'omnicall_activity_history';
const REMINDERS_STORAGE_KEY = 'omnicall_reminders';
const SETTINGS_STORAGE_KEY = 'omnicall_app_settings';

export const INITIAL_CONTACTS = [
  {
    id: 'cnt-1',
    name: 'Sarah Jenkins',
    phone: '+1 (555) 234-5678',
    secondaryPhone: '+1 (555) 987-6543',
    email: 'sarah.jenkins@techcorp.io',
    category: 'VIP',
    company: 'TechCorp Solutions',
    jobTitle: 'Senior Product Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
    address: '742 Evergreen Terrace, San Francisco, CA',
    notes: 'Key client for Q3 AI Integration deal. Prefers WhatsApp calls after 2 PM.',
    isFavorite: true,
    isVerified: true,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: 'cnt-2',
    name: 'Alex Rivera',
    phone: '+1 (555) 876-5432',
    secondaryPhone: '',
    email: 'alex.rivera@designstudio.com',
    category: 'Work',
    company: 'Creative Studio',
    jobTitle: 'Lead UX Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    address: '100 Market St, Suite 400, Austin, TX',
    notes: 'Collaborating on modern interface redesign project. Always responsive on WhatsApp.',
    isFavorite: true,
    isVerified: true,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'cnt-3',
    name: 'Dr. Michael Chen',
    phone: '+1 (555) 345-6789',
    secondaryPhone: '',
    email: 'mchen@healthnet.org',
    category: 'Personal',
    company: 'HealthNet Medical Center',
    jobTitle: 'Cardiologist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    address: '450 Medical Pkwy, New York, NY',
    notes: 'Family doctor & close friend. Send email updates regarding clinic schedule.',
    isFavorite: false,
    isVerified: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'cnt-4',
    name: 'Elena Rostova',
    phone: '+1 (555) 654-3210',
    secondaryPhone: '+1 (555) 111-2233',
    email: 'elena.rostova@globalinvest.com',
    category: 'VIP',
    company: 'Global Horizon Capital',
    jobTitle: 'Managing Partner',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
    address: '500 Fifth Avenue, 32nd Floor, New York, NY',
    notes: 'Investor relations lead. Schedule bi-weekly call reminders.',
    isFavorite: true,
    isVerified: true,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  {
    id: 'cnt-5',
    name: 'David Miller',
    phone: '+1 (555) 432-1098',
    secondaryPhone: '',
    email: 'david.m@devlabs.net',
    category: 'Friends',
    company: 'DevLabs Inc.',
    jobTitle: 'Full Stack Engineer',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80',
    address: '128 Beacon St, Boston, MA',
    notes: 'Hackathon teammate. Loves discussing open-source web tech.',
    isFavorite: false,
    isVerified: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const INITIAL_HISTORY = [
  {
    id: 'log-1',
    contactId: 'cnt-1',
    contactName: 'Sarah Jenkins',
    type: 'phone', // 'phone' | 'whatsapp' | 'email' | 'sms'
    target: '+1 (555) 234-5678',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'Outgoing Call',
    notes: 'Dialed native call'
  },
  {
    id: 'log-2',
    contactId: 'cnt-2',
    contactName: 'Alex Rivera',
    type: 'whatsapp',
    target: '+1 (555) 876-5432',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    status: 'WhatsApp Chat',
    notes: 'Sent design specs link via WhatsApp'
  },
  {
    id: 'log-3',
    contactId: 'cnt-4',
    contactName: 'Elena Rostova',
    type: 'email',
    target: 'elena.rostova@globalinvest.com',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'Email Dispatched',
    notes: 'Subject: Q3 Portfolio Overview'
  }
];

// --- Contacts API ---
export function loadContacts() {
  const saved = localStorage.getItem(CONTACTS_STORAGE_KEY);
  if (!saved) {
    saveContacts(INITIAL_CONTACTS);
    return INITIAL_CONTACTS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse stored contacts:', e);
    return INITIAL_CONTACTS;
  }
}

export function saveContacts(contacts) {
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
}

// --- Activity History API ---
export function loadActivityHistory() {
  const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!saved) {
    saveActivityHistory(INITIAL_HISTORY);
    return INITIAL_HISTORY;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse activity history:', e);
    return INITIAL_HISTORY;
  }
}

export function saveActivityHistory(history) {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

export function addActivityLog(logItem) {
  const history = loadActivityHistory();
  const newLog = {
    id: 'log-' + Date.now(),
    timestamp: new Date().toISOString(),
    ...logItem
  };
  const updated = [newLog, ...history];
  saveActivityHistory(updated);
  return updated;
}

// --- Reminders API ---
export function loadReminders() {
  const saved = localStorage.getItem(REMINDERS_STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

export function saveReminders(reminders) {
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
}

// --- Export/Import Utilities ---
export function exportContactsToCSV(contacts) {
  const headers = ['Name', 'Phone', 'Secondary Phone', 'Email', 'Category', 'Company', 'Job Title', 'Address', 'Notes', 'Is Favorite'];
  const rows = contacts.map(c => [
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${(c.phone || '').replace(/"/g, '""')}"`,
    `"${(c.secondaryPhone || '').replace(/"/g, '""')}"`,
    `"${(c.email || '').replace(/"/g, '""')}"`,
    `"${(c.category || '').replace(/"/g, '""')}"`,
    `"${(c.company || '').replace(/"/g, '""')}"`,
    `"${(c.jobTitle || '').replace(/"/g, '""')}"`,
    `"${(c.address || '').replace(/"/g, '""')}"`,
    `"${(c.notes || '').replace(/"/g, '""')}"`,
    c.isFavorite ? 'Yes' : 'No'
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `OmniCall_Contacts_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportContactsTovCard(contacts) {
  let vcfContent = '';
  contacts.forEach(c => {
    vcfContent += 'BEGIN:VCARD\r\nVERSION:3.0\r\n';
    vcfContent += `FN:${c.name}\r\n`;
    if (c.phone) vcfContent += `TEL;TYPE=CELL:${c.phone}\r\n`;
    if (c.secondaryPhone) vcfContent += `TEL;TYPE=WORK:${c.secondaryPhone}\r\n`;
    if (c.email) vcfContent += `EMAIL;TYPE=INTERNET:${c.email}\r\n`;
    if (c.company) vcfContent += `ORG:${c.company}\r\n`;
    if (c.jobTitle) vcfContent += `TITLE:${c.jobTitle}\r\n`;
    if (c.address) vcfContent += `ADR;TYPE=WORK:;;${c.address};;;;\r\n`;
    if (c.notes) vcfContent += `NOTE:${c.notes}\r\n`;
    vcfContent += 'END:VCARD\r\n\r\n';
  });

  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `OmniCall_Contacts_${new Date().toISOString().slice(0,10)}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
