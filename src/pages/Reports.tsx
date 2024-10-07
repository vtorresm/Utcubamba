import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, BarChart2, TrendingUp, AlertTriangle, DollarSign, UserPlus } from 'lucide-react';

const Reports: React.FC = () => {
  const reportTypes = [
    { name: 'Inventario Actual', icon: <FileText />, path: '/reports/inventory' },
    { name: 'Movimientos', icon: <BarChart2 />, path: '/reports/movements' },
    { name: 'Tendencias', icon: <TrendingUp />, path: '/reports/trends' },
    { name: 'Alertas', icon: <AlertTriangle />, path: '/reports/alerts' },
    { name: 'Financiero', icon: <DollarSign />, path: '/reports/financial' },
    { name: 'Pacientes', icon: <UserPlus />, path: '/reports/patients' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reportes e Informes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <Link
            key={report.name}
            to={report.path}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-4"
          >
            <div className="bg-blue-100 p-3 rounded-full">
              {report.icon}
            </div>
            <span className="text-xl font-semibold">{report.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Reports;