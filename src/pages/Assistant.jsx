import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shuffle,
    Brain,
    Calculator,
    FileText,
    Gamepad2,
    Plus,
    Mic,
    AudioLines,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useLearner, CONCEPTS } from '../context/LearnerContext';


const Assistant = () => {
    const navigate = useNavigate();
    const { theta, mastery } = useLearner();
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);

    const suggestions = [
        {
            id: 'memory',
            icon: <Brain className="w-5 h-5 text-pink-500" />,
            label: 'Track memory retention',
            path: '/analytics'
        },
        {
            id: 'puzzles',
            icon: <Calculator className="w-5 h-5 text-amber-500" />,
            label: 'Generate daily math puzzles',
            path: '/training'
        },
        {
            id: 'simulator',
            icon: <Sparkles className="w-5 h-5 text-blue-500" />,
            label: 'Launch What-If Simulator',
            path: '/simulator'
        },
        {
            id: 'rl',
            icon: <Gamepad2 className="w-5 h-5 text-indigo-500" />,
            label: 'Try a mini RL experiment',
            path: '/rl-playground'
        },
    ];

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!inputValue.trim()) return;

        const currentInput = inputValue;
        const userMsg = { role: 'user', content: currentInput };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsThinking(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("API Key not found in environment variables");
            }
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Construct context-rich prompt
            const contextPrompt = `
                You are CogniPath AI, a sophisticated cognitive learning assistant.
                Current Learner Profile:
                - Global Ability (Theta): ${theta.toFixed(2)}
                - Concept Masteries: ${CONCEPTS.map(c => `${c.label}: ${(mastery[c.id]?.value * 100 || 0).toFixed(0)}%`).join(', ')}
                
                User Goal: The user is asking about their learning path or cognitive state.
                User Message: "${currentInput}"
                
                Guidelines:
                1. Be encouraging but data-driven.
                2. Reference their specific mastery levels if relevant.
                3. Keep responses concise (under 3 sentences).
                4. Highlight that you've analyzed their neural telemetry.
                5. If they ask about improving, suggest using the 'Simulator' or 'Training' pages.
            `;

            const result = await model.generateContent(contextPrompt);
            const response = await result.response;
            const text = response.text();

            const aiMsg = {
                role: 'assistant',
                content: text
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("CogniPath Gemini Error Logs:", error);
            const errorMsg = {
                role: 'assistant',
                content: `🚨 **Neural Link Failed.** \nReason: ${error.message}\n\n**Action Required:** \n1. Check if VITE_GEMINI_API_KEY is in your .env file.\n2. **Restart your Vite server** (Ctrl+C then npm run dev).\n3. Check browser console (F12) for detailed logs.`
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="flex flex-col min-h-[80vh] bg-white px-4 relative max-w-4xl mx-auto w-full">

            {/* Chat History Area */}
            <div className={`flex-grow overflow-y-auto pt-10 pb-40 space-y-6 ${messages.length === 0 ? 'flex flex-col items-center justify-center' : ''}`}>
                {messages.length === 0 ? (
                    <>
                        {/* Suggestions Header */}
                        <div className="w-full max-w-xl mb-8 flex items-center justify-between">
                            <h2 className="text-lg font-medium text-slate-500 tracking-tight">Try something new</h2>
                            <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                <Shuffle className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Suggestions List */}
                        <div className="w-full max-w-xl space-y-2">
                            {suggestions.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100/50 hover:bg-slate-50/80 transition-all group shadow-sm bg-white"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <span className="text-slate-700 font-medium tracking-tight">{item.label}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-5 rounded-3xl ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 font-medium ml-12'
                                    : 'bg-slate-50 border border-slate-100 text-slate-800 font-medium mr-12'
                                    }`}>
                                    {msg.role === 'assistant' && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CogniPath AI</p>
                                        </div>
                                    )}
                                    <p className="leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="flex justify-start animate-pulse">
                                <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl mr-12 flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" />
                                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ChatGPT-style Input Bar */}
            <div className="fixed bottom-12 left-0 right-0 w-full flex justify-center px-4 pointer-events-none">
                <form
                    onSubmit={handleSendMessage}
                    className="w-full max-w-2xl bg-white/80 backdrop-blur-2xl border border-slate-200/50 rounded-[2.5rem] p-2 flex items-center gap-2 shadow-2xl shadow-slate-200/50 pointer-events-auto"
                >
                    <button type="button" className="p-3 hover:bg-slate-50 rounded-full transition-colors bg-transparent">
                        <Plus className="w-5 h-5 text-slate-400 font-bold" />
                    </button>

                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask CogniPath..."
                        className="flex-grow bg-transparent border-none focus:ring-0 text-slate-800 font-bold placeholder:text-slate-400 py-3 px-2 text-lg"
                    />

                    <div className="flex items-center gap-1 pr-1">
                        <button type="button" className="p-3 hover:bg-slate-50 rounded-full transition-colors bg-transparent">
                            <Mic className="w-5 h-5 text-slate-400" />
                        </button>
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="p-3 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
                        >
                            <AudioLines className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Version Badge */}
            <div className="fixed bottom-4 right-4 opacity-30 select-none">
                <span className="text-[10px] font-mono text-slate-400">v5.0.0-Gemini-Live</span>
            </div>

        </div>
    );
};

export default Assistant;
