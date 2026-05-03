// Game State
const gameState = {
    coins: 0,
    gridWidth: 1,
    gridHeight: 1,
    grid: [[null]],
    unlockedPlants: ['tomato'],
    unlockedMutations: [],
    nextExpansionCost: 10,
    expansionMultiplier: 1.5,
};

// Plant Definitions
const plants = {
    tomato: {
        name: 'Tomato',
        emoji: '🍅',
        cost: 0,
        growthTime: 3,
        baseValue: 5,
        description: '3s growth, 5 coins'
    },
    sunflower: {
        name: 'Sunflower',
        emoji: '🌻',
        cost: 10,
        growthTime: 5,
        baseValue: 10,
        description: '5s growth, 10 coins'
    },
    rose: {
        name: 'Rose',
        emoji: '🌹',
        cost: 15,
        growthTime: 4,
        baseValue: 12,
        description: '4s growth, 12 coins'
    },
    tulip: {
        name: 'Tulip',
        emoji: '🌷',
        cost: 20,
        growthTime: 4,
        baseValue: 15,
        description: '4s growth, 15 coins'
    },
    herb: {
        name: 'Herb',
        emoji: '🌿',
        cost: 12,
        growthTime: 3,
        baseValue: 8,
        description: '3s growth, 8 coins'
    },
    cactus: {
        name: 'Cactus',
        emoji: '🌵',
        cost: 25,
        growthTime: 8,
        baseValue: 25,
        description: '8s growth, 25 coins'
    },
    daisy: {
        name: 'Daisy',
        emoji: '🌼',
        cost: 18,
        growthTime: 4,
        baseValue: 14,
        description: '4s growth, 14 coins'
    },
    mushroom: {
        name: 'Mushroom',
        emoji: '🍄',
        cost: 22,
        growthTime: 6,
        baseValue: 18,
        description: '6s growth, 18 coins'
    }
};

// Mutation Definitions
const mutations = {
    golden: {
        name: 'Golden',
        emoji: '✨',
        cost: 50,
        valueMultiplier: 2.5,
        growthMultiplier: 1,
        description: '2.5x coin value'
    },
    speedy: {
        name: 'Speedy',
        emoji: '⚡',
        cost: 60,
        valueMultiplier: 1,
        growthMultiplier: 0.5,
        description: '50% faster growth'
    },
    mega: {
        name: 'Mega',
        emoji: '💪',
        cost: 75,
        valueMultiplier: 1.8,
        growthMultiplier: 1.3,
        description: '1.8x value, 1.3x growth time'
    },
    frost: {
        name: 'Frost',
        emoji: '❄️',
        cost: 100,
        valueMultiplier: 1.5,
        growthMultiplier: 0.7,
        description: '70% growth time, 1.5x value'
    }
};

