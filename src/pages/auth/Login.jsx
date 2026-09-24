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
    <div className="h-screen w-screen overflow-hidden bg-white grid grid-cols-1 lg:grid-cols-12 select-none">
      
      {/* ================= LEFT COLUMN: AUTH FORM ================= */}
      <div className="lg:col-span-5 xl:col-span-5 h-full p-6 sm:p-10 xl:p-12 flex flex-col justify-between bg-white overflow-y-auto lg:overflow-hidden">
        <div>
          {/* Logo */}
          <div className="mb-4 xl:mb-6">
            <Logo size="normal" />
          </div>

          {/* Header Titles */}
          <div className="mb-4 xl:mb-5">
            <h1 className="text-2xl sm:text-[28px] font-semibold text-stone-900 tracking-tight leading-snug">
              Welcome to The Grand Azure
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5 font-normal">
              Sign into your account
            </p>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div className="mb-4 p-2.5 rounded-2xl bg-[#F6F1EA] border border-[#E8DAC8] flex items-center justify-between text-xs text-[#755B31]">
            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D3B]" />
              <span>Demo Account Available</span>
            </div>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="px-3 py-1 bg-[#8C6D3B] hover:bg-[#755B31] text-white rounded-full font-medium transition-colors shadow-2xs cursor-pointer text-[11px]"
            >
              1-Click Log In
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
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
                  className={`w-full h-11 px-5 rounded-full bg-[#F7F7F6] border text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all ${
                    errors.email ? 'border-red-400' : 'border-[#D9D1C7]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  className={`w-full h-11 pl-5 pr-11 rounded-full bg-[#EAEAEA] border text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all ${
                    errors.password ? 'border-red-400' : 'border-transparent'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1 cursor-pointer"
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
                <p className="mt-1 text-[11px] text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs text-stone-600 pt-0.5">
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
                <span className="font-normal text-stone-700 text-xs">Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-stone-500 hover:text-[#8C6D3B] text-xs transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Log In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] active:scale-[0.99] text-white text-xs font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-1"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative my-4 xl:my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-3 text-stone-400 font-medium">OR</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="h-10 px-3 rounded-full border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
              className="h-10 px-3 rounded-full border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 shrink-0 fill-current text-stone-900" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.66-7.85-11.9-14.32-6.3-9.67-11.25-20.73-14.86-33.17-3.6-12.44-5.41-23.95-5.41-34.54 0-14.89 3.65-27.18 10.95-36.87 7.3-9.68 16.48-14.58 27.53-14.69 5.02 0 10.51 1.34 16.47 4.02 5.96 2.68 9.77 4.09 11.43 4.24 1.95-.25 5.99-1.74 12.12-4.48 6.13-2.73 11.39-3.95 15.78-3.66 12.1.61 21.69 4.97 28.77 13.08-10.74 6.54-15.98 15.65-15.7 27.32.28 9.53 4.11 17.5 11.49 23.91 7.38 6.41 16.14 10.05 26.28 10.93-2.24 6.77-4.99 13.51-8.24 20.22zM119.22 31.84c0-7.39 2.69-14.28 8.08-20.67 5.39-6.39 12-10.36 19.83-11.17.21 1.07.31 2.05.31 2.94 0 7.4-2.84 14.43-8.52 21.09-5.68 6.66-12.38 10.45-20.09 11.37-.21-1.18-.31-2.22-.31-3.13z" />
              </svg>
              <span className="truncate">Continue with Apple</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-3 pb-1 text-center text-xs text-stone-600">
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
      <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 h-full bg-[#FAF9F6] p-6 xl:p-8 flex-col justify-center items-center border-l border-stone-200/60 overflow-hidden">
        
        <div className="w-full max-w-[560px] xl:max-w-[620px] flex flex-col items-center gap-5 xl:gap-6">
          {/* Asymmetric 5-Photo Luxury Grid Matching Reference Image */}
          <div className="w-full grid grid-cols-12 gap-3 h-[380px] xl:h-[420px]">
            {/* Top-Left: Grand Luxury Chandelier Lobby */}
            <div className="col-span-6 row-span-2 rounded-2xl overflow-hidden shadow-xs relative group">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80"
                alt="Grand Azure Luxury Lobby"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>

            {/* Top-Right 1: Mountain Infinity Pool */}
            <div className="col-span-6 row-span-1 rounded-2xl overflow-hidden shadow-xs relative group">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80"
                alt="Mountain Horizon Pool"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Top-Right 2: Luxury Suite King Bedroom */}
            <div className="col-span-6 row-span-1 rounded-2xl overflow-hidden shadow-xs relative group">
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80"
                alt="Luxury Presidential Bedroom"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Bottom-Left: Sunset Palm Pool Patio */}
            <div className="col-span-8 row-span-1 rounded-2xl overflow-hidden shadow-xs relative group">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&auto=format&fit=crop&q=80"
                alt="Resort Sunset Terrace"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Bottom-Right: Courtyard Pool & Greenery */}
            <div className="col-span-4 row-span-1 rounded-2xl overflow-hidden shadow-xs relative group">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80"
                alt="Courtyard Lagoon"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

          {/* Bottom Welcome Content & Carousel Indicators - Directly below collage without huge gap */}
          <div className="text-center px-4 max-w-lg mx-auto">
            <h2 className="text-xl xl:text-2xl font-bold text-stone-900 tracking-tight mb-1.5 font-sans">
              Welcome to The Grand Azure
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed mb-3.5 font-normal max-w-md mx-auto font-sans">
              Log in to manage your bookings, access exclusive offers, and enjoy a
              personalized experience every time you stay with us.
            </p>

            {/* Carousel Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`transition-all duration-300 cursor-pointer ${
                    activeSlide === index
                      ? 'w-5 h-1.5 bg-[#8C6D3B] rounded-full'
                      : 'w-1.5 h-1.5 bg-stone-300 rounded-full hover:bg-stone-400'
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
