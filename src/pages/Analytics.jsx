import React, { useMemo } from 'react';
import { useLearner, CONCEPTS } from '../context/LearnerContext';
import { BarChart3, Clock, CheckCircle, TrendingUp, Zap, AlertCircle, Brain, Target, Network, Layers } from 'lucide-react';

const RadarChart = ({ data, size = 200 }) => {
    const center = size / 2;
    const radius = size * 0.4;
    const angleStep = (Math.PI * 2) / data.length;

    const points = data.map((d, i) => {
        const x = center + radius * d.value * Math.sin(i * angleStep);
        const y = center - radius * d.value * Math.cos(i * angleStep);
        return `${x},${y}`;
    }).join(' ');

    const axes = data.map((d, i) => {
        const x = center + radius * Math.sin(i * angleStep);
        const y = center - radius * Math.cos(i * angleStep);
        return { x, y, label: d.label };
    });

    return (
        <svg width={size} height={size} className="overflow-visible">
            {/* Background Polygons */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((tick, idx) => (
                <polygon
                    key={idx}
                    points={data.map((_, i) => `${center + radius * tick * Math.sin(i * angleStep)},${center - radius * tick * Math.cos(i * angleStep)}`).join(' ')}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                />
            ))}
            {/* Axes */}
            {axes.map((axis, i) => (
                <line key={i} x1={center} y1={center} x2={axis.x} y2={axis.y} stroke="#e2e8f0" strokeWidth="1" />
            ))}
            {/* Data Polygon */}
            <polygon points={points} fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />
            {/* Point Markers */}
            {data.map((d, i) => {
                const x = center + radius * d.value * Math.sin(i * angleStep);
                const y = center - radius * d.value * Math.cos(i * angleStep);
                return <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" />;
            })}
            {/* Labels */}
            {axes.map((axis, i) => (
                <text
                    key={i}
                    x={axis.x}
                    y={axis.y + (axis.y < center ? -10 : 15)}
                    textAnchor="middle"
                    className="text-[10px] font-bold text-slate-400 uppercase fill-current"
                >
                    {axis.label}
                </text>
            ))}
        </svg>
    );
};

