import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import AuthLayout from '../components/AuthLayout';
import { EyeIcon } from '../components/icons/EyeIcon';
import { EyeOffIcon } from '../components/icons/EyeOffIcon';


const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await signUp({
      email,
      password,
      options: {
        data: {
          fullName, // This name will be saved to user_metadata
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      if (data.session) {
        // If email verification is off, session is created, navigate to dash
        navigate('/dashboard');
      } else {
        // If email verification is on, show success message
        setSignupSuccess(true);
      }
    }
    setLoading(false);
  };
  
  if (signupSuccess) {
    return (
        <AuthLayout>
            <div className="text-left">
                <h2 className="text-3xl font-serif font-bold text-brand-heading mb-4">
                    Check your email
                </h2>
                <p className="text-brand-text mb-8">
                    We've sent a verification link to <strong>{email}</strong>. Please click the link to complete your registration.
                </p>
                <Link 
                    to="/login" 
                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-brand-primary hover:bg-brand-primary-dark"
                >
                    Back to Login
                </Link>
            </div>
        </AuthLayout>
    );
  }

  return (
    <AuthLayout>
       <div className="w-full">
        <h2 className="text-3xl font-serif font-bold text-brand-heading mb-2">
          Create an account
        </h2>
        <p className="text-brand-text mb-8">
          Create your account to get started.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-brand-text mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="appearance-none block w-full px-4 py-3 bg-brand-subtle/50 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-text mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-3 bg-brand-subtle/50 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-text mb-1">
              Password
            </label>
            <div className="relative">
                <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 bg-brand-subtle/50 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary sm:text-sm"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-brand-primary"
                >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600 text-center pt-2">{error}</p>}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-brand-primary hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400"
            >
              {loading && <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
              Create Account
            </button>
          </div>
        </form>
      </div>
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-primary hover:text-brand-primary-dark">
            Sign In
          </Link>
        </p>
    </AuthLayout>
  );
};

export default SignupPage;