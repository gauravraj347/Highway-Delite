import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
  email: string;
  otp: string;
}

const LoginPage: React.FC = () => {
  const [otpRequested, setOtpRequested] = useState(false);
  const [formData, setFormData] = useState<Partial<LoginFormData>>({});
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmitForm = async (data: Omit<LoginFormData, 'otp'>) => {
    setIsLoading(true);
    try {
      await authAPI.requestLoginOTP(data);
      setFormData(data);
      setOtpRequested(true);
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOTP = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email: formData.email!, otp: data.otp });
      const { token, user } = response.data.data;
      login(token, user);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    try {
      await authAPI.resendOTP({ email: formData.email! });
      toast.success('OTP resent successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <Sun className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">HD</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to enjoy the features of HD
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit(otpRequested ? onSubmitOTP : onSubmitForm)}>
              <div>
                <div className="mt-1 relative">
                  <label
                    htmlFor="email"
                    className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-600"
                  >
                    Email address
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    readOnly={otpRequested}
                    className={`input pl-3 ${otpRequested ? 'bg-gray-100 text-gray-600' : ''}`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {otpRequested && (
                <div>
                  <div className="mt-1 relative">
                    <label
                      htmlFor="otp"
                      className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-600"
                    >
                      Enter OTP
                    </label>
                    <input
                      {...register('otp', {
                        required: 'OTP is required',
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'OTP must be 6 digits',
                        },
                      })}
                      type={showOTP ? 'text' : 'password'}
                      className="input pl-3 pr-10"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowOTP(!showOTP)}
                    >
                      {showOTP ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.otp && (
                    <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
                  )}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn-primary btn-lg ${otpRequested ? 'flex-1' : 'w-full'}`}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : otpRequested ? (
                    'Sign In'
                  ) : (
                    'Get OTP'
                  )}
                </button>
                {otpRequested && (
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={isLoading}
                    className="btn-outline btn-lg"
                  >
                    Resend
                  </button>
                )}
              </div>
            </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

