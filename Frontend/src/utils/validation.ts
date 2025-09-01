// Validation utilities for forms

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateStudentId = (studentId: string): boolean => {
  // Assuming student ID should be alphanumeric and 6-10 characters
  const studentIdRegex = /^[a-zA-Z0-9]{6,10}$/;
  return studentIdRegex.test(studentId);
};