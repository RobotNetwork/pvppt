import {
  CalculationEngine,
  DeservedDamageCalculator,
  MagicLuckCalculator,
  KoChanceCalculator,
  HiscoreLookupService,
  PvpTrackerConfig,
  CalculationMode,
  FightData,
  Fighter,
  FightLogEntry,
  CombatLevels
} from '../types';

// ================================= RuneScape Combat Constants =================================

const COMBAT_CONSTANTS = {
  // Prayer multipliers
  PRAYER_MULTIPLIERS: {
    // Attack prayers
    CLARITY_OF_THOUGHT: 1.05,      // +5% attack
    IMPROVED_REFLEXES: 1.10,       // +10% attack
    INCREDIBLE_REFLEXES: 1.15,     // +15% attack
    CHIVALRY: 1.15,                // +15% attack, +18% defence, +20% strength
    PIETY: 1.20,                   // +20% attack, +25% defence, +23% strength
    RIGOUR: 1.20,                  // +20% ranged attack, +25% ranged defence, +23% ranged strength
    AUGURY: 1.25,                  // +25% magic attack, +25% magic defence, +25% magic damage
    
    // Strength prayers
    BURST_OF_STRENGTH: 1.05,      // +5% strength
    SUPERHUMAN_STRENGTH: 1.10,     // +10% strength
    ULTIMATE_STRENGTH: 1.15,       // +15% strength
    
    // Ranged prayers
    SHARP_EYE: 1.05,               // +5% ranged attack and strength
    HAWK_EYE: 1.10,                // +10% ranged attack and strength
    EAGLE_EYE: 1.15,               // +15% ranged attack and strength
    
    // Magic prayers
    MYSTIC_WILL: 1.05,             // +5% magic attack
    MYSTIC_LORE: 1.10,             // +10% magic attack
    MYSTIC_MIGHT: 1.15,            // +15% magic attack
  },
  
  // Weapon bonuses (simplified - in practice these would be more comprehensive)
  WEAPON_BONUSES: {
    // Melee weapons
    ABYSSAL_WHIP: { attack: 82, strength: 82 },
    ABYSSAL_TENTACLE: { attack: 90, strength: 86 },
    DRAGON_SCIMITAR: { attack: 67, strength: 66 },
    DRAGON_CLAWS: { attack: 60, strength: 60 },
    ARMADYL_GODSWORD: { attack: 118, strength: 132 },
    BANDOS_GODSWORD: { attack: 132, strength: 148 },
    SARADOMIN_GODSWORD: { attack: 118, strength: 132 },
    ZAMORAK_GODSWORD: { attack: 118, strength: 132 },
    
    // Ranged weapons
    MAGIC_SHORTBOW: { attack: 69, strength: 69 },
    MAGIC_LONGBOW: { attack: 69, strength: 69 },
    RUNE_CROSSBOW: { attack: 90, strength: 91 },
    DRAGON_CROSSBOW: { attack: 94, strength: 95 },
    ARMADYL_CROSSBOW: { attack: 100, strength: 122 },
    
    // Magic weapons
    STAFF_OF_WATER: { attack: 10, strength: 10 },
    STAFF_OF_EARTH: { attack: 10, strength: 10 },
    STAFF_OF_FIRE: { attack: 10, strength: 10 },
    STAFF_OF_AIR: { attack: 10, strength: 10 },
    MYSTIC_STAFF: { attack: 40, strength: 40 },
    STAFF_OF_LIGHT: { attack: 62, strength: 62 },
    STAFF_OF_DEATH: { attack: 65, strength: 65 },
    STAFF_OF_THE_DEAD: { attack: 70, strength: 70 },
  },
  
  // Ring bonuses
  RING_BONUSES: {
    BERSERKER_RING: { strength: 4 },
    BERSERKER_RING_I: { strength: 8 },
    ARCHERS_RING: { ranged: 4 },
    ARCHERS_RING_I: { ranged: 8 },
    SEERS_RING: { magic: 4 },
    SEERS_RING_I: { magic: 8 },
    RING_OF_SUFFERING: { defence: 4 },
    RING_OF_SUFFERING_I: { defence: 8 },
    BRIMSTONE_RING: { strength: 4, magic: 4 },
    MAGUS_RING: { magic: 8 },
    VENATOR_RING: { ranged: 8 },
    BELLATOR_RING: { strength: 8 },
    ULTOR_RING: { attack: 8 },
    RING_OF_SHADOWS: { strength: 4, magic: 4, ranged: 4 }
  },
  
  // Ammo bonuses
  AMMO_BONUSES: {
    RUNITE_BOLTS: { ranged: 115 },
    DRAGONSTONE_BOLTS_E: { ranged: 122 },
    DIAMOND_BOLTS_E: { ranged: 105 },
    DRAGONSTONE_DRAGON_BOLTS_E: { ranged: 122 },
    OPAL_DRAGON_BOLTS_E: { ranged: 105 },
    DIAMOND_DRAGON_BOLTS_E: { ranged: 105 },
    ADAMANT_DARTS: { ranged: 60 },
    RUNE_DARTS: { ranged: 100 },
    DRAGON_DARTS: { ranged: 120 }
  }
};

