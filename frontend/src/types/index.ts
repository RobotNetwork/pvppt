// PvP Performance Tracker - TypeScript Interfaces
// Based on the Java plugin's data structures and the existing JavaScript implementation

export interface CombatLevels {
  atk: number;
  str: number;
  def: number;
  range: number;
  mage: number;
  hp: number;
}

export interface FightLogEntry {
  time: number;
  tick: number;
  isFullEntry: boolean;
  attackerGear: string[];
  attackerOverhead: string | null;
  animationData: string | null;
  deservedDamage: number;
  accuracy: number;
  maxHit: number;
  minHit: number;
  splash: boolean;
  attackerLevels: CombatLevels | null;
  koChance: number | null;
  estimatedHpBeforeHit: number | null;
  opponentMaxHp: number | null;
  matchedHitsCount: number;
  actualDamageSum: number;
  defenderGear: string[];
  defenderOverhead: string | null;
  attackerOffensivePray: number;
  expectedHits: number;
  isGmaulSpecial: boolean;
  displayHpBefore: number | null;
  displayHpAfter: number | null;
  displayKoChance: number | null;
  isPartOfTickGroup: boolean;
}

export interface Fighter {
  name: string;
  attackCount: number;
  offPraySuccessCount: number;
  deservedDamage: number;
  damageDealt: number;
  totalMagicAttackCount: number;
  magicHitCount: number;
  magicHitCountDeserved: number;
  offensivePraySuccessCount: number;
  ghostBarrageCount: number;
  ghostBarrageDeservedDamage: number;
  hpHealed: number;
  robeHits: number;
  dead: boolean;
  fightLogEntries: FightLogEntry[];
}

export interface FightData {
  competitor: Fighter;
  opponent: Fighter;
  lastFightTime: number;
  fightType: string;
  world: number;
}

export interface FightHistoryItem {
  id: number;
  timestamp: number;
  data: FightData;
  competitorName: string;
  opponentName: string;
  hash: string;
}

export interface FormattedMetrics {
  name: string;
  offPrayStats: string;
  deservedDamage: string;
  damageDealt: number;
  magicStats: string;
  offensivePrayStats: string;
  hpHealed: number;
  robeHitStats: string;
  ghostBarrageStats: string;
  koChances: {
    count: number;
    overallProbability: number;
  };
}

export interface KoChances {
  count: number;
  overallProbability: number;
}

export interface FightDataParserInterface {
  parseFightData(jsonData: string | object): FightData;
  parseFighter(fighterData: any): Fighter;
  parseFightLogEntries(entries: any[]): FightLogEntry[];
  parseFightLogEntry(entry: any): FightLogEntry;
  parseCombatLevels(levelsData: any): CombatLevels | null;
  calculateMetrics(fighter: Fighter): any;
  calculateKoChances(fightLogEntries: FightLogEntry[]): KoChances;
  formatMetrics(fighter: Fighter, isCompetitor?: boolean, opponent?: Fighter | null): FormattedMetrics;
}

// ================================= Configuration System =================================

export enum RobeHitFilter {
  BOTTOM = "BOTTOM",
  TOP = "TOP", 
  BOTH = "BOTH",
  EITHER = "EITHER"
}

export enum RingData {
  SEERS_RING = "SEERS_RING",
  ARCHERS_RING = "ARCHERS_RING",
  BERSERKER_RING = "BERSERKER_RING",
  RING_OF_SUFFERING = "RING_OF_SUFFERING",
  SEERS_RING_I = "SEERS_RING_I",
  ARCHERS_RING_I = "ARCHERS_RING_I",
  BERSERKER_RING_I = "BERSERKER_RING_I",
  RING_OF_SUFFERING_I = "RING_OF_SUFFERING_I",
  BRIMSTONE_RING = "BRIMSTONE_RING",
  MAGUS_RING = "MAGUS_RING",
  VENATOR_RING = "VENATOR_RING",
  BELLATOR_RING = "BELLATOR_RING",
  ULTOR_RING = "ULTOR_RING",
  RING_OF_SHADOWS = "RING_OF_SHADOWS",
  NONE = "NONE"
}

export enum BoltAmmo {
  RUNITE_BOLTS = "RUNITE_BOLTS",
  DRAGONSTONE_BOLTS_E = "DRAGONSTONE_BOLTS_E",
  DIAMOND_BOLTS_E = "DIAMOND_BOLTS_E"
}

export enum StrongBoltAmmo {
  RUNITE_BOLTS = "RUNITE_BOLTS",
  DRAGONSTONE_BOLTS_E = "DRAGONSTONE_BOLTS_E",
  DIAMOND_BOLTS_E = "DIAMOND_BOLTS_E",
  DRAGONSTONE_DRAGON_BOLTS_E = "DRAGONSTONE_DRAGON_BOLTS_E",
  OPAL_DRAGON_BOLTS_E = "OPAL_DRAGON_BOLTS_E",
  DIAMOND_DRAGON_BOLTS_E = "DIAMOND_DRAGON_BOLTS_E"
}

export enum DartAmmo {
  ADAMANT_DARTS = "ADAMANT_DARTS",
  RUNE_DARTS = "RUNE_DARTS",
  DRAGON_DARTS = "DRAGON_DARTS"
}

export interface PvpTrackerConfig {
  // General Settings
  settingsConfigured: boolean;
  restrictToLms: boolean;
  showFightHistoryPanel: boolean;
  robeHitFilter: RobeHitFilter;
  
  // Gear/Ammo Settings
  ringChoice: RingData;
  boltChoice: BoltAmmo;
  strongBoltChoice: StrongBoltAmmo;
  bpDartChoice: DartAmmo;
  
  // Level Settings
  attackLevel: number;
  strengthLevel: number;
  defenceLevel: number;
  rangedLevel: number;
  magicLevel: number;
  
  // Misc Settings
  dlongIsVls: boolean;
  fightLogInChat: boolean;
  showWorldInSummary: boolean;
  nameFilter: string;
}

// ================================= Calculation Engine Interfaces =================================

export enum CalculationMode {
  DEFAULT = "DEFAULT",           // Use data from JSON payload
  HISCORE_LOOKUP = "HISCORE_LOOKUP", // Use hiscore API to determine stats
  SETTINGS = "SETTINGS"          // Use user-configured settings
}

export interface CalculationEngineConfig {
  mode: CalculationMode;
  useHiscoreLookup: boolean;
  useCustomSettings: boolean;
  fallbackToDefault: boolean;
}

export interface DeservedDamageCalculator {
  calculateDeservedDamage(
    attackData: any,
    config: PvpTrackerConfig,
    calculationMode: CalculationMode
  ): number;
}

export interface MagicLuckCalculator {
  calculateMagicLuck(
    magicData: any,
    config: PvpTrackerConfig,
    calculationMode: CalculationMode
  ): number;
}

export interface KoChanceCalculator {
  calculateKoChance(
    attackData: any,
    opponentHp: number,
    config: PvpTrackerConfig,
    calculationMode: CalculationMode
  ): number;
}

export interface HiscoreLookupService {
  lookupPlayerStats(username: string): Promise<CombatLevels>;
}

export interface CalculationEngine {
  deservedDamageCalculator: DeservedDamageCalculator;
  magicLuckCalculator: MagicLuckCalculator;
  koChanceCalculator: KoChanceCalculator;
  hiscoreLookupService: HiscoreLookupService;
  
  recalculateMetrics(
    fightData: FightData,
    config: PvpTrackerConfig,
    calculationMode: CalculationMode
  ): Promise<FightData>;
}
