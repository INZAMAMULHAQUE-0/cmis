import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import RegisterForm from '../components/forms/RegisterForm';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register: React.FC = () => {
  const { register, error, clearError } = useAuth();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  // Removed admin-only redirect so everyone can access the register page

  const handleRegister = async (email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    try {
      const success = await register(email, password, confirmPassword);
      if (success) {
        addToast('success', 'Account created successfully! You can now sign in.');
        navigate('/login');
      }
    } catch (err) {
      addToast('error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-green-100 rounded-full">
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the college management system
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;