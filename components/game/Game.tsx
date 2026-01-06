'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useGameStore, ANIMALS, AnimalType, BiomeType } from '@/stores/useGameStore';
import Image from 'next/image';
import { PawPrint, X, Plus, Lock, ArrowUpCircle, Gamepad2, Droplets, Snowflake, BookOpen, GraduationCap, ArrowRight, ArrowDown } from 'lucide-react';
import clsx from 'clsx';
import PexesoGame from '../minigames/PexesoGame';
import { EncyclopediaModal } from '../education/EncyclopediaModal';
import { QuizModal } from '../education/QuizModal';

interface Visitor {
    id: number;
    x: number;
    y: number; // Float coordinates for smooth movement
    targetX: number;
    targetY: number;
    skin: 'boy' | 'girl';
}

export default function Game() {
    const { money, level, xp, happiness, missions, gridRows, gridCols, gridBiomes, addMoney, addXp, addHappiness, buyAnimal, placeAnimal, placedAnimals, completeMission, incomePerSecond, expandGrid, upgradeAnimal, changeBiome } = useGameStore();
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [selectedAnimalToPlace, setSelectedAnimalToPlace] = useState<AnimalType | null>(null);
    const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(null); // For upgrades
    const [isPexesoOpen, setIsPexesoOpen] = useState(false);

    // New Features State
    const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [isQuizReady, setIsQuizReady] = useState(false); // Owl appears randomly

    const [isTerrainMode, setIsTerrainMode] = useState(false);
    const [selectedBiomeToBuild, setSelectedBiomeToBuild] = useState<BiomeType | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Visitor System
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const visitorsRef = useRef(visitors); // TRACK LATEST VISITORS

    // Sync Ref
    useEffect(() => {
        visitorsRef.current = visitors;
    }, [visitors]);

    useEffect(() => {
        setIsMounted(true);

        // Random Quiz Timer (Every 60-120 seconds)
        const quizTimer = setInterval(() => {
            if (Math.random() > 0.3) {
                setIsQuizReady(true);
            }
        }, 60000);

        return () => clearInterval(quizTimer);
    }, []);

    // Visitor Movement & Spawning
    useEffect(() => {
        const interval = setInterval(() => {
            setVisitors(prev => {
                const maxVisitors = Math.floor(placedAnimals.length / 2) + 2 + (level * 2);
                let newVisitors = [...prev];

                // Spawn Logic
                if (newVisitors.length < maxVisitors && Math.random() > 0.9) {
                    let attempts = 0;
                    while (attempts < 10) {
                        const sX = Math.floor(Math.random() * gridCols);
                        const sY = Math.floor(Math.random() * gridRows);
                        const isOccupied = placedAnimals.some(p => p.x === sX && p.y === sY);
                        // Can spawn on Path or Grass

                        if (!isOccupied) {
                            newVisitors.push({
                                id: Math.random(),
                                x: sX,
                                y: sY,
                                targetX: sX,
                                targetY: sY,
                                skin: Math.random() > 0.5 ? 'boy' : 'girl'
                            });
                            break;
                        }
                        attempts++;
                    }
                }

                // Move Logic
                return newVisitors.map(v => {
                    const dx = v.targetX - v.x;
                    const dy = v.targetY - v.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 0.1) {
                        const currentGridX = Math.round(v.targetX);
                        const currentGridY = Math.round(v.targetY);

                        const neighbors = [
                            { x: currentGridX + 1, y: currentGridY },
                            { x: currentGridX - 1, y: currentGridY },
                            { x: currentGridX, y: currentGridY + 1 },
                            { x: currentGridX, y: currentGridY - 1 }
                        ];

                        const validNeighbors = neighbors.filter(n => {
                            if (n.x < 0 || n.x >= gridCols || n.y < 0 || n.y >= gridRows) return false;
                            return !placedAnimals.some(p => p.x === n.x && p.y === n.y);
                        });

                        // PREFER PATHS Logic
                        const pathNeighbors = validNeighbors.filter(n => (gridBiomes[`${n.x},${n.y}`] === 'path'));

                        let next;
                        if (pathNeighbors.length > 0 && Math.random() > 0.3) {
                            // 70% chance to follow path if available
                            next = pathNeighbors[Math.floor(Math.random() * pathNeighbors.length)];
                        } else if (validNeighbors.length > 0) {
                            next = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
                        }

                        if (next) {
                            return { ...v, x: currentGridX, y: currentGridY, targetX: next.x, targetY: next.y };
                        } else {
                            return { ...v, x: currentGridX, y: currentGridY };
                        }
                    }

                    const speed = 0.05;
                    return {
                        ...v,
                        x: v.x + (dx / dist) * speed,
                        y: v.y + (dy / dist) * speed
                    };
                });
            });
        }, 50);

        return () => clearInterval(interval);
    }, [gridRows, gridCols, placedAnimals, level, gridBiomes]); // Dependency on gridBiomes for path checking

    // Happiness Generation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            // Read from Ref to avoid dependency on "visitors" state
            // and avoid calling setState inside setState
            const currentVisitors = visitorsRef.current;
            let happyCount = 0;
            currentVisitors.forEach(v => {
                const gx = Math.round(v.x);
                const gy = Math.round(v.y);
                if (gridBiomes[`${gx},${gy}`] === 'path') {
                    happyCount++;
                }
            });
            if (happyCount > 0) {
                addHappiness(happyCount);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [addHappiness, gridBiomes]);

    // Active Mission Logic
    const activeMission = useMemo(() => {
        const completed = missions.find(m => m.isCompleted);
        if (completed) return completed;
        return missions[0];
    }, [missions]);

    // Game Loop (Income)
    useEffect(() => {
        const interval = setInterval(() => {
            const income = incomePerSecond();
            if (income > 0) {
                addMoney(income);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [addMoney, incomePerSecond]);

    const handleTileClick = (x: number, y: number) => {
        const placement = placedAnimals.find(p => p.x === x && p.y === y);

        // TERRAIN BUILDER MODE
        if (isTerrainMode && selectedBiomeToBuild) {
            if (placement) {
                alert("Nejdřív musíš zvířátko přesunout!");
                return;
            }
            if (!gridBiomes) return; // Safety check

            const currentBiome = gridBiomes[`${x},${y}`] || 'grass';
            if (currentBiome === selectedBiomeToBuild) return;

            const success = changeBiome(x, y, selectedBiomeToBuild);
            if (!success) {
                alert("Nemáš dost penízků na úpravu terénu!");
            }
            return;
        }

        // If placing an animal
        if (selectedAnimalToPlace) {
            const animal = ANIMALS[selectedAnimalToPlace];
            const tileKey = `${x},${y}`;
            const currentBiome = gridBiomes[tileKey] || 'grass';

            // Check Biome
            if (animal.requiredBiome && animal.requiredBiome !== currentBiome) {
                alert(`Tohle zvířátko potřebuje ${animal.requiredBiome === 'water' ? 'vodu' : 'led'}!`);
                return;
            }

            const cost = ANIMALS[selectedAnimalToPlace].cost;
            if (money >= cost) {
                const success = placeAnimal(selectedAnimalToPlace, x, y);
                if (success) {
                    setSelectedAnimalToPlace(null);
                }
            } else {
                alert("Nemáš dost penízků!");
            }
            return;
        }

        // If clicking existing placement -> Upgrade
        if (placement) {
            setSelectedPlacementId(placement.id);
            return;
        }
    };

    const handleUpgrade = () => {
        if (selectedPlacementId) {
            const success = upgradeAnimal(selectedPlacementId);
            if (success) {
                setSelectedPlacementId(null);
            } else {
                alert("Nemáš dost penízků!");
            }
        }
    };

    const selectedPlacement = useMemo(() =>
        placedAnimals.find(p => p.id === selectedPlacementId),
        [selectedPlacementId, placedAnimals]);

    if (!isMounted) return null;

    return (
        <div className="relative w-full h-screen bg-zoo-green overflow-hidden flex flex-col items-center">
            {/* HUD */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm shadow-sm">
                    <Image src="/assets/coin.png" alt="coin" width={32} height={32} className="drop-shadow-md" />
                    <span className="font-black text-2xl text-yellow-300 drop-shadow-md min-w-[3ch]">{Math.floor(money)}</span>
                </div>
                {/* Happiness Display */}
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm shadow-sm">
                    <Image src="/assets/icon_heart.png" alt="heart" width={32} height={32} className="drop-shadow-md" />
                    <span className="font-black text-2xl text-red-400 drop-shadow-md min-w-[3ch]">{Math.floor(happiness)}</span>
                </div>

                <div className="flex items-center gap-2 bg-zoo-blue/90 p-2 pr-4 rounded-full shadow-cartoon border-2 border-white text-white">
                    <div className="w-10 h-10 bg-zoo-red rounded-full flex items-center justify-center font-black border-2 border-white shadow-sm z-10">
                        {level}
                    </div>
                    <div className="flex flex-col w-32">
                        <span className="text-xs font-bold ml-1">ÚROVEŇ {level}</span>
                        <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden border border-white/30">
                            <div
                                className="h-full bg-zoo-yellow transition-all duration-500"
                                style={{ width: `${Math.min(100, (xp / (level * 100)) * 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission / Ryder's Call */}
            {activeMission && (
                <div className={clsx(
                    "absolute top-4 right-4 z-20 flex flex-col items-end transition-all duration-500",
                    activeMission.isCompleted ? "scale-110" : "scale-100"
                )}>
                    <div className={clsx(
                        "relative bg-white border-4 rounded-3xl p-4 shadow-xl max-w-[200px]",
                        activeMission.isCompleted ? "border-zoo-yellow animate-bounce-short" : "border-zoo-blue"
                    )}>
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-zoo-blue rounded-full border-4 border-white flex items-center justify-center text-white font-black shadow-md">
                            R
                        </div>
                        <h3 className="font-black text-zoo-blue ml-6 text-sm uppercase">RYDER VOLÁ!</h3>
                        <p className="font-bold text-sm leading-tight mt-1 text-zoo-text">{activeMission.description}</p>

                        {activeMission.isCompleted ? (
                            <button
                                onClick={() => completeMission(activeMission.id)}
                                className="mt-2 w-full bg-zoo-green text-white font-black py-2 rounded-xl text-sm shadow-cartoon hover:shadow-cartoon-hover animate-pulse"
                            >
                                ODMĚNA: {activeMission.reward}
                            </button>
                        ) : (
                            <div className="mt-2 bg-gray-100 rounded-full h-4 w-full overflow-hidden border border-gray-300">
                                <div
                                    className="h-full bg-zoo-blue"
                                    style={{ width: `${Math.min(100, (placedAnimals.filter(p => p.animalType === activeMission.goalType).length / activeMission.goalAmount) * 100)}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Scrollable Game Area */}
            <div className="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center pt-28 pb-48 relative">
                {/* Visitors Overlay - Rendered BEFORE Grid so they are "inside"? No, on top? 
                    Actually, if we want them "walking on grass", they should be ON TOP of grid background but maybe BEHIND animal sprites? 
                    That's hard with current structure. Let's put them ON TOP of everything for visibility. 
                */}

                <div
                    className="gap-1 p-4 bg-green-300/50 rounded-3xl shadow-inner border-4 border-green-500 overflow-visible relative"
                    style={{
                        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                        display: 'grid',
                    }}
                >
                    {/* Visitor Rendering */}
                    {visitors.map(visitor => (
                        <div
                            key={visitor.id}
                            className="absolute pointer-events-none z-10 transition-transform duration-100 ease-linear"
                            style={{
                                width: '40px',
                                height: '40px',

                                // Tile is w-24 (96px). Gap is gap-2 (8px). 
                                // So 1 unit = 104px roughly.
                                // Let's simplify: 
                                // Visitor X (0-5) -> Pixels.
                                // It's better to render visitors INSIDE the mapped tiles? No, they move between tiles.
                                // Let's try estimation: 24rem is 96px. 
                                transform: `translate(${visitor.x * 104 + 20}px, ${visitor.y * 104 + 20}px)`,
                                // Reset top/left to 0 relative to grid container
                                top: '16px', // padding 4 (1rem = 16px)
                                left: '16px',
                            }}
                        >
                            <Image
                                src={visitor.skin === 'boy' ? '/assets/visitor_boy.png' : '/assets/visitor_girl.png'}
                                alt="Visitor"
                                width={40}
                                height={40}
                                className="drop-shadow-md animate-bounce-short"
                            />
                        </div>
                    ))}

                    {Array.from({ length: gridRows * gridCols }).map((_, i) => {
                        const x = i % gridCols;
                        const y = Math.floor(i / gridCols);
                        const placement = placedAnimals.find(p => p.x === x && p.y === y);
                        const biome = gridBiomes[`${x},${y}`] || 'grass';

                        return (
                            <div
                                key={`${x}-${y}`}
                                onClick={() => handleTileClick(x, y)}
                                className={clsx(
                                    "w-24 h-24 rounded-xl relative shadow-sm transition-all border-b-4",
                                    !placement && "cursor-pointer hover:brightness-110",
                                    // Biome Styling
                                    biome === 'grass' && "bg-zoo-green border-green-700",
                                    biome === 'path' && "bg-stone-300 border-stone-500", // Fallback color
                                    biome === 'water' && "bg-blue-400 border-blue-600",
                                    biome === 'ice' && "bg-cyan-100 border-cyan-300",

                                    selectedAnimalToPlace && !placement && "animate-pulse ring-4 ring-yellow-400",
                                    // Build Mode Highlight
                                    isTerrainMode && !placement && "ring-2 ring-white/50",
                                )
                                }
                                // Add background image for path if available
                                style={biome === 'path' ? { backgroundImage: 'url(/assets/biome_path.png)', backgroundSize: 'cover' } : {}}
                            >
                                {/* Biome Icon/Effect */}
                                {biome === 'water' && <Droplets className="absolute top-1 left-1 text-blue-600/30 w-6 h-6 animate-bounce" />}
                                {biome === 'ice' && <Snowflake className="absolute top-1 left-1 text-white/50 w-6 h-6 animate-spin-slow" />}

                                {placement && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center animate-bounce-short">
                                        <Image
                                            src={ANIMALS[placement.animalType].imageUrl}
                                            alt={placement.animalType}
                                            width={70}
                                            height={70}
                                            className="object-contain drop-shadow-lg"
                                        />
                                        {!ANIMALS[placement.animalType].isDecoration && (
                                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-zoo-orange text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                                {placement.level || 1}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>



                {/* Expansion Buttons */}
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => {
                            if (!expandGrid('row')) alert("Nemáš dost peněz na rozšíření dolů!");
                        }}
                        className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-2xl font-black border-b-4 border-green-800 hover:bg-green-500 active:border-b-0 active:translate-y-1 transition-all shadow-lg"
                    >
                        <ArrowDown size={24} />
                        DOLŮ ({(gridRows + gridCols) * 500})
                        <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full text-xs">
                            <Image src="/assets/coin.png" alt="coin" width={12} height={12} />
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            if (!expandGrid('col')) alert("Nemáš dost peněz na rozšíření do strany!");
                        }}
                        className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-2xl font-black border-b-4 border-green-800 hover:bg-green-500 active:border-b-0 active:translate-y-1 transition-all shadow-lg"
                    >
                        <ArrowRight size={24} />
                        DO STRANY ({(gridRows + gridCols) * 500})
                        <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full text-xs">
                            <Image src="/assets/coin.png" alt="coin" width={12} height={12} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Action Bar */}
            <div className="absolute bottom-6 flex gap-4 z-20">
                <button
                    onClick={() => setIsShopOpen(true)}
                    className="group bg-zoo-blue hover:bg-blue-400 text-white p-4 rounded-2xl shadow-cartoon hover:shadow-cartoon-hover transition-all flex flex-col items-center border-4 border-white"
                >
                    <div className="bg-white/20 p-2 rounded-full mb-1">
                        <Plus size={32} />
                    </div>
                    <span className="font-black text-lg">OBCHOD</span>
                </button>

                <button
                    onClick={() => setIsPexesoOpen(true)}
                    className="group bg-zoo-orange hover:bg-orange-400 text-white p-4 rounded-2xl shadow-cartoon hover:shadow-cartoon-hover transition-all flex flex-col items-center border-4 border-white"
                >
                    <div className="bg-white/20 p-2 rounded-full mb-1">
                        <Gamepad2 size={32} />
                    </div>
                    <span className="font-black text-lg">HRY</span>
                </button>

                <button
                    onClick={() => setIsEncyclopediaOpen(true)}
                    className="group bg-[#8b4513] hover:bg-[#a0522d] text-white p-4 rounded-2xl shadow-cartoon hover:shadow-cartoon-hover transition-all flex flex-col items-center border-4 border-white"
                >
                    <div className="bg-white/20 p-2 rounded-full mb-1">
                        <BookOpen size={32} />
                    </div>
                    <span className="font-black text-lg">KNIHA</span>
                </button>

                <button
                    onClick={() => setIsTerrainMode(!isTerrainMode)}
                    className={clsx(
                        "group text-white p-4 rounded-2xl shadow-cartoon hover:shadow-cartoon-hover transition-all flex flex-col items-center border-4 border-white",
                        isTerrainMode ? "bg-red-500 hover:bg-red-400" : "bg-purple-500 hover:bg-purple-400"
                    )}
                >
                    <div className="bg-white/20 p-2 rounded-full mb-1">
                        {isTerrainMode ? <X size={32} /> : <Droplets size={32} />}
                    </div>
                    <span className="font-black text-lg">{isTerrainMode ? "ZRUŠIT" : "TERÉN"}</span>
                </button>
            </div>

            {/* Terrain Selector Overlay */}
            {
                isTerrainMode && (
                    <div className="absolute bottom-32 bg-white/90 p-4 rounded-3xl shadow-xl border-4 border-purple-500 flex gap-4 animate-in slide-in-from-bottom-10 z-30">
                        <button
                            onClick={() => setSelectedBiomeToBuild('water')}
                            className={clsx("flex flex-col items-center p-2 rounded-xl border-2 transition-all", selectedBiomeToBuild === 'water' ? "bg-blue-100 border-blue-500 scale-110" : "hover:bg-gray-100 border-transparent")}
                        >
                            <div className="w-12 h-12 bg-blue-500 rounded-lg mb-1 flex items-center justify-center text-white"><Droplets /></div>
                            <span className="font-black text-sm text-blue-600">VODA</span>
                            <span className="text-xs font-bold text-gray-500">5000</span>
                        </button>

                        <button
                            onClick={() => setSelectedBiomeToBuild('ice')}
                            className={clsx("flex flex-col items-center p-2 rounded-xl border-2 transition-all", selectedBiomeToBuild === 'ice' ? "bg-cyan-100 border-cyan-500 scale-110" : "hover:bg-gray-100 border-transparent")}
                        >
                            <div className="w-12 h-12 bg-cyan-200 rounded-lg mb-1 flex items-center justify-center text-white"><Snowflake /></div>
                            <span className="font-black text-sm text-cyan-600">LED</span>
                            <span className="text-xs font-bold text-gray-500">3000</span>
                        </button>

                        <button
                            onClick={() => setSelectedBiomeToBuild('path')}
                            className={clsx("flex flex-col items-center p-2 rounded-xl border-2 transition-all", selectedBiomeToBuild === 'path' ? "bg-stone-100 border-stone-500 scale-110" : "hover:bg-gray-100 border-transparent")}
                        >
                            <div className="w-12 h-12 bg-stone-400 rounded-lg mb-1 flex items-center justify-center text-white font-black overflow-hidden relative">
                                <div className="absolute inset-0 bg-[url('/assets/biome_path.png')] bg-cover opacity-80" />
                                <span className="z-10 drop-shadow">..</span>
                            </div>
                            <span className="font-black text-sm text-stone-600">CESTA</span>
                            <span className="text-xs font-bold text-gray-500">100</span>
                        </button>
                    </div>
                )
            }

            {/* Instruction Overlay */}
            {
                selectedAnimalToPlace && (
                    <div className="absolute top-24 bg-yellow-400 text-black px-6 py-2 rounded-full font-bold shadow-lg animate-bounce border-2 border-white z-20">
                        👇 Vyber kam zvířátko postavit!
                        <button
                            onClick={() => setSelectedAnimalToPlace(null)}
                            className="ml-4 bg-red-500 text-white rounded-full p-1 w-6 h-6 inline-flex items-center justify-center"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )
            }

            {/* Shop Modal */}
            {
                isShopOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div className="bg-zoo-offwhite w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border-8 border-zoo-blue animate-in fade-in zoom-in duration-300">
                            <div className="bg-zoo-blue p-4 flex justify-between items-center">
                                <h2 className="text-3xl font-black text-white">OBCHOD ZVÍŘÁTEK</h2>
                                <button onClick={() => setIsShopOpen(false)} className="bg-white/20 hover:bg-white/40 p-2 rounded-full text-white">
                                    <X size={32} />
                                </button>
                            </div>

                            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {Object.values(ANIMALS).map((animal) => {
                                    const isLocked = level < animal.unlockLevel;
                                    const canAfford = money >= animal.cost;

                                    return (
                                        <button
                                            key={animal.id}
                                            onClick={() => {
                                                if (isLocked) return;
                                                setIsShopOpen(false);
                                                setSelectedAnimalToPlace(animal.type);
                                            }}
                                            disabled={!canAfford || isLocked}
                                            className={clsx(
                                                "relative flex flex-col items-center p-4 rounded-2xl border-4 transition-all group overflow-hidden",
                                                !isLocked && canAfford
                                                    ? "bg-white border-zoo-blue/20 hover:border-zoo-blue hover:scale-105 shadow-cartoon hover:shadow-cartoon-hover"
                                                    : "bg-gray-200 border-gray-300 opacity-80 cursor-not-allowed"
                                            )}
                                        >
                                            {isLocked && (
                                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-10 text-white backdrop-blur-[1px]">
                                                    <Lock size={40} className="mb-1" />
                                                    <span className="font-black text-lg">LEVEL {animal.unlockLevel}</span>
                                                </div>
                                            )}

                                            <Image src={animal.imageUrl} alt={animal.name} width={80} height={80} className="mb-2 object-contain" />
                                            <h3 className="font-bold text-xl text-zoo-text">{animal.name}</h3>
                                            <div className="flex items-center gap-1 mt-1 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300">
                                                <Image src="/assets/coin.png" alt="coin" width={16} height={16} />
                                                <span className={clsx("font-black", canAfford ? "text-zoo-orange" : "text-red-500")}>
                                                    {animal.cost}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-gray-500">
                                                {animal.isDecoration ? "DEKORACE" : `+${animal.incomeRate}/s`}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Upgrade Modal */}
            {
                selectedPlacement && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div className="bg-white p-6 rounded-3xl shadow-2xl border-8 border-zoo-yellow flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                            <h2 className="text-2xl font-black text-zoo-text">VYLEPŠIT ZVÍŘÁTKO?</h2>

                            <div className="relative w-32 h-32 bg-zoo-green rounded-full flex items-center justify-center border-4 border-green-200 shadow-inner">
                                <Image
                                    src={ANIMALS[selectedPlacement.animalType].imageUrl}
                                    alt="Upgrade"
                                    width={100}
                                    height={100}
                                    className="object-contain"
                                />
                                {!ANIMALS[selectedPlacement.animalType].isDecoration && (
                                    <div className="absolute -bottom-2 bg-zoo-blue text-white px-3 py-1 rounded-full font-black text-lg border-2 border-white shadow-cartoon">
                                        Lvl {selectedPlacement.level || 1}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center gap-1 text-center">
                                <p className="text-gray-500 font-bold">Aktuální příjem: <span className="text-zoo-green">{(selectedPlacement.level || 1) * ANIMALS[selectedPlacement.animalType].incomeRate}/s</span></p>
                                {!ANIMALS[selectedPlacement.animalType].isDecoration ? (
                                    <p className="text-gray-500 font-bold">Po vylepšení: <span className="text-zoo-green ml-1">{((selectedPlacement.level || 1) + 1) * ANIMALS[selectedPlacement.animalType].incomeRate}/s</span></p>
                                ) : (
                                    <p className="text-zoo-orange font-bold mt-2">Dekorace nejde vylepšit!</p>
                                )}
                            </div>

                            <div className="flex gap-4 mt-2">
                                <button
                                    onClick={() => setSelectedPlacementId(null)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold"
                                >
                                    Zrušit
                                </button>
                                {!ANIMALS[selectedPlacement.animalType].isDecoration && (
                                    <button
                                        onClick={handleUpgrade}
                                        className="bg-zoo-green hover:bg-green-500 text-white px-8 py-3 rounded-xl font-black shadow-cartoon hover:shadow-cartoon-hover flex items-center gap-2 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
                                    >
                                        NAKRMIT
                                        <div className="flex items-center bg-black/20 px-2 py-0.5 rounded-full text-sm">
                                            {(selectedPlacement.level || 1) * 50}
                                            <Image src="/assets/coin.png" alt="coin" width={14} height={14} className="ml-1" />
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Pexeso Minigame */}
            {
                isPexesoOpen && (
                    <PexesoGame
                        onClose={() => setIsPexesoOpen(false)}
                        onComplete={(reward) => {
                            addMoney(reward);
                            setIsPexesoOpen(false);
                            alert(`Vyhrál jsi ${reward} zlaťáků!`);
                        }}
                    />
                )
            }

            {/* Encyclopedia */}
            {
                isEncyclopediaOpen && (
                    <EncyclopediaModal onClose={() => setIsEncyclopediaOpen(false)} />
                )
            }

            {/* Quiz Button (Owl) */}
            {
                isQuizReady && !isQuizOpen && (
                    <button
                        onClick={() => setIsQuizOpen(true)}
                        className="absolute top-32 right-8 z-30 animate-bounce cursor-pointer group"
                    >
                        <div className="w-20 h-20 bg-yellow-400 rounded-full border-4 border-white shadow-cartoon flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Image src="/assets/icon_owl.png" alt="Owl" width={60} height={60} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full border-2 border-white">
                            KVÍZ!
                        </div>
                    </button>
                )
            }

            {/* Quiz Modal */}
            {
                isQuizOpen && (
                    <QuizModal
                        onClose={() => setIsQuizOpen(false)}
                        onReward={(r, x) => {
                            addMoney(r);
                            addXp(x);
                            setIsQuizReady(false);
                            setIsQuizOpen(false);
                        }}
                    />
                )
            }

        </div >
    );
}
