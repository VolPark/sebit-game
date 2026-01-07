import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AnimalType = 'dog' | 'cat' | 'penguin' | 'elephant' | 'lion' | 'shark' | 'polar_bear' | 'tree' | 'fountain' | 'giraffe' | 'zebra' | 'seal' | 'walrus' | 'monkey' | 'tiger' | 'phoenix' | 'dragon';
export type BiomeType = 'grass' | 'water' | 'ice' | 'path' | 'mud' | 'glacier' | 'moss' | 'lava';

export interface Zone {
    id: number;
    name: string;
    textureUrl?: string; // e.g. /assets/bg_savanna.png
    costMultiplier: number; // e.g. 1.5x prices
    incomeMultiplier: number; // e.g. 2x income
    unlockCost: number;
}

export const ZONES: Zone[] = [
    { id: 0, name: 'Louka', costMultiplier: 1, incomeMultiplier: 1, unlockCost: 0 },
    { id: 1, name: 'Savana', textureUrl: '/assets/bg_savanna.png', costMultiplier: 1.5, incomeMultiplier: 1.5, unlockCost: 500000 },
    { id: 2, name: 'Arktida', textureUrl: '/assets/bg_arctic.png', costMultiplier: 2.5, incomeMultiplier: 3.0, unlockCost: 2500000 },
    { id: 3, name: 'Džungle', textureUrl: '/assets/bg_jungle.png', costMultiplier: 4.0, incomeMultiplier: 5.0, unlockCost: 10000000 },
    { id: 4, name: 'Vulkán', textureUrl: '/assets/bg_volcano.png', costMultiplier: 8.0, incomeMultiplier: 10.0, unlockCost: 50000000 },
];

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
    zoneId: number;
    isDecoration?: boolean;
    // Educational Data
    funFact?: string;
    diet?: 'herbivore' | 'carnivore' | 'omnivore'; // masozravec / bylozravec
    quizQuestions?: { question: string; options: string[]; correctAnswer: number }[];
}

