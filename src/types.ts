export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'patient' | 'admin';
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  image: string;
  description: string;
  availability: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Report {
  id: string;
  patientId: string;
  title: string;
  fileUrl: string;
  createdAt: string;
}
