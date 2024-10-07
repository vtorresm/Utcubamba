import React, { useState, useEffect, useRef } from 'react';
import { ReportService } from '../../services/ReportService';
import { InventoryMovement } from '../../types/MedicationTypes';
import ExportFormatSelector from '../ExportFormatSelector';
import { useDownloadExcel } from 'react-export-table-to-excel';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MovementsReport: React.FC = () => {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchMovements = async () => {
      if (startDate && endDate) {
        try {
          setLoading(true);
          const data = await ReportService.getInventoryMovements(startDate, endDate);
          setMovements(data);
        } catch (error) {
          console.error('Error fetching movements:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMovements();
  }, [startDate, endDate]);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'movements_report',
    sheet: 'MovementsData'
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: '#movementsTable' });
    doc.save('movements_report.pdf');
  };

  const exportToCSV = () => {
    const headers = ['Fecha', 'Tipo', 'Medicamento', 'Cantidad', 'Responsable', 'Motivo'];
    const data = movements.map(movement => [
      movement.date,
      movement.type,
      movement.medicationId,
      movement.quantity.toString(),
      movement.responsiblePerson,
      movement.reason
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'movements_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    switch (format) {
      case 'pdf':
        exportToPDF();
        break;
      case 'excel':
        onDownload();
        break;
      case 'csv':
        exportToCSV();
        break;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reporte de Movimientos de Inventario</h2>
      <div className="mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mr-2 p-2 border rounded"
        />
      </div>
      <ExportFormatSelector onExport={handleExport} />
      {loading ? (
        <div>Cargando movimientos...</div>
      ) : (
        <table id="movementsTable" ref={tableRef} className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Medicamento</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Responsable</th>
              <th className="px-4 py-2">Motivo</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td className="border px-4 py-2">{movement.date}</td>
                <td className="border px-4 py-2">{movement.type}</td>
                <td className="border px-4 py-2">{movement.medicationId}</td>
                <td className="border px-4 py-2">{movement.quantity}</td>
                <td className="border px-4 py-2">{movement.responsiblePerson}</td>
                <td className="border px-4 py-2">{movement.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MovementsReport;