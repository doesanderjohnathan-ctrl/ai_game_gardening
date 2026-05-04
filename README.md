# Garden Clicker Game 🌱

A JavaScript-based gardening simulation game where you expand your garden grid, grow plants, discover mutations, and manage resources.

## Features

- **Expandable Grid**: Start with a 1×1 garden and expand it as you progress
- **Multiple Plant Types**: Unlock and cultivate different plant varieties
- **Mutation System**: Discover new plant mutations randomly as you grow
- **Shop System**: Purchase grid expansions, new plant seeds, and mutations
- **Currency System**: Earn coins by harvesting plants
- **Progressive Gameplay**: Unlock new features as you advance
- **Auto-Save**: Your progress is saved automatically to browser storage

## How to Play

1. **Plant Seeds**: Click on empty grid cells (➕) to plant seeds
2. **Grow Plants**: Wait for plants to mature (shown with a growth bar)
3. **Harvest**: Click on mature plants (glowing) to harvest for coins
4. **Expand Grid**: Use coins to expand your garden from the Shop
5. **Unlock Plants**: Purchase new plant types from the Plants shop tab
6. **Discover Mutations**: Randomly unlock mutations when harvesting (20% chance)

## Game Mechanics

### Plants
- Each plant has unique growth time and coin value
- Plants show a progress bar while growing
- Mature plants glow and are ready to harvest
- Available plants:
  - 🍅 **Tomato** (Free) - 3s, 5 coins
  - 🌻 **Sunflower** - 5s, 8 coins
  - 🌹 **Rose** - 4s, 7 coins
  - 🌷 **Tulip** - 4s, 6 coins
  - 🌿 **Herb** - 2s, 4 coins
  - 🌵 **Cactus** - 6s, 10 coins
  - 🼼 **Daisy** - 3s, 5 coins
  - 🍄 **Mushroom** - 7s, 12 coins

### Mutations
Mutations are special properties discovered randomly (20% chance per harvest) that modify plant behavior:

- **✨ Golden** - Earn 2.5x more coins (Discovered randomly)
- **⚡ Speedy** - Grow 50% faster (Discovered randomly)
- **💪 Mega** - 1.8x value + 1.3x growth time (Discovered randomly)
- **❄️ Frost** - 70% growth time, 1.5x value (Discovered randomly)

### Grid Expansion
- Start with 1×1 grid (1 cell)
- Each expansion increases grid size (1×1 → 2×2 → 3×3, etc.)
- Expansion costs increase: 10 → 15 → 22.5 → etc.

## Getting Started

1. Open `index.html` in a modern web browser
2. Start by planting tomatoes (free!)
3. Harvest them after 3 seconds to earn coins
4. Expand your garden and unlock new plants
5. Watch for mutation discoveries!

## Files

- **index.html** - Game interface and HTML structure
- **styles.css** - Responsive styling, animations, and responsive design
- **game.js** - Core game logic, state management, and mechanics
- **README.md** - This file

## Game Loop

```
Plant Seed → Wait for Growth → Harvest → Earn Coins → Buy Upgrades → Expand Grid → Repeat
```

## Tips & Strategy

- 🍅 Tomatoes are great for starting - they're free and fast!
- 🌵 Cacti take longer but give more coins - good for later game
- ⚡ Speedy mutations are great for increasing farm efficiency
- ✨ Golden mutations maximize your coin earnings
- 🌻 Sunflowers are a good mid-game investment

## Features

- ✅ Full game state persistence (localStorage)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time plant growth updates
- ✅ Random mutation discovery system
- ✅ Shop with multiple upgrade tabs
- ✅ Plant guide with stats
- ✅ Auto-save game progress
- ✅ Beautiful UI with animations

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge, etc.)

## License

MIT
