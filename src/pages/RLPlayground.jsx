import React, { useState, useEffect, useCallback } from 'react';
import {
    Play,
    RotateCcw,
    Settings,
    Zap,
    Activity,
    ChevronRight,
    BrainCircuit
} from 'lucide-react';

const GRID_SIZE = 5;
const GOAL_POS = { x: 4, y: 0 };
const START_POS = { x: 0, y: 4 };

// RL Hyperparameters
const ALPHA = 0.1;
const GAMMA = 0.9;
const EPSILON = 0.2;

const RLPlayground = () => {
    const [agentPos, setAgentPos] = useState(START_POS);
    const [qTable, setQTable] = useState({});
    const [episodes, setEpisodes] = useState(0);
    const [isTraining, setIsTraining] = useState(false);

    const getQ = (x, y, action) => qTable[`${x},${y}`]?.[action] || 0;

    const updateQ = (x, y, action, reward, nextX, nextY) => {
        const actions = ['up', 'down', 'left', 'right'];
        const maxNextQ = Math.max(...actions.map(a => getQ(nextX, nextY, a)));
        const currentQ = getQ(x, y, action);

        const newQ = currentQ + ALPHA * (reward + GAMMA * maxNextQ - currentQ);

        setQTable(prev => ({
            ...prev,
            [`${x},${y}`]: {
                ...(prev[`${x},${y}`] || {}),
                [action]: newQ
            }
        }));
    };

    const runStep = useCallback(() => {
        const { x, y } = agentPos;
        const actions = ['up', 'down', 'left', 'right'];

        // Epsilon-greedy
        let action;
        if (Math.random() < EPSILON) {
            action = actions[Math.floor(Math.random() * actions.length)];
        } else {
            action = actions.reduce((a, b) => getQ(x, y, a) > getQ(x, y, b) ? a : b);
        }

        let nextX = x;
        let nextY = y;
        if (action === 'up' && y > 0) nextY--;
        if (action === 'down' && y < GRID_SIZE - 1) nextY++;
        if (action === 'left' && x > 0) nextX--;
        if (action === 'right' && x < GRID_SIZE - 1) nextX++;

        const reward = (nextX === GOAL_POS.x && nextY === GOAL_POS.y) ? 100 : -1;
        updateQ(x, y, action, reward, nextX, nextY);

        if (nextX === GOAL_POS.x && nextY === GOAL_POS.y) {
            setAgentPos(START_POS);
            setEpisodes(e => e + 1);
        } else {
            setAgentPos({ x: nextX, y: nextY });
        }
    }, [agentPos, qTable]);

    useEffect(() => {
        let interval;
        if (isTraining) {
            interval = setInterval(runStep, 50);
        }
        return () => clearInterval(interval);
    }, [isTraining, runStep]);

    const reset = () => {
        setQTable({});
        setEpisodes(0);
        setAgentPos(START_POS);
        setIsTraining(false);
    };

    const qValuesAll = Object.values(qTable).flatMap(s => Object.values(s));
    const maxIntensityGlobal = qValuesAll.length > 0 ? Math.max(...qValuesAll) : 0;
    const stabilityValue = Math.min(100, (maxIntensityGlobal / 50) * 100);

    return (
        <div className="space-y-8 max-w-5xl mx-auto py-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <BrainCircuit className="w-8 h-8 text-indigo-600" /> RL Playground
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Mini self-learning agent simulation</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Episodes: {episodes}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* The Grid Environment */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
                    <div className="grid grid-cols-5 gap-3 aspect-square max-w-md mx-auto">
                        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                            const x = i % GRID_SIZE;
                            const y = Math.floor(i / GRID_SIZE);
                            const isAgent = agentPos.x === x && agentPos.y === y;
                            const isGoal = GOAL_POS.x === x && GOAL_POS.y === y;

                            // Visualize max Q-value intensity
                            const qVals = qTable[`${x},${y}`] || {};
                            const maxQ = Object.values(qVals).length > 0 ? Math.max(...Object.values(qVals)) : 0;
                            const intensity = Math.min(100, (maxQ / 50) * 100);

                            return (
                                <div
                                    key={i}
                                    className={`
                                        relative rounded-xl border-2 transition-all duration-300 flex items-center justify-center
                                        ${isAgent ? 'border-indigo-500 shadow-lg shadow-indigo-200 translate-y-[-2px]' : 'border-slate-50'}
                                    `}
                                    style={{
                                        backgroundColor: isGoal ? '#10b981' : (intensity > 0 ? `rgba(79, 70, 229, ${intensity / 100})` : '#f8fafc')
                                    }}
                                >
                                    {isAgent && (
                                        <div className="w-8 h-8 bg-indigo-600 rounded-lg shadow-inner animate-pulse" />
                                    )}
                                    {isGoal && <Zap className="w-6 h-6 text-white" />}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Controls & Metrics */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Settings className="w-4 h-4 text-white" /> Controller
                        </h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => setIsTraining(!isTraining)}
                                className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${isTraining ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20'}`}
                            >
                                {isTraining ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                {isTraining ? 'Stop Training' : 'Run Experiment'}
                            </button>
                            <button
                                onClick={reset}
                                className="w-full py-4 border-2 border-white/10 hover:bg-white/5 rounded-2xl font-bold text-slate-300 transition-all flex items-center justify-center gap-3"
                            >
                                <RotateCcw className="w-4 h-4" /> Reset Brain
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-5 h-5 text-emerald-500" />
                            <h4 className="font-bold text-slate-800">Learning Convergence</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                <span>Policy Stability</span>
                                <span className="text-slate-900">{stabilityValue >= 80 ? 'HIGH' : stabilityValue >= 40 ? 'MED' : 'LOW'}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (episodes / 50) * 100)}%` }}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                            The agent is learning a path from the bottom-left to the top-right using Q-Learning. Blue intensity indicates "Confidence" in a state.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RLPlayground;
