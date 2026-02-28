import React, { useState, useEffect } from 'react';
import { useLearner, QUESTION_BANK, CONCEPTS } from '../context/LearnerContext';
import { Zap, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';

const TrainingCenter = () => {
    const { mastery, theta, updateLearnerState, recommendNextAction } = useLearner();
    const [currentQuestion, setCurrentQuestion] = useState(() => {
        const initialConcept = recommendNextAction();
        return QUESTION_BANK.find(q => q.concept === initialConcept) || QUESTION_BANK[0];
    });
    const [selectedOption, setSelectedOption] = useState(null);
    const [confidence, setConfidence] = useState(3);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [feedback, setFeedback] = useState(null);

    const handleAnswerSubmit = () => {
        if (selectedOption === null) return;
        const isCorrect = selectedOption === currentQuestion.correct;
        const latencyMs = Date.now() - questionStartTime;

        setFeedback({
            isCorrect,
            text: isCorrect ? 'Correct! Mastery increased.' : 'Incorrect. Updating trajectory.'
        });

        setTimeout(() => {
            updateLearnerState(currentQuestion.concept, isCorrect, latencyMs, currentQuestion.estTime, currentQuestion.beta, currentQuestion.alpha, confidence);

            // Fetch next concept AFTER state update (it will use fresh state from closure/context)
            const nextConceptId = recommendNextAction();
            const available = QUESTION_BANK.filter(q => q.concept === nextConceptId);
            const nextQ = available.length > 0
                ? available.sort((a, b) => Math.abs(a.beta - theta) - Math.abs(b.beta - theta))[0]
                : QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];

            setCurrentQuestion(nextQ);
            setSelectedOption(null);
            setConfidence(3);
            setFeedback(null);
            setQuestionStartTime(Date.now());
        }, 800);
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" /> Cognitive Drill
                    </h2>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 border border-slate-200">
                        Difficulty β: {currentQuestion.beta.toFixed(2)}
                    </span>
                </div>

                <div className="mb-6 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full mb-4">
                        {CONCEPTS.find(c => c.id === currentQuestion.concept)?.label || currentQuestion.concept}
                    </span>
                    <p className="text-2xl font-semibold text-slate-800 leading-tight px-4">
                        {currentQuestion.text}
                    </p>
                </div>

                <div className="space-y-3 mt-4">
                    {currentQuestion.options.map((opt, idx) => (
                        <button
                            key={idx}
                            disabled={feedback !== null}
                            onClick={() => setSelectedOption(idx)}
                            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 font-medium
                ${selectedOption === idx
                                    ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.01]'
                                    : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                                }
                ${feedback !== null && idx === currentQuestion.correct ? 'border-green-500 bg-green-50' : ''}
                ${feedback !== null && selectedOption === idx && idx !== currentQuestion.correct ? 'border-red-500 bg-red-50' : ''}
              `}
                        >
                            <span className="font-mono mr-4 text-slate-400">{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                        </button>
                    ))}
                </div>

                {selectedOption !== null && feedback === null && (
                    <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                                How confident are you?
                            </label>
                            <span className="text-lg font-bold text-blue-600 font-mono">{confidence} / 5</span>
                        </div>
                        <input
                            type="range" min="1" max="5" step="1"
                            value={confidence}
                            onChange={(e) => setConfidence(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase">
                            <span>Guessing</span>
                            <span>Certain</span>
                        </div>
                    </div>
                )}

                <div className="mt-10">
                    {feedback ? (
                        <div className={`p-4 rounded-xl flex items-center justify-center gap-3 animate-bounce ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {feedback.isCorrect ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            <span className="font-bold">{feedback.text}</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleAnswerSubmit}
                            disabled={selectedOption === null}
                            className="w-full py-4 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-3 shadow-lg shadow-slate-200"
                        >
                            Verify Response <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainingCenter;
