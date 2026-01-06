import { FC, useState, useEffect } from 'react';
import { useGameStore, ANIMALS } from '@/stores/useGameStore';
import Image from 'next/image';
import { X, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

interface QuizModalProps {
    onClose: () => void;
    onReward: (amount: number, xp: number) => void;
}

export const QuizModal: FC<QuizModalProps> = ({ onClose, onReward }) => {
    const { placedAnimals } = useGameStore();
    const [currentQuestion, setCurrentQuestion] = useState<{ question: string, options: string[], correctAnswer: number, reward: number } | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        // 1. Find all unlockable questions from PLACED animals
        const availableQuestions: any[] = [];

        // Filter unique animal types placed
        const uniqueTypes = Array.from(new Set(placedAnimals.map(p => p.animalType)));

        uniqueTypes.forEach(type => {
            const animal = ANIMALS[type];
            if (animal.quizQuestions) {
                animal.quizQuestions.forEach(q => {
                    availableQuestions.push({ ...q, reward: animal.xpReward * 5 }); // Big reward!
                });
            }
        });

        if (availableQuestions.length > 0) {
            const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
            setCurrentQuestion(randomQ);
        } else {
            // Fallback if no animals placed yet? Or just one generic question
            setCurrentQuestion({
                question: "Uvítejte v ZOO! Jaké zvířátko si pořídíš jako první?",
                options: ["Pejska", "Kočičku", "Drak"],
                correctAnswer: 0,
                reward: 100
            });
        }
    }, [placedAnimals]);

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return; // Prevent double click
        setSelectedAnswer(index);

        if (currentQuestion && index === currentQuestion.correctAnswer) {
            setIsCorrect(true);
            setTimeout(() => {
                onReward(currentQuestion.reward, currentQuestion.reward / 2); // Money, XP
                // Close is handled by parent or auto after reward? 
                // Let's wait a bit then close
            }, 1000);
        } else {
            setIsCorrect(false);
        }
    };

    if (!currentQuestion) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-8 border-zoo-blue flex flex-col overflow-hidden animate-in zoom-in duration-300 relative">

                {/* Owl Character Header */}
                <div className="bg-zoo-blue p-6 flex flex-col items-center relative overflow-visible">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
                        <X size={24} />
                    </button>

                    <div className="w-32 h-32 bg-white rounded-full border-4 border-yellow-400 flex items-center justify-center shadow-lg mb-4 absolute -top-16 shadow-cartoon">
                        <Image src="/assets/icon_owl.png" alt="Owl" width={100} height={100} className="object-contain" />
                    </div>

                    <div className="mt-12 text-center text-white">
                        <h2 className="text-2xl font-black mb-1">MOUDRÁ SOVA SE PTÁ!</h2>
                        <div className="bg-blue-600/50 px-4 py-1 rounded-full text-sm font-bold border border-blue-400">
                            Odměna: {currentQuestion.reward} <Image src="/assets/coin.png" alt="coin" width={12} height={12} className="inline ml-1" />
                        </div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="p-8 flex flex-col gap-6 bg-slate-50">
                    <h3 className="text-xl font-bold text-center text-zoo-text leading-relaxed">
                        {currentQuestion.question}
                    </h3>

                    <div className="flex flex-col gap-3">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={selectedAnswer !== null}
                                className={clsx(
                                    "p-4 rounded-xl border-4 font-bold text-lg transition-all flex items-center justify-between",
                                    selectedAnswer === null
                                        ? "bg-white border-gray-200 hover:border-zoo-blue hover:bg-blue-50 text-gray-700 shadow-sm"
                                        : selectedAnswer === idx
                                            ? (isCorrect ? "bg-green-100 border-green-500 text-green-700" : "bg-red-100 border-red-500 text-red-700")
                                            : "bg-gray-100 border-gray-200 text-gray-400 opacity-50"
                                )}
                            >
                                <span>{option}</span>
                                {selectedAnswer === idx && (
                                    isCorrect ? <CheckCircle className="text-green-600" /> : <XCircle className="text-red-500" />
                                )}
                            </button>
                        ))}
                    </div>

                    {isCorrect === false && (
                        <div className="text-center text-red-500 font-bold animate-pulse">
                            To není správně! Zkus to příště.
                        </div>
                    )}
                    {isCorrect === true && (
                        <div className="text-center text-green-600 font-black animate-bounce">
                            SPRÁVNĚ!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
