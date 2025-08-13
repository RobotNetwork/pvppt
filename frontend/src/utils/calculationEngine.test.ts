import { describe, it, expect, beforeEach } from 'vitest';
import {
  PvpCalculationEngine,
  DefaultDeservedDamageCalculator,
  DefaultMagicLuckCalculator,
  DefaultKoChanceCalculator,
  RuneScapeHiscoreService
} from './calculationEngine';
import { PvpTrackerConfig, CalculationMode, RingData, BoltAmmo, StrongBoltAmmo, DartAmmo } from '../types';
import { getDefaultConfig } from './configService';

// Mock configuration for testing
const mockConfig: PvpTrackerConfig = {
  ...getDefaultConfig(),
  attackLevel: 99,
  strengthLevel: 99,
  defenceLevel: 99,
  rangedLevel: 99,
  magicLevel: 99,
  ringChoice: RingData.BERSERKER_RING,
  boltChoice: BoltAmmo.DIAMOND_BOLTS_E,
  strongBoltChoice: StrongBoltAmmo.DIAMOND_DRAGON_BOLTS_E,
  bpDartChoice: DartAmmo.DRAGON_DARTS
};

// Mock fight data for testing
const mockAttackData = {
  time: Date.now(),
  tick: 1,
  isFullEntry: true,
  attackerGear: ['1234', '5678', '9012'],
  attackerOverhead: 'PIETY',
  animationData: 'MELEE_ABYSSAL_WHIP',
  deservedDamage: 25,
  accuracy: 0.8,
  maxHit: 30,
  minHit: 0,
  splash: false,
  attackerLevels: {
    atk: 99,
    str: 99,
    def: 99,
    range: 99,
    mage: 99,
    hp: 99
  },
  koChance: null,
  estimatedHpBeforeHit: null,
  opponentMaxHp: null,
  matchedHitsCount: 1,
  actualDamageSum: 25,
  defenderGear: ['9999', '8888', '7777'],
  defenderOverhead: null,
  attackerOffensivePray: 0,
  expectedHits: 1,
  isGmaulSpecial: false,
  displayHpBefore: null,
  displayHpAfter: null,
  displayKoChance: null,
  isPartOfTickGroup: false
};

const mockMagicData = {
  time: Date.now(),
  tick: 1,
  isFullEntry: true,
  attackerGear: ['1234', '5678', '9012'],
  attackerOverhead: 'AUGURY',
  animationData: 'MAGIC_GHOST_BARRAGE',
  deservedDamage: 20,
  accuracy: 0.9,
  maxHit: 25,
  minHit: 0,
  splash: false,
  attackerLevels: {
    atk: 99,
    str: 99,
    def: 99,
    range: 99,
    mage: 99,
    hp: 99
  },
  koChance: null,
  estimatedHpBeforeHit: null,
  opponentMaxHp: null,
  matchedHitsCount: 1,
  actualDamageSum: 20,
  defenderGear: ['9999', '8888', '7777'],
  defenderOverhead: null,
  attackerOffensivePray: 0,
  expectedHits: 1,
  isGmaulSpecial: false,
  displayHpBefore: null,
  displayHpAfter: null,
  displayKoChance: null,
  isPartOfTickGroup: false
};

