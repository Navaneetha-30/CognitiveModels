import React, { createContext, useContext, useState, useEffect } from 'react';

const LearnerContext = createContext();

export const useLearner = () => useContext(LearnerContext);

// --- MOCK DATABASE ---
export const CONCEPTS = [
    { id: 'algebra_basics', label: 'Algebra Basics', x: 100, y: 120 },
    { id: 'geometry_triangles', label: 'Geometry', x: 280, y: 80 },
    { id: 'calculus_limits', label: 'Calculus', x: 240, y: 220 },
    { id: 'statistics_prob', label: 'Statistics', x: 420, y: 150 }
];

export const TRANSITIONS = [
    { source: 'algebra_basics', target: 'geometry_triangles', weight: 0.8 },
    { source: 'algebra_basics', target: 'calculus_limits', weight: 0.6 },
    { source: 'geometry_triangles', target: 'statistics_prob', weight: 0.4 },
    { source: 'calculus_limits', target: 'statistics_prob', weight: 0.7 }
];

export const QUESTION_BANK = [
    { id: 'q1', concept: 'algebra_basics', text: 'Solve for x: 2x + 5 = 13', options: ['2', '4', '6', '8'], correct: 1, beta: -1.0, alpha: 1.2, estTime: 15 },
    { id: 'q2', concept: 'algebra_basics', text: 'Evaluate: 3(x - 2) when x = 5', options: ['6', '9', '12', '15'], correct: 1, beta: -0.5, alpha: 1.0, estTime: 15 },
    { id: 'q3', concept: 'geometry_triangles', text: 'Find the hypotenuse of a right triangle with legs 3 and 4.', options: ['5', '6', '7', '8'], correct: 0, beta: 0.0, alpha: 1.5, estTime: 20 },
    { id: 'q4', concept: 'geometry_triangles', text: 'Sum of interior angles of a triangle?', options: ['90', '180', '270', '360'], correct: 1, beta: -1.5, alpha: 0.8, estTime: 10 },
    { id: 'q5', concept: 'calculus_limits', text: 'Limit of sin(x)/x as x approaches 0', options: ['0', '1', 'Infinity', 'Undefined'], correct: 1, beta: 1.2, alpha: 1.8, estTime: 30 },
    { id: 'q6', concept: 'calculus_limits', text: 'Derivative of x^2', options: ['x', '2x', 'x^2', '2'], correct: 1, beta: 0.5, alpha: 1.4, estTime: 20 },
    { id: 'q7', concept: 'statistics_prob', text: 'Probability of rolling a 6 on a fair die?', options: ['1/2', '1/4', '1/6', '1/12'], correct: 2, beta: -0.2, alpha: 1.1, estTime: 15 },
    { id: 'q8', concept: 'statistics_prob', text: 'What is the median of [1, 3, 3, 6, 7, 8, 9]?', options: ['3', '6', '7', '5.5'], correct: 1, beta: 0.8, alpha: 1.3, estTime: 25 },
];

// --- MATHEMATICAL COGNITIVE ENGINES ---

// Ebbinghaus Forgetting Curve: R = exp(-t / S)
// t: time since last review (ms), S: Stability/Strength
export const computeRetention = (lastReview, strength) => {
    if (!lastReview) return 1.0;
    const t = (Date.now() - lastReview) / (1000 * 60 * 60 * 24); // t in days
    const s = strength || 2.0; // Default stability of 2 days
    return Math.exp(-t / s);
};

// Spaced Repetition Stability Update
const computeStability = (currentStrength, isCorrect, currentRetention) => {
    const s = currentStrength || 2.0;
    if (isCorrect) {
        // Successful review increases stability (factor of 1.5 - 2.5)
        return s * (1.0 + 1.5 * currentRetention);
    } else {
        // Failed review resets stability but keeps some 'base' memory
        return Math.max(1.0, s * 0.4);
    }
};

