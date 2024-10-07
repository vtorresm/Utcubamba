import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Prediction {
  id: string;
  medicationName: string;
  medicationType: string;
  currentDate: string;
  predictionDate: string;
  predictedAmount: number;
}

interface Medication {
  id: string;
  name: string;
  type: string;
}

const MedicationPrediction: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [predictionDate, setPredictionDate] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [medicationType, setMedicationType] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);

  // Lista de tipos de medicamentos
  const medicationTypes = [
    'Analgésico',
    'Antiinflamatorio',
    'Antibiótico',
    'Antidepresivo',
    'Antihipertensivo',
    'Antihistamínico',
    'Antidiabético',
    'Anticoagulante',
    'Antiviral',
    'Anticonvulsivo'
  ];

  useEffect(() => {
    // Simular carga de predicciones previas
    const mockPredictions: Prediction[] = [
      { id: '1', medicationName: 'Paracetamol', medicationType: 'Analgésico', currentDate: '2024-03-15', predictionDate: '2024-06-15', predictedAmount: 1000 },
      { id: '2', medicationName: 'Ibuprofeno', medicationType: 'Antiinflamatorio', currentDate: '2024-03-16', predictionDate: '2024-06-16', predictedAmount: 800 },
    ];
    setPredictions(mockPredictions);

    // Simular carga de medicamentos
    const mockMedications: Medication[] = [
      { id: '1', name: 'Paracetamol', type: 'Analgésico' },
      { id: '2', name: 'Ibuprofeno', type: 'Antiinflamatorio' },
      { id: '3', name: 'Amoxicilina', type: 'Antibiótico' },
      { id: '4', name: 'Omeprazol', type: 'Antiácido' },
      { id: '5', name: 'Loratadina', type: 'Antihistamínico' },
    ];
    setMedications(mockMedications);
    setFilteredMedications(mockMedications);
  }, []);

  const handlePredict = () => {
    // Simular una predicción
    const newPrediction: Prediction = {
      id: Date.now().toString(),
      medicationName,
      medicationType,
      currentDate,
      predictionDate,
      predictedAmount: Math.floor(Math.random() * 1000) + 500, // Valor aleatorio entre 500 y 1500
    };

    setPredictions([newPrediction, ...predictions]);
    updateChartData(newPrediction);
  };

  const updateChartData = (newPrediction: Prediction) => {
    const data = {
      labels: [newPrediction.currentDate, newPrediction.predictionDate],
      datasets: [
        {
          label: 'Predicción de Stock',
          data: [1000, newPrediction.predictedAmount], // Asumimos un stock actual de 1000
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };

    setChartData(data);
  };

  const handleMedicationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMedicationName(value);
    
    // Filtrar medicamentos basados en el input
    const filtered = medications.filter(med => 
      med.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMedications(filtered);
  };

  const handleMedicationSelect = (name: string) => {
    setMedicationName(name);
    setFilteredMedications([]);
    
    // Establecer el tipo de medicamento correspondiente
    const selectedMedication = medications.find(med => med.name === name);
    if (selectedMedication) {
      setMedicationType(selectedMedication.type);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Predicciones de Medicamentos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Fecha Actual</label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1">Fecha a Predecir</label>
            <input
              type="date"
              value={predictionDate}
              onChange={(e) => setPredictionDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="relative">
            <label className="block mb-1">Nombre del Medicamento</label>
            <input
              type="text"
              value={medicationName}
              onChange={handleMedicationNameChange}
              className="w-full p-2 border rounded"
              placeholder="Buscar medicamento..."
            />
            {filteredMedications.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto">
                {filteredMedications.map(med => (
                  <li 
                    key={med.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleMedicationSelect(med.name)}
                  >
                    {med.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block mb-1">Tipo de Medicamento</label>
            <select
              value={medicationType}
              onChange={(e) => setMedicationType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione un tipo</option>
              {medicationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handlePredict}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Predecir
          </button>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          {chartData ? (
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          ) : (
            <p className="text-center text-gray-500">Realiza una predicción para ver el gráfico</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Historial de Predicciones</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Medicamento</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Fecha Actual</th>
                <th className="px-4 py-2">Fecha Predicción</th>
                <th className="px-4 py-2">Cantidad Predicha</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction) => (
                <tr key={prediction.id}>
                  <td className="border px-4 py-2">{prediction.medicationName}</td>
                  <td className="border px-4 py-2">{prediction.medicationType}</td>
                  <td className="border px-4 py-2">{prediction.currentDate}</td>
                  <td className="border px-4 py-2">{prediction.predictionDate}</td>
                  <td className="border px-4 py-2">{prediction.predictedAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicationPrediction;