import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Shield } from 'lucide-react';
import useStore from '../store';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('staff');
    navigate('/dashboard');
  };

  const handleRoleLogin = (role: 'admin' | 'waiter' | 'staff') => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Staff Login</h1>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          {/* Role Selection Buttons */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <button
              onClick={() => handleRoleLogin('admin')}
              className="flex items-center justify-center px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Shield className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Admin Login</div>
                <div className="text-sm opacity-90">Full system access</div>
              </div>
            </button>

            <button
              onClick={() => handleRoleLogin('waiter')}
              className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <User className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Waiter Login</div>
                <div className="text-sm opacity-90">Order management</div>
              </div>
            </button>

            <button
              onClick={() => handleRoleLogin('staff')}
              className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <User className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Staff Login</div>
                <div className="text-sm opacity-90">Kitchen and support</div>
              </div>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;