const computeBKT = (p_l, correct) => {
    const p_t = 0.15;
    const p_g = 0.20;
    const p_s = 0.10;
    let p_l_ev = correct
        ? (p_l * (1 - p_s)) / (p_l * (1 - p_s) + (1 - p_l) * p_g)
        : (p_l * p_s) / (p_l * p_s + (1 - p_l) * (1 - p_g));
    let p_l_new = p_l_ev + (1 - p_l_ev) * p_t;
    return Math.max(0.01, Math.min(0.99, p_l_new));
};

// 2-Parameter Logistic (2PL) IRT Model
// theta: Ability, beta: Difficulty, alpha: Discrimination, correct: Boolean
const computeIRT = (theta, beta, alpha, correct) => {
    const a = alpha || 1.0;
    const p = 1.0 / (1.0 + Math.exp(-a * (theta - beta)));

    // Likelihood gradient for 2PL
    const gradient = a * ((correct ? 1 : 0) - p);

    // Observed Information (Negative Hessian)
    const information = a * a * p * (1.0 - p);

    // Newton-Raphson Update: new_theta = old_theta + gradient/information
    // We add a small damping factor (0.1) to prevent wild swings in small datasets
    let newTheta = theta + (gradient / (information + 0.1));

    return Math.max(-4.0, Math.min(4.0, newTheta));
};

const inferCognitiveState = (latencies, accuracies, currentEstTime) => {
    if (latencies.length < 3) return 'normal';
    const recentAcc = accuracies.slice(-3).reduce((a, b) => a + (b ? 1 : 0), 0);
    const recentLat = latencies[latencies.length - 1];
    const avgLat = latencies.slice(0, -1).reduce((a, b) => a + b, 0) / (latencies.length - 1);
    if (recentAcc === 0 && latencies.length >= 4) return 'fatigue';
    if (recentLat > avgLat * 2.0 && recentLat > currentEstTime * 1000) return 'overload';
    if (recentLat < 2000 && !accuracies[accuracies.length - 1]) return 'frustration';
    return 'normal';
};

// --- RL POLICY ENGINE (Q-LEARNING) ---
const ALPHA = 0.1;
const GAMMA = 0.9;
const EPSILON = 0.1;

const discretize = (val) => {
    if (val < 0.4) return 'L';
    if (val < 0.8) return 'M';
    return 'H';
};

const discretizeState = (mastery, cogState) => {
    const mKeys = Object.keys(mastery).sort().map(k => discretize(mastery[k].value)).join('_');
    return `${mKeys}_${cogState}`;
};

