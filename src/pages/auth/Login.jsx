import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import ForgotPasswordModal from '../../components/auth/ForgotPasswordModal';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const enteredEmail = watch('email');

  // Load remembered email if available
  useEffect(() => {
    const savedEmail = localStorage.getItem('grand_azure_remembered_email');
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  // Rotate carousel dots periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await login(data.email, data.password, rememberMe);
      if (result.success) {
        navigate(from, { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role = 'admin') => {
    if (role === 'admin') {
      setValue('email', 'admin@grandazure.com');
      setValue('password', 'password123');
    } else {
      setValue('email', 'frontdesk@grandazure.com');
      setValue('password', 'password123');
    }
    handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Main Container - Matches Desktop Web View In Reference Mockup */}
      <div className="w-full max-w-[1240px] min-h-[760px] bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* ================= LEFT COLUMN: AUTH FORM ================= */}
        <div className="lg:col-span-6 xl:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white">
          <div>
            {/* Logo */}
            <div className="mb-10">
              <Logo size="normal" />
            </div>

            {/* Header Titles */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-[34px] font-semibold text-stone-900 tracking-tight leading-snug">
                Welcome to The Grand Azure
              </h1>
              <p className="text-stone-500 text-sm mt-1.5 font-normal">
                Sign into your account
              </p>
            </div>

            {/* Quick Demo Credentials Bar for Easy Evaluation */}
            <div className="mb-6 p-3 rounded-2xl bg-[#F6F1EA] border border-[#E8DAC8] flex items-center justify-between text-xs text-[#755B31]">
              <div className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-4 h-4 text-[#8C6D3B]" />
                <span>Demo Account Available</span>
              </div>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="px-3 py-1 bg-[#8C6D3B] hover:bg-[#755B31] text-white rounded-full font-medium transition-colors shadow-xs cursor-pointer"
              >
                1-Click Log In
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@grandazure.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email address'
                      }
                    })}
                    className={`w-full h-12 px-5 rounded-full bg-[#F7F7F6] border text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all ${
                      errors.email ? 'border-red-400' : 'border-[#D9D1C7]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    {...register('password', {
                      required: 'Password is required'
                    })}
                    className={`w-full h-12 pl-5 pr-12 rounded-full bg-[#EAEAEA] border text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all ${
                      errors.password ? 'border-red-400' : 'border-transparent'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      rememberMe
                        ? 'bg-[#8C6D3B] border-[#8C6D3B] text-white'
                        : 'border-stone-400 bg-white'
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-normal text-stone-700">Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-stone-500 hover:text-[#8C6D3B] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Log In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] active:scale-[0.99] text-white text-sm font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>Log In</span>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-7 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-stone-400 font-medium">OR</span>
              </div>
            </div>

            {/* Social Logins - Side by side on desktop matching web view reference */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="h-11 px-4 rounded-full border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {/* Google G SVG */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="truncate">Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('frontdesk')}
                className="h-11 px-4 rounded-full border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {/* Apple SVG */}
                <svg className="w-4 h-4 shrink-0 fill-current text-stone-900" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.66-7.85-11.9-14.32-6.3-9.67-11.25-20.73-14.86-33.17-3.6-12.44-5.41-23.95-5.41-34.54 0-14.89 3.65-27.18 10.95-36.87 7.3-9.68 16.48-14.58 27.53-14.69 5.02 0 10.51 1.34 16.47 4.02 5.96 2.68 9.77 4.09 11.43 4.24 1.95-.25 5.99-1.74 12.12-4.48 6.13-2.73 11.39-3.95 15.78-3.66 12.1.61 21.69 4.97 28.77 13.08-10.74 6.54-15.98 15.65-15.7 27.32.28 9.53 4.11 17.5 11.49 23.91 7.38 6.41 16.14 10.05 26.28 10.93-2.24 6.77-4.99 13.51-8.24 20.22zM119.22 31.84c0-7.39 2.69-14.28 8.08-20.67 5.39-6.39 12-10.36 19.83-11.17.21 1.07.31 2.05.31 2.94 0 7.4-2.84 14.43-8.52 21.09-5.68 6.66-12.38 10.45-20.09 11.37-.21-1.18-.31-2.22-.31-3.13z" />
                </svg>
                <span className="truncate">Continue with Apple</span>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs text-stone-600">
            <span>Don't have any account? </span>
            <Link
              to="/register"
              className="font-semibold text-[#8C6D3B] hover:text-[#755B31] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: LUXURY COLLAGE & WELCOME ================= */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-[#FAF9F6] p-8 lg:p-12 flex-col justify-between border-l border-stone-100">
          
          {/* Asymmetric 5-Photo Luxury Grid Matching Reference Image */}
          <div className="grid grid-cols-12 gap-3.5 h-[480px]">
            {/* Top-Left: Grand Luxury Chandelier Lobby (Span 6 cols, 2 rows) */}
            <div className="col-span-6 row-span-2 rounded-2xl overflow-hidden shadow-sm relative group">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80"
                alt="Grand Azure Luxury Lobby"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>

            {/* Top-Right 1: Mountain Infinity Pool (Span 6 cols, 1 row) */}
            <div className="col-span-6 row-span-1 rounded-2xl overflow-hidden shadow-sm relative group">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80"
                alt="Mountain Horizon Pool"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Top-Right 2: Luxury Suite King Bedroom (Span 6 cols, 1 row) */}
            <div className="col-span-6 row-span-1 rounded-2xl overflow-hidden shadow-sm relative group">
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80"
                alt="Luxury Presidential Bedroom"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Bottom-Left: Sunset Palm Pool Patio (Span 8 cols, 1 row) */}
            <div className="col-span-8 row-span-1 rounded-2xl overflow-hidden shadow-sm relative group">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&auto=format&fit=crop&q=80"
                alt="Resort Sunset Terrace"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Bottom-Right: Courtyard Pool & Greenery (Span 4 cols, 1 row) */}
            <div className="col-span-4 row-span-1 rounded-2xl overflow-hidden shadow-sm relative group">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80"
                alt="Courtyard Lagoon"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

          {/* Bottom Welcome Content & Carousel Indicators */}
          <div className="text-center pt-8 pb-2 px-4 max-w-lg mx-auto">
            <h2 className="text-2xl font-serif-luxury font-semibold text-stone-900 tracking-tight mb-2.5">
              Welcome to The Grand Azure
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              Log in to manage your bookings, access exclusive offers, and enjoy a
              personalized experience every time you stay with us.
            </p>

            {/* Carousel Pagination Dots */}
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`transition-all duration-300 cursor-pointer ${
                    activeSlide === index
                      ? 'w-6 h-2 bg-[#8C6D3B] rounded-full'
                      : 'w-2 h-2 bg-stone-300 rounded-full hover:bg-stone-400'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal Dialog */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={enteredEmail}
      />
    </div>
  );
}