// ================================= Utility Functions =================================

function getPrayerMultiplier(prayerName: string | null): { attack: number; strength: number; defence: number } {
  if (!prayerName) return { attack: 1.0, strength: 1.0, defence: 1.0 };
  
  const prayer = prayerName.toUpperCase();
  
  // Attack prayers
  if (prayer.includes('CLARITY_OF_THOUGHT')) return { attack: 1.05, strength: 1.0, defence: 1.0 };
  if (prayer.includes('IMPROVED_REFLEXES')) return { attack: 1.10, strength: 1.0, defence: 1.0 };
  if (prayer.includes('INCREDIBLE_REFLEXES')) return { attack: 1.15, strength: 1.0, defence: 1.0 };
  if (prayer.includes('CHIVALRY')) return { attack: 1.15, strength: 1.18, defence: 1.18 };
  if (prayer.includes('PIETY')) return { attack: 1.20, strength: 1.23, defence: 1.25 };
  if (prayer.includes('RIGOUR')) return { attack: 1.20, strength: 1.23, defence: 1.25 };
  if (prayer.includes('AUGURY')) return { attack: 1.25, strength: 1.25, defence: 1.25 };
  
  // Strength prayers
  if (prayer.includes('BURST_OF_STRENGTH')) return { attack: 1.0, strength: 1.05, defence: 1.0 };
  if (prayer.includes('SUPERHUMAN_STRENGTH')) return { attack: 1.0, strength: 1.10, defence: 1.0 };
  if (prayer.includes('ULTIMATE_STRENGTH')) return { attack: 1.0, strength: 1.15, defence: 1.0 };
  
  // Ranged prayers
  if (prayer.includes('SHARP_EYE')) return { attack: 1.05, strength: 1.05, defence: 1.0 };
  if (prayer.includes('HAWK_EYE')) return { attack: 1.10, strength: 1.10, defence: 1.0 };
  if (prayer.includes('EAGLE_EYE')) return { attack: 1.15, strength: 1.15, defence: 1.0 };
  
  // Magic prayers
  if (prayer.includes('MYSTIC_WILL')) return { attack: 1.05, strength: 1.05, defence: 1.0 };
  if (prayer.includes('MYSTIC_LORE')) return { attack: 1.10, strength: 1.10, defence: 1.0 };
  if (prayer.includes('MYSTIC_MIGHT')) return { attack: 1.15, strength: 1.15, defence: 1.0 };
  
  return { attack: 1.0, strength: 1.0, defence: 1.0 };
}