export const LearnerProvider = ({ children }) => {
    const [mastery, setMastery] = useState(() => {
        const saved = localStorage.getItem('cognipath_mastery');
        return saved ? JSON.parse(saved) : {
            algebra_basics: { value: 0.2, lastReview: Date.now(), strength: 2.0 },
            geometry_triangles: { value: 0.1, lastReview: Date.now(), strength: 1.5 },
            calculus_limits: { value: 0.05, lastReview: Date.now(), strength: 1.0 },
            statistics_prob: { value: 0.05, lastReview: Date.now(), strength: 1.0 }
        };
    });
    const [theta, setTheta] = useState(() => {
        const saved = localStorage.getItem('cognipath_theta');
        return saved ? JSON.parse(saved) : 0.0;
    });
    const [cognitiveState, setCognitiveState] = useState('normal');
    const [latencies, setLatencies] = useState([]);
    const [accuracies, setAccuracies] = useState([]);
    const [confidenceScores, setConfidenceScores] = useState(() => {
        const saved = localStorage.getItem('cognipath_confidence');
        return saved ? JSON.parse(saved) : {
            algebra_basics: [], geometry_triangles: [], calculus_limits: [], statistics_prob: []
        };
    });
    const [qTable, setQTable] = useState(() => {
        const saved = localStorage.getItem('cognipath_qtable');
        return saved ? JSON.parse(saved) : {};
    });
    const [sessionHistory, setSessionHistory] = useState(() => {
        const saved = localStorage.getItem('cognipath_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cognipath_qtable', JSON.stringify(qTable));
        localStorage.setItem('cognipath_mastery', JSON.stringify(mastery));
        localStorage.setItem('cognipath_theta', JSON.stringify(theta));
        localStorage.setItem('cognipath_history', JSON.stringify(sessionHistory));
        localStorage.setItem('cognipath_confidence', JSON.stringify(confidenceScores));
    }, [qTable, mastery, theta, sessionHistory, confidenceScores]);

    const updateQTable = (state, action, reward, nextState) => {
        setQTable(prev => {
            const currentQ = (prev[state] && prev[state][action]) || 0;
            const nextStateValues = prev[nextState] || {};
            const vals = Object.values(nextStateValues);
            const maxNextQ = vals.length > 0 ? Math.max(...vals) : 0;

            const newQ = currentQ + ALPHA * (reward + GAMMA * maxNextQ - currentQ);

            return {
                ...prev,
                [state]: {
                    ...(prev[state] || {}),
                    [action]: newQ
                }
            };
        });
    };

    const recommendNextAction = () => {
        const state = discretizeState(mastery, cognitiveState);
        const actions = CONCEPTS.map(c => c.id);

        if (Math.random() < EPSILON) {
            return actions[Math.floor(Math.random() * actions.length)];
        }

        const stateValues = qTable[state] || {};
        let bestAction = actions[0];
        let maxQ = -Infinity;

        actions.forEach(a => {
            const q = stateValues[a] || 0;
            if (q > maxQ) {
                maxQ = q;
                bestAction = a;
            }
        });

        return bestAction;
    };

    const updateLearnerState = (conceptId, isCorrect, latencyMs, estTime, beta, alpha, confidence) => {
        const newLatencies = [...latencies, latencyMs].slice(-5);
        const newAccuracies = [...accuracies, isCorrect].slice(-5);

        // 1. Retention & Stability Logic
        const currentM = mastery[conceptId];
        const retentionAtReview = computeRetention(currentM.lastReview, currentM.strength);
        const newStrength = computeStability(currentM.strength, isCorrect, retentionAtReview);

        // 2. BKT/IRT Logic
        const newConceptValue = computeBKT(currentM.value, isCorrect);
        const newMasteryState = {
            ...mastery,
            [conceptId]: {
                value: newConceptValue,
                lastReview: Date.now(),
                strength: newStrength
            }
        };

        const newTheta = computeIRT(theta, beta, alpha, isCorrect);
        const newCogState = inferCognitiveState(newLatencies, newAccuracies, estTime);

        // 3. RL Update
        const prevState = discretizeState(mastery, cognitiveState);
        const nextState = discretizeState(newMasteryState, newCogState);

        const masteryGain = newConceptValue - currentM.value;
        const cogPenalty = newCogState !== 'normal' ? -0.5 : 0;
        const reward = (isCorrect ? 1 : -0.5) + (masteryGain * 10) + cogPenalty;

        updateQTable(prevState, conceptId, reward, nextState);

        // 4. Confidence Logic
        if (confidence) {
            setConfidenceScores(prev => ({
                ...prev,
                [conceptId]: [...(prev[conceptId] || []), confidence].slice(-10)
            }));
        }

        setLatencies(newLatencies);
        setAccuracies(newAccuracies);
        setMastery(newMasteryState);
        setTheta(newTheta);
        setCognitiveState(newCogState);
        setSessionHistory(prev => [...prev, { conceptId, isCorrect, latencyMs, confidence, timestamp: Date.now() }]);
    };

    return (
        <LearnerContext.Provider value={{
            mastery, theta, cognitiveState, sessionHistory, confidenceScores, qTable, updateLearnerState, recommendNextAction
        }}>
            {children}
        </LearnerContext.Provider>
    );
};
