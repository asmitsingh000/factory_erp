'use client'
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const emailLower = formData.email.toLowerCase();
      let detectedRole = '';

      if (emailLower.includes('factory')) {
        detectedRole = 'factory';
      } else if (emailLower.includes('marketing')) {
        detectedRole = 'marketing';
      } else if (emailLower.includes('owner')) {
        detectedRole = 'owner';
      } else {
        setLoading(false);
        setError('Testing Tip: Email mein "factory", "marketing" ya "owner" likho (e.g., test@factory.com)');
        return;
      }

      document.cookie = `token=fake-jwt-token-for-testing; path=/; max-age=3600`;
      document.cookie = `userRole=${detectedRole}; path=/; max-age=3600`;

      if (returnUrl) {
        router.push(returnUrl);
      } else {
        const defaultRoutes = {
          factory: '/factory/dashboard',
          marketing: '/marketing/dashboard',
          owner: '/owner/monitor'
        };
        router.push(defaultRoutes[detectedRole]);
      }
      
      setLoading(false);
    }, );
  };

  return (
    <div className="min-h-screen bg-[#060913] flex items-center justify-center px-4 select-none">
      <div className="w-full max-w-md bg-[#0b0f19] border border-gray-800 rounded-xl p-8 shadow-2xl">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-700 flex items-center justify-center bg-white cursor-pointer ">
            <img src="/lotus.png" alt="Lotus Logo" className="object-contain p-1 w-full h-full" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Lotus Workspace</h2>
          <p className="text-gray-400 text-sm mt-1">Temporary Mock Login (No Backend)</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-amber-950/40 border border-amber-900/50 text-amber-400 text-xs rounded-md font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="factory@company.com ya marketing@..."
              className="w-full bg-[#141b2d] border border-gray-800 rounded-md px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="check karne ke liyeee kuchhh daldeeeeee"
              className="w-full bg-[#141b2d] border border-gray-800 rounded-md px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-md text-sm shadow-md active:scale-[0.98] transition duration-150 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Simulating Login...' : 'Test Sign In'}
          </button>

        </form>

        <div className="mt-6 border-t border-gray-800/60 pt-4 bg-gray-900/20 p-3 rounded-lg">
          <p className="text-[11px] uppercase text-indigo-400 tracking-wider mb-2 font-bold text-center">Testing Credentials</p>
          <ul className="text-[11px] text-gray-400 space-y-1 list-disc list-inside">
            <li>Type <span className="text-white font-mono">factory@test.com</span> $\rightarrow$ Factory Routes</li>
            <li>Type <span className="text-white font-mono">marketing@test.com</span> $\rightarrow$ Marketing Routes</li>
            <li>Type <span className="text-white font-mono">owner@test.com</span> $\rightarrow$ Owner Routes</li>
          </ul>
        </div>

      </div>
    </div>
  );
}