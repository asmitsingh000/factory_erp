'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userContext";

export default function AccountPage() {
  const router = useRouter();
  const { profile = {} } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  // Avatar ke initials nikalne ke liye
  const getInitials = (name) => {
    if (!name) return "UI";
    return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  };

  // Logout mock function (Isme baad mein Laravel Sanctum token delete karne ka logic aayega)
  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "userRole=; path=/; max-age=0";
    router.push("/"); // Wapas login par bhej do
  };

  return (
    <div className="min-h-screen bg-[#060913] text-white p-4 md:p-8 select-none">
      
      {/* Top Action Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition group"
        >
          <div className="p-1.5 rounded-full bg-gray-800/40 group-hover:bg-gray-700/50 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-900/30 px-4 py-1.5 rounded-md text-sm font-medium border border-red-900/30 transition duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto bg-[#0b0f19] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Profile Header Background Banner */}
        <div className="h-32 w-full bg-gradient-to-r from-indigo-900/40 to-[#0b0f19] border-b border-gray-800/50"></div>

        <div className="px-8 pb-8 relative">
          
          {/* Avatar Section (Overlapping the banner) */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 mb-8 gap-4">
            <div className="flex items-end space-x-5">
              <div className="w-24 h-24 rounded-2xl bg-[#0b0f19] p-1.5 shadow-xl border border-gray-800">
                <div className="w-full h-full rounded-xl bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
                  {getInitials(profile.username)}
                </div>
              </div>
              <div className="pb-1">
                <h1 className="text-3xl font-bold text-white tracking-wide capitalize">
                  {profile.username || "Loading User..."}
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                    {profile.roles || "Role Pending"}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span>Online</span>
                  </span>
                </div>
              </div>
            </div>

            <button className="bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium border border-gray-700 active:scale-95 transition shadow-sm">
              Edit Profile
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-6 border-b border-gray-800 mb-6">
            {['overview', 'security', 'preferences'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold capitalize transition-all duration-150 ${
                  activeTab === tab 
                  ? 'text-indigo-400 border-b-2 border-indigo-500' 
                  : 'text-gray-500 hover:text-gray-300 border-b-2 border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content: Overview */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Info Block - Email */}
              <div className="bg-[#141b2d] border border-gray-800/60 rounded-xl p-5 hover:border-gray-700 transition">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Email Address</p>
                <p className="text-gray-200 font-medium">{profile.gmail || "Not provided"}</p>
              </div>

              {/* Info Block - Phone */}
              <div className="bg-[#141b2d] border border-gray-800/60 rounded-xl p-5 hover:border-gray-700 transition">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Phone Number</p>
                <p className="text-gray-200 font-medium">{profile.phone_number || "Not provided"}</p>
              </div>

              {/* Info Block - Branch */}
              <div className="bg-[#141b2d] border border-gray-800/60 rounded-xl p-5 hover:border-gray-700 transition">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Working Branch</p>
                <div className="flex items-center space-x-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-200 font-medium capitalize">
                    {profile.working_branch || "Headquarters"}
                  </p>
                </div>
              </div>

              {/* Info Block - System ID / Registration Date (Mock) */}
              <div className="bg-[#141b2d] border border-gray-800/60 rounded-xl p-5 hover:border-gray-700 transition">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Account Status</p>
                <p className="text-green-400 font-medium flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Active & Verified</span>
                </p>
              </div>

            </div>
          )}

          {/* Tab Content: Security (Placeholder) */}
          {activeTab === 'security' && (
            <div className="animate-fade-in bg-[#141b2d] border border-gray-800/60 rounded-xl p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-300">Security Settings</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">Update your password and secure your account.</p>
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium border border-gray-700 transition">
                Change Password
              </button>
            </div>
          )}

          {/* Tab Content: Preferences (Placeholder) */}
          {activeTab === 'preferences' && (
            <div className="animate-fade-in bg-[#141b2d] border border-gray-800/60 rounded-xl p-6">
              <p className="text-sm text-gray-400 text-center">Notification and UI preferences will appear here.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}