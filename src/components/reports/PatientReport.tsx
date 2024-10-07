import React, { useState, useEffect } from 'react';
import { ReportService } from '../../services/ReportService';

interface PatientData {
  totalPatients: number;
  newPatients: number;
  topMedications: { name: string; count: number }[];
}

const PatientReport: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchPatientData = async () => {
      if (startDate && endDate) {
        try {
          setLoading(true);
          const data = await ReportService.getPatientReport(startDate, endDate);
          setPatientData(data);
        } catch (error) {
          console.error('Error fetching patient data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatientData();
  }, [startDate, endDate]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reporte de Pacientes</h2>
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
        <div>Cargando datos de pacientes...</div>
      ) : patientData ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-lg mb-2">Total de Pacientes</h3>
              <p className="text-2xl text-blue-600">{patientData.totalPatients}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-lg mb-2">Nuevos Pacientes</h3>
              <p className="text-2xl text-green-600">{patientData.newPatients}</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Medicamentos Más Recetados</h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2">Medicamento</th>
                  <th className="px-4 py-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {patientData.topMedications.map((med, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{med.name}</td>
                    <td className="border px-4 py-2">{med.count}</td>
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

export default PatientReport;