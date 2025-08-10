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
