import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useLearner } from '../context/LearnerContext';
import { useAuth } from '../context/AuthContext';
import { Target, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const { theta, cognitiveState } = useLearner();
    const location = useLocation();
    const isAssistant = location.pathname === '/assistant' || location.pathname === '/';

    const getStateColor = (state) => {
        switch (state) {
            case 'overload': return 'bg-red-100 text-red-700 border-red-200';
            case 'fatigue': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'frustration': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        }
    };

    return (
        <div className="flex bg-slate-50 min-h-screen">
            <Sidebar />
            <div className="flex-grow flex flex-col">
                {/* GLOBAL HEADER - Hidden on Assistant page */}
                {!isAssistant && (
                    <header className="h-20 bg-white border-b border-slate-200 px-8 flex-shrink-0 flex items-center justify-between sticky top-0 z-20">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-slate-400" />
                                <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px]">Neural Ability (θ)</span>
                                <span className="font-mono font-bold text-slate-800 text-lg">{theta.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className={`px-4 py-2 rounded-full font-black text-[10px] tracking-widest shadow-sm border flex items-center gap-2 transition-all ${getStateColor(cognitiveState)}`}>
                            {cognitiveState === 'normal' ? <Activity className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            {cognitiveState.toUpperCase()} TELEMETRY
                        </div>
                    </header>
                )}

                {/* PAGE CONTENT */}
                <main className={isAssistant ? "p-0" : "p-8"}>
                    <div className={isAssistant ? "w-full" : "max-w-6xl mx-auto"}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