const Analytics = () => {
    const { mastery, sessionHistory, confidenceScores, qTable } = useLearner();

    // --- RETENTION FORECAST LOGIC ---
    const generateForecastData = (m) => {
        const data = [];
        for (let i = 0; i <= 7; i++) {
            const t = i; // days in future
            const s = m.strength || 2.0;
            const r = Math.exp(-t / s) * m.value;
            data.push({ day: i, retention: r });
        }
        return data;
    };

    const getAvgConfidence = (conceptId) => {
        const scores = confidenceScores[conceptId] || [];
        if (scores.length === 0) return 0;
        return scores.reduce((a, b) => a + b, 0) / scores.length;
    };

    const radarData = useMemo(() => CONCEPTS.map(c => ({
        label: c.label.split(' ')[0],
        value: mastery[c.id]?.value || 0
    })), [mastery]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Advanced Analytics</h1>
                    <p className="text-slate-500 font-medium">Multi-dimensional cognitive mapping</p>
                </div>
                <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Engine: NeuralPolicy v3.1</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">

                {/* 1. MASTERY RADAR (NEW ADVANCED GRAPH) */}
                <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center">
                    <h2 className="text-sm font-bold text-slate-800 mb-8 self-start flex items-center gap-2 uppercase tracking-wider">
                        <Layers className="w-5 h-5 text-blue-500" /> Mastery Balance
                    </h2>
                    <RadarChart data={radarData} size={220} />
                    <p className="mt-8 text-[10px] text-slate-400 text-center font-medium px-4">
                        Radial span represents current concept proficiency across all neural clusters.
                    </p>
                </div>

                {/* 2. ENHANCED RETENTION AREA CHART (span 2) */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col h-full">
                    <h2 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
                        <TrendingUp className="w-5 h-5 text-emerald-500" /> Retention Curve Forecast
                    </h2>
                    <div className="relative flex-grow h-64 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden">
                        <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible px-10">
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {[0, 50, 100].map(y => (
                                <line key={y} x1="0" y1={200 - (y * 2)} x2="400" y2={200 - (y * 2)} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />
                            ))}
                            {CONCEPTS.map((c, idx) => {
                                const m = mastery[c.id];
                                const data = generateForecastData(m);
                                const points = data.map((d, i) => `${i * (400 / 7)},${Math.max(0, 200 - (d.retention * 200))}`);
                                const path = `M ${points.join(' ')}`;
                                const areaPath = `${path} L ${7 * (400 / 7)},200 L 0,200 Z`;
                                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
                                return (
                                    <g key={c.id}>
                                        {idx === 0 && <path d={areaPath} fill="url(#areaGradient)" className="opacity-30" />}
                                        <path d={path} fill="none" stroke={colors[idx % colors.length]} strokeWidth="3" strokeLinecap="round" className="opacity-80 transition-all duration-1000" />
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>

                {/* 3. POLICY PROBABILITY PLOT (Q-Table) */}
                <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col h-full">
                    <h2 className="text-sm font-bold text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-wider">
                        <Network className="w-5 h-5 text-indigo-500" /> Policy Expectation
                    </h2>
                    <div className="space-y-6 flex-grow">
                        {CONCEPTS.map(concept => {
                            const qValues = Object.values(qTable).map(s => s[concept.id] || 0);
                            const avgQ = qValues.length > 0 ? qValues.reduce((a, b) => a + b, 0) / qValues.length : 0;
                            return (
                                <div key={concept.id} className="relative">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{concept.label}</span>
                                        <div className="flex gap-2 items-baseline">
                                            <span className="text-[8px] font-bold text-slate-300">EV</span>
                                            <span className="text-[10px] font-mono font-bold text-indigo-600">{avgQ.toFixed(3)}</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-8 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden relative flex items-center">
                                        <div
                                            className="h-full bg-indigo-500/10 border-r border-indigo-200 transition-all duration-1000"
                                            style={{ width: `${Math.min(100, Math.max(5, (avgQ + 1) * 50))}%` }}
                                        />
                                        <Zap className="w-3 h-3 text-indigo-400 absolute left-3 opacity-40" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 4. CONFIDENCE GAP (span 2) */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col h-full">
                    <h2 className="text-sm font-bold text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-wider">
                        <Target className="w-5 h-5 text-blue-500" /> Metacognitive Gap
                    </h2>
                    <div className="space-y-12 py-4">
                        {CONCEPTS.map(c => {
                            const actualMastery = mastery[c.id].value;
                            const perceivedMastery = getAvgConfidence(c.id) / 5;
                            const gap = perceivedMastery - actualMastery;
                            const isOver = gap > 0.15;
                            return (
                                <div key={c.id} className="relative pt-2">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">{c.label}</span>
                                        <div className="h-6 px-3 rounded-full bg-slate-100 flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${isOver ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{isOver ? 'Over-Estimation' : 'Balanced'}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full relative">
                                        <div className="absolute top-1/2 -translate-y-1/2 h-4 w-[2px] bg-slate-300" style={{ left: '50%' }} />
                                        <div className="h-4 w-4 bg-blue-600 rounded-full absolute -top-1 shadow-lg shadow-blue-500/30 transition-all duration-700" style={{ left: `${actualMastery * 100}%` }} />
                                        <div className="h-6 w-1 bg-amber-400 absolute -top-2 transition-all duration-1000 opacity-60" style={{ left: `${perceivedMastery * 100}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 5. HERO FOOTER: POLICY INSIGHTS */}
                <div className="lg:col-span-3 bg-slate-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden flex flex-col justify-center shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />
                    <Network className="w-48 h-48 text-white/[0.03] absolute -bottom-12 -right-12 rotate-12" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Brain className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-3xl font-bold tracking-tight">Neural Trajectory</h3>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium">
                                Your learning model has reached **Level 3 Synchronization**. The Q-Table suggests that **{CONCEPTS[0].label}** is your primary mastery anchor, while the engine maintains a **{(100 - Object.keys(qTable).length)}% exploration entropy** to broaden your skill distribution.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 shrink-0">
                            <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">States</p>
                                <p className="text-4xl font-mono font-black">{Object.keys(qTable).length}</p>
                            </div>
                            <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Accuracy</p>
                                <p className="text-4xl font-mono font-black text-emerald-400">
                                    {sessionHistory.length > 0
                                        ? ((sessionHistory.filter(h => h.isCorrect).length / sessionHistory.length) * 100).toFixed(0)
                                        : "0"}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;