function getWeaponBonus(animationData: string | null): { attack: number; strength: number } {
  if (!animationData) return { attack: 0, strength: 0 };
  
  const animation = animationData.toUpperCase();
  
  // Melee weapons
  if (animation.includes('ABYSSAL_WHIP')) return COMBAT_CONSTANTS.WEAPON_BONUSES.ABYSSAL_WHIP;
  if (animation.includes('ABYSSAL_TENTACLE')) return COMBAT_CONSTANTS.WEAPON_BONUSES.ABYSSAL_TENTACLE;
  if (animation.includes('DRAGON_SCIMITAR')) return COMBAT_CONSTANTS.WEAPON_BONUSES.DRAGON_SCIMITAR;
  if (animation.includes('DRAGON_CLAWS')) return COMBAT_CONSTANTS.WEAPON_BONUSES.DRAGON_CLAWS;
  if (animation.includes('ARMADYL_GODSWORD')) return COMBAT_CONSTANTS.WEAPON_BONUSES.ARMADYL_GODSWORD;
  if (animation.includes('BANDOS_GODSWORD')) return COMBAT_CONSTANTS.WEAPON_BONUSES.BANDOS_GODSWORD;
  if (animation.includes('SARADOMIN_GODSWORD')) return COMBAT_CONSTANTS.WEAPON_BONUSES.SARADOMIN_GODSWORD;
  if (animation.includes('ZAMORAK_GODSWORD')) return COMBAT_CONSTANTS.WEAPON_BONUSES.ZAMORAK_GODSWORD;
  
  // Ranged weapons
  if (animation.includes('MAGIC_SHORTBOW') || animation.includes('MAGIC_LONGBOW')) return COMBAT_CONSTANTS.WEAPON_BONUSES.MAGIC_SHORTBOW;
  if (animation.includes('RUNE_CROSSBOW')) return COMBAT_CONSTANTS.WEAPON_BONUSES.RUNE_CROSSBOW;
  if (animation.includes('DRAGON_CROSSBOW')) return COMBAT_CONSTANTS.WEAPON_BONUSES.DRAGON_CROSSBOW;
  if (animation.includes('ARMADYL_CROSSBOW')) return COMBAT_CONSTANTS.WEAPON_BONUSES.ARMADYL_CROSSBOW;
  
  // Magic weapons
  if (animation.includes('STAFF_OF_WATER') || animation.includes('STAFF_OF_EARTH') || 
      animation.includes('STAFF_OF_FIRE') || animation.includes('STAFF_OF_AIR')) return COMBAT_CONSTANTS.WEAPON_BONUSES.STAFF_OF_WATER;
  if (animation.includes('MYSTIC_STAFF')) return COMBAT_CONSTANTS.WEAPON_BONUSES.MYSTIC_STAFF;
  if (animation.includes('STAFF_OF_LIGHT')) return COMBAT_CONSTANTS.WEAPON_BONUSES.STAFF_OF_LIGHT;
  if (animation.includes('STAFF_OF_DEATH')) return COMBAT_CONSTANTS.WEAPON_BONUSES.STAFF_OF_DEATH;
  if (animation.includes('STAFF_OF_THE_DEAD')) return COMBAT_CONSTANTS.WEAPON_BONUSES.STAFF_OF_THE_DEAD;
  
  // Default weapon bonuses
  if (animation.includes('MELEE')) return { attack: 50, strength: 50 };
  if (animation.includes('RANGED')) return { attack: 60, strength: 60 };
  if (animation.includes('MAGIC')) return { attack: 20, strength: 20 };
  
  return { attack: 0, strength: 0 };
}

function getRingBonus(ringChoice: string): { attack: number; strength: number; defence: number; magic: number; ranged: number } {
  const ring = ringChoice.toUpperCase();
  
  switch (ring) {
    case 'BERSERKER_RING':
      return { attack: 0, strength: COMBAT_CONSTANTS.RING_BONUSES.BERSERKER_RING.strength, defence: 0, magic: 0, ranged: 0 };
    case 'BERSERKER_RING_I':
      return { attack: 0, strength: COMBAT_CONSTANTS.RING_BONUSES.BERSERKER_RING_I.strength, defence: 0, magic: 0, ranged: 0 };
    case 'ARCHERS_RING':
      return { attack: 0, strength: 0, defence: 0, magic: 0, ranged: COMBAT_CONSTANTS.RING_BONUSES.ARCHERS_RING.ranged };
    case 'ARCHERS_RING_I':
      return { attack: 0, strength: 0, defence: 0, magic: 0, ranged: COMBAT_CONSTANTS.RING_BONUSES.ARCHERS_RING_I.ranged };
    case 'SEERS_RING':
      return { attack: 0, strength: 0, defence: 0, magic: COMBAT_CONSTANTS.RING_BONUSES.SEERS_RING.magic, ranged: 0 };
    case 'SEERS_RING_I':
      return { attack: 0, strength: 0, defence: 0, magic: COMBAT_CONSTANTS.RING_BONUSES.SEERS_RING_I.magic, ranged: 0 };
    case 'RING_OF_SUFFERING':
      return { attack: 0, strength: 0, defence: COMBAT_CONSTANTS.RING_BONUSES.RING_OF_SUFFERING.defence, magic: 0, ranged: 0 };
    case 'RING_OF_SUFFERING_I':
      return { attack: 0, strength: 0, defence: 0, magic: 0, ranged: 0 };
    case 'BRIMSTONE_RING':
      return { attack: 0, strength: COMBAT_CONSTANTS.RING_BONUSES.BRIMSTONE_RING.strength, defence: 0, magic: COMBAT_CONSTANTS.RING_BONUSES.BRIMSTONE_RING.magic, ranged: 0 };
    case 'MAGUS_RING':
      return { attack: 0, strength: 0, defence: 0, magic: COMBAT_CONSTANTS.RING_BONUSES.MAGUS_RING.magic, ranged: 0 };
    case 'VENATOR_RING':
      return { attack: 0, strength: 0, defence: 0, magic: 0, ranged: COMBAT_CONSTANTS.RING_BONUSES.VENATOR_RING.ranged };
    case 'BELLATOR_RING':
      return { attack: 0, strength: COMBAT_CONSTANTS.RING_BONUSES.BELLATOR_RING.strength, defence: 0, magic: 0, ranged: 0 };
    case 'ULTOR_RING':
      return { attack: COMBAT_CONSTANTS.RING_BONUSES.ULTOR_RING.attack, strength: 0, defence: 0, magic: 0, ranged: 0 };
    case 'RING_OF_SHADOWS':
      return { attack: 0, strength: COMBAT_CONSTANTS.RING_BONUSES.RING_OF_SHADOWS.strength, defence: 0, magic: COMBAT_CONSTANTS.RING_BONUSES.RING_OF_SHADOWS.magic, ranged: COMBAT_CONSTANTS.RING_BONUSES.RING_OF_SHADOWS.ranged };
    default:
      return { attack: 0, strength: 0, defence: 0, magic: 0, ranged: 0 };
  }
}

