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

TL;DR: The payload already has everything needed to replay a fight tick-by-tick (actions, gear, prayers, HP before/after, accuracy/max rolls, KO chances). You can 1) render the “as-recorded” view straight from the JSON, 2) re-compute accuracy/max/KO with hiscore stats, or 3) re-compute with custom stats/settings.

---

# What’s in the payload (high level)

Root object has one perspective per fighter. In the example fight data, the top-level `c` (“competitor”) object is the local player, with `n` being the player's name. In the same format, `o` represents the opponent. With the exception of `l`, the fields directly under the root `c`/`o` make up the entire fight's summary, exactly as seen in the Runelite plugin. The last field `l` is a list of actions taken place durin the fight from start to finish.

Each element of `c.l` is a *timeline record* for a single game tick. That record carries the full calculation context for that tick (gear, styles, stats, prayers, HP before/after, accuracy/max, damage dealt, etc.). Example record (trimmed): `t` (ms time), `T` (game tick), `O/o` (attacker/defender combat styles), `m` (move/attack), `a` (accuracy), `h` (max), `d` (DPS-ish / expected damage), `aD` (actual damage), `eH`/`oH` (enemy/self HP before), `displayHpBefore/After` (what client showed), `p` (overhead prayer), `G/g` (gear arrays), `C` (stats snapshot), flags like `f` (who’s POV), `s` (splash), `k` (KO chance), `expectedHits`, `isPartOfTickGroup`. You can see most of these in one span here (look for `a,h,d,aD,eH,oH,displayHpBefore/After,expectedHits` etc.).

# Per-tick schema (practical names)

Here’s a translation you can work with (based on the sample and how RuneLite plugins tend to serialize):

* `t` = absolute timestamp (ms). `T` = in-fight game tick index.
* `f` = boolean; `true` means the record is from the competitor’s action context; `false` is an “other” frame (still useful for state).
* `O` / `o` = attack/defence *styles* (e.g., `"RANGED"`, `"MAGIC"`, `"MELEE"`). When `f:true`, `O` is the *attacker*’s style and `o` the *opponent’s* at that moment. 
* `m` = specific attack / weapon family (e.g., `RANGED_CROSSBOW_PVP`, `MELEE_ABYSSAL_WHIP`, `MAGIC_ANCIENT_MULTI_TARGET`). 
* `C` = snapshot of *effective* combat stats at that tick: `a`(Attack), `s`(Strength), `d`(Defence), `r`(Ranged), `m`(Magic), `h`(Hitpoints). You can watch these change when pots/prayers/venge/procs shift. 
* Gear: `G` and `g` are arrays of item IDs representing worn gear caches before/after (or attacker/defender snapshots) on that tick; they flip as people switch. You can see both appear on the same tick record. 
* Rolls:

  * `a` = accuracy (hit chance, 0–1). `h` = max hit under current context. `d` = expected damage (≈ accuracy × max / distribution; plugin’s “DPS contribution” proxy).
  * `aD` = actual damage dealt on that action (0 when splash/miss/no hit). See 27 dealt, 3 dealt, etc.
  * `s` = splash indicator for magic (true/false). Example with `s:true`.
  * `k` / `displayKoChance` = KO chance at that moment (shown on some ticks). 
* HP tracking: `eH` (enemy HP before), `oH` (own HP before), plus `displayHpBefore/After` (what the OSRS client showed in the HP orb/nameplate). 
* `p` = protection/overhead prayer state as an enum/integer (e.g., 1420, 946, 1421 values occur; map these to Protect from Melee/Missiles/Magic/none). 
* `expectedHits` = how many hits the move is expected to produce that tick (1 for most; could be 0 on non-attacks).
* `isPartOfTickGroup` = grouping flag for multi-hit / queued actions.

# What you can (re)calculate

**From JSON only (no external data):**

* Reconstruct timeline, gear switches, styles, overheads, splashes, DPS/accuracy rolls, KO-chance trend per tick. (All above fields are present.) 
* “Hits off prayer” and related plugin metrics (you have `O/o` + `p` per tick; just map `p`-code → overhead). 
* Momentum/DPS line: use `d` or recompute `a×h` per tick and smooth to your spec.

**With hiscore lookups (re-compute “correct” stats):**

* Replace `C`’s A/S/D/R/M/H with live hiscore stats (and optionally infer boosts from known potions if you want). Then recompute accuracy `a`, max `h`, expected `d`, and KO chance `k` for each tick given the *same* gear snapshots and styles. Your inputs are: gear (`G/g`), styles (`O/o`), overhead `p`, stats `C`→overridden, and the attack `m`. 

**With “custom settings” (web-app config):**

* Same as hiscore mode, but pull stats/prayer multipliers/spec bonuses/void/imbues from your UI instead of `C`. Keep the recorded gear and styles unless the user wants “what-if” swaps.

# Feasibility notes (what’s solid vs needs mapping)

Solid:

* **Every tick has the calculation context**: gear, styles, stats, prayer, and HP snapshots — so full recalculation is feasible. 
* **Damage reality check**: `aD` lines up with `displayHpBefore/After`; you can verify reconciliation and show “client HP vs real HP” drift if desired.

Needs mapping/decoding (quick tasks):

* **Prayer enum (`p`)** → Protect from Melee/Missiles/Magic/none/rapid heal/augury/rigour etc. You already have the numbers (e.g., 946/1420/1421). Build a 1× map once; it’s stable.
* **Gear arrays (`G`/`g`)** → OSRS item IDs → names/bonuses. You can load an item-id → stats map once and join by ID to show names and calculate bonuses. See a single tick carrying both arrays. 
* **Exact meaning of `G` vs `g`**: the data shows both on the same record; treat them as “attacker gear cache” and “defender gear cache” (or “before/after”) and verify by watching when switches occur (IDs jump between consecutive ticks). You can infer this from deltas over time (works fine in practice).

This mirrors the payload and gives you clean toggles:

* **Mode: Recorded** → render the numbers from JSON directly.
* **Mode: Hiscore** → recompute `acc/max/dps/ko` with hiscore stats using the same tick context.
* **Mode: Custom** → recompute with UI-provided stats/settings.

# Minimal next steps

1. Build the `p` enum and item-ID map (one time).
2. Parse once → normalize to the `TickRecord` shape above.
3. Implement calculators: `calcMaxHit`, `calcAccuracy`, `calcKoChance` that accept `{stats, gear, styles, overheads, move}`.
4. Wire a toggle that swaps the stats source (recorded `C`, hiscore, custom) and re-derives `acc/max/dps/ko` live while leaving the timeline/gear/prayers intact.

If you want, I can stub the TS interfaces + a tiny parser that hydrates a `Fight` object from this exact payload and prints a few decoded ticks (names for styles, prayers, item names, etc.).

---

## Recompute checklist for this tick
- Use `m` to select melee/ranged/magic/spec formula path.
- Effective levels = `C` (or swapped to hiscore/custom in your modes).
- Decode `G` (attacker) and **supply ring/ammo** externally from the UI if not in Default mode; decode `g` (defender).
- Apply defender overhead via `p` (map to Protect from Melee/Missiles/Magic).
- Compute attack/defence rolls → accuracy `a`, max `h`, expected `d`, and optional KO chance.
- Compare to recorded `a/h/d` to show deltas in your UI.
