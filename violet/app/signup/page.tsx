'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: integrate auth logic
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <main className="flex-1 flex items-center justify-center bg-gray-50 px-4 overflow-hidden">
      <div className="w-full max-w-md -mt-20 bg-white rounded-2xl shadow-lg p-8" >
        <h1 className="text-2xl font-bold text-center text-black mb-6">Create your account</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-600 placeholder-gray-300 text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-600 placeholder-gray-300 text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-600 placeholder-gray-300 text-gray-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-pink-500 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
