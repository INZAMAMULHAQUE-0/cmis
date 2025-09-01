import React, { useState } from 'react';
import FormInput from './FormInput';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateEmail, validatePassword, validatePasswordMatch, validateRequired } from '../../utils/validation';

interface RegisterFormProps {
  onSubmit: (email: string, password: string, confirmPassword: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading = false, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const emailError = validateRequired(formData.email, 'Email');
    if (emailError) {
      newErrors.email = emailError;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordError = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    await onSubmit(formData.email, formData.password, formData.confirmPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
        disabled={isLoading}
        placeholder="Enter your email"
        helperText="We'll use this email for your account"
      />

      <FormInput
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
        disabled={isLoading}
        placeholder="Create a password"
        helperText="Password must be at least 6 characters long"
      />

      <FormInput
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        required
        disabled={isLoading}
        placeholder="Confirm your password"
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner size="sm" color="white" />
            <span className="ml-2">Creating Account...</span>
          </div>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

export default RegisterForm;