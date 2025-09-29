import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Calendar, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface SignupFormData {
  name: string;
  email: string;
  dateOfBirth: string;
  otp: string;
}

const SignupPage: React.FC = () => {
  const [otpRequested, setOtpRequested] = useState(false);
  const [formData, setFormData] = useState<Partial<SignupFormData>>({});
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>();

  // Format DOB as "DD Month YYYY" for display
  const dobRaw = watch('dateOfBirth');
  const formatDOB = (value?: string) => {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const onSubmitForm = async (data: Omit<SignupFormData, 'otp'>) => {
    setIsLoading(true);
    try {
      await authAPI.register(data);
      setFormData(data);
      setOtpRequested(true);
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOTP = async (data: { otp: string }) => {
    setIsLoading(true);
    try {
      const email = formData.email || watch('email');
      const response = await authAPI.verifyOTP({ email: email!, otp: data.otp });
      const { token, user } = response.data.data;
      login(token, user);
      toast.success('Account created successfully!');
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

  const goBack = () => {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <Sun className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">HD</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign up
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to enjoy the features of HD
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit(otpRequested ? onSubmitOTP : onSubmitForm)}>
              <div>
                <div className="mt-1 relative">
                  <label
                    htmlFor="name"
                    className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-600"
                  >
                    Full name
                  </label>
                  <input
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                      maxLength: {
                        value: 50,
                        message: 'Name must be less than 50 characters',
                      },
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: 'Name can only contain letters and spaces',
                      },
                    })}
                    type="text"
                    readOnly={otpRequested}
                    className={`input pl-3 ${otpRequested ? 'bg-gray-100 text-gray-600' : ''}`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <div className="mt-1 relative">
                  <label
                    htmlFor="dateOfBirth"
                    className="absolute -top-2 left-10 bg-gray-50 px-1 text-xs text-gray-600"
                  >
                    Date of birth
                  </label>
                  <button
                    type="button"
                    aria-label="Open date picker"
                    disabled={otpRequested}
                    onClick={() => {
                      if (dateInputRef.current) {
                        // @ts-ignore showPicker is supported in Chromium-based browsers
                        if (typeof dateInputRef.current.showPicker === 'function') {
                          // @ts-ignore
                          dateInputRef.current.showPicker();
                        } else {
                          dateInputRef.current.focus();
                          dateInputRef.current.click();
                        }
                      }
                    }}
                    className={`absolute inset-y-0 left-0 pl-3 pr-2 flex items-center ${otpRequested ? 'cursor-not-allowed text-gray-300' : 'cursor-pointer text-gray-400 hover:text-gray-600'}`}
                  >
                    <Calendar className="h-5 w-5" />
                  </button>
                  {(() => {
                    const dobRegister = register('dateOfBirth', {
                      required: 'Date of birth is required',
                      validate: (value) => {
                        const birthDate = new Date(value);
                        const today = new Date();
                        const age = today.getFullYear() - birthDate.getFullYear();
                        if (age < 13) return 'You must be at least 13 years old';
                        if (age > 120) return 'Please enter a valid date of birth';
                        return true;
                      },
                    });
                    return (
                      <>
                        {/* Visible formatted display that opens the picker */}
                        <div
                          onClick={() => {
                            if (!otpRequested && dateInputRef.current) {
                              // @ts-ignore
                              if (typeof dateInputRef.current.showPicker === 'function') {
                                // @ts-ignore
                                dateInputRef.current.showPicker();
                              } else {
                                dateInputRef.current.focus();
                                dateInputRef.current.click();
                              }
                            }
                          }}
                          className={`input pl-10 ${otpRequested ? 'bg-gray-100 text-gray-600' : 'cursor-text'}`}
                        >
                          {formatDOB(dobRaw) || <span className="text-gray-500">Select date</span>}
                        </div>
                        {/* Hidden native input to keep browser picker and validation */}
                        <input
                          {...dobRegister}
                          ref={(el) => {
                            if (typeof dobRegister.ref === 'function') {
                              dobRegister.ref(el);
                            } else if (dobRegister.ref) {
                              // @ts-ignore
                              dobRegister.ref.current = el;
                            }
                            dateInputRef.current = el;
                          }}
                          type="date"
                          className="absolute inset-0 w-full h-10 opacity-0 pointer-events-none"
                          tabIndex={-1}
                        />
                      </>
                    );
                  })()}
                </div>
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>

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
                    'Signup'
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
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

