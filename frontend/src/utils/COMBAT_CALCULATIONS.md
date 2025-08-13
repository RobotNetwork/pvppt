# RuneScape Combat Calculations Documentation

This document explains how the RuneScape combat calculations work in the PvP Performance Tracker.

## Overview

The combat calculation system implements real RuneScape combat mechanics including:
- **Deserved Damage Calculation**: Determines how much damage a player should deal based on their stats, gear, and prayers
- **Magic Luck Calculation**: Calculates magic accuracy and success rates
- **KO Chance Calculation**: Determines the probability of killing an opponent with a single hit

## Calculation Modes

The system supports three calculation modes:

1. **DEFAULT**: Uses the deserved damage values from the JSON payload (no recalculation)
2. **SETTINGS**: Uses user-configured combat levels and gear settings
3. **HISCORE_LOOKUP**: Fetches real player stats from the RuneScape hiscore API

## Combat Formulas

### Melee Max Hit Formula

```
Base Max Hit = floor(0.5 + (Strength Level + 8) / 64)
Bonus Max Hit = floor((Weapon Strength Bonus + Ring Strength Bonus) / 64)
Prayer Max Hit = floor(Base Max Hit × (Prayer Multiplier - 1))
Total Max Hit = Base Max Hit + Bonus Max Hit + Prayer Max Hit
```

**Example**: 99 Strength with Abyssal Whip (+82 strength) and Berserker Ring (+4 strength)
- Base Max Hit = floor(0.5 + (99 + 8) / 64) = floor(1.67) = 1
- Bonus Max Hit = floor((82 + 4) / 64) = floor(1.34) = 1
- Total Max Hit = 1 + 1 = 2

### Ranged Max Hit Formula

```
Base Max Hit = floor(0.5 + (Ranged Level + 8) / 64)
Bonus Max Hit = floor((Weapon Ranged Bonus + Ring Ranged Bonus + Ammo Bonus) / 64)
Prayer Max Hit = floor(Base Max Hit × (Prayer Multiplier - 1))
Total Max Hit = Base Max Hit + Bonus Max Hit + Prayer Max Hit
```

**Example**: 99 Ranged with Rune Crossbow (+91 ranged) and Diamond Bolts (e) (+105 ammo)
- Base Max Hit = floor(0.5 + (99 + 8) / 64) = floor(1.67) = 1
- Bonus Max Hit = floor((91 + 105) / 64) = floor(3.06) = 3
- Total Max Hit = 1 + 3 = 4

### Magic Max Hit Formula

Magic max hits are spell-specific rather than level-based:

| Spell Type | Max Hit |
|------------|---------|
| Barrage spells | 22 |
| Wave spells | 20 |
| Blast spells | 16 |
| Bolt spells | 12 |
| Default | floor(0.5 + (Magic Level + 8) / 64) |

### Accuracy Formula

```
Effective Attack = floor((Attack Level + 8) × Prayer Multiplier) + Weapon Bonus + Ring Bonus
Effective Defence = floor(Opponent Defence Level + 8) + Opponent Defence Bonus
Accuracy = Effective Attack / (Effective Attack + Effective Defence)
```

**Example**: 99 Attack with Abyssal Whip (+82 attack) and Piety (+20% attack) vs 99 Defence opponent
- Effective Attack = floor((99 + 8) × 1.20) + 82 = floor(128.4) + 82 = 128 + 82 = 210
- Effective Defence = floor(99 + 8) = 107
- Accuracy = 210 / (210 + 107) = 210 / 317 = 0.663 (66.3%)

## Prayer Multipliers

### Attack Prayers
- **Clarity of Thought**: +5% attack
- **Improved Reflexes**: +10% attack
- **Incredible Reflexes**: +15% attack
- **Chivalry**: +15% attack, +18% defence, +20% strength
- **Piety**: +20% attack, +25% defence, +23% strength
- **Rigour**: +20% ranged attack, +25% ranged defence, +23% ranged strength
- **Augury**: +25% magic attack, +25% magic defence, +25% magic damage

### Strength Prayers
- **Burst of Strength**: +5% strength
- **Superhuman Strength**: +10% strength
- **Ultimate Strength**: +15% strength

### Ranged Prayers
- **Sharp Eye**: +5% ranged attack and strength
- **Hawk Eye**: +10% ranged attack and strength
- **Eagle Eye**: +15% ranged attack and strength

### Magic Prayers
- **Mystic Will**: +5% magic attack
- **Mystic Lore**: +10% magic attack
- **Mystic Might**: +15% magic attack

## Weapon Bonuses

### Melee Weapons
| Weapon | Attack Bonus | Strength Bonus |
|--------|--------------|----------------|
| Abyssal Whip | 82 | 82 |
| Abyssal Tentacle | 90 | 86 |
| Dragon Scimitar | 67 | 66 |
| Dragon Claws | 60 | 60 |
| Armadyl Godsword | 118 | 132 |
| Bandos Godsword | 132 | 148 |
| Saradomin Godsword | 118 | 132 |
| Zamorak Godsword | 118 | 132 |

