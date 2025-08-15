# PvP Performance Tracker – Annotated Payload (up to first tick)

**Purpose:** Human-readable comments for each field so you can rebuild or recompute the fight.  
**Scope:** `c` (competitor/PoV) object + the **first** entry in its timeline array `l[0]`.

## Notes up front
- **Timeline model:** Each element in `c.l` is a game tick snapshot (0.6s). If `expectedHits=1` and `f=true`, this tick contains an actual swing by the competitor.
- **Gear arrays (`G`/`g`):** Values are **PlayerComposition equipment ids**, not raw OSRS item ids. Decode with:
  - `v >= 2048` → item id = `v - 2048`
  - `256 ≤ v < 2048` → identity **kit** (appearance only) = `v - 256` (ignore for combat)
  - `v <= 0` → empty
  - Composition does **not include ring or ammo**. Collect those via UI/presets.
- **Stats (`C`):** Live **effective levels** for the **actor** on this tick (already reflect pots/brews/restores). You can use these directly for precise recomputation.
- **Opponent stats:** Not present; the plugin used your *config Levels* + Gear/Ammo assumptions to compute the opponent’s numbers in the original overlay.

---

```js
"c": {                           // Competitor (your POV) summary + timeline
  "n": "LocalPlayer",            // Your in-game display name
  "a": 68,                       // Total attacks
  "s": 42,                       // Successful off-prayer attacks
  "d": 491.901,                  // Expected damage (sum of per-tick `d`)
  "h": 603,                      // Actual damage dealt (sum of per-tick `aD`)
  "z": 21,                       // Total # of spells cast
  "m": 13,                       // Number of successful spells
  "M": 9.460,                    // Aggregate/peak metric (e.g., momentum)
  "p": 65,                       // Total # of successful offensive prayers usage
  "g": 0,                        // Ghost barrages
  "y": 0.000,                    // Ghost barrage damage
  "H": 398,                      // Total HP recovered
  "rh": 3,                       // Number of times hit wearing robes (based on setting in RL)
  "x": false,                    // Death flag
  "l": [                         // === Timeline (array of tick records) ===

    {                            // ---------- FIRST TICK (l[0]) ----------
      "t": 1753392860333,        // Timestamp (epoch) of this tick snapshot
      "T": 11465,                // Fight-relative tick index (0.6s units)
      "f": true,                 // POV/actor flag: true = the competitor is the attacker on this tick

      "G": [                     // Attacker gear snapshot (PlayerComposition equipment ids; decode with 2048/256 rule, see notes)
        12876, 23841, 8633, 23950,
        6784, 14879, 0, 6807,
        0, 9510, 13888, 268
      ],                         // NOTE: ring & ammo are NOT here, by design. the RL plugin derives rimg/ammo from settings

      "O": "MAGIC",              // Attacker’s current style tab at this instant ("MELEE" | "RANGED" | "MAGIC")
      "m": "RANGED_CROSSBOW_PVP",// Action/move used to drive formulas (e.g., xbow shot, whip, AGS spec, ancients)
      
      "d": 11.302,               // Expected damage contribution this tick (RL plugin’s DPS proxy under recorded assumptions)
      "a": 0.538,                // Accuracy (chance to hit, 0–1) under recorded assumptions
      "h": 42,                   // Max hit under recorded assumptions
      "l": 0,                    // Internal/unused here (not needed for recalculation)
      "s": false,                // Splash indicator (true when a magic splash occurred)

      "C": {                     // Actor's effective levels on this tick (includes boosts)
        "a": 91,                 // Attack
        "s": 118,                // Strength
        "d": 85,                 // Defence
        "r": 112,                // Ranged
        "m": 99,                 // Magic
        "h": 120                 // Hitpoints
      },
      "eH": 122,                 // Enemy HP before this tick (from actor’s perspective)
      "oH": 99,                  // Own HP before this tick
      "mC": 1,                   // Internal plugin toggle/counter (not required for recomputation)
      "aD": 25,                  // Actual damage dealt on this tick (what really happened)
      "g": [                     // Defender gear snapshot (PlayerComposition ids; same decoding rules as `G`)
        12876, 23843, 8633, 24344,
        6139, 14879, 0, 6141,
        0, 9510, 13888, 266
      ],
      "o": "MAGIC",              // Defender’s current style tab at this instant
      "p": 1420,                 // Defender overhead prayer id (e.g., 1420 = Protect from Missiles).
      "expectedHits": 1,         // 1 = this tick contains an attack swing by the actor; 0 = state-only snapshot
      "GMS": false,              // Granite Maul special chain flag (false here)
      "displayHpBefore": 122,    // Target HP as *displayed* by the client before this tick (visual/UI reference)
      "displayHpAfter": 97,      // Target HP as *displayed* by the client after this tick
      "isPartOfTickGroup": false // Grouping hint for multi-hit or chained actions
    },
    // ...repeat
  ],
"o": {                           // Opponent (your POV) summary + timeline
  "n": "OpponentName",           // Opponent's in-game name
  // ... same structure as above
```

---

## Recompute checklist for this tick
- Use `m` to select melee/ranged/magic/spec formula path.
- Effective levels = `C` (or swapped to hiscore/custom in your modes).
- Decode `G` (attacker) and **supply ring/ammo** externally from the UI if not in Default mode; decode `g` (defender).
- Apply defender overhead via `p` (map to Protect from Melee/Missiles/Magic).
- Compute attack/defence rolls → accuracy `a`, max `h`, expected `d`, and optional KO chance.
- Compare to recorded `a/h/d` to show deltas in your UI.
