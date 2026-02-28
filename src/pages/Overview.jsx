import React from 'react';
import { useLearner, CONCEPTS } from '../context/LearnerContext';
import { Target, Activity, CheckCircle, TrendingUp, BarChart, History, Brain } from 'lucide-react';

const Overview = () => {
    const { theta, cognitiveState, mastery, sessionHistory } = useLearner();

    const masteredCount = Object.values(mastery).filter(m => m.value >= 0.85).length;
    const avgMastery = Object.values(mastery).reduce((a, b) => a + b.value, 0) / Object.keys(mastery).length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">Cognitive Overview</h1>
                <p className="text-slate-500 font-medium">Real-time status of your neural learning policy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* KPI CARDS */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" /> Ability Score
                    </span>
                    <span className="text-3xl font-mono font-bold text-slate-800">{theta.toFixed(3)}</span>
                    <div className="mt-4 flex items-center gap-1 text-emerald-500 text-xs font-bold">
                        <TrendingUp className="w-3 h-3" /> STABLE TRAJECTORY
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Cognitive State
                    </span>
                    <span className="text-2xl font-bold text-slate-800 uppercase tracking-tight">{cognitiveState}</span>
                    <div className="mt-4 flex items-center gap-1 text-slate-400 text-xs font-bold">
                        NO ANOMALIES DETECTED
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Concepts Mastered
                    </span>
                    <span className="text-3xl font-mono font-bold text-slate-800">{masteredCount} / {Object.keys(mastery).length}</span>
                    <div className="mt-4 flex items-center gap-1 text-blue-500 text-xs font-bold">
                        NEXT: {CONCEPTS.find(c => mastery[c.id] < 0.85)?.label || 'All Complete'}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <BarChart className="w-4 h-4" /> Avg Mastery
                    </span>
                    <span className="text-3xl font-mono font-bold text-slate-800">{(avgMastery * 100).toFixed(1)}%</span>
                    <div className="mt-4 flex items-center gap-1 text-slate-400 text-xs font-bold">
                        CITY-WIDE PERCENTILE: 84th
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                    <h2 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
                        <History className="w-5 h-5 text-slate-400" /> Recent Drills
                    </h2>
                    <div className="space-y-4">
                        {sessionHistory.length > 0 ? (
                            sessionHistory.slice(-5).reverse().map((drill, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${drill.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {drill.isCorrect ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{CONCEPTS.find(c => c.id === drill.conceptId)?.label}</p>
                                            <p className="text-xs text-slate-500">{new Date(drill.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-mono font-bold text-slate-600">{(drill.latencyMs / 1000).toFixed(2)}s</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-black">LATENCY</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-10 text-slate-400 font-medium italic">No drills recorded in current session.</p>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-2xl shadow-xl p-8 flex flex-col justify-center text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Brain className="w-32 h-32" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 relative z-10">Neural Optimization Active</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed relative z-10">
                        AegisNet's CogniPath engine is real-time adjusting your learning vector using Bayesian inference and Newton-Raphson descent.
                    </p>
                    <button className="py-3 px-6 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all w-fit relative z-10">
                        SYSTEM STATUS: HEALTHY
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;