export const ANIMALS: Record<AnimalType, Animal> = {
    // Zone 0: Meadow
    dog: {
        id: 'dog', type: 'dog', name: 'Pejsek', cost: 100, incomeRate: 1, imageUrl: '/assets/animal_dog.png', unlockLevel: 1, xpReward: 20, zoneId: 0,
        funFact: 'Psi mají čich 10 000x lepší než lidé!', diet: 'omnivore',
        quizQuestions: [
            { question: 'Co dělají psi, když jsou šťastní?', options: ['Vrtí ocasem', 'Mňoukají', 'Létají'], correctAnswer: 0 },
            { question: 'Jak se jmenuje psí mládě?', options: ['Kotě', 'Štěně', 'Telátko'], correctAnswer: 1 }
        ]
    },
    cat: {
        id: 'cat', type: 'cat', name: 'Kočička', cost: 150, incomeRate: 2, imageUrl: '/assets/animal_cat.png', unlockLevel: 1, xpReward: 30, zoneId: 0,
        funFact: 'Kočky spí až 16 hodin denně!', diet: 'carnivore',
        quizQuestions: [
            { question: 'Co kočky milují?', options: ['Vodu', 'Spánek a myši', 'Brokolici'], correctAnswer: 1 },
            { question: 'Vidí kočky dobře ve tmě?', options: ['Ano', 'Ne', 'Jen v úterý'], correctAnswer: 0 }
        ]
    },
    tree: {
        id: 'tree', type: 'tree', name: 'Strom', cost: 50, incomeRate: 0, imageUrl: '/assets/prop_tree.png', unlockLevel: 2, xpReward: 50, isDecoration: true, zoneId: 0
    },
    fountain: {
        id: 'fountain', type: 'fountain', name: 'Fontána', cost: 2000, incomeRate: 0, imageUrl: '/assets/prop_fountain.png', unlockLevel: 4, xpReward: 100, isDecoration: true, zoneId: 0
    },
    shark: {
        id: 'shark', type: 'shark', name: 'Žralok', cost: 10000, incomeRate: 100, imageUrl: '/assets/animal_shark.png', unlockLevel: 8, xpReward: 1000, requiredBiome: 'water', zoneId: 0,
        funFact: 'Žraloci nemají kosti, jejich kostra je z chrupavky.', diet: 'carnivore',
        quizQuestions: [
            { question: 'Kde žije žralok?', options: ['V řece', 'V oceánu', 'Na stromě'], correctAnswer: 1 },
            { question: 'Má žralok zuby?', options: ['Ne, žádné', 'Ano, spoustu', 'Jen jeden'], correctAnswer: 1 }
        ]
    },

    // Zone 1: Savanna (Lev, Slon moved here, + Giraffe, Zebra)
    lion: {
        id: 'lion', type: 'lion', name: 'Lev', cost: 1000, incomeRate: 12, imageUrl: '/assets/animal_lion.png', unlockLevel: 5, xpReward: 200, zoneId: 1,
        funFact: 'Lví řev je slyšet až na 8 kilometrů!', diet: 'carnivore',
        quizQuestions: [
            { question: 'Jak se říká lvi?', options: ['Král džungle', 'Pan lesa', 'Vládce moří'], correctAnswer: 0 },
            { question: 'Kdo loví potravu pro smečku?', options: ['Lev (samec)', 'Lvice (samice)', 'Lvíčata'], correctAnswer: 1 }
        ]
    },
    elephant: {
        id: 'elephant', type: 'elephant', name: 'Slon', cost: 1500, incomeRate: 15, imageUrl: '/assets/animal_elephant.png', unlockLevel: 3, xpReward: 100, requiredBiome: 'mud', zoneId: 1,
        funFact: 'Slon má výbornou paměť a nikdy nezapomíná.', diet: 'herbivore',
        quizQuestions: [
            { question: 'Čím nabírâ slon vodu?', options: ['Ocasem', 'Chobotem', 'Uchem'], correctAnswer: 1 },
            { question: 'Jaké je slon zvíře?', options: ['Největší suchozemské', 'Nejmenší na světě', 'Mořské'], correctAnswer: 0 }
        ]
    },
    giraffe: {
        id: 'giraffe', type: 'giraffe', name: 'Žirafa', cost: 1200, incomeRate: 10, imageUrl: '/assets/animal_giraffe.png', unlockLevel: 2, xpReward: 80, zoneId: 1,
        funFact: 'Žirafa má stejně krčních obratlů jako člověk (7), ale obrovských!', diet: 'herbivore',
        quizQuestions: [
            { question: 'Co má žirafa dlouhé?', options: ['Krk', 'Uši', 'Nos'], correctAnswer: 0 },
            { question: 'Jak spí žirafa?', options: ['Ve stoje', 'V hnízdě', 'Pod vodou'], correctAnswer: 0 }
        ]
    },
    zebra: {
        id: 'zebra', type: 'zebra', name: 'Zebra', cost: 900, incomeRate: 8, imageUrl: '/assets/animal_zebra.png', unlockLevel: 2, xpReward: 70, zoneId: 1,
        funFact: 'Každá zebra má unikátní pruhy, jako otisky prstů.', diet: 'herbivore',
        quizQuestions: [
            { question: 'Jakou barvu má zebra?', options: ['Modrou', 'Černo-bílou', 'Zelenou'], correctAnswer: 1 },
            { question: 'Kde žijí zebry?', options: ['V Africe', 'Na severním pólu', 'V rybníku'], correctAnswer: 0 }
        ]
    },

    // Zone 2: Arctic (Penguin, Polar Bear moved here, + Seal, Walrus)
    penguin: {
        id: 'penguin', type: 'penguin', name: 'Tučňák', cost: 2500, incomeRate: 20, imageUrl: '/assets/animal_penguin.png', unlockLevel: 2, xpReward: 60, requiredBiome: 'ice', zoneId: 2,
        funFact: 'Tučňáci neumí létat, ale skvěle plavou.', diet: 'carnivore',
        quizQuestions: [
            { question: 'Kde žijí tučňáci?', options: ['Na poušti', 'Na jižním pólu', 'V lese'], correctAnswer: 1 },
            { question: 'Čím se živí tučňák?', options: ['Ryby', 'Banány', 'Tráva'], correctAnswer: 0 }
        ]
    },
    polar_bear: {
        id: 'polar_bear', type: 'polar_bear', name: 'Lední Medvěd', cost: 7500, incomeRate: 80, imageUrl: '/assets/animal_polar_bear.png', unlockLevel: 7, xpReward: 800, requiredBiome: 'ice', zoneId: 2,
        funFact: 'Pod bílým kožichem má lední medvěd černou kůži!', diet: 'carnivore',
        quizQuestions: [
            { question: 'Jakou barvu má kůže ledního medvěda?', options: ['Bílou', 'Černou', 'Růžovou'], correctAnswer: 1 },
            { question: 'Je lední medvěd dobrý plavec?', options: ['Ano, výborný', 'Ne, bojí se vody', 'Neumí plavat'], correctAnswer: 0 }
        ]
    },
    seal: {
        id: 'seal', type: 'seal', name: 'Tuleň', cost: 2800, incomeRate: 25, imageUrl: '/assets/animal_seal.png', unlockLevel: 6, xpReward: 150, requiredBiome: 'ice', zoneId: 2,
        funFact: 'Tuleni dokáží zadržet dech až na 2 hodiny!', diet: 'carnivore',
        quizQuestions: [
            { question: 'Co dělají tuleni na ledu?', options: ['Hrají fotbal', 'Odpočívají', 'Pečou cukroví'], correctAnswer: 1 }
        ]
    },
    walrus: {
        id: 'walrus', type: 'walrus', name: 'Mrož', cost: 8000, incomeRate: 90, imageUrl: '/assets/animal_walrus.png', unlockLevel: 8, xpReward: 900, requiredBiome: 'glacier', zoneId: 2,
        funFact: 'Mroží kly jsou vlastně prodloužené zuby.', diet: 'carnivore',
        quizQuestions: [
            { question: 'Co má mrož velkého?', options: ['Uši', 'Kly', 'Ocas'], correctAnswer: 1 }
        ]
    },

    // Zone 3: Jungle
    monkey: {
        id: 'monkey', type: 'monkey', name: 'Opice', cost: 15000, incomeRate: 200, imageUrl: '/assets/animal_monkey.png', unlockLevel: 10, xpReward: 1500, zoneId: 3,
        funFact: 'Některé opice si myjí ovoce, než ho sní!', diet: 'omnivore',
        quizQuestions: [
            { question: 'Co jedí opice?', options: ['Jen maso', 'Jen kameny', 'Banány a ovoce'], correctAnswer: 2 },
            { question: 'Kde žije většina opic?', options: ['Na stromech', 'V podzemí', 'V moři'], correctAnswer: 0 }
        ]
    },
    tiger: {
        id: 'tiger', type: 'tiger', name: 'Tygr', cost: 40000, incomeRate: 500, imageUrl: '/assets/animal_tiger.png', unlockLevel: 12, xpReward: 3000, requiredBiome: 'moss', zoneId: 3,
        funFact: 'Tygr má pruhovanou i kůži pod srstí!', diet: 'carnivore',
        quizQuestions: [
            { question: 'Je tygr samotář?', options: ['Ano', 'Ne, žije ve smečce', 'Žije s lvy'], correctAnswer: 0 },
            { question: 'Umí tygr plavat?', options: ['Ne', 'Ano, miluje vodu', 'Bojí se vody'], correctAnswer: 1 }
        ]
    },

    // Zone 4: Volcano
    phoenix: {
        id: 'phoenix', type: 'phoenix', name: 'Fénix', cost: 200000, incomeRate: 2500, imageUrl: '/assets/animal_phoenix.png', unlockLevel: 15, xpReward: 10000, requiredBiome: 'lava', zoneId: 4,
        funFact: 'Fénix se podle legendy rodí znovu ze svého popela.', diet: 'omnivore',
        quizQuestions: [
            { question: 'Z čeho se rodí Fénix?', options: ['Vejce', 'Popel', 'Kámen'], correctAnswer: 1 },
            { question: 'Jakou barvu má Fénix?', options: ['Ohnivou', 'Modrou', 'Zelenou'], correctAnswer: 0 }
        ]
    },
    dragon: {
        id: 'dragon', type: 'dragon', name: 'Drak', cost: 1000000, incomeRate: 15000, imageUrl: '/assets/animal_dragon.png', unlockLevel: 20, xpReward: 50000, requiredBiome: 'lava', zoneId: 4,
        funFact: 'Draci v pohádkách často chrání poklad.', diet: 'carnivore',
        quizQuestions: [
            { question: 'Co chrlí drak?', options: ['Vodu', 'Oheň', 'Bubliny'], correctAnswer: 1 },
            { question: 'Má drak křídla?', options: ['Ne', 'Ano', 'Jen někdy'], correctAnswer: 1 }
        ]
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
    currentZone: number; // New State
    gridRows: number;
    gridCols: number;
    placedAnimals: PlacedAnimal[];
    gridBiomes: Record<string, BiomeType>;
    missions: Mission[];

    // Actions
    addMoney: (amount: number) => void;
    addXp: (amount: number) => void;
    addHappiness: (amount: number) => void;
    buyAnimal: (type: AnimalType) => boolean;
    placeAnimal: (type: AnimalType, x: number, y: number) => boolean;
    completeMission: (missionId: string) => void;

    expandGrid: (direction: 'row' | 'col') => boolean;
    upgradeAnimal: (placementId: string) => boolean;
    changeBiome: (x: number, y: number, biome: BiomeType) => boolean;
    advanceZone: () => boolean; // New Action

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
            currentZone: 0, // Default to Zone 0
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

            incomePerSecond: () => {
                const state = get();
                // Apply Zone Multiplier to Total Income
                const baseIncome = state.placedAnimals.reduce((total, placement) => {
                    const animal = ANIMALS[placement.animalType];
                    return total + (animal.incomeRate * (placement.level || 1));
                }, 0);

                const zoneMultiplier = ZONES[state.currentZone].incomeMultiplier;
                return Math.floor(baseIncome * zoneMultiplier);
            },

            // New: Advance Zone (Prestige)
            advanceZone: () => {
                const state = get();
                const nextZoneIdx = state.currentZone + 1;
                if (nextZoneIdx >= ZONES.length) return false;

                const nextZone = ZONES[nextZoneIdx];
                if (state.money >= nextZone.unlockCost) {
                    set({
                        currentZone: nextZoneIdx,
                        money: state.money - nextZone.unlockCost,
                        // RESET GRID for new zone (Prestige feeling)
                        gridRows: 5,
                        gridCols: 6,
                        placedAnimals: [],
                        gridBiomes: {},
                        // Keep Level, XP, Happiness? Usually yes.
                    });
                    return true;
                }
                return false;
            },

            buyAnimal: (type) => { // Modified for Zone Cost
                const state = get();
                const zone = ZONES[state.currentZone];
                const cost = Math.floor(ANIMALS[type].cost * zone.costMultiplier);

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
                const zone = ZONES[state.currentZone];
                const finalCost = Math.floor(animal.cost * zone.costMultiplier);

                // Check again for safety
                if (state.money < finalCost) return false;

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
                        money: prev.money - finalCost, // Deduct Scaled Cost
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
                    // Scale cost by zone? No, grid expansion usually fixed or maybe slightly scaled. 
                    // Let's keep grid expansion fixed for now or minimal scaling.
                    const zone = ZONES[state.currentZone];
                    const scaledCost = Math.floor(cost * zone.costMultiplier);

                    if (state.money < scaledCost) return false;

                    set((prev) => ({
                        money: prev.money - scaledCost,
                        gridRows: direction === 'row' ? prev.gridRows + 1 : prev.gridRows,
                        gridCols: direction === 'col' ? prev.gridCols + 1 : prev.gridCols
                    }));
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
                const cost =
                    biome === 'water' ? 5000 :
                        biome === 'ice' ? 3000 :
                            biome === 'mud' ? 2000 :
                                biome === 'glacier' ? 8000 :
                                    biome === 'moss' ? 15000 :
                                        biome === 'lava' ? 50000 :
                                            biome === 'path' ? 100 : 0;

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


        }),
        {
            name: 'zoo-game-storage',
            version: 3, // Bump for Zone Progression
            migrate: (persistedState: any, version) => {
                if (version < 3) {
                    return { ...persistedState, currentZone: 0 };
                }
                return persistedState;
            },
        }
    )
);