describe('RuneScape Combat Calculations', () => {
  let calculationEngine: PvpCalculationEngine;
  let deservedDamageCalculator: DefaultDeservedDamageCalculator;
  let magicLuckCalculator: DefaultMagicLuckCalculator;
  let koChanceCalculator: DefaultKoChanceCalculator;
  let hiscoreService: RuneScapeHiscoreService;

  beforeEach(() => {
    calculationEngine = new PvpCalculationEngine();
    deservedDamageCalculator = new DefaultDeservedDamageCalculator();
    magicLuckCalculator = new DefaultMagicLuckCalculator();
    koChanceCalculator = new DefaultKoChanceCalculator();
    hiscoreService = new RuneScapeHiscoreService();
  });

  describe('Prayer Multipliers', () => {
    it('should return correct prayer multipliers for attack prayers', () => {
      const pietyMultiplier = deservedDamageCalculator.calculateDeservedDamage(
        { ...mockAttackData, attackerOverhead: 'PIETY' },
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      const noPrayerMultiplier = deservedDamageCalculator.calculateDeservedDamage(
        { ...mockAttackData, attackerOverhead: null },
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      // PIETY should give higher damage than no prayer
      expect(pietyMultiplier).toBeGreaterThan(noPrayerMultiplier);
    });

    it('should return correct prayer multipliers for strength prayers', () => {
      const ultimateStrengthMultiplier = deservedDamageCalculator.calculateDeservedDamage(
        { ...mockAttackData, attackerOverhead: 'ULTIMATE_STRENGTH' },
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      const noPrayerMultiplier = deservedDamageCalculator.calculateDeservedDamage(
        { ...mockAttackData, attackerOverhead: null },
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      // ULTIMATE_STRENGTH should give higher damage than no prayer
      expect(ultimateStrengthMultiplier).toBeGreaterThan(noPrayerMultiplier);
    });
  });

  describe('Weapon Bonuses', () => {
    it('should calculate correct damage for different weapons', () => {
      const whipDamage = deservedDamageCalculator.calculateDeservedDamage(
        { ...mockAttackData, animationData: 'MELEE_ABYSSAL_WHIP' },
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      const godswordDamage = deservedDamageCalculator.calculateDeservedDamage(
        { ...mockAttackData, animationData: 'MELEE_ARMADYL_GODSWORD_SPEC' },
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      // Godsword should do more damage than whip
      expect(godswordDamage).toBeGreaterThan(whipDamage);
    });

    it('should calculate correct damage for ranged weapons', () => {
      const crossbowDamage = deservedDamageCalculator.calculateDeservedDamage(
        { ...mockAttackData, animationData: 'RANGED_CROSSBOW_PVP' },
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      const bowDamage = deservedDamageCalculator.calculateDeservedDamage(
        { ...mockAttackData, animationData: 'RANGED_MAGIC_SHORTBOW' },
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      // Crossbow should do more damage than bow
      expect(crossbowDamage).toBeGreaterThan(bowDamage);
    });
  });

  describe('Ring Bonuses', () => {
    it('should apply correct ring bonuses', () => {
      const berserkerRingConfig = { ...mockConfig, ringChoice: RingData.BERSERKER_RING };
      const noRingConfig = { ...mockConfig, ringChoice: RingData.NONE };
      
      const berserkerRingDamage = deservedDamageCalculator.calculateDeservedDamage(
        mockAttackData,
        berserkerRingConfig,
        CalculationMode.SETTINGS
      );
      
      const noRingDamage = deservedDamageCalculator.calculateDeservedDamage(
        mockAttackData,
        noRingConfig,
        CalculationMode.SETTINGS
      );
      
      // Berserker ring should give higher damage than no ring
      expect(berserkerRingDamage).toBeGreaterThan(noRingDamage);
    });

    it('should apply correct magic ring bonuses', () => {
      const seersRingConfig = { ...mockConfig, ringChoice: RingData.SEERS_RING };
      const noRingConfig = { ...mockConfig, ringChoice: RingData.NONE };
      
      const seersRingMagicLuck = magicLuckCalculator.calculateMagicLuck(
        mockMagicData,
        seersRingConfig,
        CalculationMode.SETTINGS
      );
      
      const noRingMagicLuck = magicLuckCalculator.calculateMagicLuck(
        mockMagicData,
        noRingConfig,
        CalculationMode.SETTINGS
      );
      
      // Seers ring should give higher magic accuracy than no ring
      expect(seersRingMagicLuck).toBeGreaterThan(noRingMagicLuck);
    });
  });

  describe('Ammo Bonuses', () => {
    it('should apply correct bolt bonuses', () => {
      const diamondBoltsConfig = { ...mockConfig, boltChoice: BoltAmmo.DIAMOND_BOLTS_E };
      const runiteBoltsConfig = { ...mockConfig, boltChoice: BoltAmmo.RUNITE_BOLTS };
      
      const diamondBoltsDamage = deservedDamageCalculator.calculateDeservedDamage(
        { ...mockAttackData, animationData: 'RANGED_CROSSBOW_PVP' },
        diamondBoltsConfig,
        CalculationMode.SETTINGS
      );
      
      const runiteBoltsDamage = deservedDamageCalculator.calculateDeservedDamage(
        { ...mockAttackData, animationData: 'RANGED_CROSSBOW_PVP' },
        runiteBoltsConfig,
        CalculationMode.SETTINGS
      );
      
      // Diamond bolts should do more damage than runite bolts
      expect(diamondBoltsDamage).toBeGreaterThan(runiteBoltsDamage);
    });
  });

  describe('Combat Level Calculations', () => {
    it('should calculate correct damage for different strength levels', () => {
      const highStrengthConfig = { ...mockConfig, strengthLevel: 99 };
      const lowStrengthConfig = { ...mockConfig, strengthLevel: 50 };
      
      const highStrengthDamage = deservedDamageCalculator.calculateDeservedDamage(
        mockAttackData,
        highStrengthConfig,
        CalculationMode.SETTINGS
      );
      
      const lowStrengthDamage = deservedDamageCalculator.calculateDeservedDamage(
        mockAttackData,
        lowStrengthConfig,
        CalculationMode.SETTINGS
      );
      
      // Higher strength should give higher damage
      expect(highStrengthDamage).toBeGreaterThan(lowStrengthDamage);
    });

    it('should calculate correct damage for different ranged levels', () => {
      const highRangedConfig = { ...mockConfig, rangedLevel: 99 };
      const lowRangedConfig = { ...mockConfig, rangedLevel: 50 };
      
      const highRangedDamage = deservedDamageCalculator.calculateDeservedDamage(
        { ...mockAttackData, animationData: 'RANGED_CROSSBOW_PVP' },
        highRangedConfig,
        CalculationMode.SETTINGS
      );
      
      const lowRangedDamage = deservedDamageCalculator.calculateDeservedDamage(
        { ...mockAttackData, animationData: 'RANGED_CROSSBOW_PVP' },
        lowRangedConfig,
        CalculationMode.SETTINGS
      );
      
      // Higher ranged should give higher damage
      expect(highRangedDamage).toBeGreaterThan(lowRangedDamage);
    });
  });

  describe('Magic Calculations', () => {
    it('should calculate correct magic max hits for different spells', () => {
      const ghostBarrageData = { ...mockMagicData, animationData: 'MAGIC_GHOST_BARRAGE' };
      const blastData = { ...mockMagicData, animationData: 'MAGIC_BLAST' };
      
      const ghostBarrageLuck = magicLuckCalculator.calculateMagicLuck(
        ghostBarrageData,
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      const blastLuck = magicLuckCalculator.calculateMagicLuck(
        blastData,
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      // Both should return valid accuracy values
      expect(ghostBarrageLuck).toBeGreaterThan(0);
      expect(ghostBarrageLuck).toBeLessThanOrEqual(1);
      expect(blastLuck).toBeGreaterThan(0);
      expect(blastLuck).toBeLessThanOrEqual(1);
    });
  });

  describe('KO Chance Calculations', () => {
    it('should return 100% KO chance when max hit can kill', () => {
      const highDamageData = { ...mockAttackData, maxHit: 50 };
      const lowHp = 30;
      
      const koChance = koChanceCalculator.calculateKoChance(
        highDamageData,
        lowHp,
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      expect(koChance).toBe(1.0);
    });

    it('should calculate reasonable KO chance for non-lethal hits', () => {
      const mediumDamageData = { ...mockAttackData, maxHit: 25 };
      const mediumHp = 50;
      
      const koChance = koChanceCalculator.calculateKoChance(
        mediumDamageData,
        mediumHp,
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      // KO chance should be between 0 and 1
      expect(koChance).toBeGreaterThan(0);
      expect(koChance).toBeLessThan(1);
    });
  });

  describe('Calculation Modes', () => {
    it('should use default data when in DEFAULT mode', () => {
      const defaultDamage = deservedDamageCalculator.calculateDeservedDamage(
        mockAttackData,
        mockConfig,
        CalculationMode.DEFAULT
      );
      
      expect(defaultDamage).toBe(mockAttackData.deservedDamage);
    });

    it('should use configured settings when in SETTINGS mode', () => {
      const settingsDamage = deservedDamageCalculator.calculateDeservedDamage(
        mockAttackData,
        mockConfig,
        CalculationMode.SETTINGS
      );
      
      // Should calculate based on config, not return default
      expect(settingsDamage).not.toBe(mockAttackData.deservedDamage);
      expect(settingsDamage).toBeGreaterThan(0);
    });

    it('should use hiscore data when in HISCORE_LOOKUP mode', () => {
      const hiscoreDamage = deservedDamageCalculator.calculateDeservedDamage(
        mockAttackData,
        mockConfig,
        CalculationMode.HISCORE_LOOKUP
      );
      
      // Should calculate based on hiscore data, not return default
      expect(hiscoreDamage).not.toBe(mockAttackData.deservedDamage);
      expect(hiscoreDamage).toBeGreaterThan(0);
    });
  });

  describe('Hiscore Service', () => {
    it('should return default levels when lookup fails', async () => {
      const stats = await hiscoreService.lookupPlayerStats('nonexistent_player_12345');
      
      expect(stats.atk).toBe(99);
      expect(stats.str).toBe(99);
      expect(stats.def).toBe(99);
      expect(stats.range).toBe(99);
      expect(stats.mage).toBe(99);
      expect(stats.hp).toBe(99);
    });


  });

  describe('Integration Tests', () => {
    it('should recalculate metrics correctly', async () => {
      const mockFightData = {
        competitor: {
          name: 'Player1',
          attackCount: 10,
          offPraySuccessCount: 5,
          deservedDamage: 100,
          damageDealt: 80,
          totalMagicAttackCount: 3,
          magicHitCount: 2,
          magicHitCountDeserved: 2.5,
          offensivePraySuccessCount: 3,
          ghostBarrageCount: 1,
          ghostBarrageDeservedDamage: 20,
          hpHealed: 10,
          robeHits: 1,
          dead: false,
          fightLogEntries: [mockAttackData]
        },
        opponent: {
          name: 'Player2',
          attackCount: 8,
          offPraySuccessCount: 4,
          deservedDamage: 90,
          damageDealt: 70,
          totalMagicAttackCount: 2,
          magicHitCount: 1,
          magicHitCountDeserved: 1.5,
          offensivePraySuccessCount: 2,
          ghostBarrageCount: 0,
          ghostBarrageDeservedDamage: 0,
          hpHealed: 5,
          robeHits: 0,
          dead: true,
          fightLogEntries: [mockAttackData]
        },
        lastFightTime: Date.now(),
        fightType: 'PVP',
        world: 1
      };

      const recalculatedData = await calculationEngine.recalculateMetrics(
        mockFightData,
        mockConfig,
        CalculationMode.SETTINGS
      );

      expect(recalculatedData).toBeDefined();
      expect(recalculatedData.competitor).toBeDefined();
      expect(recalculatedData.opponent).toBeDefined();
      
      // Should have recalculated deserved damage
      expect(recalculatedData.competitor.deservedDamage).toBeGreaterThan(0);
      expect(recalculatedData.opponent.deservedDamage).toBeGreaterThan(0);
    });
  });
});
