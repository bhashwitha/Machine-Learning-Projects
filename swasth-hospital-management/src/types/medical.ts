export interface Patient {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  patientType: string;
  contactDetails: {
    phone: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
  };
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  chiefComplaints: string[];
  symptoms: string[];
  diagnosis: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TestReport {
  id: string;
  patientId: string;
  testName: string;
  testDate: Date;
  reportUrl: string;
  status: 'Pending' | 'Completed';
  results?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  specialInstructions?: string;
  startDate: Date;
  endDate?: Date;
}

export interface Treatment {
  id: string;
  patientId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: 'Ongoing' | 'Completed' | 'Cancelled';
  notes?: string;
  createdBy: string;
  updatedAt: Date;
} 