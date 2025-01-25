import { useState, useEffect } from 'react';

interface Patient {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  patientType: string;
  contactDetails: {
    phone: string;
    email: string;
    address: string;
  };
  bloodGroup: string;
  contact: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  diagnoses: Array<{
    condition: string;
    date: string;
    notes: string;
  }>;
  reports: Array<{
    type: string;
    date: string;
    url: string;
  }>;
  currentSymptoms: string[];
  treatments: Array<{
    medication: string;
    dosage: string;
    startDate: string;
  }>;
}

export const usePatient = (id: string) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock patient data - replace with actual API call
    const mockPatient: Patient = {
      id: '1',
      name: 'John Smith',
      age: 45,
      bloodType: 'O+',
      patientType: 'Adult',
      contactDetails: {
        phone: '+1 234-567-8900',
        email: 'john.smith@example.com',
        address: '123 Main St, Anytown, USA',
      },
      bloodGroup: 'O+',
      contact: '+1 234-567-8900',
      emergencyContact: {
        name: 'Jane Smith',
        phone: '+1 234-567-8901',
      },
      diagnoses: [
        {
          condition: 'Hypertension',
          date: '2023-10-15',
          notes: 'Prescribed medication and lifestyle changes',
        },
      ],
      reports: [
        {
          type: 'Blood Test',
          date: '2024-01-20',
          url: '#',
        },
      ],
      currentSymptoms: ['Persistent headache', 'High blood pressure'],
      treatments: [
        {
          medication: 'Amlodipine',
          dosage: '5mg daily',
          startDate: '2024-01-15',
        },
      ],
    };

    // Simulate API call
    setTimeout(() => {
      setPatient(mockPatient);
      setLoading(false);
    }, 1000);
  }, [id]);

  return { patient, loading, error };
}; 