function getAmmoBonus(ammoChoice: string, isStrongBolt: boolean = false): number {
  const ammo = ammoChoice.toUpperCase();
  
  if (isStrongBolt) {
    switch (ammo) {
      case 'DRAGONSTONE_DRAGON_BOLTS_E': return COMBAT_CONSTANTS.AMMO_BONUSES.DRAGONSTONE_DRAGON_BOLTS_E.ranged;
      case 'OPAL_DRAGON_BOLTS_E': return COMBAT_CONSTANTS.AMMO_BONUSES.OPAL_DRAGON_BOLTS_E.ranged;
      case 'DIAMOND_DRAGON_BOLTS_E': return COMBAT_CONSTANTS.AMMO_BONUSES.DIAMOND_DRAGON_BOLTS_E.ranged;
      default: return 0;
    }
  } else {
    switch (ammo) {
      case 'RUNITE_BOLTS': return COMBAT_CONSTANTS.AMMO_BONUSES.RUNITE_BOLTS.ranged;
      case 'DRAGONSTONE_BOLTS_E': return COMBAT_CONSTANTS.AMMO_BONUSES.DRAGONSTONE_BOLTS_E.ranged;
      case 'DIAMOND_BOLTS_E': return COMBAT_CONSTANTS.AMMO_BONUSES.DIAMOND_BOLTS_E.ranged;
      case 'ADAMANT_DARTS': return COMBAT_CONSTANTS.AMMO_BONUSES.ADAMANT_DARTS.ranged;
      case 'RUNE_DARTS': return COMBAT_CONSTANTS.AMMO_BONUSES.RUNE_DARTS.ranged;
      case 'DRAGON_DARTS': return COMBAT_CONSTANTS.AMMO_BONUSES.DRAGON_DARTS.ranged;
      default: return 0;
    }
  }
}

// ================================= RuneScape Combat Formulas =================================

function calculateMeleeMaxHit(
  strengthLevel: number,
  weaponBonus: number,
  ringBonus: number,
  prayerMultiplier: number
): number {
  // RuneScape melee max hit formula (more accurate)
  const baseMaxHit = Math.floor(0.5 + (strengthLevel + 8) / 64);
  const bonusMaxHit = Math.floor((weaponBonus + ringBonus) / 64);
  const prayerMaxHit = Math.floor(baseMaxHit * (prayerMultiplier - 1));
  
  // Apply prayer multiplier to the total
  const totalMaxHit = baseMaxHit + bonusMaxHit + prayerMaxHit;
  
  return totalMaxHit;
}

function calculateRangedMaxHit(
  rangedLevel: number,
  weaponBonus: number,
  ringBonus: number,
  ammoBonus: number,
  prayerMultiplier: number
): number {
  // RuneScape ranged max hit formula (more accurate)
  const baseMaxHit = Math.floor(0.5 + (rangedLevel + 8) / 64);
  const bonusMaxHit = Math.floor((weaponBonus + ringBonus + ammoBonus) / 64);
  const prayerMaxHit = Math.floor(baseMaxHit * (prayerMultiplier - 1));
  
  // Apply prayer multiplier to the total
  const totalMaxHit = baseMaxHit + bonusMaxHit + prayerMaxHit;
  
  return totalMaxHit;
}

