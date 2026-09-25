import React, { useState } from 'react';
import { X, Download, Upload, FileSpreadsheet, FileCode, CheckCircle2 } from 'lucide-react';
import { exportContactsToCSV, exportContactsTovCard } from '../services/storageService';

export default function ImportExportModal({ contacts = [], onClose, onImportContacts }) {
  const [importStatus, setImportStatus] = useState('');

  const handleExportCSV = () => {
    exportContactsToCSV(contacts);
  };

  const handleExportVCard = () => {
    exportContactsTovCard(contacts);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          setImportStatus('Invalid CSV format or empty file.');
          return;
        }

        // CSV parsing simple logic
        const imported = [];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map(p => p.replace(/^"|"$/g, ''));
          if (parts[0]) {
            imported.push({
              id: 'cnt-imp-' + Date.now() + '-' + i,
              name: parts[0] || 'Imported Contact',
              phone: parts[1] || '+1 555-000-0000',
              secondaryPhone: parts[2] || '',
              email: parts[3] || '',
              category: parts[4] || 'Work',
              company: parts[5] || '',
              jobTitle: parts[6] || '',
              address: parts[7] || '',
              notes: parts[8] || '',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parts[0])}&background=6366f1&color=fff`,
              isFavorite: parts[9] === 'Yes',
              createdAt: new Date().toISOString()
            });
          }
        }

        if (imported.length > 0) {
          onImportContacts(imported);
          setImportStatus(`Successfully imported ${imported.length} new contact(s)!`);
          setTimeout(() => {
            onClose();
          }, 1800);
        } else {
          setImportStatus('No valid contacts parsed from file.');
        }

      } catch (err) {
        setImportStatus('Error reading file. Please upload a standard CSV file.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Import & Export Contacts</h3>
              <p className="text-xs text-slate-400">Backup your contacts to CSV or mobile vCard (.vcf) format</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Export Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Export Options</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportCSV}
                className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2 transition-all hover:border-indigo-500/40"
              >
                <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
                <span className="text-xs font-bold text-white">Export to CSV</span>
                <span className="text-[10px] text-slate-400">Excel / Spreadsheet format</span>
              </button>

              <button
                onClick={handleExportVCard}
                className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2 transition-all hover:border-indigo-500/40"
              >
                <FileCode className="w-8 h-8 text-indigo-400" />
                <span className="text-xs font-bold text-white">Export to vCard (.vcf)</span>
                <span className="text-[10px] text-slate-400">iOS & Android contacts format</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Import CSV File</h4>
            <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-900/40">
              <Upload className="w-8 h-8 text-indigo-400 mb-2" />
              <span className="text-xs font-bold text-white">Click to upload CSV File</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Supports standard Name, Phone, Email CSV files</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{importStatus}</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
