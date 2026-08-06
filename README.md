# SNBT-JS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/snbt-js.svg)](https://www.npmjs.com/package/snbt-js)
[![Build Status](https://github.com/myworldzycpc/snbt-js/actions/workflows/tests.yml/badge.svg)](https://github.com/myworldzycpc/snbt-js/actions)

*(Formerly known as nbtcoder.js)*

A robust TypeScript library for parsing, manipulating, and serializing Minecraft's NBT (Named Binary Tag) format. 
Supports SNBT (Stringified NBT) with zero dependencies.

## Features

- 🚀 Full NBT specification implementation (Tags 1-12)
- ✨ Intuitive API for creating and modifying NBT structures
- 🔍 Path-based access using dot/bracket notation (`player.inventory[0].id`)
- 📝 Syntax-highlighted SNBT output for debugging
- ⚠️ Strict type validation and error handling
- 🌐 Browser and Node.js compatible

## Installation

```bash
npm install snbt-js
```

## Usage

### Parsing SNBT
```javascript
const { parseNbtString } = await import('snbt-js');

const nbtData = parseNbtString(`
{
  player: {
    name: "Steve",
    health: 20.0f,
    inventory: [
      { id: "minecraft:diamond_sword", Count: 1b },
      { id: "minecraft:cooked_beef", Count: 8b }
    ],
    position: [I; 125, 64, -312]
  }
}`);

console.log(nbtData.get('player.name').value); // "Steve"
```

### Creating NBT Programmatically
```javascript
const { NbtObject, NbtList, NbtString, NbtNumber } = await import('snbt-js');

const player = new NbtObject({
  name: new NbtString('Alex'),
  health: new NbtNumber(15.5, 'f'),
  skills: new NbtList([
    new NbtString('mining'),
    new NbtString('farming')
  ])
});

// Add armor items
player.addChild('armor', new NbtList([
  new NbtObject({ id: new NbtString('minecraft:iron_helmet') }),
  new NbtObject({ id: new NbtString('minecraft:diamond_chestplate') })
]));

console.log(player.text(true)); // Pretty-printed with syntax highlighting
```

### Modifying NBT
```javascript
// Update player position
player.set(['position', 0], new NbtNumber(130)); // X coordinate
player.set(['position', 1], new NbtNumber(65));  // Y coordinate
player.set(['position', 2], new NbtNumber(-305)); // Z coordinate

// Add new item to inventory
const inventory = player.get('inventory');
inventory.addChild(new NbtObject({
  id: new NbtString('minecraft:golden_apple'),
  Count: new NbtNumber(3, 'b')
}));
```

## API Documentation

[View full API documentation](./docs/api-reference.md)

## Contributing

Contributions are welcome! Please read the [contribution guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [Player Data Analyser](https://github.com/myworldzycpc/player-data-analyser) - Web-based player data analyser using this library
- [Bio Generator](https://github.com/TheRedMaker/theredmaker.github.io/tree/main/Biogenerator) - Summon command generator utilizing snbt-js (Formerly known as nbtcoder.js)
