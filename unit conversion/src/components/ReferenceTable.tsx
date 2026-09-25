import React, { useState } from 'react';
import { Table, Printer, Download, SlidersHorizontal } from 'lucide-react';
import { Unit } from '../types';
import { convertValue, formatNumber } from '../utils/converterEngine';

interface ReferenceTableProps {
  fromUnit: Unit;
  toUnit: Unit;
}

export const ReferenceTable: React.FC<ReferenceTableProps> = ({ fromUnit, toUnit }) => {
  const [stepSize, setStepSize] = useState<number>(1);
  const [rowsCount, setRowsCount] = useState<number>(12);

  const tableData = Array.from({ length: rowsCount }, (_, i) => {
    const val = (i + 1) * stepSize;
    const res = convertValue(val, fromUnit, toUnit);
    return {
      fromVal: val,
      toVal: res,
      formattedTo: formatNumber(res, 'auto', 4)
    };
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = `${fromUnit.name} (${fromUnit.symbol}),${toUnit.name} (${toUnit.symbol})\n`;
    tableData.forEach((row) => {
      csv += `${row.fromVal},"${row.formattedTo}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reference_table_${fromUnit.id}_to_${toUnit.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full glass-panel border border-white/10 p-5 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-400" />
            <span>Interactive Reference Matrix Table</span>
          </h3>
          <p className="text-xs text-gray-400">
            Quick reference guide for common {fromUnit.name} to {toUnit.name} values
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 rounded-xl px-2.5 py-1 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400">Step:</span>
            <select
              value={stepSize}
              onChange={(e) => setStepSize(parseFloat(e.target.value))}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="0.1" className="bg-slate-900">0.1</option>
              <option value="1" className="bg-slate-900">1</option>
              <option value="5" className="bg-slate-900">5</option>
              <option value="10" className="bg-slate-900">10</option>
              <option value="50" className="bg-slate-900">50</option>
              <option value="100" className="bg-slate-900">100</option>
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition"
            title="Print Reference Table"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Reference Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {tableData.map((row) => (
          <div
            key={row.fromVal}
            className="glass-card p-2.5 border border-white/10 bg-slate-900/40 text-center hover:border-indigo-500/40 transition"
          >
            <div className="text-[11px] font-mono text-gray-400">
              {row.fromVal} {fromUnit.symbol}
            </div>
            <div className="text-xs font-extrabold font-mono text-indigo-300 mt-0.5 truncate">
              {row.formattedTo} {toUnit.symbol}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
