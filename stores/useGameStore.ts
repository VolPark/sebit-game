import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AnimalType = 'dog' | 'cat' | 'elephant' | 'lion' | 'penguin' | 'shark' | 'polar_bear' | 'fountain' | 'tree';
export type BiomeType = 'grass' | 'water' | 'ice' | 'path';

export interface Animal {
    id: string;
    type: AnimalType;
    name: string;
    cost: number;
    incomeRate: number; // Coins per second
    imageUrl: string;
    unlockLevel: number;
    xpReward: number;
    requiredBiome?: BiomeType;
    isDecoration?: boolean;
    // Educational Data
    funFact?: string;
    diet?: 'herbivore' | 'carnivore' | 'omnivore'; // masozravec / bylozravec
    quizQuestions?: { question: string; options: string[]; correctAnswer: number }[];
}

export const ANIMALS: Record<AnimalType, Animal> = {
    // Basic
    dog: {
        id: 'dog', type: 'dog', name: 'Pejsek', cost: 100, incomeRate: 1, imageUrl: '/assets/dog.png', unlockLevel: 1, xpReward: 20,
        funFact: 'Psi mají čich 10 000x lepší než lidé!', diet: 'omnivore',
        quizQuestions: [
            { question: 'Co dělají psi, když jsou šťastní?', options: ['Vrtí ocasem', 'Mňoukají', 'Létají'], correctAnswer: 0 },
            { question: 'Jak se jmenuje psí mládě?', options: ['Kotě', 'Štěně', 'Telátko'], correctAnswer: 1 }
        ]
    },
    cat: {
        id: 'cat', type: 'cat', name: 'Kočička', cost: 150, incomeRate: 2, imageUrl: '/assets/cat.png', unlockLevel: 1, xpReward: 30,
        funFact: 'Kočky spí až 16 hodin denně!', diet: 'carnivore',
        quizQuestions: [
            { question: 'Co kočky milují?', options: ['Vodu', 'Spánek a myši', 'Brokolici'], correctAnswer: 1 },
            { question: 'Vidí kočky dobře ve tmě?', options: ['Ano', 'Ne', 'Jen v úterý'], correctAnswer: 0 }
        ]
    },
    penguin: {
        id: 'penguin', type: 'penguin', name: 'Tučňák', cost: 300, incomeRate: 5, imageUrl: '/assets/penguin.png', unlockLevel: 2, xpReward: 60,
        funFact: 'Tučňáci neumí létat, ale skvěle plavou.', diet: 'carnivore',
        quizQuestions: [
            { question: 'Kde žijí tučňáci?', options: ['Na poušti', 'Na jižním pólu', 'V lese'], correctAnswer: 1 },
            { question: 'Čím se živí tučňák?', options: ['Ryby', 'Banány', 'Tráva'], correctAnswer: 0 }
        ]
    },
    elephant: {
        id: 'elephant', type: 'elephant', name: 'Slon', cost: 500, incomeRate: 8, imageUrl: '/assets/elephant.png', unlockLevel: 3, xpReward: 100,
        funFact: 'Slon má výbornou paměť a nikdy nezapomíná.', diet: 'herbivore',
        quizQuestions: [
            { question: 'Čím nabírâ slon vodu?', options: ['Ocasem', 'Chobotem', 'Uchem'], correctAnswer: 1 },
            { question: 'Jaké je slon zvíře?', options: ['Největší suchozemské', 'Nejmenší na světě', 'Mořské'], correctAnswer: 0 }
        ]
    },
    lion: {
        id: 'lion', type: 'lion', name: 'Lev', cost: 800, incomeRate: 12, imageUrl: '/assets/lion.png', unlockLevel: 5, xpReward: 200,
        funFact: 'Lví řev je slyšet až na 8 kilometrů!', diet: 'carnivore',
        quizQuestions: [
            { question: 'Jak se říká lvi?', options: ['Král džungle', 'Pan lesa', 'Vládce moří'], correctAnswer: 0 },
            { question: 'Kdo loví potravu pro smečku?', options: ['Lev (samec)', 'Lvice (samice)', 'Lvíčata'], correctAnswer: 1 }
        ]
    },

    // Legendary / Biome Specific
    shark: {
        id: 'shark', type: 'shark', name: 'Žralok', cost: 10000, incomeRate: 100, imageUrl: '/assets/shark.png', unlockLevel: 8, xpReward: 1000, requiredBiome: 'water',
        funFact: 'Žraloci nemají kosti, jejich kostra je z chrupavky.', diet: 'carnivore',
        quizQuestions: [
            { question: 'Kde žije žralok?', options: ['V řece', 'V oceánu', 'Na stromě'], correctAnswer: 1 },
            { question: 'Má žralok zuby?', options: ['Ne, žádné', 'Ano, spoustu', 'Jen jeden'], correctAnswer: 1 }
        ]
    },
    polar_bear: {
        id: 'polar_bear', type: 'polar_bear', name: 'Lední Medvěd', cost: 7500, incomeRate: 80, imageUrl: '/assets/polar_bear.png', unlockLevel: 7, xpReward: 800, requiredBiome: 'ice',
        funFact: 'Pod bílým kožichem má lední medvěd černou kůži!', diet: 'carnivore',
        quizQuestions: [
            { question: 'Jakou barvu má kůže ledního medvěda?', options: ['Bílou', 'Černou', 'Růžovou'], correctAnswer: 1 },
            { question: 'Je lední medvěd dobrý plavec?', options: ['Ano, výborný', 'Ne, bojí se vody', 'Neumí plavat'], correctAnswer: 0 }
        ]
    },

    // Decorations
    fountain: {
        id: 'fountain', type: 'fountain', name: 'Fontána', cost: 2000, incomeRate: 0, imageUrl: '/assets/fountain.png', unlockLevel: 4, xpReward: 100, isDecoration: true
    },
    tree: {
        id: 'tree', type: 'tree', name: 'Strom', cost: 500, incomeRate: 0, imageUrl: '/assets/tree.png', unlockLevel: 2, xpReward: 50, isDecoration: true
    }
};

