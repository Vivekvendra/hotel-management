import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Mail, KeyRound, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function ForgotPasswordModal({ isOpen, onClose, initialEmail = '' }) {
  const { resetPassword } = useAuth();
  const [step, setStep] = useState('email'); // 'email' | 'newPassword' | 'success'
  const [targetEmail, setTargetEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: { email: initialEmail, newPassword: '', confirmPassword: '' }
  });

  if (!isOpen) return null;

  const handleEmailSubmit = (data) => {
    setTargetEmail(data.email);
    setStep('newPassword');
  };

  const handlePasswordSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const result = resetPassword(targetEmail, data.newPassword);
    if (result.success) {
      setStep('success');
    }
  };

  const handleClose = () => {
    reset();
    setStep('email');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-stone-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'email' && (
          <div>
            <div className="w-12 h-12 bg-[#8C6D3B]/10 rounded-2xl flex items-center justify-center text-[#8C6D3B] mb-5">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif-luxury font-semibold text-stone-900 mb-2">
              Reset Your Password
            </h3>
            <p className="text-sm text-stone-500 mb-6">
              Enter the email associated with your account to verify and set a new password.
            </p>

            <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@grandazure.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full px-5 py-3.5 rounded-full bg-[#F7F7F6] border text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all ${
                    errors.email ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === 'newPassword' && (
          <div>
            <div className="w-12 h-12 bg-[#8C6D3B]/10 rounded-2xl flex items-center justify-center text-[#8C6D3B] mb-5">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif-luxury font-semibold text-stone-900 mb-2">
              Set New Password
            </h3>
            <p className="text-sm text-stone-500 mb-6">
              Create a new secure password for <strong className="text-stone-800">{targetEmail}</strong>
            </p>

            <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`w-full px-5 py-3.5 rounded-full bg-[#F7F7F6] border text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all ${
                    errors.newPassword ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your new password'
                  })}
                  className={`w-full px-5 py-3.5 rounded-full bg-[#F7F7F6] border text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Update Password</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif-luxury font-semibold text-stone-900 mb-2">
              Password Reset!
            </h3>
            <p className="text-sm text-stone-500 mb-6">
              Your password has been securely updated. You can now log into your account with your new credentials.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3.5 px-6 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Back to Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
