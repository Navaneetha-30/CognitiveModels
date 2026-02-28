import React from 'react';
import { useLearner, CONCEPTS, TRANSITIONS } from '../context/LearnerContext';
import { Map, Info } from 'lucide-react';

const NeuralRoadmap = () => {
    const { mastery } = useLearner();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Neural Roadmap</h1>
                    <p className="text-slate-500 font-medium">Visualization of the adaptive learning graph</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl text-blue-600 text-xs font-bold border border-blue-100 italic">
                    <Info className="w-4 h-4" /> RE-OPTIMIZING GRAPH TOPOLOGY...
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <div className="relative w-full h-[500px] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 500 300" className="absolute inset-0">
                        {/* Edges */}
                        {TRANSITIONS.map((link, i) => {
                            const src = CONCEPTS.find(c => c.id === link.source);
                            const tgt = CONCEPTS.find(c => c.id === link.target);
                            return (
                                <line
                                    key={i}
                                    x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                                    stroke="#cbd5e1" strokeWidth={1 + link.weight * 3}
                                    strokeDasharray={link.weight < 0.5 ? "4,4" : "none"}
                                    className="transition-all duration-1000"
                                    opacity={0.6}
                                />
                            );
                        })}

                        {/* Nodes */}
                        {CONCEPTS.map((node) => {
                            const mVal = mastery[node.id]?.value || 0;
                            const r = 24 + (mVal * 20);

                            const rCol = Math.round(255 * (1 - mVal));
                            const gCol = Math.round(200 * mVal + 50);
                            const fillStr = `rgb(${rCol}, ${gCol}, 80)`;

                            return (
                                <g key={node.id} className="transition-all duration-1000 ease-in-out cursor-pointer" style={{ transform: `translate(${node.x}px, ${node.y}px)` }}>
                                    <circle
                                        r={r}
                                        fill={fillStr}
                                        stroke="#ffffff"
                                        strokeWidth="3"
                                        className="shadow-xl"
                                    />
                                    <text y={r + 20} textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155" className="drop-shadow-sm uppercase tracking-tighter">
                                        {node.label}
                                    </text>
                                    <text y={5} textAnchor="middle" fontSize="11" fontWeight="black" fill="#ffffff">
                                        {(mVal * 100).toFixed(0)}%
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Graph Density</p>
                        <p className="font-bold text-slate-700">0.82 Op/s</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Convergence Rate</p>
                        <p className="font-bold text-slate-700">92.4% Optimal</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Policy Type</p>
                        <p className="font-bold text-slate-700">REINFORCEMENT LEARNING</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralRoadmap;