export interface PlacedAnimal {
    id: string;
    animalType: AnimalType;
    x: number;
    y: number;
    placedAt: number;
    level: number;
}

export interface Mission {
    id: string;
    description: string;
    goalType: AnimalType;
    goalAmount: number;
    reward: number;
    isCompleted: boolean;
}

const STARTING_MISSIONS: Mission[] = [
    { id: 'm1', description: 'Postav 2 pejsky!', goalType: 'dog', goalAmount: 2, reward: 200, isCompleted: false },
    { id: 'm2', description: 'Postav 1 kočičku!', goalType: 'cat', goalAmount: 1, reward: 300, isCompleted: false },
    { id: 'm3', description: 'Postav 3 pejsky!', goalType: 'dog', goalAmount: 3, reward: 500, isCompleted: false },
];

interface GameState {
    money: number;
    level: number;
    xp: number;
    happiness: number;
    gridRows: number;
    gridCols: number; // New: Horizontal expansion
    placedAnimals: PlacedAnimal[];
    gridBiomes: Record<string, BiomeType>; // New: Store biome data "x,y" -> 'water'
    missions: Mission[];

    // Actions
    addMoney: (amount: number) => void;
    addXp: (amount: number) => void;
    addHappiness: (amount: number) => void;
    buyAnimal: (type: AnimalType) => boolean;
    placeAnimal: (type: AnimalType, x: number, y: number) => boolean; // Changed to boolean
    completeMission: (missionId: string) => void;

    expandGrid: (direction: 'row' | 'col') => boolean; // Updated signature
    upgradeAnimal: (placementId: string) => boolean;
    changeBiome: (x: number, y: number, biome: BiomeType) => boolean; // New Action

    // Computed
    incomePerSecond: () => number;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            money: 1000,
            level: 1,
            xp: 0,
            happiness: 0,
            gridRows: 5,

            gridCols: 6,
            placedAnimals: [],
            gridBiomes: {}, // Default is empty (grass)
            missions: STARTING_MISSIONS,

            addMoney: (amount) => set((state) => ({ money: state.money + amount })),

            addHappiness: (amount) => set((state) => ({ happiness: state.happiness + amount })),

            addXp: (amount) => set((state) => {
                const nextXp = state.xp + amount;
                const xpForNextLevel = state.level * 100;

                if (nextXp >= xpForNextLevel) {
                    return { xp: nextXp - xpForNextLevel, level: state.level + 1 };
                }
                return { xp: nextXp };
            }),

