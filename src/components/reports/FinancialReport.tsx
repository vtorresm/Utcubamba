import React, { useState, useEffect } from 'react';
import { ReportService } from '../../services/ReportService';

interface FinancialData {
  totalRevenue: number;
  totalCost: number;
  profit: number;
  topSellingMedications: { name: string; revenue: number }[];
}

const FinancialReport: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchFinancialData = async () => {
      if (startDate && endDate) {
        try {
          setLoading(true);
          const data = await ReportService.getFinancialReport(startDate, endDate);
          setFinancialData(data);
        } catch (error) {
          console.error('Error fetching financial data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFinancialData();
  }, [startDate, endDate]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reporte Financiero</h2>
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
      {loading ? (
        <div>Cargando datos financieros...</div>
      ) : financialData ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-lg mb-2">Ingresos Totales</h3>
              <p className="text-2xl text-green-600">${financialData.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-lg mb-2">Costos Totales</h3>
              <p className="text-2xl text-red-600">${financialData.totalCost.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-lg mb-2">Beneficio</h3>
              <p className="text-2xl text-blue-600">${financialData.profit.toFixed(2)}</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Medicamentos Más Vendidos</h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2">Medicamento</th>
                  <th className="px-4 py-2">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {financialData.topSellingMedications.map((med, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{med.name}</td>
                    <td className="border px-4 py-2">${med.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>No hay datos disponibles para el período seleccionado.</div>
      )}
    </div>
  );
};

export default FinancialReport;