import React, { useState } from 'react';
import { X, Code, Copy, Check } from 'lucide-react';

interface WidgetEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WidgetEmbedModal: React.FC<WidgetEmbedModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [width, setWidth] = useState('450');
  const [height, setHeight] = useState('500');

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const embedCode = `<iframe src="${currentUrl}" width="${width}" height="${height}" frameborder="0" style="border-radius:16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" allow="clipboard-write"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel border border-white/15 p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Embed Converter Widget</h3>
            <p className="text-xs text-gray-400">Add OmniConvert directly to your blog or website</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Widget Width (px):</label>
              <input
                type="text"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Widget Height (px):</label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">Embed Code (HTML):</label>
            <div className="relative">
              <textarea
                value={embedCode}
                readOnly
                rows={4}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-indigo-300 font-mono text-[11px] resize-none focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Snippet' : 'Copy HTML'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
