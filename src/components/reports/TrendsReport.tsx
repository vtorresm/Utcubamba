import React, { useState, useEffect } from 'react';
import { ReportService } from '../../services/ReportService';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TrendsReport: React.FC = () => {
  const [trendsData, setTrendsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchTrends = async () => {
      if (startDate && endDate) {
        try {
          setLoading(true);
          const data = await ReportService.getMedicationTrends(startDate, endDate);
          setTrendsData(data);
        } catch (error) {
          console.error('Error fetching trends:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTrends();
  }, [startDate, endDate]);

  const chartData = {
    labels: trendsData?.labels || [],
    datasets: [
      {
        label: 'Uso de Medicamentos',
        data: trendsData?.data || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Tendencias de Uso de Medicamentos'
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reporte de Tendencias</h2>
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
        <div>Cargando tendencias...</div>
      ) : trendsData ? (
        <div className="w-full h-64">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <div>No hay datos disponibles para el período seleccionado.</div>
      )}
    </div>
  );
};

export default TrendsReport;