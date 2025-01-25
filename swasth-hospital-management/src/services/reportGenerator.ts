import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '../utils/dateUtils';

interface ReportOptions {
  title: string;
  subtitle?: string;
  logo?: string;
  footer?: string;
}

interface PatientData {
  name: string;
  id: string;
  dateOfBirth: string | Date;
  contact: string;
  medicalHistory: Array<{
    condition: string;
    diagnosis: string;
    date: string | Date;
  }>;
}

interface TestResult {
  name: string;
  value: string;
  range: string;
  status: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface PrescriptionData {
  medications: Medication[];
  notes?: string;
}

class ReportGenerator {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF();
  }

  private async addHeader(options: ReportOptions) {
    const { title, subtitle, logo } = options;
    
    if (logo) {
      this.doc.addImage(logo, 'PNG', 10, 10, 30, 30);
    }

    this.doc.setFontSize(20);
    this.doc.text(title, 50, 20);

    if (subtitle) {
      this.doc.setFontSize(12);
      this.doc.text(subtitle, 50, 30);
    }

    this.doc.line(10, 40, 200, 40);
  }

  public async generatePatientReport(patientData: PatientData, options: ReportOptions) {
    await this.addHeader(options);

    // Patient Information
    this.doc.autoTable({
      startY: 50,
      head: [['Patient Information']],
      body: [
        ['Name', patientData.name],
        ['ID', patientData.id],
        ['Date of Birth', formatDate(patientData.dateOfBirth)],
        ['Contact', patientData.contact],
      ],
    });

    // Medical History
    this.doc.autoTable({
      startY: this.doc.lastAutoTable.finalY + 10,
      head: [['Medical History']],
      body: patientData.medicalHistory.map(item => [
        item.condition,
        item.diagnosis,
        formatDate(item.date),
      ]),
    });

    return this.doc;
  }

  public async generateLabReport(testResults: TestResult[], options: ReportOptions) {
    await this.addHeader(options);

    this.doc.autoTable({
      startY: 50,
      head: [['Test', 'Result', 'Reference Range', 'Status']],
      body: testResults.map(result => [
        result.name,
        result.value,
        result.range,
        result.status,
      ]),
    });

    return this.doc;
  }

  public async generatePrescription(prescriptionData: PrescriptionData, options: ReportOptions) {
    await this.addHeader(options);

    // Prescription Details
    this.doc.autoTable({
      startY: 50,
      head: [['Medication', 'Dosage', 'Frequency', 'Duration']],
      body: prescriptionData.medications.map(med => [
        med.name,
        med.dosage,
        med.frequency,
        med.duration,
      ]),
    });

    // Doctor's Notes
    if (prescriptionData.notes) {
      this.doc.setFontSize(12);
      this.doc.text('Notes:', 10, this.doc.lastAutoTable.finalY + 20);
      this.doc.setFontSize(10);
      this.doc.text(prescriptionData.notes, 10, this.doc.lastAutoTable.finalY + 30);
    }

    return this.doc;
  }

  public save(filename: string) {
    this.doc.save(filename);
  }
}

export const reportGenerator = new ReportGenerator(); 