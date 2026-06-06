"use client";

import React, { useState } from "react";
// Ye context Laravel API se fetch kiya hua logged-in user ka data dega
import { useUser } from "../context/userContext"; 

export default function AccountCard() {
  // Context se DB fields destructure kar rahe hain. 
  // Agar profile load nahi hui hai, toh app crash na ho isliye fallback empty object {} diya hai.
  const { profile = {} } = useUser(); 
  const [activeSection, setActiveSection] = useState("details");

  // Initials nikalne ka logic (e.g., "Test manager" -> "TM")
  const getInitials = (name) => {
    if (!name) return "DM"; // User Initials fallback
    return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  };

  // Dynamic sections: Agar factory ka banda hai toh uske hisab se tabs/data dikhega
  const isFactory = profile.roles?.toLowerCase().includes("factory");
  const isMarketing = profile.roles?.toLowerCase().includes("marketing");

  // Tab styling helper
  const tabBtn = (name, isActive) => ({
    padding: "0 4px 10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    background: "none",
    border: "none",
    borderBottom: isActive ? "2px solid #4f46e5" : "2px solid transparent", // Indigo-600 for active
    color: isActive ? "#4f46e5" : "#9ca3af", // text-gray-400 for inactive
    transition: "all 0.2s",
  });

  return (
    <div className="max-w-[600px] mx-auto w-full py-6 select-none">
      
      {/* Main Card Container (Tailwind dark mode colors applied) */}
      <div className="rounded-2xl p-7 bg-[#0b0f19] border border-gray-800 shadow-2xl">
        
        {/* Profile Header */}
        <div className="flex items-center gap-5 mb-8 border-b border-gray-800/60 pb-6">
          <div className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-3xl font-bold shrink-0 bg-indigo-900/50 text-indigo-400 border border-indigo-500/30">
            {getInitials(profile.username)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white capitalize m-0">
              {profile.username || "Loading..."}
            </h1>
            <p className="text-sm mt-1 mb-0 text-indigo-400 font-medium capitalize">
              {profile.roles || "Assigning Role"}
            </p>
          </div>
        </div>

        {/* User Details Grid based on MySQL columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {[
            { label: "Email Address", value: profile.gmail },
            { label: "Phone Number", value: profile.phone_number },
            { label: "Designation", value: profile.roles },
            // Agar owner hai (jiska branch null/empty hai), toh default "Headquarters" dikhayega
            { label: "Working Branch", value: profile.working_branch || "Headquarters" }, 
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col p-3.5 rounded-xl bg-[#141b2d] border border-gray-800"
            >
              <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-1">
                {item.label}
              </span>
              <span className="text-sm text-gray-200 truncate">
                {item.value || "N/A"}
              </span>
            </div>
          ))}
        </div>

        {/* Role-Based Section Tabs */}
        <div className="flex gap-6 mb-6 border-b border-gray-800">
          <button 
            style={tabBtn("details", activeSection === "details")} 
            onClick={() => setActiveSection("details")}
          >
            Recent Activities
          </button>
          
          {/* Conditional Tab Rendering based on user role */}
          {isFactory && (
            <button 
              style={tabBtn("factory", activeSection === "factory")} 
              onClick={() => setActiveSection("factory")}
            >
              Factory Stats
            </button>
          )}
          
          {isMarketing && (
            <button 
              style={tabBtn("marketing", activeSection === "marketing")} 
              onClick={() => setActiveSection("marketing")}
            >
              Campaign History
            </button>
          )}
        </div>

        {/* Section Content Area */}
        <div className="rounded-2xl p-5 bg-[#060913]/50 border border-gray-800/50">
          {activeSection === "details" && (
            <p className="text-sm text-gray-400 leading-relaxed text-center py-4">
              System monitoring active for {profile.username}. All recent login and activity logs will appear here.
            </p>
          )}

          {activeSection === "factory" && (
            <p className="text-sm text-gray-400 leading-relaxed text-center py-4">
              Factory module loaded. Branch: {profile.working_branch} inventory and staff metrics will be displayed here.
            </p>
          )}

          {activeSection === "marketing" && (
            <p className="text-sm text-gray-400 leading-relaxed text-center py-4">
              Marketing module loaded. Active ad campaigns and lead generations for {profile.working_branch} branch will show here.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}