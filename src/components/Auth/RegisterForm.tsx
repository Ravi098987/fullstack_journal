import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { themeClasses } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${themeClasses.cardBg} p-8 rounded-2xl shadow-xl border ${themeClasses.border} max-w-md w-full`}>
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-12 h-12 ${themeClasses.button} rounded-full mb-4`}>
          <UserPlus className="w-6 h-6" />
        </div>
        <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Create Account</h2>
        <p className={`${themeClasses.textSecondary} mt-2`}>Start your diary journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
            placeholder="Choose a username"
            required
            minLength={3}
            maxLength={20}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 pr-12 rounded-lg border ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
              placeholder="Create a password"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
            placeholder="Confirm your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${themeClasses.button} py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="text-center">
          <p className={`${themeClasses.textSecondary}`}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className={`${themeClasses.accent} hover:underline font-medium`}
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;