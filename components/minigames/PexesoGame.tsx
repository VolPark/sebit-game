'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Trophy, PawPrint } from 'lucide-react';
import clsx from 'clsx';
import { ANIMALS, AnimalType } from '@/stores/useGameStore';

interface Card {
    id: number;
    type: string; // AnimalType | 'coin'
    imageUrl: string;
    isFlipped: boolean;
    isMatched: boolean;
}

interface PexesoGameProps {
    onClose: () => void;
    onComplete: (reward: number) => void;
}

export default function PexesoGame({ onClose, onComplete }: PexesoGameProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [isWon, setIsWon] = useState(false);

    // Initialize Game
    useEffect(() => {
        const types: { type: string, img: string }[] = [
            { type: 'dog', img: ANIMALS['dog'].imageUrl },
            { type: 'cat', img: ANIMALS['cat'].imageUrl },
            { type: 'elephant', img: ANIMALS['elephant'].imageUrl },
            { type: 'lion', img: ANIMALS['lion'].imageUrl },
            { type: 'penguin', img: ANIMALS['penguin'].imageUrl },
            { type: 'coin', img: '/assets/coin.png' } // 6th pair
        ];

        // Create pairs
        let initialCards: Card[] = [];
        types.forEach((item, index) => {
            // Add two cards for each type
            initialCards.push({ id: index * 2, type: item.type, imageUrl: item.img, isFlipped: false, isMatched: false });
            initialCards.push({ id: index * 2 + 1, type: item.type, imageUrl: item.img, isFlipped: false, isMatched: false });
        });

        // Shuffle
        initialCards.sort(() => Math.random() - 0.5);
        setCards(initialCards);
    }, []);

    const handleCardClick = (index: number) => {
        if (isChecking || cards[index].isFlipped || cards[index].isMatched) return;

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setIsChecking(true);
            checkForMatch(newFlipped[0], newFlipped[1]);
        }
    };

    const checkForMatch = (idx1: number, idx2: number) => {
        const card1 = cards[idx1];
        const card2 = cards[idx2];

        if (card1.type === card2.type) {
            // Match!
            setTimeout(() => {
                setCards(prev => prev.map((c, i) =>
                    i === idx1 || i === idx2 ? { ...c, isMatched: true } : c
                ));
                setFlippedIndices([]);
                setIsChecking(false);
                checkWinCondition();
            }, 500);
        } else {
            // No Match
            setTimeout(() => {
                setCards(prev => prev.map((c, i) =>
                    i === idx1 || i === idx2 ? { ...c, isFlipped: false } : c
                ));
                setFlippedIndices([]);
                setIsChecking(false);
            }, 1000);
        }
    };

    const checkWinCondition = () => {
        // We need to check the state AFTER the match update. 
        // Since setCards is async, let's just check if all but 2 are matched (because we just matched 2)
        // Or easier: use a useEffect or just check count.
        // Actually, inside checkForMatch, we know we just matched 2.

        // Let's rely on a helper or useEffect for winning.
    };

    // Check for win effect
    useEffect(() => {
        if (cards.length > 0 && cards.every(c => c.isMatched)) {
            setIsWon(true);
        }
    }, [cards]);

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-zoo-offwhite w-full max-w-lg rounded-3xl shadow-2xl border-8 border-zoo-orange p-6 relative animate-in zoom-in duration-300">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-black text-zoo-orange flex items-center gap-2">
                        <PawPrint className="text-zoo-yellow fill-current" />
                        PEXESO
                    </h2>
                    <button onClick={onClose} className="bg-gray-200 hover:bg-red-100 p-2 rounded-full text-gray-500 hover:text-red-500 transition-colors">
                        <X size={32} />
                    </button>
                </div>

                {/* Grid */}
                {!isWon ? (
                    <div className="grid grid-cols-4 gap-3 bg-orange-100 p-4 rounded-2xl border-4 border-orange-200">
                        {cards.map((card, index) => (
                            <button
                                key={card.id}
                                onClick={() => handleCardClick(index)}
                                className={clsx(
                                    "aspect-square rounded-xl shadow-sm transition-all duration-300 transform perspective-1000 relative",
                                    card.isFlipped || card.isMatched ? "rotate-y-180" : "hover:scale-105 bg-zoo-orange border-b-4 border-orange-700"
                                )}
                                disabled={card.isMatched}
                            >
                                <div className={clsx(
                                    "absolute inset-0 flex items-center justify-center backface-hidden rounded-xl",
                                    card.isFlipped || card.isMatched ? "bg-white border-4 border-zoo-yellow" : ""
                                )}>
                                    {(card.isFlipped || card.isMatched) ? (
                                        <Image src={card.imageUrl} alt={card.type} width={60} height={60} className="object-contain animate-in fade-in zoom-in" />
                                    ) : (
                                        <PawPrint className="text-white/50 w-8 h-8" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-8 animate-in zoom-in">
                        <Trophy size={80} className="text-yellow-400 mb-4 animate-bounce" />
                        <h3 className="text-4xl font-black text-zoo-text mb-2">VYHRÁL JSI!</h3>
                        <p className="text-gray-500 font-bold mb-6">Našel jsi všechny dvojice.</p>

                        <button
                            onClick={() => onComplete(500)}
                            className="bg-zoo-green text-white text-xl font-black px-8 py-4 rounded-2xl shadow-cartoon hover:shadow-cartoon-hover hover:scale-105 transition-all flex items-center gap-2 animate-pulse"
                        >
                            <Image src="/assets/coin.png" alt="coin" width={32} height={32} />
                            ZÍSKAT 500
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