            buyAnimal: (type) => {
                const state = get();
                const cost = ANIMALS[type].cost;
                if (state.money >= cost && state.level >= ANIMALS[type].unlockLevel) {
                    // Money is NOT deducted here anymore, it's deducted in placeAnimal
                    // Wait, if I change this, I must verify Game.tsx logic.
                    // Previous logic: buyAnimal returned true if affordable.
                    // The UI calls buyAnimal -> if true, set mode.
                    // Then placeAnimal -> actually places.
                    // IF I move deduction to placeAnimal, then buyAnimal should just return true/false without modifying state.

                    // LET'S STICK TO THE PLAN: Decoration happened in placeAnimal in my previous edit, 
                    // BUT I see duplicated code in what I viewed.
                    // I will make buyAnimal ONLY check checks. Deduction in placeAnimal.
                    return true;
                }
                return false;
            },
            placeAnimal: (type, x, y) => {
                const state = get();
                const animal = ANIMALS[type];

                // Check Biome
                const biome = state.gridBiomes[`${x},${y}`] || 'grass';
                if (animal.requiredBiome && animal.requiredBiome !== biome) {
                    // Logic handled in Game.tsx, but good to have double check or return specific error
                    return false;
                }

                set((prev) => {
                    // Mission Progress Check
                    const newMissions = prev.missions.map(mission => {
                        if (!mission.isCompleted && mission.goalType === type) {
                            const currentCount = prev.placedAnimals.filter(p => p.animalType === type).length + 1; // +1 for current
                            if (currentCount >= mission.goalAmount) {
                                return { ...mission, isCompleted: true };
                            }
                        }
                        return mission;
                    });

                    return {
                        money: prev.money - ANIMALS[type].cost,
                        placedAnimals: [...prev.placedAnimals, {
                            id: Math.random().toString(36).substr(2, 9),
                            animalType: type,
                            x,
                            y,
                            placedAt: Date.now(),
                            level: 1
                        }],
                        missions: newMissions
                    };
                });
                get().addXp(animal.xpReward);
                return true;
            },
            completeMission: (id) => {
                set((state) => {
                    const mission = state.missions.find(m => m.id === id);
                    if (mission && mission.isCompleted) {
                        // Generate new random mission (simplified)
                        const randomAnimal = Object.keys(ANIMALS)[Math.floor(Math.random() * 5)] as AnimalType;
                        const newMission: Mission = {
                            id: Math.random().toString(),
                            description: `Postav další ${ANIMALS[randomAnimal].name}!`,
                            goalType: randomAnimal,
                            goalAmount: state.placedAnimals.filter(p => p.animalType === randomAnimal).length + 2,
                            reward: 500 + (state.level * 100),
                            isCompleted: false
                        };

                        return {
                            money: state.money + mission.reward,
                            missions: [...state.missions.filter(m => m.id !== id), newMission]
                        };
                    }
                    return state;
                })
            },
            expandGrid: (direction) => {
                const state = get();
                const cost = (state.gridRows + state.gridCols) * 500; // Cheaper cost formula
                if (state.money >= cost) {
                    if (direction === 'row') {
                        set({ money: state.money - cost, gridRows: state.gridRows + 1 });
                    } else {
                        set({ money: state.money - cost, gridCols: state.gridCols + 1 });
                    }
                    return true;
                }
                return false;
            },

            upgradeAnimal: (placementId) => {
                const state = get();
                const placement = state.placedAnimals.find(p => p.id === placementId);
                if (!placement) return false;

                // Decor can't be upgraded (income 0)
                if (ANIMALS[placement.animalType].isDecoration) return false;

                const currentLevel = placement.level || 1;
                const cost = currentLevel * 50;

                if (state.money >= cost) {
                    set({
                        money: state.money - cost,
                        placedAnimals: state.placedAnimals.map(p =>
                            p.id === placementId ? { ...p, level: currentLevel + 1 } : p
                        )
                    });
                    return true;
                }
                return false;
            },

            changeBiome: (x, y, biome) => {
                const state = get();
                const cost = biome === 'water' ? 5000 : (biome === 'ice' ? 3000 : (biome === 'path' ? 100 : 0));

                if (state.money >= cost) {
                    // Can't replace if occupied by animal (unless it's just path/grass swap and animal allows it?)
                    // For now simple constraint:
                    const isOccupied = state.placedAnimals.some(p => p.x === x && p.y === y);
                    if (isOccupied && biome !== 'path' && biome !== 'grass') return false;
                    // Allow Path under Animals? User said "mezi" (between). 
                    // If we place an animal on a path, that's up to user.
                    // But usually paths are empty tiles.
                    if (isOccupied) return false;

                    set((prev) => ({
                        money: prev.money - cost,
                        gridBiomes: { ...prev.gridBiomes, [`${x},${y}`]: biome }
                    }));
                    return true;
                }
                return false;
            },

            incomePerSecond: () => {
                const state = get();
                return state.placedAnimals.reduce((total, placement) => {
                    const baseRate = ANIMALS[placement.animalType].incomeRate;
                    // Decor has 0 rate so it adds nothing
                    const levelMultiplier = placement.level || 1;
                    return total + (baseRate * levelMultiplier);
                }, 0);
            },
        }),
        {
            name: 'zoo-game-storage',
            version: 2, // Bump version if adding biome state
        }
    )
);
