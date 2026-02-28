import React, { useState, useMemo } from 'react';
import { useLearner, CONCEPTS, computeRetention } from '../context/LearnerContext';
import {
    Zap,
    TrendingUp,
    Target,
    Clock,
    RefreshCw,
    Brain,
    ChevronRight,
    Sparkles,
    Layers,
    Network,
    BarChart3
} from 'lucide-react';

const Simulator = () => {
    const { theta: actualTheta, mastery: actualMastery } = useLearner();

    // Simulation state
    const [simTheta, setSimTheta] = useState(actualTheta);
    const [simTimeLapse, setSimTimeLapse] = useState(0); // days
    const [simMastery, setSimMastery] = useState(() => {
        const initial = {};
        CONCEPTS.forEach(c => {
            initial[c.id] = actualMastery[c.id]?.value || 0.1;
        });
        return initial;
    });

    const handleMasteryChange = (id, val) => {
        setSimMastery(prev => ({ ...prev, [id]: val }));
    };

    const simulatedRetention = useMemo(() => {
        return CONCEPTS.map(c => {
            const m = actualMastery[c.id] || { strength: 2.0 };
            const baseValue = simMastery[c.id];
            // Simulate retention after simTimeLapse days
            const r = Math.exp(-simTimeLapse / (m.strength || 2.0)) * baseValue;
            return { id: c.id, label: c.label, value: r, original: baseValue };
        });
    }, [simMastery, simTimeLapse, actualMastery]);

    const resetSimulation = () => {
        setSimTheta(actualTheta);
        setSimTimeLapse(0);
        const initial = {};
        CONCEPTS.forEach(c => {
            initial[c.id] = actualMastery[c.id]?.value || 0.1;
        });
        setSimMastery(initial);
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-blue-600" /> What-If Simulator
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Predict cognitive outcomes in hypothetical scenarios</p>
                </div>
                <button
                    onClick={resetSimulation}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <RefreshCw className="w-4 h-4" /> RESET TO ACTUALS
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. INPUT SANDBOX */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-wider">
                            <Layers className="w-5 h-5 text-blue-500" /> Neural Parameters
                        </h2>

                        <div className="space-y-8">
                            {/* Theta Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Ability (θ)</label>
                                    <span className="text-lg font-mono font-bold text-blue-600">{simTheta.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range" min="-4" max="4" step="0.1"
                                    value={simTheta}
                                    onChange={(e) => setSimTheta(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            {/* Time Lapse Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Days Since Review</label>
                                    <span className="text-lg font-mono font-bold text-amber-600">{simTimeLapse} d</span>
                                </div>
                                <input
                                    type="range" min="0" max="30" step="1"
                                    value={simTimeLapse}
                                    onChange={(e) => setSimTimeLapse(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-amber-500"
                                />
                            </div>

                            <hr className="border-slate-100" />

                            {/* Mastery Sliders */}
                            <div className="space-y-6 pt-2">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block">Concept Proficiency</label>
                                {CONCEPTS.map(c => (
                                    <div key={c.id} className="space-y-3">
                                        <div className="flex justify-between text-[11px] font-bold text-slate-500">
                                            <span>{c.label}</span>
                                            <span>{(simMastery[c.id] * 100).toFixed(0)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.01"
                                            value={simMastery[c.id]}
                                            onChange={(e) => handleMasteryChange(c.id, parseFloat(e.target.value))}
                                            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-400"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SIMULATED IMPACT VISUALIZATION */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Simulated Retention Curve */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <TrendingUp className="w-48 h-48 text-white/[0.03] absolute -bottom-12 -right-12 rotate-12" />
                        <h2 className="text-sm font-bold text-blue-400 mb-8 flex items-center gap-2 uppercase tracking-widest relative z-10">
                            <Clock className="w-5 h-5" /> Predicted Decay Trajectory
                        </h2>

                        <div className="relative h-64 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden z-10">
                            <svg width="100%" height="100%" viewBox="0 0 400 200" className="px-10 overflow-visible">
                                <defs>
                                    <linearGradient id="simGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {simulatedRetention.map((d, idx) => {
                                    // Plot 7 days forecast from current 'simulated' state
                                    const pathPoints = [];
                                    for (let i = 0; i <= 7; i++) {
                                        const t = i;
                                        const s = actualMastery[d.id]?.strength || 2.0;
                                        const r = Math.exp(-t / s) * d.value;
                                        pathPoints.push(`${i * (400 / 7)},${200 - (r * 180)}`);
                                    }
                                    const path = `M ${pathPoints.join(' ')}`;
                                    return (
                                        <g key={d.id}>
                                            {idx === 0 && <path d={`${path} L 400,200 L 0,200 Z`} fill="url(#simGradient)" />}
                                            <path
                                                d={path}
                                                fill="none"
                                                stroke={idx === 0 ? '#3b82f6' : '#ffffff20'}
                                                strokeWidth={idx === 0 ? "4" : "2"}
                                                className="transition-all duration-500"
                                            />
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                            {simulatedRetention.map(d => (
                                <div key={d.id} className="text-center">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{d.label.split(' ')[0]}</p>
                                    <p className="text-2xl font-mono font-black text-white">
                                        {(d.value * 100).toFixed(0)}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Outcome Metrics & Research Positioning */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
                            <h2 className="text-xs font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                                <Target className="w-4 h-4 text-emerald-500" /> Measurable Outcomes
                            </h2>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Predicted GPA Mastery</p>
                                        <p className="text-4xl font-mono font-black text-slate-800">
                                            {(Math.min(4.0, 3.0 + (simTheta * 0.25) + (Object.values(simMastery).reduce((a, b) => a + b, 0) / 4))).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase">Top 4%</p>
                                        <p className="text-xs text-slate-400 font-medium whitespace-nowrap">Global Academic Rank</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                                    <Clock className="w-5 h-5 text-emerald-600" />
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900">
                                            {Math.round(24 + simTheta * 5)}% Time Efficiency
                                        </p>
                                        <p className="text-[10px] text-emerald-600 font-medium">Estimated study time reduction vs. Rote</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                            <h2 className="text-xs font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                                <BarChart3 className="w-4 h-4 text-blue-500" /> Research Positioning
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase px-1">
                                    <span>Methodology</span>
                                    <span>Retention @ {simTimeLapse}d</span>
                                </div>
                                <div className="space-y-3">
                                    {/* CogniPath Bar */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                                            <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-blue-500" /> CogniPath (SRS)</span>
                                            <span className="font-mono">{(simulatedRetention.reduce((a, b) => a + b.value, 0) / 4 * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-6 w-full bg-slate-50 rounded-lg overflow-hidden border border-slate-100 p-1">
                                            <div
                                                className="h-full bg-blue-500 rounded-md transition-all duration-1000"
                                                style={{ width: `${(simulatedRetention.reduce((a, b) => a + b.value, 0) / 4 * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                    {/* Traditional Bar */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                                            <span>Traditional (Block Study)</span>
                                            <span className="font-mono">{(Math.max(5, (simulatedRetention.reduce((a, b) => a + b.value, 0) / 4 * 100) * Math.pow(0.8, Math.max(1, simTimeLapse / 2)))).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-6 w-full bg-slate-50 rounded-lg overflow-hidden border border-slate-100 p-1">
                                            <div
                                                className="h-full bg-slate-200 rounded-md transition-all duration-1000"
                                                style={{ width: `${Math.max(5, (simulatedRetention.reduce((a, b) => a + b.value, 0) / 4 * 100) * Math.pow(0.8, Math.max(1, simTimeLapse / 2)))}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Future Scalability Slide */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl bg-blue-500 rounded-full w-96 h-96 -mr-48 -mt-48 animate-pulse" />
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <RefreshCw className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight">Future Scaling Vision 2030</h3>
                            <p className="text-indigo-300 text-sm font-bold uppercase tracking-[0.3em]">Synaptic Expansion Phase</p>
                        </div>
                    </div>

                    <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium">
                        We are moving beyond dashboard simulation. The architecture is evolving into a <span className="text-white font-bold">Collaborative Neural Mesh</span>, where individual learning vectors synchronize with global peer clusters for decentralized intelligence harvesting.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all cursor-pointer">
                            <Brain className="w-8 h-8 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold text-white mb-2">Edge NPU Sync</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">On-device inference scaling to billion-parameter models for near-zero latency coaching.</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all cursor-pointer">
                            <Network className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold text-white mb-2">Synaptic Swarms</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">Anonymous peer-to-peer knowledge transfer via encrypted cognitive vector sharing.</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all cursor-pointer">
                            <Zap className="w-8 h-8 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold text-white mb-2">Real-time IoT Integration</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">Environmental sensory data (light, posture, noise) feeding directly into the BKT engine.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Simulator;
