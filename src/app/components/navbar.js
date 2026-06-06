'use client'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
// Context API import kiya taaki db ka user data mil sake
import { useUser } from '../context/userContext' 

// 1. Role Configuration Maps
const ROLE_CONFIGS = {
    factory: {
        links: [
            { label: 'Dashboard', href: "/factory/dashboard" },
            { label: 'Team Access', href: "/factory/team" },
            { label: 'Production Calendar', href: "/factory/calender" },
        ],
        defaultButtonText: '+ New Entry',
    },
    marketing: {
        links: [
            { label: 'Sales Overview', href: "/marketing/dashboard" },
            { label: 'Track', href: "/marketing/team" },
            { label: 'Delivery Calendar', href: "/marketing/calender" },
        ],
        defaultButtonText: '+ New Delivery',
    },
    owner: {
        links: [
            { label: 'Global Monitor', href: "/owner/monitor" },
        ],
        defaultButtonText: 'Download Reports',
    }
};

// 2. Page wise Action Button Text
const PAGE_BUTTONS = {
    factory: {
        'Dashboard': '+ New entry',
        'Team Access': '+ Add Team',
        'Production Calendar': '+ New Event',
    },
    marketing: {
        'Sales Overview': '+ New Delivery',
        'Track': '+ New Track',
        'Delivery Calendar': '+ New Event',
    },
    owner: {
        'Global Monitor': 'Export Analytics'
    }
};

const Navbar = () => {
    const pathname = usePathname();
    
    // Global state se profile data extract kiya
    const { profile = {} } = useUser();

    // Safety Guard: Agar user login page par hai, toh Navbar show nahi hoga
    if (pathname === '/' || pathname === '/login') return null;

    // 3. SEAMLESS ROUTING MAGIC
    const urlSegment = pathname.split('/')[1];
    // Custom logic: agar profile.roles hai, ya fallback URL segment
    const currentRole = ROLE_CONFIGS[urlSegment] ? urlSegment : 'factory'; 

    const currentConfig = ROLE_CONFIGS[currentRole];
    const activeLink = currentConfig.links.find(link => pathname === link.href);

    let dynamicButtonText = currentConfig.defaultButtonText;
    if (activeLink && PAGE_BUTTONS[currentRole]?.[activeLink.label]) {
        dynamicButtonText = PAGE_BUTTONS[currentRole][activeLink.label];
    }

    // AccountCard ki tarah Initials nikalne ka function
    const getInitials = (name) => {
        if (!name) return "UI";
        return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <div className="bg-[#0b0f19] border-b border-gray-800 flex items-center justify-between px-6 h-16 text-white select-none w-full">

            {/* Left Side: Dynamic Branding & Nav Links */}
            <div className="flex items-center space-x-8">
                <Link href={`/${currentRole}/dashboard`} className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 flex items-center justify-center bg-white cursor-pointer hover:border-indigo-500 transition duration-150">
                    <img src="/lotus.png" alt="Lotus Logo" className="object-contain p-1 w-full h-full" />
                </Link>

                <ul className="flex items-center space-x-2 text-sm font-medium">
                    {currentConfig.links.map((link, index) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={index} className="rounded-md">
                                <Link
                                    href={link.href}
                                    className={`px-3 py-1.5 block rounded-md transition duration-150 ${isActive
                                        ? 'bg-[#000000] text-indigo-400 font-semibold border border-indigo-900/40'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Right Side: Smart Action Buttons & Profiling */}
            <div className="flex items-center space-x-4">

                <button className="bg-blue-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-md active:scale-95 transition duration-150 whitespace-nowrap">
                    {dynamicButtonText}
                </button>

                <button className="bg-slate-800/80 hover:bg-slate-700 text-gray-200 border border-gray-700 px-4 py-1.5 rounded-md text-sm font-medium active:scale-95 transition duration-150 whitespace-nowrap">
                    Edit/Modify
                </button>

                <div className="text-gray-400 hover:text-gray-200 cursor-pointer p-1.5 rounded-full hover:bg-gray-800/40 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>

                {/* UPDATED: Dynamic Role Indicator & Account Link */}
                <Link 
                    href="/account" 
                    className="relative group flex items-center space-x-2 border border-gray-700 bg-indigo-950/40 pl-3 pr-2 py-1 rounded-full cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-900/40 transition"
                    title="View Account"
                >
                    <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-300 select-none truncate max-w-[70px]">
                        {/* Database ka pehla role word (e.g. "factory") dikhayega */}
                        {profile.roles ? profile.roles.split(' ')[0] : currentRole}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                        {/* Database username se dynamic initials aayenge */}
                        {getInitials(profile.username)}
                    </div>
                </Link>

            </div>
        </div>
    )
}

export default Navbar;