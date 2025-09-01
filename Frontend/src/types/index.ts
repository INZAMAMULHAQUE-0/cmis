// Common types for the CMIS application

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
}

export interface Mark {
  subjectCode: string;
  subjectName: string;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
}

export interface StudentMarks {
  student: Student;
  marks: Mark[];
  semester: string;
  cgpa: number;
}

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  department: string;
  semester: number;
  instructor: string;
  description: string;
}

export interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  totalFees: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
  semester: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}