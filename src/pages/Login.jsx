import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Shield, User, Lock, ArrowLeft, Loader2 } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const themeColor = 'blue';

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Mock authentication delay
        setTimeout(() => {
            if (email && password) {
                login();
                navigate('/assistant');
            } else {
                setError('Please enter valid neural credentials.');
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">

            {/* Background Decorative Blur */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-${themeColor}-50/50 rounded-full blur-[120px] pointer-events-none`} />

            <div className="w-full max-w-md z-10">
                <div className={`bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-2xl shadow-${themeColor}-100/50`}>
                    <div className="text-center mb-10">
                        <div className={`w-16 h-16 bg-${themeColor}-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-${themeColor}-200`}>
                            <Brain className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                            Student Neural Link
                        </h2>
                        <p className="text-slate-400 font-medium text-sm italic">
                            Authenticate your cognitive profile
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity UID (Email)</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="uid@cognipath.ai"
                                    className={`w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-${themeColor}-500/20 focus:border-${themeColor}-500 transition-all`}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Neural Key (Password)</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-${themeColor}-500/20 focus:border-${themeColor}-500 transition-all`}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs font-bold text-center animate-bounce">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-${themeColor}-600 text-white rounded-2xl py-4 font-black uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Synchronizing...
                                </>
                            ) : (
                                'Initiate Session'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <a href="#" className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors">
                            Forgot neural key?
                        </a>
                    </div>
                </div>

                <p className="mt-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    End-to-End Encrypted Neural Link
                </p>
            </div>
        </div>
    );
};

export default Login;
