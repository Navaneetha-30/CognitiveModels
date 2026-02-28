import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, GraduationCap, Map, BarChart3, Brain, Gamepad2, Sparkles, LogOut, Shield } from 'lucide-react';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { to: '/assistant', icon: <Brain className="w-5 h-5" />, label: 'Assistant' },
        { to: '/overview', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/training', icon: <GraduationCap className="w-5 h-5" />, label: 'Training' },
        { to: '/roadmap', icon: <Map className="w-5 h-5" />, label: 'Roadmap' },
        { to: '/analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
        { to: '/simulator', icon: <Sparkles className="w-5 h-5" />, label: 'Simulator' },
        { to: '/rl-playground', icon: <Gamepad2 className="w-5 h-5" />, label: 'Playground' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-2 text-blue-600">
                    <Brain className="w-8 h-8" />
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">CogniPath</h1>
                </div>
            </div>

            <nav className="flex-grow p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
              ${isActive
                                ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                            }
            `}
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
                <div className="bg-slate-50 rounded-xl p-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Neural Engine v5.0.0
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