### Ranged Weapons
| Weapon | Attack Bonus | Strength Bonus |
|--------|--------------|----------------|
| Magic Shortbow | 69 | 69 |
| Magic Longbow | 69 | 69 |
| Rune Crossbow | 90 | 91 |
| Dragon Crossbow | 94 | 95 |
| Armadyl Crossbow | 100 | 122 |

### Magic Weapons
| Weapon | Attack Bonus | Strength Bonus |
|--------|--------------|----------------|
| Staff of Water/Earth/Fire/Air | 10 | 10 |
| Mystic Staff | 40 | 40 |
| Staff of Light | 62 | 62 |
| Staff of Death | 65 | 65 |
| Staff of the Dead | 70 | 70 |

## Ring Bonuses

| Ring | Attack | Strength | Defence | Magic | Ranged |
|------|--------|----------|---------|-------|--------|
| Berserker Ring | 0 | +4 | 0 | 0 | 0 |
| Berserker Ring (i) | 0 | +8 | 0 | 0 | 0 |
| Archers Ring | 0 | 0 | 0 | 0 | +4 |
| Archers Ring (i) | 0 | 0 | 0 | 0 | +8 |
| Seers Ring | 0 | 0 | 0 | +4 | 0 |
| Seers Ring (i) | 0 | 0 | 0 | +8 | 0 |
| Ring of Suffering | 0 | 0 | +4 | 0 | 0 |
| Ring of Suffering (i) | 0 | 0 | +8 | 0 | 0 |
| Brimstone Ring | 0 | +4 | 0 | +4 | 0 |
| Magus Ring | 0 | 0 | 0 | +8 | 0 |
| Venator Ring | 0 | 0 | 0 | 0 | +8 |
| Bellator Ring | 0 | +8 | 0 | 0 | 0 |
| Ultor Ring | +8 | 0 | 0 | 0 | 0 |
| Ring of Shadows | 0 | +4 | 0 | +4 | +4 |

## Ammo Bonuses

### Bolts
| Ammo | Ranged Bonus |
|------|--------------|
| Runite Bolts | 115 |
| Dragonstone Bolts (e) | 122 |
| Diamond Bolts (e) | 105 |
| Dragonstone Dragon Bolts (e) | 122 |
| Opal Dragon Bolts (e) | 105 |
| Diamond Dragon Bolts (e) | 105 |

### Darts
| Ammo | Ranged Bonus |
|------|--------------|
| Adamant Darts | 60 |
| Rune Darts | 100 |
| Dragon Darts | 120 |

## Deserved Damage Calculation

Deserved damage is calculated as:
```
Deserved Damage = Max Hit × Accuracy
```

This represents the expected damage output considering:
- Player combat levels
- Weapon and gear bonuses
- Prayer effects
- Opponent defence
- Combat style (melee, ranged, magic)

## Magic Luck Calculation

Magic luck represents the probability of successfully hitting with magic:
```
Magic Luck = Magic Accuracy
```

Magic accuracy is calculated using the same accuracy formula but with:
- Magic level instead of attack level
- Magic weapon bonuses
- Magic ring bonuses
- Magic prayer multipliers
- Opponent magic defence

## KO Chance Calculation

KO chance represents the probability of killing an opponent with a single hit:

```
if (Max Hit >= Opponent HP):
    KO Chance = 100%
else:
    KO Chance = min(80%, (Max Hit / Opponent HP) × 0.8)
```

The 80% cap for non-lethal hits reflects the fact that even high-damage hits don't guarantee a kill due to various game mechanics.

## Configuration Integration

The calculation system integrates with user configuration settings:

- **Combat Levels**: Attack, Strength, Defence, Ranged, Magic, HP
- **Gear Choices**: Ring selection, bolt/ammo preferences
- **Calculation Mode**: Whether to use settings, hiscore lookup, or default data

## Hiscore Integration

When using `HISCORE_LOOKUP` mode, the system:
1. Fetches real player stats from the RuneScape hiscore API
2. Uses actual combat levels for calculations
3. Falls back to configured defaults if lookup fails
4. Ignores online status (always returns false as requested)

## Testing

The system includes comprehensive tests covering:
- Prayer multiplier calculations
- Weapon bonus applications
- Ring and ammo bonus effects
- Combat level scaling
- Magic spell calculations
- KO chance logic
- Different calculation modes
- Integration scenarios

## Performance Considerations

- Calculations are performed on-demand during metric recalculation
- Hiscore lookups are cached to avoid repeated API calls
- Complex calculations are optimized for real-time performance
- Fallback mechanisms ensure system stability

## Future Enhancements

Potential improvements could include:
- More comprehensive weapon and gear databases
- Advanced prayer effect combinations
- Special attack damage calculations
- PvP world-specific modifiers
- Historical accuracy tracking
- Machine learning-based prediction models