function calculateMagicMaxHit(
  magicLevel: number,
  weaponBonus: number,
  ringBonus: number,
  prayerMultiplier: number,
  spellType: string
): number {
  // RuneScape magic max hit formula (more accurate)
  let baseMaxHit = 0;
  
  // Spell-specific max hits
  if (spellType.includes('GHOST_BARRAGE')) {
    baseMaxHit = 24;
  } else if (spellType.includes('BARRAGE')) {
    baseMaxHit = 22;
  } else if (spellType.includes('BLAST')) {
    baseMaxHit = 16;
  } else if (spellType.includes('BOLT')) {
    baseMaxHit = 12;
  } else if (spellType.includes('WAVE')) {
    baseMaxHit = 20;
  } else {
    // Default magic max hit
    baseMaxHit = Math.floor(0.5 + (magicLevel + 8) / 64);
  }
  
  const bonusMaxHit = Math.floor((weaponBonus + ringBonus) / 64);
  const prayerMaxHit = Math.floor(baseMaxHit * (prayerMultiplier - 1));
  
  // Apply prayer multiplier to the total
  const totalMaxHit = baseMaxHit + bonusMaxHit + prayerMaxHit;
  
  return totalMaxHit;
}

function calculateAccuracy(
  attackLevel: number,
  weaponBonus: number,
  ringBonus: number,
  prayerMultiplier: number,
  opponentDefenceLevel: number,
  opponentDefenceBonus: number,
  attackStyle: string
): number {
  // RuneScape accuracy formula
  const effectiveAttack = Math.floor((attackLevel + 8) * prayerMultiplier) + weaponBonus + ringBonus;
  const effectiveDefence = Math.floor((opponentDefenceLevel + 8)) + opponentDefenceBonus;
  
  // Base accuracy calculation
  let accuracy = 0;
  
  if (attackStyle === 'MELEE') {
    accuracy = effectiveAttack / (effectiveAttack + effectiveDefence);
  } else if (attackStyle === 'RANGED') {
    accuracy = effectiveAttack / (effectiveAttack + effectiveDefence);
  } else if (attackStyle === 'MAGIC') {
    // Magic accuracy is more complex and depends on opponent magic defence
    accuracy = effectiveAttack / (effectiveAttack + effectiveDefence);
  }
  
  // Apply some randomization and bounds
  accuracy = Math.max(0.1, Math.min(0.95, accuracy));
  
  return accuracy;
}

// ================================= Updated Hiscore Service =================================

export class RuneScapeHiscoreService implements HiscoreLookupService {
  private readonly HISCORE_API_BASE = 'https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=';

  async lookupPlayerStats(username: string): Promise<CombatLevels> {
    try {
      const response = await fetch(`${this.HISCORE_API_BASE}${encodeURIComponent(username)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch hiscore data: ${response.status}`);
      }

      const data = await response.text();
      const lines = data.split('\n');
      
      // RuneScape hiscore format: rank, level, experience
      // Combat skills are at specific indices
      const attackLevel = parseInt(lines[1]?.split(',')[1]) || 1;
      const defenceLevel = parseInt(lines[2]?.split(',')[1]) || 1;
      const strengthLevel = parseInt(lines[3]?.split(',')[1]) || 1;
      const hitpointsLevel = parseInt(lines[4]?.split(',')[1]) || 10;
      const rangedLevel = parseInt(lines[5]?.split(',')[1]) || 1;
      const magicLevel = parseInt(lines[7]?.split(',')[1]) || 1;

      return {
        atk: attackLevel,
        str: strengthLevel,
        def: defenceLevel,
        range: rangedLevel,
        mage: magicLevel,
        hp: hitpointsLevel
      };
    } catch (error) {
      console.error('Error looking up player stats:', error);
      // Return default levels if lookup fails
      return {
        atk: 99,
        str: 99,
        def: 99,
        range: 99,
        mage: 99,
        hp: 99
      };
    }
  }
}

// ================================= Real Deserved Damage Calculator =================================

