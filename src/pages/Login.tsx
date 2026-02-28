import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Code, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F13] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#4F0F93]/5"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-[#111317] border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-[#4F0F93] rounded-2xl flex items-center justify-center">
              <Code className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-sm text-[#A0A0B0]">Sign in to continue your journey</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#D0D0E0] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0B0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111317] border border-gray-800 rounded-lg pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#D0D0E0] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0B0]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111317] border border-gray-800 rounded-lg pl-11 pr-12 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4F0F93] text-white font-medium py-2.5 text-sm rounded-lg hover:bg-[#6312BA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#A0A0B0]">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-[#808090]">
          By continuing, you agree to PlacementPro's Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
