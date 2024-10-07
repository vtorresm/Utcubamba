import React, { useState, useEffect, useRef } from 'react';
import { ReportService } from '../../services/ReportService';
import { Medication } from '../../types/MedicationTypes';
import ExportFormatSelector from '../ExportFormatSelector';
import { useDownloadExcel } from 'react-export-table-to-excel';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InventoryReport: React.FC = () => {
  const [inventory, setInventory] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await ReportService.getCurrentInventory();
        setInventory(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'inventory_report',
    sheet: 'InventoryData'
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: '#inventoryTable' });
    doc.save('inventory_report.pdf');
  };

  const exportToCSV = () => {
    const headers = ['Código', 'Nombre', 'Stock Actual', 'Stock Mínimo', 'Ubicación', 'Fecha de Vencimiento'];
    const data = inventory.map(item => [
      item.code,
      item.name,
      item.currentStock.toString(),
      item.minStock.toString(),
      item.location,
      item.expirationDate
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
      link.setAttribute('download', 'inventory_report.csv');
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

  if (loading) {
    return <div>Cargando inventario...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reporte de Inventario Actual</h2>
      <ExportFormatSelector onExport={handleExport} />
      <table id="inventoryTable" ref={tableRef} className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Código</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Stock Actual</th>
            <th className="px-4 py-2">Stock Mínimo</th>
            <th className="px-4 py-2">Ubicación</th>
            <th className="px-4 py-2">Fecha de Vencimiento</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.code}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.currentStock}</td>
              <td className="border px-4 py-2">{item.minStock}</td>
              <td className="border px-4 py-2">{item.location}</td>
              <td className="border px-4 py-2">{item.expirationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryReport;