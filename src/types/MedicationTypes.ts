export interface Medication {
  id: string;
  name: string;
  activeIngredient: string;
  presentation: string;
  concentration: string;
  measurementUnit: string;
  code: string;
  location: string;
  batch: string;
  manufacturingDate: string;
  expirationDate: string;
  supplier: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  cost: number;
  salePrice: number;
}

export interface InventoryMovement {
  id: string;
  medicationId: string;
  type: 'entrada' | 'salida';
  date: string;
  quantity: number;
  responsiblePerson: string;
  reason: string;
}

export interface Patient {
  id: string;
  name: string;
  medicalRecordNumber: string;
}

export interface MedicationDispense {
  id: string;
  medicationId: string;
  patientId: string;
  date: string;
  quantity: number;
  prescribedBy: string;
}