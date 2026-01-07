'use client';

import { useState, useEffect } from 'react';
import { Trophy, ArrowRight, X, BrainCircuit, Wallet } from 'lucide-react';
import clsx from 'clsx';
import { useGameStore, ZONES } from '@/stores/useGameStore';

interface MathGateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MathGateModal = ({ isOpen, onClose }: MathGateModalProps) => {
    const { money, currentZone, advanceZone } = useGameStore();
    const [question, setQuestion] = useState({ a: 0, b: 0, op: '+' });
    const [answer, setAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const nextZoneIdx = currentZone + 1;
    const nextZone = ZONES[nextZoneIdx];

    useEffect(() => {
        if (isOpen) {
            generateQuestion();
            setAnswer('');
            setIsCorrect(null);
        }
    }, [isOpen]);

    const generateQuestion = () => {
        // Simple Math for kids (Result <= 10)
        const op = Math.random() > 0.5 ? '+' : '-';
        let a, b;

        if (op === '+') {
            a = Math.floor(Math.random() * 6); // 0-5
            b = Math.floor(Math.random() * (11 - a)); // so sum <= 10
        } else {
            a = Math.floor(Math.random() * 10) + 1; // 1-10
            b = Math.floor(Math.random() * (a + 1)); // <= a
        }
        setQuestion({ a, b, op });
    };

    const handleAnswer = (val: number) => {
        const correct = question.op === '+' ? question.a + question.b : question.a - question.b;
        if (val === correct) {
            setIsCorrect(true);
            setTimeout(() => {
                const success = advanceZone();
                if (success) {
                    onClose();
                }
            }, 1000);
        } else {
            setIsCorrect(false);
            setAnswer('');
            setTimeout(() => setIsCorrect(null), 1000);
        }
    };

    if (!isOpen || !nextZone) return null;

    const canAfford = money >= nextZone.unlockCost;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border-8 border-indigo-500 overflow-hidden relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={32} />
                </button>

                <div className="bg-indigo-100 p-6 text-center border-b-4 border-indigo-200">
                    <h2 className="text-3xl font-black text-indigo-600 mb-2">DALŠÍ SVĚT</h2>
                    <p className="font-bold text-gray-600">Postup do zóny: {nextZone.name}</p>

                    <div className="flex justify-center gap-4 mt-4 text-sm font-bold opacity-75">
                        <span className="bg-yellow-200 px-2 py-1 rounded text-yellow-800">Ceny: {nextZone.costMultiplier}x</span>
                        <span className="bg-green-200 px-2 py-1 rounded text-green-800">Příjem: {nextZone.incomeMultiplier}x</span>
                    </div>
                </div>

                <div className="p-8 flex flex-col items-center gap-6">
                    {/* Cost Check */}
                    <div className={clsx("flex items-center gap-3 text-2xl font-black px-6 py-3 rounded-full border-4 shadow-sm transition-all",
                        canAfford ? "bg-green-100 text-green-600 border-green-300" : "bg-red-100 text-red-500 border-red-300"
                    )}>
                        <Wallet size={32} />
                        {nextZone.unlockCost}
                    </div>

                    {!canAfford ? (
                        <p className="text-center font-bold text-gray-400">Nemáš dost peněz!</p>
                    ) : (
                        <div className="w-full flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-indigo-500 font-bold mb-2">
                                <BrainCircuit />
                                <span>Vypočítej pro postup:</span>
                            </div>

                            {/* Question */}
                            <div className="text-6xl font-black text-gray-800 bg-gray-100 px-8 py-4 rounded-2xl border-b-4 border-gray-300">
                                {question.a} {question.op} {question.b} = ?
                            </div>

                            {/* Number Pad for answering */}
                            <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handleAnswer(num)}
                                        className={clsx(
                                            "aspect-square rounded-xl text-2xl font-black shadow-cartoon transition-transform active:scale-95 border-b-4",
                                            isCorrect === false ? "bg-red-200 text-red-600 border-red-400" :
                                                isCorrect === true ? "bg-green-400 text-white border-green-600" :
                                                    "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100"
                                        )}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