export class DefaultDeservedDamageCalculator implements DeservedDamageCalculator {
  calculateDeservedDamage(
    attackData: any,
    config: PvpTrackerConfig,
    calculationMode: CalculationMode
  ): number {
    if (calculationMode === CalculationMode.DEFAULT) {
      // Use the deserved damage from the JSON payload
      return attackData.deservedDamage || 0;
    }

    // Get combat levels based on calculation mode
    let attackerLevels: CombatLevels;
    let opponentLevels: CombatLevels;
    
    if (calculationMode === CalculationMode.HISCORE_LOOKUP) {
      // Use hiscore data if available
      attackerLevels = attackData.attackerLevels || {
        atk: config.attackLevel,
        str: config.strengthLevel,
        def: config.defenceLevel,
        range: config.rangedLevel,
        mage: config.magicLevel,
        hp: 99
      };
      opponentLevels = {
        atk: 99, str: 99, def: 99, range: 99, mage: 99, hp: 99
      };
    } else {
      // Use configured settings
      attackerLevels = {
        atk: config.attackLevel,
        str: config.strengthLevel,
        def: config.defenceLevel,
        range: config.rangedLevel,
        mage: config.magicLevel,
        hp: 99
      };
      opponentLevels = {
        atk: 99, str: 99, def: 99, range: 99, mage: 99, hp: 99
      };
    }

    const animationData = attackData.animationData;
    const attackerOverhead = attackData.attackerOverhead;
    
    // Determine attack style
    let attackStyle = 'MELEE';
    if (animationData?.includes('RANGED') || animationData?.includes('CROSSBOW') || 
        animationData?.includes('BOW') || animationData?.includes('DART')) {
      attackStyle = 'RANGED';
    } else if (animationData?.includes('MAGIC') || animationData?.includes('SPELL')) {
      attackStyle = 'MAGIC';
    }

    // Get prayer multipliers
    const prayerMultipliers = getPrayerMultiplier(attackerOverhead);
    
    // Get weapon and gear bonuses
    const weaponBonus = getWeaponBonus(animationData);
    const ringBonus = getRingBonus(config.ringChoice);
    
    // Calculate max hit based on attack style
    let maxHit = 0;
    
    if (attackStyle === 'MELEE') {
      maxHit = calculateMeleeMaxHit(
        attackerLevels.str,
        weaponBonus.strength,
        ringBonus.strength,
        prayerMultipliers.strength
      );
    } else if (attackStyle === 'RANGED') {
      const ammoBonus = getAmmoBonus(config.boltChoice, false);
      maxHit = calculateRangedMaxHit(
        attackerLevels.range,
        weaponBonus.attack,
        ringBonus.ranged,
        ammoBonus,
        prayerMultipliers.strength
      );
    } else if (attackStyle === 'MAGIC') {
      maxHit = calculateMagicMaxHit(
        attackerLevels.mage,
        weaponBonus.strength,
        ringBonus.magic,
        prayerMultipliers.strength,
        animationData || ''
      );
    }

    // Calculate accuracy
    const accuracy = calculateAccuracy(
      attackStyle === 'MELEE' ? attackerLevels.atk : 
      attackStyle === 'RANGED' ? attackerLevels.range : attackerLevels.mage,
      weaponBonus.attack,
      ringBonus.attack,
      prayerMultipliers.attack,
      opponentLevels.def,
      0, // Simplified opponent defence bonus
      attackStyle
    );

    // Deserved damage = max hit * accuracy
    return Math.floor(maxHit * accuracy);
  }
}

// ================================= Real Magic Luck Calculator =================================

export class DefaultMagicLuckCalculator implements MagicLuckCalculator {
  calculateMagicLuck(
    magicData: any,
    config: PvpTrackerConfig,
    calculationMode: CalculationMode
  ): number {
    if (calculationMode === CalculationMode.DEFAULT) {
      // Use the magic luck data from the JSON payload
      return magicData.magicLuck || 0;
    }

    // Get magic level based on calculation mode
    let magicLevel: number;
    
    if (calculationMode === CalculationMode.HISCORE_LOOKUP) {
      magicLevel = magicData.attackerLevels?.mage || config.magicLevel;
    } else {
      magicLevel = config.magicLevel;
    }

    const animationData = magicData.animationData;
    const attackerOverhead = magicData.attackerOverhead;
    
    // Get prayer multipliers
    const prayerMultipliers = getPrayerMultiplier(attackerOverhead);
    
    // Get weapon and gear bonuses
    const weaponBonus = getWeaponBonus(animationData);
    const ringBonus = getRingBonus(config.ringChoice);
    
    // Calculate magic accuracy
    const accuracy = calculateAccuracy(
      magicLevel,
      weaponBonus.attack,
      ringBonus.magic,
      prayerMultipliers.attack,
      99, // Default opponent magic defence
      0,  // Default opponent magic defence bonus
      'MAGIC'
    );

    // Magic luck is essentially the accuracy percentage
    return accuracy;
  }
}

