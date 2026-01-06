import { FC } from 'react';
import { useGameStore, ANIMALS } from '@/stores/useGameStore';
import Image from 'next/image';
import { X, Lock } from 'lucide-react';
import clsx from 'clsx';

interface EncyclopediaModalProps {
    onClose: () => void;
}

export const EncyclopediaModal: FC<EncyclopediaModalProps> = ({ onClose }) => {
    const { level, placedAnimals } = useGameStore();

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#fdf6e3] w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl border-8 border-[#8b4513] flex flex-col overflow-hidden animate-in zoom-in duration-300 relative">

                {/* Header */}
                <div className="bg-[#8b4513] p-4 flex justify-between items-center shadow-lg z-10">
                    <div className="flex items-center gap-3">
                        <Image src="/assets/icon_book.png" alt="Encyclopedia" width={48} height={48} />
                        <h2 className="text-3xl font-black text-[#fdf6e3] tracking-wider">ZVÍŘECÍ ENCYKLOPEDIE</h2>
                    </div>
                    <button onClick={onClose} className="bg-[#5e2f0d] hover:bg-[#4a250a] text-[#fdf6e3] p-2 rounded-full transition-colors">
                        <X size={32} />
                    </button>
                </div>

                {/* Content - Book Pages Look */}
                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-amber-50">
                    {Object.values(ANIMALS).map((animal) => {
                        if (animal.isDecoration) return null; // Skip decorations

                        const hasPlaced = placedAnimals.some(p => p.animalType === animal.type);
                        const isUnlocked = level >= animal.unlockLevel;

                        return (
                            <div
                                key={animal.id}
                                className={clsx(
                                    "relative bg-white p-4 rounded-xl shadow-md border-2 transform transition-all hover:scale-102 flex flex-col gap-3",
                                    hasPlaced ? "border-[#8b4513] opacity-100 rotate-1" : "border-gray-300 opacity-70 grayscale",
                                    !isUnlocked && "opacity-50 blur-[1px]"
                                )}
                            >
                                {/* Photo / Image */}
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                                    <Image
                                        src={animal.imageUrl}
                                        alt={animal.name}
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-contain"
                                    />
                                    {!hasPlaced && isUnlocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-center p-2">
                                            <span className="bg-yellow-200 text-[#8b4513] px-2 py-1 rounded font-bold text-xs shadow-sm">
                                                Postav zvířátko pro odemčení informací!
                                            </span>
                                        </div>
                                    )}
                                    {!isUnlocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <Lock className="text-gray-600 w-12 h-12" />
                                        </div>
                                    )}
                                </div>

                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-black text-[#8b4513]">{animal.name}</h3>
                                    {hasPlaced && (
                                        <div className="flex gap-2">
                                            {animal.diet && (
                                                <div className="w-8 h-8 p-1 bg-gray-100 rounded-full border border-gray-300" title={animal.diet === 'carnivore' ? 'Masožravec' : 'Býložravec'}>
                                                    <Image
                                                        src={animal.diet === 'carnivore' || animal.diet === 'omnivore' ? '/assets/icon_meat.png' : '/assets/icon_leaf.png'}
                                                        alt="Diet"
                                                        width={32}
                                                        height={32}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Facts */}
                                {hasPlaced ? (
                                    <div className="bg-[#fff9e6] p-3 rounded-lg border border-[#f3e5ab]">
                                        <p className="text-sm font-serif italic text-gray-700">
                                            &quot;{animal.funFact || "Tohle zvířátko je tajemné..."}&quot;
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 h-16 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">???</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
