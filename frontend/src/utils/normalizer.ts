import { Equip, FightData, Overhead, StyleTab, TickNorm } from "@/types";

const OVERHEAD_MAP: Record<number, Overhead> = {
  946: "MELEE", 
  1420: "MISSILES", 
  1421: "MAGIC"
};

const KIT_OFFSET = 256;
const ITEM_OFFSET = 2048;

export function normalizeEntries(rawEntries: any[]): TickNorm[] {
  let lastG: number[] = [];
  let lastg: number[] = [];

  return (rawEntries || []).map((r: any): TickNorm => {
    // carry forward gear
    if (r.G) lastG = carryForward(lastG, r.G);
    if (r.g) lastg = carryForward(lastg, r.g);

    const attackerGear = (lastG || []).map(decodeEquip);
    const defenderGear = (lastg || []).map(decodeEquip);

    return {
      time: r.t ?? 0,
      tick: r.T ?? 0,
      acted: !!r.f,
      expectedHits: r.expectedHits ?? 0,

      action: r.m ?? "UNKNOWN",
      attackerStyle: (r.O as StyleTab) ?? "MELEE",
      defenderStyle: (r.o as StyleTab) ?? "MELEE",

      attackerGear,
      defenderGear,

      overhead: OVERHEAD_MAP[r.p ?? -1] ?? "NONE",

      attackerLevels: r.C
        ? { atk: r.C.a, str: r.C.s, def: r.C.d, range: r.C.r, mage: r.C.m, hp: r.C.h }
        : undefined,

      hpEnemyBefore: r.eH,
      hpSelfBefore: r.oH,

      recorded: {
        acc: r.a, max: r.h, exp: r.d, dmg: r.aD,
        ko: r.k ?? r.displayKoChance
      }
    };
  });
}

export function normalizeFight(data: FightData) {
  return {
    competitor: { name: data.competitor.name, ticks: normalizeEntries(data.competitor.fightLogEntries as any) },
    opponent:   { name: data.opponent.name,   ticks: normalizeEntries(data.opponent.fightLogEntries as any) },
    meta: { time: data.lastFightTime, world: data.world, type: data.fightType }
  };
}

export interface NormalizedEntry {
  time: number;
  tick: number;
  attackerComposition: number[]; // decoded composition ids (real item ids or 0)
  defenderComposition: number[];
  attackerOverhead: string | null;
  defenderOverhead: string | null;
  animationKey: string | null;
  expectedHits: number;
  actorLevels: { atk: number; str: number; def: number; range: number; mage: number; hp: number } | null;
}

export function decodeEquip(raw: number | undefined | null): Equip {
  if (raw == null || raw <= 0) return { kind: "empty" };
  if (raw >= ITEM_OFFSET) return { kind: "item", id: raw - ITEM_OFFSET };
  if (raw >= KIT_OFFSET) return { kind: "kit", id: raw - KIT_OFFSET };
  return { kind: "kit", id: raw }; // very low kit ids exist
}

function decodeComposition(raw: number[] | undefined): number[] {
  if (!raw) return [];
  return raw.map(v => {
    if (v >= 2048) return v - ITEM_OFFSET; // real item id - 2048 offset
    if (v >= 256) return 0; // kit, ignore
    return 0; // empty or invalid
  });
}

export function carryForward(prev: number[] = [], next?: number[]): number[] {
  if (!next) return prev.slice(); // no changes this tick
  const len = Math.max(prev.length, next.length);
  const out = prev.slice(0, len);
  for (let i = 0; i < len; i++) {
    if (next[i] !== undefined && next[i] !== null) out[i] = next[i]!;
  }
  return out;
}

export function mapOverheadBySpriteId(spriteId: number | null | undefined): string | null {
  if (!spriteId) return null;
  // determines the overhead prayer used by the player
  switch (spriteId) {
    case 1420: return 'PROTECT_FROM_MISSILES';
    case 1421: return 'PROTECT_FROM_MELEE';
    case 1422: return 'PROTECT_FROM_MAGIC';
    default: return null;
  }
}

export function normalizeTimeline(entries: any[]): NormalizedEntry[] {
  let lastG: number[] = [];
  let lastg: number[] = [];
  return entries.map((e) => {
    if (e.G && e.G.length > 0) lastG = e.G; // carry-forward
    if (e.g && e.g.length > 0) lastg = e.g;
    return {
      time: e.t || 0,
      tick: e.T || 0,
      attackerComposition: decodeComposition(lastG),
      defenderComposition: decodeComposition(lastg),
      attackerOverhead: (e.O as string) || null,
      defenderOverhead: e.p ? mapOverheadBySpriteId(e.p) : ((e.o as string) || null),
      animationKey: (e.m as string) || null,
      expectedHits: e.expectedHits ?? 1,
      actorLevels: e.C ? { atk: e.C.a, str: e.C.s, def: e.C.d, range: e.C.r, mage: e.C.m, hp: e.C.h } : null
    } as NormalizedEntry;
  });
}