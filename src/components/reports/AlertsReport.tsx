import React, { useState, useEffect } from 'react';
import { ReportService } from '../../services/ReportService';

interface Alert {
  type: 'lowStock' | 'expiringSoon' | 'overstock';
  medicationId: string;
  medicationName: string;
  message: string;
}

const AlertsReport: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await ReportService.getInventoryAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'lowStock':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'expiringSoon':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'overstock':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  if (loading) {
    return <div>Cargando alertas...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Alertas de Inventario</h2>
      {alerts.length === 0 ? (
        <p>No hay alertas activas en este momento.</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 border-l-4 rounded ${getAlertColor(alert.type)}`}
            >
              <h3 className="font-bold">{alert.medicationName}</h3>
              <p>{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsReport;