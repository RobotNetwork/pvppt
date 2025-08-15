export type StyleTab = "MELEE" | "RANGED" | "MAGIC";
export type Overhead = "NONE" | "MELEE" | "MISSILES" | "MAGIC";

export type Equip =
  | { kind: "item"; id: number }
  | { kind: "kit"; id: number }
  | { kind: "empty" };

  // --- New calc-friendly tick ---
export interface TickNorm {
  time: number;                // r.t
  tick: number;                // r.T
  acted: boolean;              // r.f
  expectedHits: number;        // r.expectedHits

  action: string;              // r.m (e.g., "RANGED_CROSSBOW_PVP")
  attackerStyle: StyleTab;     // r.O
  defenderStyle: StyleTab;     // r.o

  attackerGear: Equip[];       // decoded + carried-forward G
  defenderGear: Equip[];       // decoded + carried-forward g

  overhead: Overhead;          // mapped from r.p (defender's protect prayer)

  attackerLevels?: {           // r.C (actor’s visible boosted levels on this tick)
    atk: number; str: number; def: number; range: number; mage: number; hp: number;
  };

  hpEnemyBefore?: number;      // r.eH
  hpSelfBefore?: number;       // r.oH

  recorded?: {                 // recorded outputs (useful for “Recorded” mode / diff)
    acc?: number;              // r.a
    max?: number;              // r.h
    exp?: number;              // r.d
    dmg?: number;              // r.aD
    ko?: number;               // r.k or r.displayKoChance
  };
}

// Optional wrappers, if you want them:
export interface SideNorm { name: string; ticks: TickNorm[]; }
export interface FightNorm {
  meta: { time?: number; world?: number; type?: string };
  competitor: SideNorm;
  opponent: SideNorm;
}


export interface TickRaw {
  t:number;           // timestamp
  T:number;           // tick index
  f?:boolean;         // actor flag (this side acted)
  G?:number[];        // attacker composition array (appearance ids)
  g?:number[];        // defender composition array (appearance ids)
  O?:StyleTab;        // attacker style tab
  o?:StyleTab;        // defender style tab
  m?:string;          // action key (e.g., RANGED_CROSSBOW_PVP)
  d?:number; a?:number; h?:number; aD?:number; // recorded outputs
  C?:CombatLevels; // actor levels (this side)
  eH?:number; oH?:number; // expected hp before and after hit
  p?:number;          // overhead id
  expectedHits?:number;
  displayHpBefore?:number; 
  displayHpAfter?:number;
  isPartOfTickGroup?:boolean;
}



export interface FighterRaw {
  n:string; // player name
  // summary fields (keep as-is)
  a?:number; s?:number; d?:number; h?:number; // etc.
  l: TickRaw[]; // timeline of ticks
}

export interface FightDataRaw {
  t?:number; w?:number; l?:string;
  c: FighterRaw;
  o: FighterRaw;
}

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

  // @deprecated: this flag doesn’t mean “full entry”; use TickNorm.acted / expectedHits instead.
  isFullEntry: boolean;

  // @deprecated: these should be typed Equip[] in new code; keep as-is for current UI.
  attackerGear: string[];
  defenderGear: string[];

  // @deprecated: overhead is on the DEFENDER (payload key `p`). Use TickNorm.overhead.
  attackerOverhead: string | null;

  // @deprecated: the payload doesn’t serialize animations; use TickNorm.action (payload `m`).
  animationData: string | null;

  // recorded outputs:
  deservedDamage: number; // payload `d`
  accuracy: number;       // payload `a`
  maxHit: number;         // payload `h`

  // @deprecated: payload `l` isn’t a “min hit”; don’t use/compute it.
  minHit: number;

  splash: boolean;

  // actor levels (only present on actor’s ticks)
  attackerLevels: CombatLevels | null;

  // recorded KO chance if present
  koChance: number | null;

  // bookkeeping/visuals:
  estimatedHpBeforeHit: number | null; // eH
  opponentMaxHp: number | null;        // oH
  matchedHitsCount: number;            // mC
  actualDamageSum: number;             // aD

  // @deprecated: not an “offensive pray”; payload `p` is defender overhead.
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
  parseFightDataSummary(jsonData: string | object): FightData;
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
