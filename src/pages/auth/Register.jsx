import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: 'Front Desk Lead',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
      });
      if (result.success) {
        navigate('/dashboard', { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[1100px] min-h-[720px] bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* ================= LEFT COLUMN: REGISTER FORM ================= */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Logo */}
            <div className="mb-8">
              <Logo size="normal" />
            </div>

            {/* Header Titles */}
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-stone-900 tracking-tight leading-snug">
                Create Grand Azure Account
              </h1>
              <p className="text-stone-500 text-sm mt-1">
                Register as hotel staff or executive administrator
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Julian Montgomery"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className={`w-full h-11 px-5 rounded-full bg-[#F7F7F6] border text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all ${
                    errors.name ? 'border-red-400' : 'border-[#D9D1C7]'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email & Role Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    Work Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@grandazure.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email'
                      }
                    })}
                    className={`w-full h-11 px-5 rounded-full bg-[#F7F7F6] border text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all ${
                      errors.email ? 'border-red-400' : 'border-[#D9D1C7]'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    System Role
                  </label>
                  <select
                    {...register('role')}
                    className="w-full h-11 px-4 rounded-full bg-[#F7F7F6] border border-[#D9D1C7] text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all"
                  >
                    <option value="General Manager">General Manager</option>
                    <option value="Front Desk Lead">Front Desk Lead</option>
                    <option value="Reservations Specialist">Reservations Specialist</option>
                    <option value="Operations Director">Operations Director</option>
                  </select>
                </div>
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Min 6 characters'
                        }
                      })}
                      className={`w-full h-11 pl-5 pr-10 rounded-full bg-[#EAEAEA] border text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all ${
                        errors.password ? 'border-red-400' : 'border-transparent'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('confirmPassword', {
                        required: 'Confirm your password',
                        validate: (value) =>
                          value === passwordValue || 'Passwords do not match'
                      })}
                      className={`w-full h-11 pl-5 pr-10 rounded-full bg-[#EAEAEA] border text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all ${
                        errors.confirmPassword ? 'border-red-400' : 'border-transparent'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                    >
                      {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none text-xs text-stone-600">
                  <input
                    type="checkbox"
                    {...register('terms', {
                      required: 'You must accept the terms of service'
                    })}
                    className="mt-0.5 accent-[#8C6D3B] w-4 h-4 rounded"
                  />
                  <span>
                    I confirm that I am an authorized employee or partner of The Grand Azure and agree to the{' '}
                    <span className="text-[#8C6D3B] underline font-medium">Hotel Privacy Policies</span>.
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 h-12 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] active:scale-[0.99] text-white text-sm font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs text-stone-600">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-semibold text-[#8C6D3B] hover:text-[#755B31] transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: BRAND SHOWCASE ================= */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#1C1814] via-[#2A231C] to-[#17130F] p-10 flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle Ambient Backlights */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8C6D3B]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C89D58]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-200 text-xs font-medium mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C89D58]" />
              <span>Verified Hotel Staff Access</span>
            </div>

            <h2 className="text-3xl font-serif-luxury font-medium tracking-wide leading-tight text-white mb-4">
              World-Class Luxury Management
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Empowering hoteliers with synchronized reservation control, instantaneous guest profiling, and real-time revenue intelligence.
            </p>
          </div>

          {/* Luxury Room Image Card */}
          <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative">
            <img
              src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80"
              alt="Presidential Penthouse"
              className="w-full h-56 object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <p className="text-xs uppercase tracking-widest text-amber-300 font-medium">Presidential Penthouse</p>
              <p className="text-sm font-semibold text-white">The Grand Azure Riviera</p>
            </div>
          </div>

          <div className="text-xs text-stone-400 flex items-center justify-between">
            <span>© 2026 The Grand Azure Luxury Resorts</span>
            <span className="text-[#C89D58]">Confidential & Encrypted</span>
          </div>
        </div>

      </div>
    </div>
  );
}