// ================================= Real KO Chance Calculator =================================

export class DefaultKoChanceCalculator implements KoChanceCalculator {
  calculateKoChance(
    attackData: any,
    opponentHp: number,
    config: PvpTrackerConfig,
    calculationMode: CalculationMode
  ): number {
    if (calculationMode === CalculationMode.DEFAULT) {
      // Use the KO chance from the JSON payload
      return attackData.koChance || 0;
    }

    // Get combat levels based on calculation mode
    let attackerLevels: CombatLevels;
    
    if (calculationMode === CalculationMode.HISCORE_LOOKUP) {
      attackerLevels = attackData.attackerLevels || {
        atk: config.attackLevel,
        str: config.strengthLevel,
        def: config.defenceLevel,
        range: config.rangedLevel,
        mage: config.magicLevel,
        hp: 99
      };
    } else {
      attackerLevels = {
        atk: config.attackLevel,
        str: config.strengthLevel,
        def: config.defenceLevel,
        range: config.rangedLevel,
        mage: config.magicLevel,
        hp: 99
      };
    }

    const animationData = attackData.animationData;
    const attackerOverhead = attackData.attackerOverhead;
    
    // Get prayer multipliers
    const prayerMultipliers = getPrayerMultiplier(attackerOverhead);
    
    // Get weapon and gear bonuses
    const weaponBonus = getWeaponBonus(animationData);
    const ringBonus = getRingBonus(config.ringChoice);
    
    // Determine attack style
    let attackStyle = 'MELEE';
    if (animationData?.includes('RANGED') || animationData?.includes('CROSSBOW') || 
        animationData?.includes('BOW') || animationData?.includes('DART')) {
      attackStyle = 'RANGED';
    } else if (animationData?.includes('MAGIC') || animationData?.includes('SPELL')) {
      attackStyle = 'MAGIC';
    }

    // Use provided max hit if available, otherwise calculate it
    let maxHit = attackData.maxHit || 0;
    
    if (maxHit === 0) {
      // Calculate max hit if not provided
      if (attackStyle === 'MELEE') {
        maxHit = calculateMeleeMaxHit(
          attackerLevels.str,
          weaponBonus.strength,
          ringBonus.strength,
          prayerMultipliers.strength
        );
      } else if (attackStyle === 'RANGED') {
        const ammoBonus = getAmmoBonus(config.boltChoice, false);
        maxHit = calculateRangedMaxHit(
          attackerLevels.range,
          weaponBonus.attack,
          ringBonus.ranged,
          ammoBonus,
          prayerMultipliers.strength
        );
      } else if (attackStyle === 'MAGIC') {
        maxHit = calculateMagicMaxHit(
          attackerLevels.mage,
          weaponBonus.strength,
          ringBonus.magic,
          prayerMultipliers.strength,
          animationData || ''
        );
      }
    }
    
    // If max hit can kill, 100% KO chance
    if (maxHit >= opponentHp) {
      return 1.0;
    }
    
    // Calculate KO chance based on damage potential vs current HP
    // This is a simplified formula - in practice, it would be more complex
    const damageRatio = maxHit / opponentHp;
    const koChance = Math.max(0, Math.min(1, damageRatio * 0.8)); // Cap at 80% for non-lethal hits
    
    return koChance;
  }
}

// ================================= Main Calculation Engine =================================

export class PvpCalculationEngine implements CalculationEngine {
  deservedDamageCalculator: DeservedDamageCalculator;
  magicLuckCalculator: MagicLuckCalculator;
  koChanceCalculator: KoChanceCalculator;
  hiscoreLookupService: HiscoreLookupService;

  constructor() {
    this.deservedDamageCalculator = new DefaultDeservedDamageCalculator();
    this.magicLuckCalculator = new DefaultMagicLuckCalculator();
    this.koChanceCalculator = new DefaultKoChanceCalculator();
    this.hiscoreLookupService = new RuneScapeHiscoreService();
  }

