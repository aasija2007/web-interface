import React, { useState } from 'react';
import { ListFilter, Download, Copy, Check, FileText } from 'lucide-react';
import { Unit } from '../types';
import { convertValue, formatNumber } from '../utils/converterEngine';

interface BatchConverterProps {
  fromUnit: Unit;
  toUnit: Unit;
}

export const BatchConverter: React.FC<BatchConverterProps> = ({ fromUnit, toUnit }) => {
  const [inputText, setInputText] = useState('1\n5\n10\n25\n50\n100');
  const [copied, setCopied] = useState(false);

  // Parse lines
  const lines = inputText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const results = lines.map((line) => {
    const num = parseFloat(line);
    if (isNaN(num)) {
      return { rawInput: line, val: null, resultStr: 'Invalid' };
    }
    const res = convertValue(num, fromUnit, toUnit);
    return {
      rawInput: line,
      val: num,
      resultStr: formatNumber(res, 'auto', 4)
    };
  });

  const handleExportCSV = () => {
    let csv = `Input (${fromUnit.symbol}),Converted (${toUnit.symbol})\n`;
    results.forEach((r) => {
      csv += `"${r.rawInput}","${r.resultStr}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `batch_conversion_${fromUnit.id}_to_${toUnit.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = () => {
    const text = results.map((r) => `${r.rawInput} ${fromUnit.symbol} = ${r.resultStr} ${toUnit.symbol}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full glass-panel border border-white/10 p-5 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-purple-400" />
            <span>Batch & Bulk Conversion Tool</span>
          </h3>
          <p className="text-xs text-gray-400">
            Paste multiple values (one per line) to convert all simultaneously ({fromUnit.symbol} → {toUnit.symbol})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white border border-white/10 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy All'}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-medium shadow-md shadow-indigo-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Textarea */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">
            Input Values ({fromUnit.name}):
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
            placeholder="Paste numbers here, one per line..."
            className="w-full p-3 rounded-xl bg-slate-900/80 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 transition resize-none"
          />
        </div>

        {/* Results Table */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">
            Converted Output ({toUnit.name}):
          </label>
          <div className="h-[148px] overflow-y-auto rounded-xl bg-slate-900/90 border border-white/10 p-2 scrollbar-thin">
            <table className="w-full text-xs text-left font-mono">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-1.5 px-2">From ({fromUnit.symbol})</th>
                  <th className="pb-1.5 px-2 text-indigo-400">To ({toUnit.symbol})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((res, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="py-1 px-2 text-gray-300">{res.rawInput}</td>
                    <td className="py-1 px-2 font-bold text-indigo-200">{res.resultStr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
