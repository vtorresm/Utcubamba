import React from 'react';

interface ExportFormatSelectorProps {
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
}

const ExportFormatSelector: React.FC<ExportFormatSelectorProps> = ({ onExport }) => {
  return (
    <div className="mb-4">
      <label className="mr-2">Exportar como:</label>
      <button
        onClick={() => onExport('pdf')}
        className="bg-red-500 text-white px-3 py-1 rounded mr-2 hover:bg-red-600"
      >
        PDF
      </button>
      <button
        onClick={() => onExport('excel')}
        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
      >
        Excel
      </button>
      <button
        onClick={() => onExport('csv')}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        CSV
      </button>
    </div>
  );
};

export default ExportFormatSelector;