// Initialize game
function init() {
    loadGame();
    renderGarden();
    renderShop();
    renderPlantGuide();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('expand-btn').addEventListener('click', expandGrid);
    document.getElementById('reset-btn').addEventListener('click', resetGame);

    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Render the garden grid
function renderGarden() {
    const gridContainer = document.getElementById('garden-grid');
    gridContainer.style.gridTemplateColumns = `repeat(${gameState.gridWidth}, 1fr)`;
    gridContainer.innerHTML = '';

    for (let y = 0; y < gameState.gridHeight; y++) {
        for (let x = 0; x < gameState.gridWidth; x++) {
            const cell = gameState.grid[y][x];
            const cellElement = document.createElement('div');
            cellElement.className = 'grid-cell';

            if (cell === null) {
                cellElement.className += ' empty';
                cellElement.textContent = '➕';
                cellElement.addEventListener('click', () => openPlantMenu(x, y));
            } else {
                const stage = getPlantStage(cell);
                if (stage === 'mature') {
                    cellElement.className += ' mature';
                } else if (stage === 'growing') {
                    cellElement.className += ' growing';
                }

                const plantData = plants[cell.type];
                cellElement.innerHTML = `
                    <div class="plant-info">
                        <div class="plant-stage">${plantData.emoji}</div>
                        ${cell.mutation ? `<div class="mutation-badge">${mutations[cell.mutation].emoji}</div>` : ''}
                        <div class="growth-bar">
                            <div class="growth-fill" style="width: ${getGrowthPercentage(cell)}%"></div>
                        </div>
                    </div>
                `;

                cellElement.addEventListener('click', () => {
                    if (stage === 'mature') {
                        harvestPlant(x, y);
                    }
                });
            }

            gridContainer.appendChild(cellElement);
        }
    }

    updateStats();
}

// Get plant stage (growing/mature/seed)
function getPlantStage(plant) {
    const now = Date.now();
    const growthTime = plants[plant.type].growthTime * 1000;
    const mutationMultiplier = plant.mutation ? mutations[plant.mutation].growthMultiplier : 1;
    const adjustedGrowthTime = growthTime * mutationMultiplier;

    if (now >= plant.plantedAt + adjustedGrowthTime) {
        return 'mature';
    } else {
        return 'growing';
    }
}

// Get growth percentage for progress bar
function getGrowthPercentage(plant) {
    const now = Date.now();
    const growthTime = plants[plant.type].growthTime * 1000;
    const mutationMultiplier = plant.mutation ? mutations[plant.mutation].growthMultiplier : 1;
    const adjustedGrowthTime = growthTime * mutationMultiplier;
    const elapsed = now - plant.plantedAt;

    return Math.min(100, (elapsed / adjustedGrowthTime) * 100);
}

// Open plant menu
function openPlantMenu(x, y) {
    const options = gameState.unlockedPlants
        .map(plantId => {
            const plant = plants[plantId];
            return {
                id: plantId,
                name: plant.name,
                cost: plant.cost
            };
        })
        .sort((a, b) => a.cost - b.cost);

    const choice = prompt(
        'Plant a seed:\n' + options.map(p => `${p.name} (${p.cost} coins)`).join('\n') + '\n\nEnter plant name (case-sensitive):',
        gameState.unlockedPlants[0]
    );

    if (choice) {
        const selected = options.find(o => o.id === choice || o.name.toLowerCase() === choice.toLowerCase());
        if (selected && gameState.coins >= selected.cost) {
            gameState.coins -= selected.cost;
            gameState.grid[y][x] = {
                type: selected.id,
                plantedAt: Date.now(),
                mutation: null
            };
            saveGame();
            renderGarden();
        } else if (selected) {
            alert('Not enough coins!');
        }
    }
}

// Harvest plant
function harvestPlant(x, y) {
    const plant = gameState.grid[y][x];
    if (!plant) return;

    const baseValue = plants[plant.type].baseValue;
    let value = baseValue;

    if (plant.mutation) {
        value *= mutations[plant.mutation].valueMultiplier;
    }

    gameState.coins += Math.floor(value);

    // Random mutation discovery (20% chance)
    if (Math.random() < 0.2) {
        const unlockedMutationIds = Object.keys(mutations);
        const newMutation = unlockedMutationIds[Math.floor(Math.random() * unlockedMutationIds.length)];
        if (!gameState.unlockedMutations.includes(newMutation)) {
            gameState.unlockedMutations.push(newMutation);
            alert(`🎉 Discovered new mutation: ${mutations[newMutation].name} (${mutations[newMutation].emoji})`);
        }
    }

    gameState.grid[y][x] = null;
    saveGame();
    renderGarden();
    renderShop();
}

// Expand grid
function expandGrid() {
    if (gameState.coins < gameState.nextExpansionCost) {
        alert('Not enough coins!');
        return;
    }

    gameState.coins -= gameState.nextExpansionCost;

    // Expand grid
    if (gameState.gridWidth === gameState.gridHeight) {
        gameState.gridWidth++;
    } else {
        gameState.gridHeight++;
    }

    // Add new cells
    for (let y = 0; y < gameState.gridHeight; y++) {
        if (!gameState.grid[y]) {
            gameState.grid[y] = [];
        }
        for (let x = 0; x < gameState.gridWidth; x++) {
            if (gameState.grid[y][x] === undefined) {
                gameState.grid[y][x] = null;
            }
        }
    }

    // Update cost
    gameState.nextExpansionCost = Math.ceil(gameState.nextExpansionCost * gameState.expansionMultiplier);

    saveGame();
    renderGarden();
    renderShop();
}

// Render shop
function renderShop() {
    renderExpansionShop();
    renderPlantsShop();
    renderMutationsShop();
}

// Render expansion shop
function renderExpansionShop() {
    const btn = document.getElementById('expand-btn');
    const desc = document.getElementById('expansionDesc');
    const cost = document.getElementById('expansionCost');

    const newWidth = gameState.gridWidth === gameState.gridHeight ? gameState.gridWidth + 1 : gameState.gridWidth;
    const newHeight = gameState.gridWidth === gameState.gridHeight ? gameState.gridHeight : gameState.gridHeight + 1;

    desc.textContent = `Expand your garden from ${gameState.gridWidth}×${gameState.gridHeight} to ${newWidth}×${newHeight}`;
    cost.textContent = gameState.nextExpansionCost;

    btn.disabled = gameState.coins < gameState.nextExpansionCost;
    btn.onclick = expandGrid;
}

// Render plants shop
function renderPlantsShop() {
    const container = document.getElementById('plants-shop');
    container.innerHTML = '';

    Object.entries(plants).forEach(([id, plant]) => {
        if (id === 'tomato') return; // Tomato is free from start

        const isUnlocked = gameState.unlockedPlants.includes(id);
        const item = document.createElement('div');
        item.className = 'shop-item';
        if (!isUnlocked) item.style.opacity = '0.5';

        const btn = document.createElement('button');
        btn.className = 'buy-btn';
        btn.disabled = !isUnlocked && gameState.coins < plant.cost;
        btn.textContent = `${plant.emoji} ${plant.name}: ${plant.cost} 🪙`;

        btn.onclick = () => {
            if (!isUnlocked && gameState.coins >= plant.cost) {
                gameState.coins -= plant.cost;
                gameState.unlockedPlants.push(id);
                saveGame();
                renderShop();
                renderGarden();
            } else if (!isUnlocked) {
                alert('Not enough coins!');
            }
        };

        item.innerHTML = `<h3>${plant.emoji} ${plant.name}</h3><p>${plant.description}</p>`;
        item.appendChild(btn);
        container.appendChild(item);
    });
}

// Render mutations shop
function renderMutationsShop() {
    const container = document.getElementById('mutations-shop');
    container.innerHTML = '';

    Object.entries(mutations).forEach(([id, mutation]) => {
        const isUnlocked = gameState.unlockedMutations.includes(id);
        const item = document.createElement('div');
        item.className = 'shop-item';
        if (!isUnlocked) item.style.opacity = '0.5';

        const btn = document.createElement('button');
        btn.className = 'buy-btn';
        btn.disabled = !isUnlocked && gameState.coins < mutation.cost;
        btn.textContent = `${mutation.emoji} ${mutation.name}: ${mutation.cost} 🪙`;

        btn.onclick = () => {
            if (!isUnlocked && gameState.coins >= mutation.cost) {
                gameState.coins -= mutation.cost;
                gameState.unlockedMutations.push(id);
                saveGame();
                renderShop();
            } else if (!isUnlocked) {
                alert('Not enough coins!');
            }
        };

        item.innerHTML = `<h3>${mutation.emoji} ${mutation.name}</h3><p>${mutation.description}</p>`;
        item.appendChild(btn);
        container.appendChild(item);
    });
}

// Render plant guide
function renderPlantGuide() {
    const container = document.getElementById('plant-guide');
    container.innerHTML = '';

    gameState.unlockedPlants.forEach(id => {
        const plant = plants[id];
        const card = document.createElement('div');
        card.className = 'plant-card';
        card.innerHTML = `
            <div class="plant-emoji">${plant.emoji}</div>
            <div class="plant-name">${plant.name}</div>
            <div class="plant-stats">${plant.description}</div>
        `;
        container.appendChild(card);
    });
}

// Update stats display
function updateStats() {
    document.getElementById('coins').textContent = Math.floor(gameState.coins);
    document.getElementById('gridSize').textContent = `${gameState.gridWidth}×${gameState.gridHeight}`;
    document.getElementById('plantCount').textContent = gameState.grid.flat().filter(cell => cell !== null).length;
}

// Save game to localStorage
function saveGame() {
    localStorage.setItem('gardenGame', JSON.stringify(gameState));
}

// Load game from localStorage
function loadGame() {
    const saved = localStorage.getItem('gardenGame');
    if (saved) {
        Object.assign(gameState, JSON.parse(saved));
    }
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset your game?')) {
        localStorage.removeItem('gardenGame');
        gameState.coins = 0;
        gameState.gridWidth = 1;
        gameState.gridHeight = 1;
        gameState.grid = [[null]];
        gameState.unlockedPlants = ['tomato'];
        gameState.unlockedMutations = [];
        gameState.nextExpansionCost = 10;
        renderGarden();
        renderShop();
        renderPlantGuide();
    }
}

// Auto-update growth every 500ms
setInterval(() => {
    renderGarden();
}, 500);

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);