  async recalculateMetrics(
    fightData: FightData,
    config: PvpTrackerConfig,
    calculationMode: CalculationMode
  ): Promise<FightData> {
    try {
      // Create a deep copy of the fight data to avoid mutating the original
      const recalculatedFightData: FightData = {
        ...fightData,
        competitor: { ...fightData.competitor },
        opponent: { ...fightData.opponent }
      };

      // Recalculate competitor metrics
      if (recalculatedFightData.competitor.fightLogEntries) {
        recalculatedFightData.competitor.fightLogEntries = 
          await this.recalculateFightLogEntries(
            recalculatedFightData.competitor.fightLogEntries,
            config,
            calculationMode
          );
      }

      // Recalculate opponent metrics
      if (recalculatedFightData.opponent.fightLogEntries) {
        recalculatedFightData.opponent.fightLogEntries = 
          await this.recalculateFightLogEntries(
            recalculatedFightData.opponent.fightLogEntries,
            config,
            calculationMode
          );
      }

      // Recalculate overall fighter metrics
      recalculatedFightData.competitor = this.recalculateFighterMetrics(
        recalculatedFightData.competitor,
        config,
        calculationMode
      );
      
      recalculatedFightData.opponent = this.recalculateFighterMetrics(
        recalculatedFightData.opponent,
        config,
        calculationMode
      );

      return recalculatedFightData;
    } catch (error) {
      console.error('Error recalculating metrics:', error);
      return fightData; // Return original data if recalculation fails
    }
  }

  private async recalculateFightLogEntries(
    entries: FightLogEntry[],
    config: PvpTrackerConfig,
    calculationMode: CalculationMode
  ): Promise<FightLogEntry[]> {
    return entries.map(entry => {
      const recalculatedEntry = { ...entry };

      // Recalculate deserved damage
      if (entry.animationData) {
        recalculatedEntry.deservedDamage = this.deservedDamageCalculator.calculateDeservedDamage(
          entry,
          config,
          calculationMode
        );
      }

      // Recalculate KO chance
      if (entry.estimatedHpBeforeHit !== null && entry.opponentMaxHp !== null) {
        recalculatedEntry.koChance = this.koChanceCalculator.calculateKoChance(
          entry,
          entry.estimatedHpBeforeHit,
          config,
          calculationMode
        );
      }

      return recalculatedEntry;
    });
  }

  private recalculateFighterMetrics(
    fighter: Fighter,
    config: PvpTrackerConfig,
    calculationMode: CalculationMode
  ): Fighter {
    const recalculatedFighter = { ...fighter };

    // Recalculate total deserved damage
    if (fighter.fightLogEntries) {
      recalculatedFighter.deservedDamage = fighter.fightLogEntries.reduce(
        (total, entry) => total + (entry.deservedDamage || 0),
        0
      );
    }

    // Recalculate magic luck metrics
    if (fighter.fightLogEntries) {
      const magicEntries = fighter.fightLogEntries.filter(entry => 
        entry.animationData && entry.animationData.includes('MAGIC')
      );
      
      recalculatedFighter.totalMagicAttackCount = magicEntries.length;
      recalculatedFighter.magicHitCount = magicEntries.filter(entry => !entry.splash).length;
      
      // Calculate deserved magic hits based on magic level and gear
      recalculatedFighter.magicHitCountDeserved = Math.round(
        magicEntries.length * this.calculateMagicAccuracy(config, calculationMode)
      );
    }

    return recalculatedFighter;
  }

  private calculateMagicAccuracy(
    config: PvpTrackerConfig,
    calculationMode: CalculationMode
  ): number {
    // Use the real magic accuracy calculation
    if (calculationMode === CalculationMode.SETTINGS || calculationMode === CalculationMode.HISCORE_LOOKUP) {
      const magicLevel = calculationMode === CalculationMode.HISCORE_LOOKUP ? 99 : config.magicLevel;
      const weaponBonus = 20; // Default magic weapon bonus
      const ringBonus = getRingBonus(config.ringChoice).magic;
      const prayerMultiplier = 1.0; // Default prayer multiplier
      
      return calculateAccuracy(
        magicLevel,
        weaponBonus,
        ringBonus,
        prayerMultiplier,
        99, // Default opponent magic defence
        0,  // Default opponent magic defence bonus
        'MAGIC'
      );
    }
    
    // Default accuracy
    return 0.7;
  }
}

// ================================= Factory Functions =================================

export function createCalculationEngine(): CalculationEngine {
  return new PvpCalculationEngine();
}

export function createHiscoreService(): HiscoreLookupService {
  return new RuneScapeHiscoreService();
}
