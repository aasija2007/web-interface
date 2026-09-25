import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ContactList from './components/ContactList';
import Dialer from './components/Dialer';
import ActivityLog from './components/ActivityLog';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ContactDetailModal from './components/ContactDetailModal';
import ContactFormModal from './components/ContactFormModal';
import EmailComposerModal from './components/EmailComposerModal';
import WhatsAppComposerModal from './components/WhatsAppComposerModal';
import SettingsModal from './components/SettingsModal';
import ImportExportModal from './components/ImportExportModal';
import AuthScreen from './components/AuthScreen';

import {
  loadContacts,
  saveContacts,
  loadActivityHistory,
  saveActivityHistory,
  addActivityLog,
  INITIAL_CONTACTS
} from './services/storageService';

import { getActiveUser, logoutUser } from './services/authService';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' | 'dialer' | 'history' | 'analytics'

  // Modals state
  const [selectedContact, setSelectedContact] = useState(null); // Detail modal
  const [contactToEdit, setContactToEdit] = useState(null); // Add/Edit modal (null means closed unless isFormOpen)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [emailContact, setEmailContact] = useState(null); // Email modal
  const [whatsappContact, setWhatsappContact] = useState(null); // WhatsApp modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  // Load initial active user & app data
  useEffect(() => {
    const activeUser = getActiveUser();
    if (activeUser) {
      setCurrentUser(activeUser);
    }
    const loadedContacts = loadContacts();
    const loadedHistory = loadActivityHistory();
    setContacts(loadedContacts);
    setHistory(loadedHistory);
  }, []);

  // Save contacts whenever modified
  const updateContactsState = (newContacts) => {
    setContacts(newContacts);
    saveContacts(newContacts);
  };

  // Activity Log Handler
  const handleLogActivity = (logData) => {
    const updatedHistory = addActivityLog(logData);
    setHistory(updatedHistory);
  };

  // Favorite toggle
  const handleToggleFavorite = (id) => {
    const updated = contacts.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c);
    updateContactsState(updated);
  };

  // Delete contact
  const handleDeleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const updated = contacts.filter(c => c.id !== id);
      updateContactsState(updated);
      setSelectedContact(null);
    }
  };

  // Save Add/Edit Contact
  const handleSaveContact = (contactData) => {
    const exists = contacts.some(c => c.id === contactData.id);
    let updated;
    if (exists) {
      updated = contacts.map(c => c.id === contactData.id ? contactData : c);
    } else {
      updated = [contactData, ...contacts];
    }
    updateContactsState(updated);
    setIsFormOpen(false);
    setContactToEdit(null);
    if (selectedContact?.id === contactData.id) {
      setSelectedContact(contactData);
    }
  };

  // Import Contacts Batch
  const handleImportContacts = (importedList) => {
    const updated = [...importedList, ...contacts];
    updateContactsState(updated);
  };

  // Reset Sample Data
  const handleResetSampleData = () => {
    if (window.confirm('Reset all contacts to demo sample data?')) {
      updateContactsState(INITIAL_CONTACTS);
      localStorage.removeItem('omnicall_activity_history');
      setHistory([]);
      setIsSettingsOpen(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // If not logged in, display AuthScreen login/registration
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddContact={() => {
          setContactToEdit(null);
          setIsFormOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'contacts' && (
          <ContactList
            contacts={contacts}
            onSelectContact={(c) => setSelectedContact(c)}
            onOpenAddContact={() => {
              setContactToEdit(null);
              setIsFormOpen(true);
            }}
            onOpenEmailModal={(c) => setEmailContact(c)}
            onOpenWhatsAppModal={(c) => setWhatsappContact(c)}
            onToggleFavorite={handleToggleFavorite}
            onDeleteContact={handleDeleteContact}
            onLogActivity={handleLogActivity}
          />
        )}

        {activeTab === 'dialer' && (
          <Dialer
            contacts={contacts}
            onLogActivity={handleLogActivity}
            onOpenEmailModal={(c) => setEmailContact(c)}
            onSelectContact={(c) => setSelectedContact(c)}
          />
        )}

        {activeTab === 'history' && (
          <ActivityLog
            history={history}
            contacts={contacts}
            onClearHistory={() => {
              saveActivityHistory([]);
              setHistory([]);
            }}
            onOpenEmailModal={(c) => setEmailContact(c)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            contacts={contacts}
            history={history}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-400 bg-slate-950">
        OmniCall Real-Touch Contact Manager • Connected with Native Phone Dialing, WhatsApp & Live Gmail Dispatching
      </footer>

      {/* Modals */}
      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onEdit={(c) => {
            setSelectedContact(null);
            setContactToEdit(c);
            setIsFormOpen(true);
          }}
          onDelete={handleDeleteContact}
          onToggleFavorite={handleToggleFavorite}
          onOpenEmailModal={(c) => setEmailContact(c)}
          onOpenWhatsAppModal={(c) => setWhatsappContact(c)}
          onLogActivity={handleLogActivity}
        />
      )}

      {isFormOpen && (
        <ContactFormModal
          contactToEdit={contactToEdit}
          onClose={() => {
            setIsFormOpen(false);
            setContactToEdit(null);
          }}
          onSave={handleSaveContact}
        />
      )}

      {emailContact && (
        <EmailComposerModal
          contact={emailContact}
          onClose={() => setEmailContact(null)}
          onLogActivity={handleLogActivity}
        />
      )}

      {whatsappContact && (
        <WhatsAppComposerModal
          contact={whatsappContact}
          onClose={() => setWhatsappContact(null)}
          onLogActivity={handleLogActivity}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onResetSampleData={handleResetSampleData}
        />
      )}

      {isImportExportOpen && (
        <ImportExportModal
          contacts={contacts}
          onClose={() => setIsImportExportOpen(false)}
          onImportContacts={handleImportContacts}
        />
      )}

    </div>
  );
}
