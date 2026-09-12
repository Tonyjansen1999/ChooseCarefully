/* =========================================================
   ChooseCarefully — Game Script
   ========================================================= */

// ── Class Definitions ─────────────────────────────────────
const CLASSES = [
  {
    id: 'tank',
    name: 'Protector',
    image: 'Images/protector.png',
    baseHp: 170,
    baseDamage: 30,
    armorType: 'mail', armorValue: 20,
    ultimateThreshold: 3,
    ultimateDescription: 'Restores 20 HP to self and grants all living allies +5 damage.',
    passives: [
      {
        key: 'fortify',
        name: 'Fortify',
        description: 'Reduces all incoming physical damage by 33%.',
      },
      {
        key: 'shieldblock',
        name: 'Shield Block',
        description: 'Blocks all direct damage from the opponent\'s very first attack. One-time effect per life.',
      },
    ],
  },
  {
    id: 'bruiser',
    name: 'Barbarian',
    image: 'Images/barbarian.png',
    baseHp: 130,
    baseDamage: 40,
    armorType: 'mail', armorValue: 20,
    ultimateThreshold: 2,
    ultimateDescription: 'Every 2 attacks: +10 damage on next attack and heal 10 HP (same for both passives).',
    passives: [
      {
        key: 'bloodthirst',
        name: 'Bloodthirst',
        description: 'Heals 15 HP after each attack.',
      },
      {
        key: 'rage',
        name: 'Rage',
        description: 'For every 20 HP missing, deals +10% bonus damage (calculated from base damage).',
      },
    ],
  },
  {
    id: 'support',
    name: 'Cleric',
    image: 'Images/cleric.png',
    baseHp: 110,
    baseDamage: 20,
    armorType: 'cloth', armorValue: 0,
    ultimateThreshold: 3,
    ultimateDescription: 'Shielding: doubles shield generation (every 3 attacks). Nerfer: heals itself for 20 HP (every 2 attacks).',
    passives: [
      {
        key: 'shield',
        name: 'Shielding',
        description: 'Each turn alive grants +20 HP shield to both benched allies.',
      },
      {
        key: 'nerfer',
        name: 'Nerfer',
        description: 'Each turn survived, permanently reduces a random benched opponent\'s damage by 10 (min 10).',
      },
    ],
  },
  {
    id: 'mage',
    name: 'Mage',
    image: 'Images/mage.png',
    baseHp: 90,
    baseDamage: 50,
    armorType: 'cloth', armorValue: 0,
    ultimateThreshold: 2,
    ultimateDescription: 'Burn: increases burn by +10 dmg/turn. Thunderlord: deals 10 immediate damage to the active opponent.',
    passives: [
      {
        key: 'burn',
        name: 'Burn',
        description: 'Attacks apply permanent burn — 10 damage at the start of the target\'s turn.',
      },
      {
        key: 'thunderlord',
        name: 'Thunderlord',
        description: 'On knockout: heals 30 HP, gains +20 damage permanently, and strikes the next entering opponent for 30.',
      },
    ],
  },
  {
    id: 'assassin',
    name: 'Assassin',
    image: 'Images/assassin.png',
    baseHp: 100,
    baseDamage: 40,
    armorType: 'leather', armorValue: 10,
    ultimateThreshold: 2,
    ultimateDescription: 'Every 2 attacks: next attack deals +20 ✨ Magical bonus damage (bypasses armor).',
    passives: [
      {
        key: 'firststrike',
        name: 'First Strike',
        description: 'Always attacks first. First attack deals +30 ✨ Magical bonus damage (bypasses armor).',
      },
      {
        key: 'evasion',
        name: 'Evasion',
        description: 'After 2 attacks, retreats to bench (once per match): heals 50% of lost HP, gains +20 permanent damage.',
      },
    ],
  },
  {
    id: 'marksman',
    name: 'Marksman',
    image: 'Images/marksman.png',
    baseHp: 90,
    baseDamage: 40,
    armorType: 'leather', armorValue: 10,
    ultimateThreshold: 3,
    ultimateDescription: 'Fires an additional attack immediately.',
    passives: [
      {
        key: 'steadyaim',
        name: 'Steady Aim',
        description: 'Damage increases by 20 after each attack.',
      },
      {
        key: 'doubleshot',
        name: 'Double Shot',
        description: 'After every 2 attacks, deals 30 ⚔ Physical damage to a random living benched opponent.',
      },
    ],
  },
  {
    id: 'deathknight',
    name: 'Death Knight',
    image: 'Images/DeathKnight.png',
    baseHp: 150,
    baseDamage: 40,
    armorType: 'mail', armorValue: 20,
    ultimateThreshold: 2,
    ultimateDescription: 'Every 2 attacks: exponential healing — first +10 HP, then +20, +40 (doubles each time, cappeed at +40 for wave mode).',
    passives: [
      {
        key: 'deathgrip',
        name: 'Death Grip',
        description: 'Every 3 attacks: pulls a random benched enemy into battle and immediately attacks them for +20 ✨ Magical bonus damage (bypasses armor).',
      },
      {
        key: 'fearofthedead',
        name: 'Fear of the Dead',
        description: 'Every 3 attacks: forces the opponent to skip their next turn completely.',
      },
    ],
  },
  {
    id: 'joker',
    name: 'Joker',
    image: 'Images/Joker.png',
    baseHp: 100,
    baseDamage: 30,
    armorType: 'cloth', armorValue: 0,
    ultimateThreshold: 9999,
    ultimateDescription: 'Always active: every attack is random — 33% miss (0 dmg), 33% normal, 33% critical hit (2× all damage).',
    passives: [
      {
        key: 'luckofthedraw',
        name: 'Luck of the Draw',
        description: 'Every other attack, flip a coin: Heads = +20 bonus damage that turn (even if the attack misses). Tails = no bonus.',
      },
      {
        key: 'theace',
        name: 'The Ace',
        description: 'Once when first entering battle, flip a coin: Heads = permanently +50 HP and +10 damage. Tails = no effect.',
      },
    ],
  },
  {
    id: 'druid',
    name: 'Druid',
    image: 'Images/Druid.png',
    baseHp: 70,
    baseDamage: 30,
    armorType: 'leather', armorValue: 10,
    ultimateThreshold: 1,
    ultimateDescription: 'After first attack, transforms: Bear Form (150 HP, 50 DMG, fully healed) or Wolf Form (120 HP, 60 DMG, attacks twice per turn + 25 Wolf Bite).',
    passives: [
      {
        key: 'bearform',
        name: 'Bear Form',
        description: 'After first attack (✨ Magical), transforms into a mighty bear: becomes 150 HP / 50 ⚔ Physical DMG and heals to full immediately.',
      },
      {
        key: 'wolfform',
        name: 'Wolf Form',
        description: 'After first attack (✨ Magical), transforms into a swift wolf: becomes 120 HP / 60 DMG and attacks twice per turn — the second hit (Wolf Bite) always deals exactly 25 ⚔ Physical damage.',
      },
    ],
  },
  {
    id: 'rider',
    name: 'Rider',
    image: 'Images/rider.png',
    baseHp: 70,
    baseDamage: 40,
    armorType: 'mail', armorValue: 20,
    ultimateThreshold: 9999,
    ultimateDescription: 'Always mounted on a horse (80 HP) that absorbs all incoming damage with no overflow to the rider. On dismount, gains +20 ⚔ Physical anger per turn.',
    passives: [
      {
        key: 'revival',
        name: 'Revival',
        description: 'After 2 turns dismounted, the horse revives with 40 HP and the anger bonus resets. Horse revival is one-time only.',
      },
      {
        key: 'parry',
        name: 'Parry',
        description: 'While dismounted, blocks every other incoming attack.',
      },
    ],
  },
  {
    id: 'necromancer',
    name: 'Necromancer',
    image: 'Images/Necromancer.png',
    baseHp: 200,
    baseDamage: 20,
    armorType: 'cloth', armorValue: 0,
    ultimateThreshold: 9999,
    ultimateDescription: 'Each turn: takes 20 self-damage. Every 3 turns: Fire Storm hits ALL living opponents for 30 ✨ Magical.',
    passives: [
      {
        key: 'sacrifice',
        name: 'Sacrifice',
        description: 'A Ghoul grows each turn (+30 HP, +10 DMG; starts at 10 HP / 10 DMG). When the Necromancer dies the Ghoul rises in its place as a ⚔ Physical attacker.',
      },
      {
        key: 'reborn',
        name: 'Reborn',
        description: 'Starting turn 3, revives one fallen ally at 50% HP and 50% damage (one-time only). The revived ally appears darkened.',
      },
    ],
  },
  {
    id: 'shaman',
    name: 'Shaman',
    image: 'Images/Shaman.png',
    baseHp: 120,
    baseDamage: 30,
    armorType: 'leather', armorValue: 10,
    ultimateThreshold: 9999,
    ultimateDescription: 'Lightning Shield (immediately active): permanently reduces incoming damage by 10 and retaliates 10 ✨ Magical against physical attackers.',
    passives: [
      {
        key: 'chainheal',
        name: 'Chain Heal',
        description: 'Every 2 attacks: heals the Shaman and all living allies for 20 HP.',
      },
      {
        key: 'lavablast',
        name: 'Lava Blast',
        description: 'Every 3 attacks: fires a massive 60 ✨ Magical blast. Overkill damage transfers to the next living opponent.',
      },
    ],
  },
];

// ── Wave Mode — Enemy Compositions (50 waves) ─────────────
// Each entry is an array of 'peon'|'dartpeon'|'knight'|'wizard'|'champion'|'demon'|'dragon' strings.
const WAVE_TABLE = [
  // Set 1: Peons only (waves 1–10); Dart-Peon debuts wave 6
  ['peon'],                            // 1
  ['peon'],                            // 2
  ['peon', 'peon'],                    // 3
  ['peon', 'peon'],                    // 4
  ['peon', 'peon'],                    // 5
  ['dartpeon', 'peon', 'peon'],        // 6 — first Dart-Peon!
  ['peon', 'peon', 'peon'],            // 7
  ['peon', 'peon', 'peon'],            // 8
  ['peon', 'dartpeon', 'peon'],        // 9
  ['peon', 'peon', 'knight'],          // 10 — first Knight

  // Set 2: Knights emerging (waves 11–20); Wizard debuts wave 20
  ['peon', 'peon', 'knight'],          // 11
  ['peon', 'dartpeon', 'knight'],      // 12
  ['peon', 'knight', 'knight'],        // 13
  ['peon', 'knight', 'knight'],        // 14
  ['peon', 'dartpeon', 'peon'],        // 15 — breather
  ['peon', 'peon', 'knight'],          // 16
  ['peon', 'knight', 'knight'],        // 17
  ['knight', 'knight', 'knight'],      // 18 — first all-Knight wave
  ['peon', 'knight', 'knight'],        // 19
  ['peon', 'knight', 'wizard'],        // 20 — first Wizard!

  // Set 3: Wizard grows; Champion debuts wave 30
  ['peon', 'knight', 'wizard'],        // 21
  ['knight', 'wizard', 'knight'],      // 22
  ['dartpeon', 'peon', 'knight'],      // 23 — peon breather w/ Dart-Peon
  ['knight', 'wizard', 'knight'],      // 24
  ['peon', 'knight', 'wizard'],        // 25
  ['knight', 'wizard', 'wizard'],      // 26
  ['knight', 'wizard', 'knight'],      // 27
  ['dartpeon', 'knight', 'wizard'],    // 28
  ['knight', 'wizard', 'wizard'],      // 29
  ['knight', 'wizard', 'champion'],    // 30 — first Champion!

  // Set 4: Champion and Wizard dominant; Demon debuts wave 40
  ['dartpeon', 'knight', 'champion'],  // 31 — small breather w/ Dart-Peon
  ['knight', 'wizard', 'champion'],    // 32
  ['champion', 'wizard', 'knight'],    // 33
  ['peon', 'wizard', 'champion'],      // 34
  ['knight', 'champion', 'champion'],  // 35
  ['wizard', 'champion', 'champion'],  // 36
  ['dartpeon', 'knight', 'champion'],  // 37
  ['knight', 'wizard', 'champion'],    // 38
  ['wizard', 'champion', 'champion'],  // 39
  ['knight', 'champion', 'demon'],     // 40 — first Demon!

  // Set 5: Final stretch — Demon, Champion, Wizard; Dragon boss (50)
  ['wizard', 'champion', 'demon'],     // 41
  ['dartpeon', 'champion', 'demon'],   // 42 — small breather w/ Dart-Peon
  ['wizard', 'champion', 'demon'],     // 43
  ['champion', 'demon', 'demon'],      // 44
  ['wizard', 'champion', 'demon'],     // 45
  ['dartpeon', 'wizard', 'demon'],     // 46
  ['champion', 'demon', 'demon'],      // 47
  ['wizard', 'champion', 'demon'],     // 48
  ['champion', 'demon', 'demon'],      // 49
  ['dragon'],                          // 50 — BOSS
];

// ── Wave Enemy Factories ──────────────────────────────────
function _waveEnemyBase() {
  return {
    attackCount: 0, ultimateCharge: 0, ultimateReady: false, dead: false,
    shieldHp: 0, shieldHpMax: 0, burnDamage: 10, shieldMultiplier: 1, burnAmount: 0,
    poisonDotAmount: 0, healingReductionPct: 0, deathsDoorActive: false,
    shieldBlockAvailable: false, evasionAttackCount: 0, evasionUsed: false,
    doubleshotCount: 0, thunderlordPendingStrike: false,
    healStack: 0, deathGripCount: 0, fearCount: 0, deathGripBonus: 0,
    lotdTurnCount: 0, aceFlipped: false, aceResult: null, _jokerResult: null,
    transformed: false, wolfForm: false,
    _magicBonus: 0, attacksReceived: 0, berserk: false,
    isMounted: false, horseHp: 0, horseHpMax: 0,
    dismountedAttacks: 0, dismountBonus: 0, horseReviveUsed: false, parryToggle: false,
    necroTurnCount: 0, ghoulHp: 0, ghoulHpMax: 0, ghoulDamage: 0,
    ghoulSpawned: false, rebornUsed: false, reborn: false,
    lightningShieldActive: false, shamHealCount: 0, shamLavaCount: 0,
    // Wave loot
    lootItem: null, _lootGranted: false,
  };
}

function buildPeon() {
  // Base: 60 HP / 35 DMG. Scales +10 HP and +5 DMG per 10-wave set.
  const sets = state.waveMode ? Math.floor((state.currentWave - 1) / 10) : 0;
  const hp  = 60  + sets * 10;
  const dmg = 35  + sets * 5;
  const enemy = {
    ..._waveEnemyBase(),
    id: 'peon', name: 'Peon', image: 'Images/peon.png',
    hp, maxHp: hp, damage: dmg, baseDamage: dmg,
    armorType: 'leather', armorValue: 10,
    passiveKey: 'peon_doubleattack', passiveName: 'Double Strike',
    passive: 'Attacks twice every other turn.',
    passives: [{ key: 'peon_doubleattack', name: 'Double Strike', description: 'Attacks twice every other turn.' }],
    ultimateThreshold: 9999,
    ultimateDescription: 'None.',
    peonAttackCount: 0,
  };
  if (state.waveMode && Math.random() < 0.25) enemy.lootItem = rollLootItem();
  return enemy;
}

function buildKnight() {
  // Base: 100 HP / 55 DMG. Scales +15 HP and +10 DMG per 10-wave set.
  const sets = state.waveMode ? Math.floor((state.currentWave - 1) / 10) : 0;
  const hp  = 100 + sets * 15;
  const dmg = 55  + sets * 10;
  const enemy = {
    ..._waveEnemyBase(),
    id: 'knight', name: 'Knight', image: 'Images/Knight.png',
    hp, maxHp: hp, damage: dmg, baseDamage: dmg,
    armorType: 'mail', armorValue: 20,
    passiveKey: 'knightblock', passiveName: 'Iron Guard',
    passive: 'Blocks the first direct attack of the battle. Does not reset for later opponents.',
    passives: [{ key: 'knightblock', name: 'Iron Guard', description: 'Blocks the first direct attack of the battle. Does not reset for later opponents.' }],
    ultimateThreshold: 9999,
    ultimateDescription: 'None.',
    shieldBlockAvailable: true,
  };
  if (state.waveMode && Math.random() < 0.25) enemy.lootItem = rollLootItem();
  return enemy;
}

function buildWizard() {
  // Base: 110 HP / 80 DMG. Scales +10 HP and +15 DMG per 10-wave set after wave 20.
  const sets = state.waveMode ? Math.max(0, Math.floor((state.currentWave - 20) / 10)) : 0;
  const hp  = 110 + sets * 10;
  const dmg =  80 + sets * 15;
  const enemy = {
    ..._waveEnemyBase(),
    id: 'wizard', name: 'Wizard', image: 'Images/Wizard.png',
    hp, maxHp: hp, damage: dmg, baseDamage: dmg,
    armorType: 'cloth', armorValue: 0,
    passiveKey: 'wizardfirestorm', passiveName: 'Fire Storm',
    passive: 'Retaliates magical fire damage when hit; retaliation starts at 15 and grows +20 each time. Heals the Wizard for 50% of the retaliation amount.',
    passives: [{ key: 'wizardfirestorm', name: 'Fire Storm', description: 'Retaliates when hit; damage starts at 15 and grows by 20 each retaliation. Heals Wizard for 50% of the retaliation amount.' }],
    ultimateThreshold: 9999,
    ultimateDescription: 'None.',
    wizardFireStormDmg: 15,   // starts at 15, +20 after each retaliation
  };
  if (state.waveMode && Math.random() < 0.25) enemy.lootItem = rollLootItem();
  return enemy;
}

function buildChampion() {
  // Base: 195 HP / 105 DMG. Scales +20 HP and +15 DMG per 10-wave set after wave 30.
  const sets = state.waveMode ? Math.max(0, Math.floor((state.currentWave - 30) / 10)) : 0;
  const hp  = 195 + sets * 20;
  const dmg = 105 + sets * 15;
  const enemy = {
    ..._waveEnemyBase(),
    id: 'champion', name: 'Champion', image: 'Images/Champion.png',
    hp, maxHp: hp, damage: dmg, baseDamage: dmg,
    armorType: 'mail', armorValue: 20,
    passiveKey: 'truedamage', passiveName: 'True Damage',
    passive: 'Half of base damage is true damage — ignores all armor and damage reduction.',
    passives: [{ key: 'truedamage', name: 'True Damage', description: 'Half of base damage bypasses all armor and damage reduction.' }],
    ultimateThreshold: 9999,
    ultimateDescription: 'None.',
  };
  if (state.waveMode && Math.random() < 0.25) enemy.lootItem = rollLootItem();
  return enemy;
}

function buildDartPeon() {
  // Base: 60 HP / 30 DMG. Scales +15 HP and +5 DMG every OTHER 10-wave set (sets 1, 3 stay same as prior).
  const sets   = state.waveMode ? Math.floor((state.currentWave - 1) / 10) : 0;
  const scales = Math.floor((sets + 1) / 2); // grows at sets 1→same, 2→1, 3→same, 4→2 ...
  const hp  = 60 + scales * 15;
  const dmg = 30 + scales * 5;
  const enemy = {
    ..._waveEnemyBase(),
    id: 'dartpeon', name: 'Dart-Peon', image: 'Images/Dart-peon.png',
    hp, maxHp: hp, damage: dmg, baseDamage: dmg,
    armorType: 'leather', armorValue: 10,
    passiveKey: 'dartpeon', passiveName: 'Poison Dart',
    passive: 'Poison Dart: Attacks apply Poison: 10 damage per turn + healing reduction.',
    passives: [{ key: 'dartpeon', name: 'Poison Dart', description: 'Each hit poisons the target: 10 magical DOT per turn + 50% healing reduction. Clears when benched or at wave end.' }],
    ultimateThreshold: 9999,
    ultimateDescription: 'None.',
  };
  if (state.waveMode && Math.random() < 0.25) enemy.lootItem = rollLootItem();
  return enemy;
}

function buildDemon() {
  // Fixed stats — introduced at wave 40, game ends at 50 so no scaling needed.
  const enemy = {
    ..._waveEnemyBase(),
    id: 'demon', name: 'Demon', image: 'Images/Demon.png',
    hp: 240, maxHp: 240, damage: 135, baseDamage: 135,
    armorType: 'mail', armorValue: 20,
    passiveKey: 'demonblood', passiveName: 'Demonblood',
    passive: '30% lifesteal on every attack. Revives to full HP on death (once).',
    passives: [{ key: 'demonblood', name: 'Demonblood', description: '30% lifesteal and revives to full HP on death once.' }],
    ultimateThreshold: 9999,
    ultimateDescription: 'None.',
    demonReviveUsed: false,
  };
  if (state.waveMode && Math.random() < 0.25) enemy.lootItem = rollLootItem();
  return enemy;
}

function buildDragon() {
  const enemy = {
    ..._waveEnemyBase(),
    id: 'dragon', name: 'Dragon', image: 'Images/Dragon.png',
    hp: 1200, maxHp: 1200, damage: 130, baseDamage: 130,
    armorType: 'mail', armorValue: 20,
    passiveKey: 'dragonfire', passiveName: 'Inferno',
    passive: 'Every 3rd attack launches a fireball hitting all living player cards for 50 damage.',
    passives: [{ key: 'dragonfire', name: 'Inferno', description: 'Every 3rd attack, all living player cards take 50 damage.' }],
    ultimateThreshold: 9999,
    ultimateDescription: 'None.',
  };
  if (state.waveMode && Math.random() < 0.25) enemy.lootItem = rollLootItem();
  return enemy;
}

function buildWaveEnemy(type) {
  if (type === 'peon')     return buildPeon();
  if (type === 'dartpeon') return buildDartPeon();
  if (type === 'knight')   return buildKnight();
  if (type === 'wizard')   return buildWizard();
  if (type === 'champion') return buildChampion();
  if (type === 'demon')    return buildDemon();
  if (type === 'dragon')   return buildDragon();
}

// ── Wave Upgrade Pool ─────────────────────────────────────
const WAVE_UPGRADES = [
  { id: 'all_hp_dmg',   title: '+20 HP & +10 DMG — All Cards',    desc: 'Every card permanently gains +20 max HP and +10 damage.',             rarity: 'common',   weight: 10, target: 'all'     },
  { id: 'all_hp',       title: '+40 HP — All Cards',               desc: 'Every card permanently gains +40 max HP.',                            rarity: 'common',   weight: 10, target: 'all'     },
  { id: 'all_dmg',      title: '+20 DMG — All Cards',              desc: 'Every card permanently gains +20 damage.',                            rarity: 'common',   weight: 10, target: 'all'     },
  { id: 'single_hp_dmg',title: '+50 HP & +20 DMG — 1 Card',        desc: 'Choose one card: it gains +50 max HP and +20 damage.',               rarity: 'common',   weight: 10, target: 'single'  },
  { id: 'single_hp',    title: '+90 HP — 1 Card',                  desc: 'Choose one card: it gains +90 max HP.',                              rarity: 'common',   weight: 10, target: 'single'  },
  { id: 'single_dmg',   title: '+40 DMG — 1 Card',                 desc: 'Choose one card: it gains +40 damage.',                             rarity: 'common',   weight: 10, target: 'single'  },
  { id: 'all_armor_magic',      title: '+10 Armor & +10 Magic Resist — All Cards', desc: 'Every card permanently gains +10 armor (physical) and +10 magic damage reduction.',    rarity: 'common', weight: 10, target: 'all'    },
  { id: 'single_armor_magic',   title: '+25 Armor & +25 Magic Resist — 1 Card',   desc: 'Choose one card: it gains +25 armor (physical) and +25 magic damage reduction.',        rarity: 'common', weight: 10, target: 'single' },
  { id: 'all_dmg_reduction',    title: '+10% Damage Reduction — All Cards',        desc: 'Every card permanently reduces all incoming damage by 10% (after armor and magic resist).', rarity: 'common', weight: 8,  target: 'all'    },
  { id: 'single_dmg_reduction', title: '+20% Damage Reduction — 1 Card',           desc: 'Choose one card: permanently reduces all incoming damage by 20% (after armor and magic resist).', rarity: 'common', weight: 8, target: 'single' },
  { id: 'single_dmg_ability', title: '🐉 Dragon Power — 1 Card', desc: 'Choose one card: +40 damage and +10 to all passive and ability effects.', rarity: 'rare', weight: 3, target: 'single' },
  { id: 'first_flip',   title: '⚡ Always First — Every Wave',      desc: 'You always win the initiative coin flip at the start of each wave.', rarity: 'rare',     weight: 2,  target: 'passive' },
  { id: 'all_big',      title: '🌟 Legendary Boost — All Cards',   desc: 'Every card gains +100 max HP and +40 damage.',                       rarity: 'veryrare', weight: 1,  target: 'all'     },
];

// ── Wave Item Pool ────────────────────────────────────────
const WAVE_ITEMS = {
  potion:      { id: 'potion',      name: 'Health Potion', image: 'Images/Potion.png',      rarity: 'common',    weight: 35, consumable: true,  unique: true,  desc: 'Use in the lobby to restore 70 HP to this card.' },
  revive:      { id: 'revive',      name: 'Revive',        image: 'Images/Revive.png',      rarity: 'rare',      weight: 14, consumable: true,  unique: true,  desc: 'Use in the lobby: revive a dead ally to 50% of their max HP, or heal self 25% of your max HP if no one is dead.' },
  power:       { id: 'power',       name: 'Power',         image: 'Images/Power.png',       rarity: 'rare',      weight: 8,  stackable: true,   unique: false, desc: '+10 base damage (stacks). Effect applied immediately on pickup.' },
  spikyvest:   { id: 'spikyvest',   name: 'Spiky Vest',    image: 'Images/SpikyVest.png',   rarity: 'rare',      weight: 8,  stackable: true,   unique: false, desc: '+10 armor and +10 retaliation damage per stack. Attackers take retaliation damage when they hit you (physical only).' },
  spellbook:   { id: 'spellbook',   name: 'Spellbook',     image: 'Images/Spellbook.png',   rarity: 'rare',      weight: 8,  stackable: true,   unique: false, desc: '+10 to all passive and ultimate effects per stack — damage, healing, shields, and damage reduction all scale up. Effect applied immediately.' },
  lifesteal:   { id: 'lifesteal',   name: 'Lifesteal',     image: 'Images/Lifesteal.png',   rarity: 'rare',      weight: 8,  stackable: true,   unique: false, desc: '+10% lifesteal per stack (stacks). Effect applied immediately.' },
  shield:      { id: 'shield',      name: 'Shield',        image: 'Images/Shield.png',      rarity: 'rare',      weight: 8,  stackable: true,   unique: false, desc: 'Reduces incoming physical damage by 10% per stack.' },
  magicarmor:  { id: 'magicarmor',  name: 'Magic Armor',   image: 'Images/MagicArmor.png',  rarity: 'rare',      weight: 8,  stackable: true,   unique: false, desc: '+15 flat magical damage reduction and +10 max HP per stack.' },
  angel:       { id: 'angel',       name: 'Angel',         image: 'Images/Angel.png',       rarity: 'legendary', weight: 2,  unique: true,      desc: 'Revives this card on death: +50 max HP, +30 DMG, +10 passive DMG. Consumed on use. Max 1.' },
  speed:       { id: 'speed',       name: 'Speed',         image: 'Images/Speed.png',       rarity: 'legendary', weight: 2,  unique: true,      desc: 'Always win the initiative coin flip. Max 1.' },
};

function rollLootItem() {
  const pool = [];
  Object.values(WAVE_ITEMS).forEach(item => {
    for (let i = 0; i < item.weight; i++) pool.push(item);
  });
  return pool[Math.floor(Math.random() * pool.length)];
}

// Equip an item on a fighter: apply immediate effects and add to bag display.
function equipItem(fighter, item) {
  // Guard: unique items max 1 per fighter
  if (item.unique && fighter.items.some(i => i.id === item.id)) {
    addLog(`<span class="log-event">🎒 ${fighter.name} already has a ${item.name}!</span>`);
    return false;
  }
  // Guard: 16-slot cap measured by UNIQUE item types (stacks of the same item share one slot)
  const alreadyHasType = fighter.items.some(i => i.id === item.id);
  if (!alreadyHasType && new Set(fighter.items.map(i => i.id)).size >= 16) {
    addLog(`<span class="log-event">🎒 ${fighter.name}'s bag is full!</span>`);
    return false;
  }
  // Ghoul item mirroring: any item the Ghoul receives is also stored on the underlying
  // Necromancer so it survives the 10-wave hard-reset that revives the Necromancer.
  if (fighter.passiveKey === 'ghoul' && fighter._necromancer) {
    const necro = fighter._necromancer;
    necro.items.push({ ...item });
    // Mirror permanent stat bonuses to the Necromancer so they carry over on revival.
    if (item.id === 'power')      { necro.baseDamage += 10; necro.damage = Math.max(necro.damage, necro.baseDamage); }
    if (item.id === 'spellbook')  { necro.spellbookBonus       = (necro.spellbookBonus       || 0) + 10; }
    if (item.id === 'lifesteal')  { necro.lifeStealStacks      = (necro.lifeStealStacks       || 0) + 1;  }
    if (item.id === 'shield')     { necro.physicalDmgReduction = (necro.physicalDmgReduction  || 0) + 0.10; }
    if (item.id === 'spikyvest')  { necro.armorValue           = (necro.armorValue            || 0) + 10; necro.spikyRetaliDmg = (necro.spikyRetaliDmg || 0) + 10; }
    if (item.id === 'magicarmor') { necro.magicDmgReduction    = (necro.magicDmgReduction     || 0) + 15; necro.maxHp += 10; }
    if (item.id === 'speed')      { necro.hasSpeed = true; }
    if (item.id === 'angel')      { necro.angelRevived = false; /* angel stored in necro.items already */ }
  }
  fighter.items.push(item);
  // Apply passive effects immediately
  if (item.id === 'power') {
    fighter.baseDamage += 10;
    fighter.damage     += 10;
    addLog(`<span class="log-event">⚔ Power! ${fighter.name} gains +10 base damage permanently!</span>`);
  } else if (item.id === 'spellbook') {
    fighter.spellbookBonus = (fighter.spellbookBonus || 0) + 10;
    addLog(`<span class="log-event">📖 Spellbook! ${fighter.name} gains +10 passive/ultimate damage permanently!</span>`);
  } else if (item.id === 'lifesteal') {
    fighter.lifeStealStacks = (fighter.lifeStealStacks || 0) + 1;
    addLog(`<span class="log-event">💉 Lifesteal! ${fighter.name} gains +10% lifesteal permanently!</span>`);
  } else if (item.id === 'speed') {
    fighter.hasSpeed = true;
    addLog(`<span class="log-event">⚡ Speed! ${fighter.name} will always win the coin flip!</span>`);
  } else if (item.id === 'angel') {
    addLog(`<span class="log-event">👼 Angel! ${fighter.name} is protected from death once!</span>`);
  } else if (item.id === 'spikyvest') {
    fighter.armorValue      = (fighter.armorValue      || 0) + 10;
    fighter.spikyRetaliDmg  = (fighter.spikyRetaliDmg  || 0) + 10;
    addLog(`<span class="log-event">🦔 Spiky Vest! ${fighter.name} gains +10 armor and +10 retaliation damage permanently!</span>`);
  } else if (item.id === 'shield') {
    fighter.physicalDmgReduction = (fighter.physicalDmgReduction || 0) + 0.10;
    addLog(`<span class="log-event">🛡 Shield! ${fighter.name} gains +10% physical damage reduction permanently!</span>`);
  } else if (item.id === 'magicarmor') {
    fighter.magicDmgReduction = (fighter.magicDmgReduction || 0) + 15;
    fighter.maxHp += 10;
    fighter.hp = Math.min(fighter.maxHp, fighter.hp + 10);
    addLog(`<span class="log-event">🔮 Magic Armor! ${fighter.name} gains +15 magical damage reduction and +10 max HP permanently!</span>`);
  } else if (item.id === 'potion') {
    addLog(`<span class="log-event">🧪 ${fighter.name} found a Health Potion! Use it in the lobby.</span>`);
  } else if (item.id === 'revive') {
    addLog(`<span class="log-event">✨ ${fighter.name} found a Revive! Use it in the lobby.</span>`);
  }
  return true;
}

// Show the loot selection overlay during battle.
function showWaveLoot(item) {
  // Potion and Revive scale +20 every 10 waves so they stay relevant in later sets.
  const waveSet    = state.waveMode ? Math.floor((state.currentWave - 1) / 10) : 0;
  const potionHeal = 70 + waveSet * 20;
  const reviveHp   = 50 + waveSet * 20;
  const reviveFallback = Math.floor(reviveHp / 2);

  const overlay = document.getElementById('wave-loot-overlay');
  document.getElementById('wave-loot-icon').src = item.image;
  document.getElementById('wave-loot-name').textContent = item.name;
  const rarityEl = document.getElementById('wave-loot-rarity');
  rarityEl.textContent = item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1);
  rarityEl.className = `wave-loot-rarity rarity-${item.rarity}`;
  // Dynamic description: potion heal scales with wave set
  const lootDesc = (item.id === 'potion')
    ? `Use in the lobby to restore ${potionHeal} HP to this card.`
    : item.desc;
  document.getElementById('wave-loot-desc').textContent = lootDesc;

  const picksEl = document.getElementById('wave-loot-picks');
  picksEl.innerHTML = '';

  const allPicks   = state.playerPicks;
  const alivePicks = allPicks.filter(f => !f.dead);

  // Helper: slots used = number of distinct item types (stacks of same item share one slot)
  function usedSlots(f) { return new Set((f.items || []).map(i => i.id)).size; }

  // If this is a unique consumable and ALL alive cards already have one,
  // auto-use the existing copy on the most-damaged card to free up a slot.
  if (item.consumable && item.unique) {
    const allHaveIt = alivePicks.every(f => f.items.some(i => i.id === item.id));
    if (allHaveIt) {
      const neediest = alivePicks.reduce((a, b) => (a.hp / a.maxHp) <= (b.hp / b.maxHp) ? a : b);
      const existing = neediest.items.find(i => i.id === item.id);
      if (existing) {
        neediest.items.splice(neediest.items.indexOf(existing), 1);
        if (item.id === 'potion') {
          const healed = Math.min(70, neediest.maxHp - neediest.hp);
          neediest.hp = Math.min(neediest.maxHp, neediest.hp + 70);
          addLog(`<span class="log-event">🧪 All cards had a Potion! ${neediest.name}'s was auto-used (+${healed} HP) to make room.</span>`);
        } else if (item.id === 'revive') {
          const dead = state.playerPicks.find(f => f.dead && f !== neediest);
          if (dead) {
            dead.dead = false; dead.hp = 50;
            addLog(`<span class="log-event">✨ All cards had a Revive! ${neediest.name}'s was auto-used (${dead.name} revived) to make room.</span>`);
          } else {
            neediest.hp = Math.min(neediest.maxHp, neediest.hp + 25);
            addLog(`<span class="log-event">✨ All cards had a Revive! ${neediest.name}'s was auto-used (+25 HP) to make room.</span>`);
          }
        }
      }
    }
  }

  // ── "Give to bag" buttons ──────────────────────────────
  const giveLabel = document.createElement('p');
  giveLabel.className = 'wave-loot-section-label';
  giveLabel.textContent = 'Give to:';
  picksEl.appendChild(giveLabel);

  allPicks.forEach(fighter => {
    // For Ghouls, route the item to the underlying Necromancer for capacity checks.
    const bagHolder    = (fighter.passiveKey === 'ghoul' && fighter._necromancer) ? fighter._necromancer : fighter;
    const typesFull    = usedSlots(bagHolder) >= 16 && !(bagHolder.items || []).some(i => i.id === item.id);
    const alreadyUnique = item.unique && (bagHolder.items || []).some(i => i.id === item.id);
    const blocked      = typesFull || alreadyUnique;
    const slotsLeft    = 16 - usedSlots(bagHolder);

    let statusText;
    if (fighter.dead) {
      statusText = blocked
        ? (alreadyUnique ? '(already has one)' : '(bag full)')
        : `💀 Dead — stores in bag for revival`;
    } else {
      statusText = blocked
        ? (alreadyUnique ? '(already has one)' : '(bag full)')
        : `${slotsLeft} slot${slotsLeft !== 1 ? 's' : ''} free · HP ${fighter.hp}/${fighter.maxHp}`;
    }

    const displayName = (fighter.passiveKey === 'ghoul' && fighter._necromancer)
      ? `Ghoul → ${fighter._necromancer.name}`
      : fighter.name;

    const btn = document.createElement('button');
    btn.className = `wave-loot-pick-btn${blocked ? ' unavailable' : ''}`;
    btn.innerHTML = `
      <img src="${fighter.image}" alt="${fighter.name}" style="width:28px;height:28px;object-fit:contain;border-radius:4px;${fighter.dead ? 'filter:grayscale(1);opacity:0.7;' : ''}">
      <div>
        <div style="font-weight:700">🎒 ${displayName}</div>
        <div style="font-size:0.73rem;color:var(--muted)">${statusText}</div>
      </div>
    `;
    if (!blocked) {
      btn.addEventListener('click', () => {
        overlay.style.display = 'none';
        state.aiActive._lootGranted = true;
        equipItem(fighter, item);
        renderFighter('player', state.playerActive);
        renderReserves('player');
        chooseNextAICard();
      });
    }
    picksEl.appendChild(btn);
  });

  // ── "Use immediately" section — only for consumables ──
  if (item.consumable) {
    function closeLootAndContinue() {
      overlay.style.display = 'none';
      state.aiActive._lootGranted = true;
      renderFighter('player', state.playerActive);
      renderReserves('player');
      chooseNextAICard();
    }

    const divider = document.createElement('div');
    divider.className = 'wave-loot-use-divider';
    divider.textContent = '— or use immediately —';
    picksEl.appendChild(divider);

    if (item.id === 'potion') {
      alivePicks.forEach(fighter => {
        const atFull = fighter.hp >= fighter.maxHp;
        const useBtn = document.createElement('button');
        useBtn.className = `wave-loot-pick-btn wave-loot-use-now-btn${atFull ? ' unavailable' : ''}`;
        useBtn.innerHTML = `
          <img src="${item.image}" alt="" style="width:28px;height:28px;object-fit:contain;border-radius:4px;">
          <div>
            <div style="font-weight:700">⚡ Heal ${fighter.name}</div>
            <div style="font-size:0.73rem;color:var(--muted)">${atFull
              ? 'Already at full HP'
              : `+${Math.min(potionHeal, fighter.maxHp - fighter.hp)} HP (${fighter.hp}/${fighter.maxHp})`}</div>
          </div>
        `;
        if (!atFull) {
          useBtn.addEventListener('click', () => {
            const healed = Math.min(potionHeal, fighter.maxHp - fighter.hp);
            fighter.hp   = Math.min(fighter.maxHp, fighter.hp + potionHeal);
            addLog(`<span class="log-event">🧪 Potion used on the spot! ${fighter.name} +${healed} HP (${fighter.hp}/${fighter.maxHp})</span>`);
            closeLootAndContinue();
          });
        }
        picksEl.appendChild(useBtn);
      });

    } else if (item.id === 'revive') {
      const deadPicks = state.playerPicks.filter(f => f.dead);
      if (deadPicks.length > 0) {
        // Revive a dead ally immediately — one button per dead fighter (player chooses)
        deadPicks.forEach(fighter => {
          const revBtn = document.createElement('button');
          revBtn.className = 'wave-loot-pick-btn wave-loot-use-now-btn';
          revBtn.innerHTML = `
            <img src="${item.image}" alt="" style="width:28px;height:28px;object-fit:contain;border-radius:4px;">
            <div>
              <div style="font-weight:700">⚡ Revive ${fighter.name}</div>
              <div style="font-size:0.73rem;color:var(--muted)">Comes back at ${reviveHp} HP</div>
            </div>
          `;
          revBtn.addEventListener('click', () => {
            fighter.dead = false;
            fighter.hp   = reviveHp;
            addLog(`<span class="log-event">✨ Revive used on the spot! ${fighter.name} returns to ${reviveHp} HP!</span>`);
            closeLootAndContinue();
          });
          picksEl.appendChild(revBtn);
        });
      } else {
        // No dead allies — heal any alive card (player chooses)
        alivePicks.forEach(fighter => {
          const atFull = fighter.hp >= fighter.maxHp;
          const useBtn = document.createElement('button');
          useBtn.className = `wave-loot-pick-btn wave-loot-use-now-btn${atFull ? ' unavailable' : ''}`;
          useBtn.innerHTML = `
            <img src="${item.image}" alt="" style="width:28px;height:28px;object-fit:contain;border-radius:4px;">
            <div>
              <div style="font-weight:700">⚡ Heal ${fighter.name}</div>
              <div style="font-size:0.73rem;color:var(--muted)">${atFull
                ? 'Already at full HP'
                : `+${Math.min(reviveFallback, fighter.maxHp - fighter.hp)} HP — no allies dead`}</div>
            </div>
          `;
          if (!atFull) {
            useBtn.addEventListener('click', () => {
              const healed = Math.min(reviveFallback, fighter.maxHp - fighter.hp);
              fighter.hp   = Math.min(fighter.maxHp, fighter.hp + reviveFallback);
              addLog(`<span class="log-event">✨ Revive used on the spot! No allies dead — ${fighter.name} +${healed} HP (${fighter.hp}/${fighter.maxHp})</span>`);
              closeLootAndContinue();
            });
          }
          picksEl.appendChild(useBtn);
        });
      }
    }
  }

  overlay.style.display = 'flex';
}

// Use a consumable item from the lobby bag (Potion or Revive).
// Shows a small modal letting the player pick one fighter from `choices`.
// After picking, calls onPick(fighter) and re-renders the lobby team.
function showConsumablePicker(title, choices, onPick) {
  const existing = document.getElementById('consumable-picker-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'consumable-picker-overlay';
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:900',
    'background:rgba(0,0,0,.65)',
    'display:flex;align-items:center;justify-content:center',
  ].join(';');

  const modal = document.createElement('div');
  modal.style.cssText = [
    'background:var(--surface2);border:1px solid var(--border)',
    'border-radius:12px;padding:20px;max-width:360px;width:90%',
    'box-shadow:0 8px 32px rgba(0,0,0,.8)',
  ].join(';');

  const titleEl = document.createElement('div');
  titleEl.textContent = title;
  titleEl.style.cssText = 'font-weight:700;margin-bottom:12px;text-align:center;font-size:1rem;';
  modal.appendChild(titleEl);

  choices.forEach(f => {
    const btn = document.createElement('button');
    btn.style.cssText = [
      'display:flex;align-items:center;gap:10px;width:100%',
      'padding:10px 12px;margin-bottom:8px',
      'background:var(--surface);border:1px solid var(--border)',
      'border-radius:8px;cursor:pointer;color:inherit;font-size:0.9rem;text-align:left',
    ].join(';');
    btn.innerHTML = `
      <img src="${f.image}" style="width:36px;height:36px;object-fit:contain;border-radius:6px;flex-shrink:0">
      <div>
        <div style="font-weight:700">${f.name}</div>
        <div style="font-size:0.75rem;color:var(--muted)">${f.dead ? '💀 Defeated' : `${f.hp}/${f.maxHp} HP`}</div>
      </div>`;
    btn.addEventListener('click', () => { overlay.remove(); onPick(f); renderWaveLobbyTeam(); });
    modal.appendChild(btn);
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.cssText = [
    'width:100%;padding:8px;margin-top:4px',
    'border:1px solid var(--border);border-radius:8px',
    'background:transparent;cursor:pointer;color:inherit',
  ].join(';');
  cancelBtn.addEventListener('click', () => overlay.remove());
  modal.appendChild(cancelBtn);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function useConsumable(fighter, item) {
  const idx = fighter.items.indexOf(item);
  if (idx === -1) return;

  const waveSet    = state.waveMode ? Math.floor((state.currentWave - 1) / 10) : 0;
  const potionHeal = 70  + waveSet * 20;
  // Revive always restores 50% of the target's max HP; fallback self-heal is 25% of own max.
  // (reviveHp is computed per-target inside doRevive, not a fixed value)

  if (item.id === 'potion') {
    const healTargets = state.playerPicks.filter(f => !f.dead && f.hp < f.maxHp);
    if (healTargets.length > 1) {
      // Let player choose which alive fighter to heal
      showConsumablePicker(`Choose who to heal (+${potionHeal} HP)`, healTargets, chosen => {
        const healed = Math.min(potionHeal, chosen.maxHp - chosen.hp);
        chosen.hp = Math.min(chosen.maxHp, chosen.hp + potionHeal);
        fighter.items.splice(fighter.items.indexOf(item), 1);
        addLog(`<span class="log-event">🧪 Potion! ${chosen.name} heals ${healed} HP (${chosen.hp}/${chosen.maxHp})</span>`);
      });
      return;  // picker handles the rest
    }
    // Only one valid target (or holder is the only option) — apply directly
    const target = healTargets[0] || fighter;
    const healed = Math.min(potionHeal, target.maxHp - target.hp);
    target.hp = Math.min(target.maxHp, target.hp + potionHeal);
    fighter.items.splice(idx, 1);
    addLog(`<span class="log-event">🧪 Potion! ${target.name} heals ${healed} HP (${target.hp}/${target.maxHp})</span>`);

  } else if (item.id === 'revive') {
    // Dead Ghouls with _necromancer proxy to the Necromancer: revive brings back the original.
    const rawDead = state.playerPicks.filter(f => f.dead);
    const reviveTargets = rawDead.map(f =>
      (f.passiveKey === 'ghoul' && f._necromancer) ? f._necromancer : f
    );
    // Apply a revive to a target — always 50% of that target's max HP.
    function doRevive(target) {
      const hp50 = Math.floor(target.maxHp * 0.5);
      // Check if this target is a Necromancer whose Ghoul is currently in picks.
      const ghoulInPicks = state.playerPicks.find(
        f => f.passiveKey === 'ghoul' && f._necromancer === target
      );
      if (ghoulInPicks) {
        const gIdx = state.playerPicks.indexOf(ghoulInPicks);
        if (gIdx !== -1) state.playerPicks[gIdx] = target;
        target.dead = false;
        target.hp   = hp50;
        addLog(`<span class="log-event">✨ Revive! ${target.name} rises from the Ghoul at ${hp50} HP!</span>`);
      } else {
        target.dead = false;
        target.hp   = hp50;
        addLog(`<span class="log-event">✨ Revive! ${target.name} is revived to ${hp50} HP (50%)!</span>`);
      }
    }
    if (reviveTargets.length > 1) {
      showConsumablePicker('Choose who to revive (50% HP)', reviveTargets, chosen => {
        doRevive(chosen);
        fighter.items.splice(fighter.items.indexOf(item), 1);
      });
      return;  // picker handles the rest
    } else if (reviveTargets.length === 1) {
      doRevive(reviveTargets[0]);
    } else {
      // No dead allies — heal self for 25% of own max HP
      const fallback = Math.floor(fighter.maxHp * 0.25);
      const healed   = Math.min(fallback, fighter.maxHp - fighter.hp);
      fighter.hp     = Math.min(fighter.maxHp, fighter.hp + fallback);
      addLog(`<span class="log-event">✨ Revive! No dead allies — ${fighter.name} heals ${healed} HP (${fighter.hp}/${fighter.maxHp})</span>`);
    }
    fighter.items.splice(idx, 1);
  }
  renderWaveLobbyTeam();
}

// Show/hide the item bag tooltip near the given anchor element.
let _bagTooltipTimeout = null;

function showItemTooltip(fighter, anchorEl) {
  clearTimeout(_bagTooltipTimeout);
  const tooltip = document.getElementById('item-bag-tooltip');
  tooltip.querySelector('.ibt-title').textContent = `${fighter.name}'s Bag`;

  const slotsEl = document.getElementById('ibt-slots');
  slotsEl.innerHTML = '';

  const inLobby = screens.wavelobby.classList.contains('active');

  // Group identical items by id so stackable items show once with a ×N count badge
  const grouped = [];
  const seenIds = {};
  (fighter.items || []).forEach(item => {
    if (seenIds[item.id] !== undefined) {
      grouped[seenIds[item.id]].count++;
    } else {
      seenIds[item.id] = grouped.length;
      grouped.push({ item, count: 1 });
    }
  });

  for (let i = 0; i < 16; i++) {
    const slot = document.createElement('div');
    slot.className = 'ibt-slot';
    const group = grouped[i];
    if (group) {
      const { item, count } = group;
      slot.classList.add(`rarity-${item.rarity}`);
      // Dynamic tooltip: potion heal scales with wave set
      if (item.id === 'potion' && state.waveMode) {
        const ws = Math.floor((state.currentWave - 1) / 10);
        slot.dataset.tooltip = `Use in the lobby to restore ${70 + ws * 20} HP to this card.`;
      } else {
        slot.dataset.tooltip = item.desc;
      }
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      const nameEl = document.createElement('div');
      nameEl.className = 'ibt-slot-name';
      nameEl.textContent = item.name;
      slot.appendChild(img);
      slot.appendChild(nameEl);
      if (count > 1) {
        const countEl = document.createElement('div');
        countEl.className = 'ibt-slot-count';
        countEl.textContent = `×${count}`;
        slot.appendChild(countEl);
      }
      if (item.consumable && inLobby) {
        const useBtn = document.createElement('button');
        useBtn.className = 'ibt-slot-use';
        useBtn.textContent = 'Use';
        useBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          useConsumable(fighter, item); // always removes one occurrence
          showItemTooltip(fighter, anchorEl); // refresh count
        });
        slot.appendChild(useBtn);
      }
    } else {
      slot.classList.add('empty');
    }
    slotsEl.appendChild(slot);
  }

  tooltip.style.display = 'block';
  requestAnimationFrame(() => {
    const rect = anchorEl.getBoundingClientRect();
    const th   = tooltip.offsetHeight;
    const tw   = tooltip.offsetWidth;
    let top    = rect.top - th - 8;
    let left   = rect.left;
    if (top < 4)                     top  = rect.bottom + 8;
    if (left + tw > window.innerWidth - 4) left = window.innerWidth - tw - 8;
    if (left < 4)                    left = 4;
    tooltip.style.top  = `${top}px`;
    tooltip.style.left = `${left}px`;
  });
}

function hideItemTooltip() {
  _bagTooltipTimeout = setTimeout(() => {
    const t = document.getElementById('item-bag-tooltip');
    if (t) t.style.display = 'none';
  }, 150);
}

// Attach a bag icon to a DOM element (card or fighter slot), pointing at fighter data.
function attachBagIcon(containerEl, fighter) {
  if (!state.waveMode || !fighter.items) return;
  const existing = containerEl.querySelector('.card-bag-icon');
  if (existing) existing.remove();
  const img = document.createElement('img');
  img.className = 'card-bag-icon';
  img.src = 'Images/bag.png';
  img.alt = 'Bag';
  img.title = 'Items';
  img.addEventListener('mouseenter', (e) => { e.stopPropagation(); showItemTooltip(fighter, img); });
  img.addEventListener('mouseleave', hideItemTooltip);
  containerEl.appendChild(img);
}

// ── Game State ────────────────────────────────────────────
let state = {};

function resetState() {
  state = {
    playerPicks: [],
    aiPicks: [],
    playerActive: null,
    aiActive: null,
    currentTurn: null,
    playerShield: 0,
    aiShield: 0,
    paused: false,
    battleRunning: false,
    battleTimeout: null,
    buildAITimeout: null,
    playerSkipNextTurn: false,
    aiSkipNextTurn: false,
    // Wave mode
    waveMode: false,
    currentWave: 0,
    waveSelectedActive: null,
    waveAlwaysFirstFlip: false,
  };
}

// Fighter object factory — one per battle slot, passiveIndex 0 or 1
function makeFighter(classDef, passiveIndex) {
  const pi = (passiveIndex === 0 || passiveIndex === 1) ? passiveIndex : 0;
  const chosen = classDef.passives[pi];
  return {
    ...classDef,
    hp: classDef.baseHp,
    maxHp: classDef.baseHp,
    damage: classDef.baseDamage,
    passiveKey: chosen.key,
    passiveName: chosen.name,
    passive: chosen.description,
    chosenPassiveIndex: pi,
    attackCount: 0,
    ultimateCharge: 0,
    ultimateReady: false,
    burnDamage: 10,
    shieldMultiplier: 1,
    burnAmount: 0,
    dead: false,
    // Joker Ace: tracks maxHp added so it can be stripped on 10-wave reset
    aceHpBonus: 0,
    // Shield Block
    shieldBlockAvailable: chosen.key === 'shieldblock',
    // Evasion
    evasionAttackCount: 0,
    evasionUsed: false,
    // Marksman Steady Aim: accumulated bonus damage — survives soft-resets, stripped on hard-reset
    steadyAimBonus: 0,
    // Double Shot
    doubleshotCount: 0,
    // Thunderlord
    thunderlordPendingStrike: false,
    thunderlordMaxHpBonus: 0,   // total maxHp gained from kills; stripped on 10-wave reset
    // Shield (separate from HP — absorbs damage before actual HP is reduced)
    shieldHp: 0,
    shieldHpMax: 0, // cumulative shield ever granted — lets Rage count consumed shield as "missing"
    // Death Knight
    healStack: 0,
    deathGripCount: 0,
    fearCount: 0,
    deathGripBonus: 0,
    // Joker
    lotdTurnCount: 0,
    aceFlipped: false,
    aceResult: null,
    _jokerResult: null,
    // Druid — form tracking for wave mode (hard-reset at 10-wave boundaries)
    transformed: false,
    wolfForm: false,
    upgradeMaxHp: 0,              // cumulative max HP from wave upgrades; lets hardReset undo form HP bonuses
    _origBaseDmg: classDef.baseDamage,  // immutable pre-upgrade base damage; used in transform formula
    _origImage:   classDef.image,        // pre-transform image path; restored on hard reset
    _origPassive: chosen.description,    // pre-transform passive description; restored on hard reset
    // Armor / damage split
    _magicBonus: 0,
    // Berserk (triggers after 6 attacks received)
    attacksReceived: 0,
    berserk: false,
    // Rider
    isMounted: classDef.id === 'rider',
    horseHp: classDef.id === 'rider' ? 80 : 0,
    horseHpMax: classDef.id === 'rider' ? 80 : 0,
    dismountedAttacks: 0,
    dismountBonus: 0,
    horseReviveUsed: false,
    parryToggle: false,
    // Necromancer
    necroTurnCount: 0,
    ghoulHp: classDef.id === 'necromancer' ? 10 : 0,
    ghoulHpMax: classDef.id === 'necromancer' ? 10 : 0,
    ghoulDamage: classDef.id === 'necromancer' ? 10 : 0,
    ghoulSpawned: false,
    rebornUsed: false,
    reborn: false,
    // Shaman
    lightningShieldActive: classDef.id === 'shaman',
    shamHealCount: 0,
    shamLavaCount: 0,
    // Wave mode items (all fighters start empty; populated via equipItem in wave mode)
    items:                [],
    spellbookBonus:       0,    // cumulative +X to all passive/ult damage (each Spellbook = +10)
    lifeStealStacks:      0,    // 10% heal per stack on every hit dealt
    hasSpeed:             false, // guaranteed coin-flip win
    angelRevived:         false, // true after Angel fires (triggers golden glow)
    physicalDmgReduction: 0,    // 0.10 per Shield item; stacks with Fortify (additive %)
    spikyRetaliDmg:       0,    // 10 per Spiky Vest stack; retaliation dealt to physical attackers
    magicDmgReduction:    0,    // 15 flat per Magic Armor stack; applied vs magical attacks
    allDmgReductionPct:   0,    // additive % from wave upgrades; reduces all damage after other mitigation
    healingReductionPct:  0,    // % reduction on in-battle heals (e.g. Dragon Inferno debuff, poison)
    poisonDotAmount:      0,    // >0 when poisoned; DOT dealt at start of fighter's own turn
    bearHealUsed:         false, // true once the Bear Form low-HP surge has fired this wave
    deathsDoorActive:     false, // true this turn when Death's Door saved the fighter at 1 HP
  };
}

// ── Screen Management ─────────────────────────────────────
const screens = {
  menu:        document.getElementById('screen-menu'),
  selection:   document.getElementById('screen-selection'),
  passive:     document.getElementById('screen-passive'),
  reveal:      document.getElementById('screen-reveal'),
  battle:      document.getElementById('screen-battle'),
  choose:      document.getElementById('screen-choose'),
  end:         document.getElementById('screen-end'),
  wavelobby:   document.getElementById('screen-wave-lobby'),
  waveupgrade: document.getElementById('screen-wave-upgrade'),
  wavevictory: document.getElementById('screen-wave-victory'),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  // Always dismiss the card tooltip on any screen change
  document.getElementById('card-detail-panel').classList.remove('visible');
  if (name === 'menu' || name === 'selection') playMenuMusic();
  else if (name === 'battle') playBattleMusic();
  else if (name === 'end' || name === 'wavevictory') stopAllMusic();
  else if (name === 'wavelobby' || name === 'waveupgrade') playMenuMusic();
  // Show Home button on every screen except the main menu itself
  const homeBtn = document.getElementById('btn-home-menu');
  if (homeBtn) homeBtn.style.display = (name === 'menu') ? 'none' : 'block';
}

// ── Event Bindings ────────────────────────────────────────
document.getElementById('btn-start').addEventListener('click', startGame);
document.getElementById('btn-home-menu').addEventListener('click', restartGame);
document.getElementById('btn-wave-mode').addEventListener('click', startWaveMode);
document.getElementById('btn-battle').addEventListener('click', revealAndBattle);
document.getElementById('btn-restart').addEventListener('click', restartGame);
document.getElementById('btn-wave-fight').addEventListener('click', startWave);
document.getElementById('btn-wave-play-again').addEventListener('click', restartGame);

// Wave lobby: press Enter to start wave when a card is selected
document.addEventListener('keydown', function _waveLobbyEnterHandler(e) {
  if (e.key === 'Enter' && screens.wavelobby.classList.contains('active') && state.waveSelectedActive) {
    startWave();
  }
});
document.getElementById('btn-pause').addEventListener('click', togglePause);
document.getElementById('btn-log').addEventListener('click', toggleBattleLog);

// Keep item bag tooltip open when the cursor moves into it (so Use buttons are clickable)
(function () {
  const tt = document.getElementById('item-bag-tooltip');
  if (tt) {
    tt.addEventListener('mouseenter', () => clearTimeout(_bagTooltipTimeout));
    tt.addEventListener('mouseleave', hideItemTooltip);
  }
})();

function _logOutsideHandler(e) {
  const log = document.getElementById('battle-log');
  const btn = document.getElementById('btn-log');
  if (!log.contains(e.target) && !btn.contains(e.target)) {
    log.classList.remove('log-visible');
    btn.classList.remove('log-open');
    document.removeEventListener('click', _logOutsideHandler);
  }
}

function toggleBattleLog() {
  const log = document.getElementById('battle-log');
  const btn = document.getElementById('btn-log');
  const isOpen = log.classList.toggle('log-visible');
  btn.classList.toggle('log-open', isOpen);
  if (isOpen) {
    log.scrollTop = log.scrollHeight;
    setTimeout(() => document.addEventListener('click', _logOutsideHandler), 0);
  } else {
    document.removeEventListener('click', _logOutsideHandler);
  }
}

function togglePause() {
  state.paused = !state.paused;
  const btn = document.getElementById('btn-pause');
  if (state.paused) {
    clearTimeout(state.battleTimeout);
    btn.textContent = '▶ Resume';
    btn.classList.add('is-paused');
  } else {
    btn.textContent = '⏸ Pause';
    btn.classList.remove('is-paused');
    // Small delay so any in-flight animation setTimeout callbacks finish before
    // the next tick starts — prevents the "super fast" double-tick race condition.
    state.battleTimeout = setTimeout(runBattleTick, 300);
  }
}

// ── START GAME ────────────────────────────────────────────
function startGame() {
  initAudio();
  resetState();
  renderCardSelection();
  showScreen('selection');
}

// ── CARD SELECTION SCREEN ─────────────────────────────────
function renderCardSelection() {
  const grid = document.getElementById('selection-grid');
  grid.innerHTML = '';
  CLASSES.forEach(cls => {
    const card = buildCardEl(cls, 'full');
    card.dataset.id = cls.id;
    card.addEventListener('click', () => selectCard(cls.id));
    card.addEventListener('mouseenter', () => showCardDetail(cls, card));
    card.addEventListener('mouseleave', hideCardDetail);
    grid.appendChild(card);
  });
  updatePickLabel();
}

function showCardDetail(cls, cardEl) {
  const panel = document.getElementById('card-detail-panel');
  const dt = getDmgType(cls);

  panel.innerHTML = `
    <div class="cdp-name">${cls.name}</div>
    <div class="cdp-stats">
      <span class="cdp-hp">❤ ${cls.baseHp} HP</span>
      <span class="cdp-dmg ${dt.cls}">${dt.icon} ${cls.baseDamage} DMG</span>
    </div>
    <div class="cdp-dmg-type ${dt.cls}">${dt.label}</div>
    <hr class="cdp-divider">
    <div class="cdp-section-label">Passive Options</div>
    <div class="cdp-passive">
      <span class="cdp-option-tag cdp-opt-a">A</span>
      <div class="cdp-passive-body">
        <strong>${cls.passives[0].name}</strong>
        <p>${cls.passives[0].description}</p>
      </div>
    </div>
    <div class="cdp-passive">
      <span class="cdp-option-tag cdp-opt-b">B</span>
      <div class="cdp-passive-body">
        <strong>${cls.passives[1].name}</strong>
        <p>${cls.passives[1].description}</p>
      </div>
    </div>
    <hr class="cdp-divider">
    <div class="cdp-section-label">
      Ultimate
      <span class="cdp-ult-charge">${cls.ultimateThreshold >= 9999 ? 'always active' : cls.ultimateThreshold === 1 ? 'after 1st attack' : `every ${cls.ultimateThreshold} attacks`}</span>
    </div>
    <p class="cdp-ult-desc">${cls.ultimateDescription}</p>
  `;

  positionDetailPanel(panel, cardEl);
}

function showFighterDetail(fighter, cardEl) {
  const panel = document.getElementById('card-detail-panel');
  const ultLabel = fighter.ultimateThreshold >= 9999 ? 'always active'
    : fighter.ultimateThreshold === 1 ? 'after 1st attack'
    : `every ${fighter.ultimateThreshold} attacks`;
  const dt = getDmgType(fighter);

  panel.innerHTML = `
    <div class="cdp-name">${fighter.name}</div>
    <div class="cdp-stats">
      <span class="cdp-hp">❤ ${fighter.hp ?? fighter.baseHp} HP</span>
      <span class="cdp-dmg ${dt.cls}">${dt.icon} ${fighter.damage ?? fighter.baseDamage} DMG</span>
    </div>
    <div class="cdp-dmg-type ${dt.cls}">${dt.label}</div>
    <hr class="cdp-divider">
    <div class="cdp-section-label">Chosen Passive</div>
    <div class="cdp-passive">
      <div class="cdp-passive-body">
        <strong>${fighter.passiveName}</strong>
        <p>${fighter.passive}</p>
      </div>
    </div>
    <hr class="cdp-divider">
    <div class="cdp-section-label">
      Ultimate <span class="cdp-ult-charge">${ultLabel}</span>
    </div>
    <p class="cdp-ult-desc">${fighter.ultimateDescription}</p>
  `;
  positionDetailPanel(panel, cardEl);
}

function positionDetailPanel(panel, cardEl) {
  const rect   = cardEl.getBoundingClientRect();
  const panelW = 252;
  const gap    = 12;

  let left = rect.right + gap;
  if (left + panelW > window.innerWidth - 8) {
    left = rect.left - panelW - gap;
  }
  left = Math.max(8, left);

  // Use actual rendered height for accurate bottom-clamping
  const actualH = panel.offsetHeight || 300;
  let top = rect.top;
  if (top + actualH > window.innerHeight - 8) {
    top = window.innerHeight - actualH - 8;
  }
  top = Math.max(8, top);

  panel.style.left = `${left}px`;
  panel.style.top  = `${top}px`;
  panel.classList.add('visible');
}

function hideCardDetail() {
  document.getElementById('card-detail-panel').classList.remove('visible');
}

function selectCard(classId) {
  if (state.playerPicks.find(f => f.id === classId)) {
    deselectCard(classId);
    return;
  }
  if (state.playerPicks.length >= 3) return;
  const cls = CLASSES.find(c => c.id === classId);
  showPassivePicker(cls);
}

function deselectCard(classId) {
  const idx = state.playerPicks.findIndex(f => f.id === classId);
  if (idx === -1) return;
  cancelAIBuild();
  state.playerPicks.splice(idx, 1);
  updateSelectionUI();
}

function deselectLastPick() {
  if (state.playerPicks.length === 0) return;
  cancelAIBuild();
  state.playerPicks.pop();
  updateSelectionUI();
}

function cancelAIBuild() {
  if (state.buildAITimeout) {
    clearTimeout(state.buildAITimeout);
    state.buildAITimeout = null;
  }
}

document.getElementById('passive-pick-back').addEventListener('click', () => showScreen('selection'));

document.addEventListener('keydown', e => {
  if (!document.getElementById('screen-selection').classList.contains('active')) return;
  if (e.key === 'Escape' || e.key === 'Backspace') {
    e.preventDefault();
    deselectLastPick();
  }
});

function showPassivePicker(cls) {
  hideCardDetail();
  document.getElementById('passive-pick-title').textContent = `Choose a Passive — ${cls.name}`;
  document.getElementById('passive-pick-subtitle').textContent =
    'Select one passive ability. Your choice is locked for the match.';

  const optionsEl = document.getElementById('passive-pick-options');
  optionsEl.innerHTML = '';

  cls.passives.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = 'passive-pick-btn';
    btn.innerHTML = `
      <span class="passive-btn-label">Option ${i === 0 ? 'A' : 'B'}</span>
      <span class="passive-btn-name">${p.name}</span>
      <span class="passive-btn-desc">${p.description}</span>
    `;
    btn.addEventListener('click', () => confirmPassiveChoice(cls, i));
    optionsEl.appendChild(btn);
  });

  showScreen('passive');
}

function confirmPassiveChoice(cls, passiveIndex) {
  const fighter = makeFighter(cls, passiveIndex);
  state.playerPicks.push(fighter);
  showScreen('selection');
  updateSelectionUI();

  if (state.playerPicks.length === 3) {
    if (state.waveMode) {
      state.currentWave = 1;
      setTimeout(showWaveUpgrade, 400);   // starting bonus before wave 1
    } else {
      state.buildAITimeout = setTimeout(buildAITeam, 500);
    }
  }
}

function updateSelectionUI() {
  const picks = state.playerPicks;
  const cards = document.querySelectorAll('#selection-grid .card');
  const done = picks.length >= 3;

  cards.forEach(card => {
    const id = card.dataset.id;
    const pickIdx = picks.findIndex(f => f.id === id);

    card.querySelectorAll('.pick-badge').forEach(b => b.remove());

    const passiveLabel = card.querySelector('.passive-label');

    if (pickIdx !== -1) {
      card.classList.add('selected');
      const badge = document.createElement('span');
      badge.className = 'pick-badge';
      badge.textContent = pickIdx === 0 ? 'FIGHTER' : 'RESERVE';
      card.appendChild(badge);

      // Replace the "A: X | B: Y" text with the chosen passive name
      if (passiveLabel) {
        passiveLabel.innerHTML = `<strong>${picks[pickIdx].passiveName}</strong>`;
        passiveLabel.style.color = 'var(--accent)';
        passiveLabel.style.fontStyle = 'normal';
      }
    } else {
      card.classList.remove('selected');
      // Restore default passive listing
      if (passiveLabel) {
        const cls = CLASSES.find(c => c.id === card.dataset.id);
        if (cls) {
          passiveLabel.innerHTML = `A: ${cls.passives[0].name} | B: ${cls.passives[1].name}`;
          passiveLabel.style.color = '';
          passiveLabel.style.fontStyle = '';
        }
      }
    }

    if (done && pickIdx === -1) {
      card.classList.add('disabled');
    }
  });

  updatePickLabel();
}

function updatePickLabel() {
  document.getElementById('pick-label').innerHTML =
    `Picks: <strong>${state.playerPicks.length} / 3</strong>`;
}

// ── AI TEAM ───────────────────────────────────────────────
function buildAITeam() {
  const allIds = CLASSES.map(c => c.id);
  const shuffled = shuffle([...allIds]);
  const aiIds = shuffled.slice(0, 3);
  state.aiPicks = aiIds.map(id => {
    const cls = CLASSES.find(c => c.id === id);
    const pi = Math.random() < 0.5 ? 0 : 1; // 50/50 passive choice
    return makeFighter(cls, pi);
  });

  // Randomly assign AI's first fighter
  const firstIdx = Math.floor(Math.random() * 3);
  if (firstIdx !== 0) {
    [state.aiPicks[0], state.aiPicks[firstIdx]] = [state.aiPicks[firstIdx], state.aiPicks[0]];
  }

  renderRevealScreen();
  showScreen('reveal');
}

// ── TEAM REVEAL ───────────────────────────────────────────
function renderRevealScreen() {
  const playerRow = document.getElementById('player-team-reveal');
  const aiRow = document.getElementById('ai-team-reveal');
  playerRow.innerHTML = '';
  aiRow.innerHTML = '';

  state.playerPicks.forEach((fighter, i) => {
    const card = buildCardEl(fighter, 'full');
    card.style.cursor = 'default';
    card.addEventListener('mouseenter', () => showFighterDetail(fighter, card));
    card.addEventListener('mouseleave', hideCardDetail);
    const badge = document.createElement('span');
    badge.className = 'pick-badge';
    badge.textContent = i === 0 ? 'FIGHTER' : 'RESERVE';
    card.appendChild(badge);
    playerRow.appendChild(card);
  });

  state.aiPicks.forEach((fighter, i) => {
    const card = buildCardEl(fighter, 'full');
    card.style.cursor = 'default';
    card.addEventListener('mouseenter', () => showFighterDetail(fighter, card));
    card.addEventListener('mouseleave', hideCardDetail);
    const badge = document.createElement('span');
    badge.className = 'pick-badge';
    badge.textContent = i === 0 ? 'FIGHTER' : 'RESERVE';
    card.appendChild(badge);
    aiRow.appendChild(card);
  });
}

// ── START BATTLE ──────────────────────────────────────────
function revealAndBattle() {
  state.playerActive = state.playerPicks[0];
  state.aiActive     = state.aiPicks[0];
  showScreen('battle');
  clearLog();
  renderBattleScreen();
  logEvent('⚔ Battle begins!');
  applyOnEnterEffects(state.playerActive, 'player');
  applyOnEnterEffects(state.aiActive, 'ai');
  initCombatTurn(state.playerActive, state.aiActive);
  setTimeout(runBattleTick, 1200);
}

// Coin-flip for who opens; Assassin First Strike overrides.
function initCombatTurn(playerFighter, aiFighter) {
  const pFS = playerFighter.passiveKey === 'firststrike';
  const aFS = aiFighter.passiveKey === 'firststrike';

  if (pFS && !aFS) {
    state.currentTurn = 'player';
    logEvent('⚡ First Strike! Your Assassin attacks first!');
  } else if (aFS && !pFS) {
    state.currentTurn = 'ai';
    logEvent('⚡ First Strike! Enemy Assassin attacks first!');
  } else if (state.waveAlwaysFirstFlip || (state.waveMode && playerFighter.hasSpeed)) {
    state.currentTurn = 'player';
    logEvent(playerFighter.hasSpeed && !state.waveAlwaysFirstFlip
      ? '⚡ Speed item — you win the coin flip!'
      : '⚡ First-Strike Rune — you always go first!');
  } else {
    state.currentTurn = Math.random() < 0.5 ? 'player' : 'ai';
    logEvent(`🎲 Coin flip — ${state.currentTurn === 'player' ? 'You go' : 'Enemy goes'} first!`);
  }
  renderTurnIndicator();
}

// ── BATTLE SCREEN RENDER ──────────────────────────────────
function renderBattleScreen() {
  renderFighter('player', state.playerActive);
  renderFighter('ai', state.aiActive);
  renderReserves('player');
  renderReserves('ai');
}

function renderFighter(side, fighter) {
  const el = document.getElementById(`${side}-fighter`);
  if (!fighter) { el.innerHTML = ''; el.classList.remove('berserk', 'angel-revived', 'deaths-door'); return; }

  el.classList.toggle('berserk', !!fighter.berserk);
  el.classList.toggle('angel-revived', !!fighter.angelRevived);
  el.classList.toggle('deaths-door', !!fighter.deathsDoorActive);

  const hpPct = Math.max(0, (fighter.hp / fighter.maxHp) * 100);
  const hpColor = hpPct > 50 ? 'var(--green)' : hpPct > 25 ? 'var(--gold)' : 'var(--accent2)';
  const ultimatePct = (fighter.ultimateCharge / fighter.ultimateThreshold) * 100;
  const passiveDisplay = buildPassiveDisplay(fighter);

  const horseNote = fighter.isMounted ? ` 🐴${fighter.horseHp}` : '';
  el.innerHTML = `
    <div class="card-image${fighter.reborn ? ' reborn' : ''}">
      <img src="${fighter.image}" alt="${fighter.name}" />
      <div class="ultimate-bar-wrap">
        <div class="ultimate-bar" style="width:${ultimatePct}%"></div>
      </div>
      ${armorBadgeHtml(fighter)}
    </div>
    <div class="card-info">
      <h3>${fighter.name}</h3>
      <div class="stats">
        <span class="hp">HP ${fighter.hp}${fighter.shieldHp > 0 ? `<span class="hp-shield"> +${fighter.shieldHp}🛡</span>` : ''}${horseNote}</span>
        <span class="dmg">DMG ${fighter.damage}</span>
      </div>
      <div class="hp-bar-wrap">
        <div class="hp-bar" style="width:${hpPct}%;background:${hpColor};"></div>
      </div>
      <p class="passive-label"><strong>${fighter.passiveName}</strong>: ${passiveDisplay}</p>
    </div>
  `;
  // Wave mode: bag icon on player's active fighter
  if (state.waveMode && side === 'player' && fighter.items && fighter.items.length > 0) {
    attachBagIcon(el, fighter);
  }
  // Wave mode: loot badge on AI's active fighter — placed inside .card-image (bottom-right of image)
  if (state.waveMode && side === 'ai' && fighter.lootItem && !fighter._lootGranted) {
    const cardImg = el.querySelector('.card-image');
    const target  = cardImg || el;
    const badge   = document.createElement('div');
    badge.className = 'enemy-loot-badge';
    badge.innerHTML = `<img class="loot-badge-icon" src="${fighter.lootItem.image}" alt="loot" />🎁 Loot`;
    target.appendChild(badge);
  }
}

// Build a short status string for the active passive
function buildPassiveDisplay(fighter) {
  if (fighter.passiveKey === 'shieldblock') {
    return fighter.shieldBlockAvailable ? '🛡 Shield ready' : '🛡 Consumed';
  }
  if (fighter.passiveKey === 'evasion') {
    if (fighter.evasionUsed) return '💨 Used';
    return `💨 ${fighter.evasionAttackCount}/2 attacks`;
  }
  if (fighter.passiveKey === 'doubleshot') {
    return `🎯 ${fighter.doubleshotCount}/2 attacks`;
  }
  if (fighter.passiveKey === 'thunderlord') {
    return fighter.thunderlordPendingStrike ? '⚡ Strike pending!' : '⚡ Active';
  }
  if (fighter.passiveKey === 'rage') {
    const missing = (fighter.maxHp - fighter.hp) + (fighter.shieldHpMax - fighter.shieldHp);
    const tiers = Math.floor(missing / 20);
    return `💢 +${tiers * 10}% damage`;
  }
  if (fighter.passiveKey === 'deathgrip') {
    return `💀 ${fighter.deathGripCount}/3 attacks`;
  }
  if (fighter.passiveKey === 'fearofthedead') {
    return `😱 ${fighter.fearCount}/3 attacks`;
  }
  if (fighter.passiveKey === 'luckofthedraw') {
    const flipNext = fighter.lotdTurnCount % 2 === 0 ? 'Next attack' : 'In 2 attacks';
    return `🎴 Coin flip: ${flipNext}`;
  }
  if (fighter.passiveKey === 'theace') {
    if (!fighter.aceFlipped) return '🃏 Awaiting entry';
    return fighter.aceResult === 'heads' ? '🃏 ACE! Active' : '🃏 Tails — no bonus';
  }
  if (fighter.passiveKey === 'bearform') {
    return fighter.transformed ? '🐻 Bear Form!' : '🐻 Transforms after 1st attack';
  }
  if (fighter.passiveKey === 'wolfform') {
    return fighter.wolfForm ? '🐺 Wolf Form! 2× attacks' : '🐺 Transforms after 1st attack';
  }
  if (fighter.passiveKey === 'revival') {
    if (fighter.isMounted) return `🐴 Mounted (Horse: ${fighter.horseHp}/${fighter.horseHpMax} HP)`;
    if (fighter.horseReviveUsed) return `🐭 Dismounted (anger: +${fighter.dismountBonus} | revive used)`;
    return `🐭 Dismounted — horse revives in ${Math.max(0, 2 - fighter.dismountedAttacks)} attack(s)`;
  }
  if (fighter.passiveKey === 'parry') {
    if (fighter.isMounted) return `🐴 Mounted (Horse: ${fighter.horseHp}/${fighter.horseHpMax} HP)`;
    return `${fighter.parryToggle ? '🛡 Next attack parried' : '⚔ Next attack hits'} (anger: +${fighter.dismountBonus})`;
  }
  if (fighter.passiveKey === 'sacrifice') {
    return `💀 Ghoul: ${fighter.ghoulHp} HP / ${fighter.ghoulDamage} DMG`;
  }
  if (fighter.passiveKey === 'reborn') {
    if (fighter.rebornUsed) return `💀 Ally reborn`;
    if (fighter.necroTurnCount < 3) return `💀 Reborn in ${3 - fighter.necroTurnCount} turn(s)`;
    return `💀 Reborn ready`;
  }
  if (fighter.passiveKey === 'chainheal') {
    const healIn = fighter.shamHealCount % 2 === 0 ? 2 : 1;
    return `${fighter.lightningShieldActive ? '⚡🛡 ' : ''}⛓ Heal in ${healIn} attack(s)`;
  }
  if (fighter.passiveKey === 'lavablast') {
    const lavaIn = 3 - (fighter.shamLavaCount % 3);
    return `${fighter.lightningShieldActive ? '⚡🛡 ' : ''}🌋 Lava in ${lavaIn} attack(s)`;
  }
  if (fighter.passiveKey === 'ghoul') return `💀 Risen`;
  return fighter.passive;
}

// ── Reserve card hover tooltip ────────────────────────────
function showReserveTooltip(event, fighter) {
  let tip = document.getElementById('reserve-card-tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'reserve-card-tooltip';
    document.body.appendChild(tip);
  }

  const armorLabel = { cloth: 'Cloth (+0)', leather: 'Leather (+10)', mail: 'Mail (+20)' }[fighter.armorType] || fighter.armorType;
  const passiveText = (typeof getPassiveDisplay === 'function') ? getPassiveDisplay(fighter) : (fighter.passive || '');

  let html = `
    <div class="rct-name">${fighter.dead ? '💀 ' : ''}${fighter.name}</div>
    <div class="rct-stats">HP ${fighter.hp}/${fighter.maxHp}${fighter.shieldHp > 0 ? ` +${fighter.shieldHp}🛡` : ''} · DMG ${fighter.damage} · ${armorLabel}</div>
    <div class="rct-passive"><strong>${fighter.passiveName}:</strong> ${passiveText}</div>
  `;

  // Player card items
  if (state.waveMode && fighter.items && fighter.items.length > 0) {
    const grouped = {};
    fighter.items.forEach(i => {
      if (!grouped[i.id]) grouped[i.id] = { item: i, count: 0 };
      grouped[i.id].count++;
    });
    html += '<div class="rct-items-header">🎒 Bag:</div><div class="rct-items">';
    Object.values(grouped).forEach(({ item, count }) => {
      html += `<div class="rct-item"><img src="${item.image}" alt="" width="14" height="14"> ${item.name}${count > 1 ? ' ×' + count : ''}</div>`;
    });
    html += '</div>';
  }

  // AI loot item
  if (state.waveMode && fighter.lootItem && !fighter._lootGranted) {
    const li = fighter.lootItem;
    html += `
      <div class="rct-loot">
        <div class="rct-loot-header"><img src="${li.image}" alt="" width="14" height="14"> <strong>${li.name}</strong> <span class="rarity-${li.rarity}" style="font-size:0.72rem">(${li.rarity})</span></div>
        <div class="rct-loot-desc">${li.desc}</div>
      </div>`;
  }

  tip.innerHTML = html;
  tip.style.display = 'block';
  positionReserveTooltip(event, tip);
}

function positionReserveTooltip(event, tip) {
  if (!tip || tip.style.display === 'none') return;
  const margin = 12;
  let x = event.clientX + margin;
  let y = event.clientY + margin;
  // Ensure tooltip stays inside viewport
  const w = tip.offsetWidth  || 220;
  const h = tip.offsetHeight || 80;
  if (x + w > window.innerWidth  - margin) x = event.clientX - w - margin;
  if (y + h > window.innerHeight - margin) y = event.clientY - h - margin;
  tip.style.left = Math.max(margin, x) + 'px';
  tip.style.top  = Math.max(margin, y) + 'px';
}

function hideReserveTooltip() {
  const tip = document.getElementById('reserve-card-tooltip');
  if (tip) tip.style.display = 'none';
}

function renderReserves(side) {
  const container = document.getElementById(`${side}-reserves`);
  const picks = side === 'player' ? state.playerPicks : state.aiPicks;
  const active = side === 'player' ? state.playerActive : state.aiActive;
  container.innerHTML = '';

  picks.forEach(fighter => {
    if (fighter === active) return;
    const card = document.createElement('div');
    card.className = 'card' + (fighter.dead ? ' dead' : '') + (fighter.berserk ? ' berserk' : '') + (fighter.reborn ? ' reborn' : '');
    card.dataset.fighterId = fighter.id;

    const hpPct = Math.max(0, (fighter.hp / fighter.maxHp) * 100);
    const hpColor = hpPct > 50 ? 'var(--green)' : hpPct > 25 ? 'var(--gold)' : 'var(--accent2)';
    const ultimatePct = (fighter.ultimateCharge / fighter.ultimateThreshold) * 100;

    card.innerHTML = `
      <div class="card-image${fighter.reborn ? ' reborn' : ''}">
        <img src="${fighter.image}" alt="${fighter.name}" />
        <div class="ultimate-bar-wrap">
          <div class="ultimate-bar" style="width:${ultimatePct}%"></div>
        </div>
        ${armorBadgeHtml(fighter)}
      </div>
      <div class="card-info">
        <h3>${fighter.name}</h3>
        <div class="stats">
          <span class="hp">HP ${fighter.hp}${fighter.shieldHp > 0 ? `<span class="hp-shield"> +${fighter.shieldHp}🛡</span>` : ''}</span>
        </div>
        <div class="hp-bar-wrap">
          <div class="hp-bar" style="width:${hpPct}%;background:${hpColor};"></div>
        </div>
      </div>
    `;
    // Wave mode: bag icon on player reserve cards
    if (state.waveMode && side === 'player' && fighter.items && fighter.items.length > 0) {
      attachBagIcon(card, fighter);
    }
    // Wave mode: loot badge on AI reserve cards — placed inside .card-image (bottom-right of image)
    if (state.waveMode && side === 'ai' && fighter.lootItem && !fighter._lootGranted) {
      const cardImg = card.querySelector('.card-image');
      const target  = cardImg || card;
      const badge   = document.createElement('div');
      badge.className = 'enemy-loot-badge';
      badge.innerHTML = `<img class="loot-badge-icon" src="${fighter.lootItem.image}" alt="loot" />🎁`;
      target.appendChild(badge);
    }
    // Hover tooltip for all reserve cards — shows stats, passive, bag/loot details
    card.addEventListener('mouseenter', (e) => showReserveTooltip(e, fighter));
    card.addEventListener('mousemove',  (e) => positionReserveTooltip(e, document.getElementById('reserve-card-tooltip')));
    card.addEventListener('mouseleave', hideReserveTooltip);
    container.appendChild(card);
  });
}

// ── BATTLE TICK ───────────────────────────────────────────
function runBattleTick() {
  if (!state.playerActive || !state.aiActive) return;

  const turn = state.currentTurn;

  // Death's Door: clear the protection flag at the start of the protected fighter's own turn.
  // The flag is set on AI enemies in wave mode; once it's their turn again they can die normally.
  const tickAttacker = turn === 'player' ? state.playerActive : state.aiActive;
  if (tickAttacker.deathsDoorActive) {
    tickAttacker.deathsDoorActive = false;
    renderFighter(turn, tickAttacker);
  }

  // Fear of the Dead: skip this turn if queued
  const skipKey = turn === 'player' ? 'playerSkipNextTurn' : 'aiSkipNextTurn';
  if (state[skipKey]) {
    state[skipKey] = false;
    const skipped = turn === 'player' ? state.playerActive : state.aiActive;
    logEvent(`😱 ${skipped.name} is paralyzed by fear and skips their turn!`);
    state.currentTurn = turn === 'player' ? 'ai' : 'player';
    renderTurnIndicator();
    if (!state.paused) state.battleTimeout = setTimeout(runBattleTick, 1400);
    return;
  }

  const attacker = turn === 'player' ? state.playerActive : state.aiActive;
  const defender = turn === 'player' ? state.aiActive     : state.playerActive;

  if (attacker.burnAmount > 0) {
    applyBurnTick(turn, attacker, () => {
      if (attacker.hp <= 0) return;
      if (attacker.poisonDotAmount > 0) {
        applyPoisonTick(turn, attacker, () => {
          if (attacker.hp > 0) executeAttack(turn, attacker, defender);
        });
      } else {
        executeAttack(turn, attacker, defender);
      }
    });
  } else if (attacker.poisonDotAmount > 0) {
    applyPoisonTick(turn, attacker, () => {
      if (attacker.hp > 0) executeAttack(turn, attacker, defender);
    });
  } else {
    executeAttack(turn, attacker, defender);
  }
}

function applyBurnTick(side, fighter, callback) {
  const burnDmg = fighter.burnAmount;

  // Burn hits the horse while Rider is mounted
  if (fighter.isMounted) {
    fighter.horseHp = Math.max(0, fighter.horseHp - burnDmg);
    const horseDiedBurn = fighter.horseHp <= 0;
    if (horseDiedBurn) {
      fighter.isMounted = false;
      fighter.image = 'Images/mouse.png';
      if (fighter.passiveKey === 'parry') fighter.parryToggle = true;
    }
    addLog(`<span class="log-event">🔥 Burn hits the horse! (${fighter.horseHp}/${fighter.horseHpMax} HP)</span>`);
    if (horseDiedBurn) addLog(`<span class="log-event">🐴 The horse was defeated! ${fighter.name} dismounts as a mouse!</span>`);
    showFloatDmg(document.getElementById(`${side}-fighter`), burnDmg);
    renderFighter(side, fighter);
    setTimeout(callback, 400);
    return;
  }

  const shieldAbs = Math.min(fighter.shieldHp, burnDmg);
  fighter.shieldHp -= shieldAbs;
  fighter.hp = Math.max(0, fighter.hp - (burnDmg - shieldAbs));
  addLog(`<span class="log-event">🔥 ${fighter.name} suffers burn — ${burnDmg} damage!${shieldAbs > 0 ? ` (🛡 ${shieldAbs} absorbed)` : ''}</span>`);
  showFloatDmg(document.getElementById(`${side}-fighter`), burnDmg);
  renderFighter(side, fighter);

  if (fighter.hp <= 0) {
    // Demonblood: intercept burn death — revive to full HP once.
    if (side === 'ai' && fighter.passiveKey === 'demonblood' && !fighter.demonReviveUsed) {
      fighter.demonReviveUsed = true;
      fighter.hp = fighter.maxHp;
      addLog(`<span class="log-event">🩸 DEMONBLOOD! ${fighter.name} refuses to die from burn — rising at full HP!</span>`);
      renderFighter(side, fighter);
      setTimeout(callback, 400);
      return;
    }

    // Death's Door: already protected — keep at 1 HP
    if (fighter.deathsDoorActive) {
      fighter.hp = 1;
      renderFighter(side, fighter);
      setTimeout(callback, 400);
      return;
    }

    // Death's Door: chance to survive at 1 HP (wave mode, AI only, wave > 10)
    if (side === 'ai' && state.waveMode && state.currentWave > 10) {
      const ddChance = Math.min(0.10, Math.floor((state.currentWave - 1) / 10) * 0.025);
      if (Math.random() < ddChance) {
        fighter.hp = 1;
        fighter.deathsDoorActive = true;
        addLog(`<span class="log-event">☠ Death's Door! ${fighter.name} clings to life at 1 HP!</span>`);
        renderFighter(side, fighter);
        setTimeout(callback, 400);
        return;
      }
    }

    fighter.dead = true;
    logEvent(`💀 ${fighter.name} burned to death!`);

    // Thunderlord: burn counts as a kill for the opposite mage
    const oppSide = side === 'player' ? 'ai' : 'player';
    const oppFighter = side === 'player' ? state.aiActive : state.playerActive;
    handleThunderlordKill(oppFighter, oppSide);

    animateDeath(side, () => {
      if (side === 'player') {
        const next = chooseNextPlayerCard();
        if (!next) endGame(false);
      } else {
        chooseNextAICard();
      }
    });
    return;
  }

  setTimeout(callback, 400);
}

// ── POISON DOT (Dart-Peon) ───────────────────────────────
// Fires at the start of the poisoned fighter's own turn, before their attack.
// Magical damage (bypasses armor); hits shield first, then HP.
function applyPoisonTick(side, fighter, callback) {
  const poisonDmg = fighter.poisonDotAmount;

  const shieldAbs = Math.min(fighter.shieldHp || 0, poisonDmg);
  fighter.shieldHp = (fighter.shieldHp || 0) - shieldAbs;
  fighter.hp = Math.max(0, fighter.hp - (poisonDmg - shieldAbs));

  const shieldNote = shieldAbs > 0 ? ` (🛡 ${shieldAbs} absorbed)` : '';
  addLog(`<span class="log-event">☠️ ${fighter.name} suffers poison — ${poisonDmg} damage!${shieldNote} (${fighter.hp} HP)</span>`);
  showFloatDmg(document.getElementById(`${side}-fighter`), poisonDmg);
  renderFighter(side, fighter);

  if (fighter.hp <= 0) {
    // Death's Door: already protected — keep at 1 HP
    if (fighter.deathsDoorActive) {
      fighter.hp = 1;
      renderFighter(side, fighter);
      setTimeout(callback, 400);
      return;
    }

    // Death's Door: chance to survive at 1 HP (wave mode, AI only, wave > 10)
    if (side === 'ai' && state.waveMode && state.currentWave > 10) {
      const ddChance = Math.min(0.10, Math.floor((state.currentWave - 1) / 10) * 0.025);
      if (Math.random() < ddChance) {
        fighter.hp = 1;
        fighter.deathsDoorActive = true;
        addLog(`<span class="log-event">☠ Death's Door! ${fighter.name} clings to life at 1 HP!</span>`);
        renderFighter(side, fighter);
        setTimeout(callback, 400);
        return;
      }
    }

    fighter.dead = true;
    logEvent(`💀 ${fighter.name} died from poison!`);
    animateDeath(side, () => {
      if (side === 'player') {
        const next = chooseNextPlayerCard();
        if (!next) endGame(false);
      } else {
        chooseNextAICard();
      }
    });
    return;
  }

  setTimeout(callback, 400);
}

function executeAttack(turn, attacker, defender) {
  doAttack(turn, attacker, defender, () => {
    // Dragon Inferno — every 3rd attack hits ALL opponents with a fireball.
    // Checked BEFORE checkDeaths so Inferno always fires on bench fighters even if the
    // base attack already killed the active opponent (which would otherwise cause an
    // early return and skip the bench damage entirely).
    const dragonInfernoReady = attacker.passiveKey === 'dragonfire' && attacker.attackCount > 0 && attacker.attackCount % 3 === 0;
    if (dragonInfernoReady) {
      const killedActive = checkDeaths(); // process base-attack death first (may swap active card)
      triggerDragonFireball(attacker, turn, () => {
        if (killedActive) return; // death/transition already handled by checkDeaths above
        if (checkDeaths()) return; // Inferno itself may have killed someone
        state.currentTurn = turn === 'player' ? 'ai' : 'player';
        renderTurnIndicator();
        if (!state.paused) state.battleTimeout = setTimeout(runBattleTick, 1400);
      });
      return;
    }

    if (checkDeaths()) return;

    // Peon Double Strike — fires on every 2nd natural turn (tracked via peonAttackCount)
    if (attacker.passiveKey === 'peon_doubleattack' && !attacker._peonBonusActive) {
      attacker.peonAttackCount = (attacker.peonAttackCount || 0) + 1;
      if (attacker.peonAttackCount % 2 === 0) {
        attacker._peonBonusActive = true;
        addLog(`<span class="log-event">⚔ Double Strike! ${attacker.name} attacks again!</span>`);
        doAttack(turn, attacker, defender, () => {
          attacker._peonBonusActive = false;
          if (checkDeaths()) return;
          state.currentTurn = turn === 'player' ? 'ai' : 'player';
          renderTurnIndicator();
          if (!state.paused) state.battleTimeout = setTimeout(runBattleTick, 1400);
        });
        return;
      }
    }

    // Wolf Form: second attack (always 10 damage)
    if (attacker.wolfForm) {
      triggerWolfBite(turn, attacker, defender);
      return;
    }

    // Evasion: after 2 attacks, try to retreat
    if (attacker.passiveKey === 'evasion' && !attacker.evasionUsed && attacker.evasionAttackCount >= 2) {
      triggerEvasion(turn, attacker);
      return;
    }

    // Marksman bonus attack (ultimate) — both Steady Aim and Double Shot
    if ((attacker.passiveKey === 'steadyaim' || attacker.passiveKey === 'doubleshot') && attacker.ultimateReady) {
      attacker.ultimateReady = false;
      addLog(`<span class="log-event">⚡ Marksman fires again!</span>`);
      executeAttack(turn, attacker, defender);
      return;
    }

    // Double Shot: after every 2 attacks
    if (attacker.passiveKey === 'doubleshot' && attacker.doubleshotCount >= 2) {
      attacker.doubleshotCount = 0;
      triggerDoubleShot(turn, attacker, defender);
      return;
    }

    // Death Grip: after every 3 attacks, pull a benched enemy
    if (attacker.passiveKey === 'deathgrip' && attacker.deathGripCount >= 3) {
      attacker.deathGripCount = 0;
      triggerDeathGrip(turn, attacker);
      return;
    }

    // Fear of the Dead: queue skip for opponent's next turn
    if (attacker.passiveKey === 'fearofthedead' && attacker.fearCount >= 3) {
      attacker.fearCount = 0;
      const oppFighter = turn === 'player' ? state.aiActive : state.playerActive;
      state[turn === 'player' ? 'aiSkipNextTurn' : 'playerSkipNextTurn'] = true;
      logEvent(`😱 Fear of the Dead! ${oppFighter.name} is seized with terror — next turn skipped!`);
    }

    // Normal turn flip
    state.currentTurn = turn === 'player' ? 'ai' : 'player';
    renderTurnIndicator();
    if (!state.paused) {
      state.battleTimeout = setTimeout(runBattleTick, 1400);
    }
  });
}

// ── ATTACK ────────────────────────────────────────────────
function doAttack(attackerSide, attacker, defender, callback) {
  const defenderSide = attackerSide === 'player' ? 'ai' : 'player';

  let dmg = attacker.damage;
  dmg = applyPassiveAttack(attacker, dmg);

  // Berserk: attacker deals double damage
  if (attacker.berserk) dmg = Math.round(dmg * 2);

  attacker.attackCount++;
  if (attacker.passiveKey === 'evasion') attacker.evasionAttackCount++;
  if (attacker.passiveKey === 'doubleshot') attacker.doubleshotCount++;
  if (attacker.passiveKey === 'deathgrip') attacker.deathGripCount++;
  if (attacker.passiveKey === 'fearofthedead') attacker.fearCount++;

  // Nerfer: Cleric fires its nerf at end of its own turn
  if (attacker.passiveKey === 'nerfer') {
    applyNerfer(attackerSide, attacker, defender);
  }

  // Shield Block / Parry: defender blocks incoming damage
  let blocked = false;
  let parryBlocked = false;
  if ((defender.passiveKey === 'shieldblock' || defender.passiveKey === 'knightblock') && defender.shieldBlockAvailable) {
    defender.shieldBlockAvailable = false;
    blocked = true;
    const blockMsg = defender.passiveKey === 'knightblock'
      ? `🛡 Iron Guard! ${defender.name} blocks the attack!`
      : `🛡 Shield Block activates! ${defender.name} blocks all damage!`;
    addLog(`<span class="log-event">${blockMsg}</span>`);
    dmg = 0;
  } else if (defender.passiveKey === 'parry' && !defender.isMounted && defender.parryToggle) {
    // Parry: blocks every other attack while dismounted
    blocked = true;
    parryBlocked = true;
    defender.parryToggle = false;
    addLog(`<span class="log-event">🛡 Parry! ${defender.name} deflects the attack!</span>`);
    dmg = 0;
  } else {
    // Mark next attack as parry-eligible if applicable
    if (defender.passiveKey === 'parry' && !defender.isMounted) defender.parryToggle = true;
    if (dmg > 0) {
      // Berserk: doubles incoming damage before any mitigation
      if (defender.berserk) dmg = Math.round(dmg * 2);
      // Lightning Shield: reduces all incoming damage by 10
      if (defender.lightningShieldActive) dmg = Math.max(0, dmg - 10);
      // Armor reduces physical portion only
      const armorVal = defender.armorValue || 0;
      let trueDmgPart = 0;
      if (attacker.passiveKey === 'truedamage') {
        // Champion True Damage: half bypasses all armor and passive defense
        trueDmgPart    = Math.floor(dmg / 2);
        let physPart   = dmg - trueDmgPart;
        if (armorVal > 0) {
          const absorbed = Math.min(armorVal, physPart);
          physPart = Math.max(0, physPart - absorbed);
          if (absorbed > 0) addLog(`<span class="log-event">🛡 ${defender.name}'s armor absorbs ${absorbed} physical damage! (True damage bypasses)</span>`);
        }
        dmg = physPart + trueDmgPart;
      } else if (armorVal > 0 && !isBaseAttackMagical(attacker)) {
        const magicPart = Math.min(attacker._magicBonus || 0, dmg);
        const physPart  = dmg - magicPart;
        const absorbed  = Math.min(armorVal, physPart);
        if (absorbed > 0) {
          dmg = Math.max(0, dmg - absorbed);
          addLog(`<span class="log-event">🛡 ${defender.name}'s armor absorbs ${absorbed} physical damage!</span>`);
        }
      }
      // Magic Armor: flat reduction vs magical attacks (wave mode, player fighters)
      if (isBaseAttackMagical(attacker) && (defender.magicDmgReduction || 0) > 0 && dmg > 1) {
        const magAbs = Math.min(defender.magicDmgReduction, dmg - 1); // always leave at least 1
        dmg -= magAbs;
        addLog(`<span class="log-event">🔮 Magic Armor absorbs ${magAbs} magical damage!</span>`);
      }
      // Passive defense (Fortify etc.) applied last; trueDmgPart bypasses it
      dmg = applyPassiveDefend(defender, dmg, trueDmgPart);
      // All-damage reduction (wave upgrade): applied after all other mitigation.
      // trueDmgPart (Champion True Damage) bypasses ALL reductions — only the reducible portion shrinks.
      if ((defender.allDmgReductionPct || 0) > 0) {
        const reduciblePart = dmg - trueDmgPart;
        dmg = Math.round(reduciblePart * (1 - defender.allDmgReductionPct)) + trueDmgPart;
      }
      dmg = Math.max(1, Math.round(dmg));
    }
  }

  // Track attacks received and trigger berserk (disabled in wave mode — enemies must stay fair)
  defender.attacksReceived++;
  let newlyBerserk = false;
  if (!state.waveMode && !defender.berserk && defender.attacksReceived >= 9) {
    defender.berserk = true;
    newlyBerserk = true;
  }

  // Rider: horse absorbs ALL incoming damage with no overflow to rider
  // origDmg is captured here — after all reductions but before the horse absorbs.
  // Spiky Vest and Lightning Shield use origDmg > 0 so they still fire when horseBlocked,
  // because the attacker made physical contact with the rider's unit regardless.
  const origDmg = dmg;
  let horseBlocked = false;
  if (defender.isMounted && !blocked && dmg > 0) {
    const horseAbsorb = Math.min(defender.horseHp, dmg);
    defender.horseHp -= horseAbsorb;
    addLog(`<span class="log-event">🐴 ${dmg} hits the horse! (${defender.horseHp}/${defender.horseHpMax} HP remaining)</span>`);
    horseBlocked = true;
    dmg = 0;
    if (defender.horseHp <= 0) dismountRider(defender, defenderSide);
  }

  // Capture defender's total durability before damage lands — used to cap lifesteal/demonblood
  // to actual HP consumed so overkill hits don't generate excess healing.
  const preDefDurability = (!blocked && !horseBlocked && dmg > 0)
    ? (defender.shieldHp || 0) + defender.hp
    : 0;

  if (!blocked && dmg > 0) {
    const shieldAbs = Math.min(defender.shieldHp, dmg);
    defender.shieldHp -= shieldAbs;
    defender.hp = Math.max(0, defender.hp - (dmg - shieldAbs));
    if (shieldAbs > 0 && shieldAbs < dmg) {
      addLog(`<span class="log-event">🛡 ${shieldAbs} absorbed by shield! (${defender.shieldHp} remaining)</span>`);
    } else if (shieldAbs > 0) {
      addLog(`<span class="log-event">🛡 All ${shieldAbs} damage absorbed by shield! (${defender.shieldHp} remaining)</span>`);
    }
  }

  // Dart-Peon Poison: applied on every hit that lands (magical DOT + healing reduction).
  // Re-applying while already poisoned just refreshes the effect with no extra stacking.
  if (!blocked && !horseBlocked && dmg > 0 && attacker.passiveKey === 'dartpeon') {
    const alreadyPoisoned = defender.poisonDotAmount > 0;
    defender.poisonDotAmount     = 10;
    // Healing reduction: add 50% on first application; already-poisoned cards don't re-stack.
    if (!alreadyPoisoned) {
      defender.healingReductionPct = Math.min(1, (defender.healingReductionPct || 0) + 0.50);
    }
    if (!alreadyPoisoned) {
      addLog(`<span class="log-event">☠️ Poison Dart! ${defender.name} is poisoned! (10 dmg/turn, -50% healing)</span>`);
    }
  }

  // Bear Form low-HP surge: heals 30% of max HP once when dropping below 33% HP.
  // Fires synchronously here so the heal is captured in defHpSnap for accurate rendering.
  if (!blocked && !horseBlocked && dmg > 0 &&
      defender.passiveKey === 'bearform' && (defender.transformed || false) &&
      defender.hp > 0 && !(defender.bearHealUsed || false) &&
      defender.hp < Math.floor(defender.maxHp * 0.33)) {
    defender.bearHealUsed = true;
    const bearHeal = Math.floor(defender.maxHp * 0.30);
    defender.hp = Math.min(defender.maxHp, defender.hp + bearHeal);
    const _snapBearHp  = defender.hp;
    const _snapBearMax = defender.maxHp;
    const _dSide = defenderSide;
    setTimeout(() => {
      addLog(`<span class="log-event">🐻 Bloodlust! ${defender.name} surges and heals ${bearHeal} HP! (${_snapBearHp}/${_snapBearMax})</span>`);
      renderFighter(_dSide, defender);
    }, 350);
  }

  // Snapshot defender HP right after damage lands (and after immediate passives like bear heal),
  // before delayed effects. The attack-result log uses this value.
  const defHpSnap      = defender.hp;
  const defShieldSnap  = defender.shieldHp;

  // Lifesteal: heal attacker for 10% × stacks of damage dealt, capped at defender's pre-hit
  // durability so overkill attacks don't generate excess healing.
  if (state.waveMode && !blocked && !horseBlocked && attackerSide === 'player' &&
      attacker.lifeStealStacks > 0 && dmg > 0) {
    const effectiveDmg = Math.min(dmg, preDefDurability);
    const lsHealRaw = Math.floor(effectiveDmg * 0.1 * attacker.lifeStealStacks);
    const lsHeal = (attacker.healingReductionPct || 0) > 0
      ? Math.floor(lsHealRaw * (1 - attacker.healingReductionPct))
      : lsHealRaw;
    if (lsHeal > 0) {
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + lsHeal);
      const debuffNote = (attacker.healingReductionPct || 0) > 0 ? ' (healing reduced)' : '';
      addLog(`<span class="log-event">💉 Lifesteal! ${attacker.name} heals ${lsHeal} HP (${attacker.hp}/${attacker.maxHp})${debuffNote}</span>`);
    }
  }

  // Demonblood lifesteal: 30% of damage dealt, capped to pre-hit durability (no overkill heal)
  if (state.waveMode && !blocked && !horseBlocked && attackerSide === 'ai' &&
      attacker.passiveKey === 'demonblood' && dmg > 0) {
    const demonHeal = Math.floor(Math.min(dmg, preDefDurability) * 0.30);
    if (demonHeal > 0) {
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + demonHeal);
      addLog(`<span class="log-event">🩸 Demonblood! ${attacker.name} heals ${demonHeal} HP (${attacker.hp}/${attacker.maxHp})</span>`);
    }
  }

  // Lightning Shield retaliation: only against physical attackers.
  // Uses origDmg so the discharge fires even when the Rider's horse absorbed the hit.
  if (!blocked && defender.lightningShieldActive && origDmg > 0 && !isBaseAttackMagical(attacker)) {
    const retaliDmg = 10 + (defender.spellbookBonus || 0);
    if (attacker.isMounted) {
      // Horse absorbs the retaliation — update state synchronously, log in setTimeout
      attacker.horseHp = Math.max(0, attacker.horseHp - retaliDmg);
      const snapHorseHp    = attacker.horseHp;
      const snapHorseHpMax = attacker.horseHpMax;
      const horseDiedRetal = snapHorseHp <= 0;
      if (horseDiedRetal) {
        attacker.isMounted = false;
        attacker.image = 'Images/mouse.png';
        if (attacker.passiveKey === 'parry') attacker.parryToggle = true;
      }
      setTimeout(() => {
        const atkElR = document.getElementById(`${attackerSide}-fighter`);
        const defElR = document.getElementById(`${defenderSide}-fighter`);
        playSound('sound-lightning');
        animateProjectile('LightningballAni.png', defElR, atkElR, { isImpact: true, flip: defenderSide === 'ai' });
        showFloatDmg(atkElR, retaliDmg);
        addLog(`<span class="log-event">⚡ Lightning Shield retaliates! ${retaliDmg} hits the horse! (${snapHorseHp}/${snapHorseHpMax} HP)</span>`);
        if (horseDiedRetal) addLog(`<span class="log-event">🐴 The horse was defeated! ${attacker.name} dismounts as a mouse!</span>`);
        renderFighter(attackerSide, attacker);
      }, 350);
    } else {
      const retShieldAbs = Math.min(attacker.shieldHp, retaliDmg);
      attacker.shieldHp -= retShieldAbs;
      attacker.hp = Math.max(0, attacker.hp - (retaliDmg - retShieldAbs));
      setTimeout(() => {
        const atkElR = document.getElementById(`${attackerSide}-fighter`);
        const defElR = document.getElementById(`${defenderSide}-fighter`);
        playSound('sound-lightning');
        animateProjectile('LightningballAni.png', defElR, atkElR, { isImpact: true, flip: defenderSide === 'ai' });
        showFloatDmg(atkElR, retaliDmg);
        addLog(`<span class="log-event">⚡ Lightning Shield retaliates! ${attacker.name} takes ${retaliDmg} damage!</span>`);
        renderFighter(attackerSide, attacker);
      }, 350);
    }
  }

  // Spiky Vest retaliation: physical hits only (mirrors Lightning Shield behaviour).
  // Uses origDmg so the spikes still hit the attacker even when the Rider's horse absorbed the blow.
  if (!blocked && origDmg > 0 &&
      defender.spikyRetaliDmg > 0 && !isBaseAttackMagical(attacker)) {
    const spikyDmg = defender.spikyRetaliDmg;
    if (attacker.isMounted && attacker.horseHp > 0) {
      // Horse absorbs spiky retaliation — update synchronously, animate in timeout
      attacker.horseHp = Math.max(0, attacker.horseHp - spikyDmg);
      const snapHp    = attacker.horseHp;
      const snapHpMax = attacker.horseHpMax;
      const horseDied = snapHp <= 0;
      if (horseDied) {
        attacker.isMounted = false;
        attacker.image     = 'Images/mouse.png';
        if (attacker.passiveKey === 'parry') attacker.parryToggle = true;
      }
      setTimeout(() => {
        showFloatDmg(document.getElementById(`${attackerSide}-fighter`), spikyDmg);
        addLog(`<span class="log-event">🦔 Spiky Vest retaliates! ${spikyDmg} hits the horse! (${snapHp}/${snapHpMax} HP)</span>`);
        if (horseDied) addLog(`<span class="log-event">🐴 The horse was defeated! ${attacker.name} dismounts as a mouse!</span>`);
        renderFighter(attackerSide, attacker);
      }, 500);
    } else {
      const spikyShieldAbs = Math.min(attacker.shieldHp, spikyDmg);
      attacker.shieldHp   -= spikyShieldAbs;
      attacker.hp          = Math.max(0, attacker.hp - (spikyDmg - spikyShieldAbs));
      setTimeout(() => {
        showFloatDmg(document.getElementById(`${attackerSide}-fighter`), spikyDmg);
        addLog(`<span class="log-event">🦔 Spiky Vest retaliates! ${attacker.name} takes ${spikyDmg} damage! (${attacker.hp} HP)</span>`);
        renderFighter(attackerSide, attacker);
      }, 500);
    }
  }

  // Wizard Fire Storm: magical retaliation + self-heal when the Wizard is hit.
  // Fires on any hit that lands (not blocked, not horse-absorbed), regardless of damage type.
  // Damage starts at 15 and grows by +20 after each retaliation. Self-heal is 50% of that damage.
  // Guard: defender.hp > 0 — Fire Storm does NOT trigger if the Wizard died from the hit.
  if (!blocked && !horseBlocked && dmg > 0 && defender.passiveKey === 'wizardfirestorm' && defender.hp > 0) {
    const fsDmg  = defender.wizardFireStormDmg;
    // Heal capped at 50% of retaliation so the Wizard can never net-gain HP from a Fire Storm
    // exchange — low-damage fighters still make progress, just slowly.
    const fsHeal = Math.floor(fsDmg * 0.5);
    // Apply retaliation damage to attacker (magical — bypasses armor; absorbed by shield)
    const fsShieldAbs = Math.min(attacker.shieldHp, fsDmg);
    attacker.shieldHp -= fsShieldAbs;
    attacker.hp = Math.max(0, attacker.hp - (fsDmg - fsShieldAbs));
    // Heal wizard for 50% of retaliation amount
    defender.hp = Math.min(defender.maxHp, defender.hp + fsHeal);
    // Ramp up for next hit
    defender.wizardFireStormDmg += 20;
    setTimeout(() => {
      const atkEl = document.getElementById(`${attackerSide}-fighter`);
      const defEl = document.getElementById(`${defenderSide}-fighter`);
      playSound('sound-fireball');
      animateProjectile('FireballAni.png', defEl, atkEl, { flip: defenderSide === 'ai' });
      showFloatDmg(atkEl, fsDmg);
      addLog(`<span class="log-event">🔥 Fire Storm! ${defender.name} retaliates ${fsDmg} magical damage and heals ${fsHeal} HP! (${defender.hp}/${defender.maxHp})</span>`);
      renderFighter(attackerSide, attacker);
      renderFighter(defenderSide, defender);
    }, 500);
  }

  applyPassiveHeal(attacker);

  if (attacker.passiveKey === 'burn' && defender.burnAmount === 0) {
    const burnTotal = attacker.burnDamage + (attacker.spellbookBonus || 0);
    defender.burnAmount = burnTotal;
    addLog(`<span class="log-event">🔥 ${defender.name} is now burning! (${burnTotal} dmg/turn)</span>`);
  }

  if (attacker.passiveKey === 'shield') {
    const shieldAmount = (20 + (attacker.spellbookBonus || 0)) * attacker.shieldMultiplier;
    const myPicks  = attackerSide === 'player' ? state.playerPicks : state.aiPicks;
    const myActive = attackerSide === 'player' ? state.playerActive : state.aiActive;
    // Give shield directly to BOTH benched living allies (not just the first one entering).
    const benched = myPicks.filter(f => f !== myActive && !f.dead);
    if (benched.length > 0) {
      benched.forEach(f => {
        f.shieldHp    = (f.shieldHp    || 0) + shieldAmount;
        f.shieldHpMax = Math.max(f.shieldHpMax || 0, f.shieldHp);
      });
      const names = benched.map(f => f.name).join(' & ');
      addLog(`<span class="log-event">🛡 Cleric Shielding! ${names} each gain ${shieldAmount} shield HP!</span>`);
      setTimeout(() => { renderReserves('player'); renderReserves('ai'); }, 200);
    } else {
      addLog(`<span class="log-event">🛡 Cleric builds shield — no benched allies to shield.</span>`);
    }
  }

  attacker.ultimateCharge++;
  const ultThreshold = attacker.passiveKey === 'nerfer' ? 2 : attacker.ultimateThreshold;
  let thunderlordFired = false;
  if (attacker.ultimateCharge >= ultThreshold) {
    if (attacker.passiveKey === 'thunderlord') thunderlordFired = true;
    triggerUltimate(attacker, defender, attackerSide);
    attacker.ultimateCharge = 0;
  }

  // End-of-turn counters for new classes
  if (attacker.passiveKey === 'sacrifice' || attacker.passiveKey === 'reborn') {
    attacker.necroTurnCount++;
    if (attacker.passiveKey === 'sacrifice') {
      // Ghoul grows per turn with Spellbook (+spellbookBonus to each growth rate)
      attacker.ghoulHp     += 30 + (attacker.spellbookBonus || 0);
      attacker.ghoulHpMax  += 30 + (attacker.spellbookBonus || 0);
      attacker.ghoulDamage += 10 + (attacker.spellbookBonus || 0);
    }
  }
  if (attacker.passiveKey === 'chainheal') attacker.shamHealCount++;
  if (attacker.passiveKey === 'lavablast') attacker.shamLavaCount++;
  if (attacker.passiveKey === 'revival' && !attacker.isMounted && !attacker.horseReviveUsed) {
    attacker.dismountedAttacks++;
  }

  const attackerEl = document.getElementById(`${attackerSide}-fighter`);
  const defenderEl = document.getElementById(`${defenderSide}-fighter`);

  const isJoker   = attacker.passiveKey === 'luckofthedraw' || attacker.passiveKey === 'theace';
  const jokerMiss = isJoker && attacker._jokerResult === 'miss';
  const jokerCrit = isJoker && attacker._jokerResult === 'crit';

  if (!jokerMiss) {
    playAttackSound(attacker);
    triggerAnim(attackerEl, attackerSide === 'player' ? 'do-attack-right' : 'do-attack-left', 350);
    const ani = getAttackAni(attacker);
    const aniOpts = { ...ani, flip: attackerSide === 'ai' };
    animateProjectile(ani.src, attackerEl, defenderEl, aniOpts);
    if (jokerCrit) {
      setTimeout(() => {
        playAttackSound(attacker);
        animateProjectile(ani.src, attackerEl, defenderEl, aniOpts);
        triggerAnim(defenderEl, 'do-flash', 350);
        triggerAnim(defenderEl, 'do-shake', 400);
      }, 500);
    }
  }

  // Cleric: HealAni pops on each reserve ally 500ms after attack
  if (attacker.passiveKey === 'shield') {
    setTimeout(() => {
      const reserves = document.querySelectorAll(`#${attackerSide}-reserves [data-fighter-id]`);
      if (reserves.length > 0) {
        playSound('sound-heal');
        reserves.forEach(card => animateProjectile('HealAni.png', null, card, { isImpact: true }));
      }
    }, 500);
  }

  setTimeout(() => {
    if (!jokerMiss) {
      triggerAnim(defenderEl, 'do-flash', 350);
      triggerAnim(defenderEl, 'do-shake', 400);
    }
    if (!blocked && !horseBlocked && dmg > 0) { showFloatDmg(defenderEl, dmg); playSound('sound-hit'); }
    else if (!blocked && !horseBlocked && dmg === 0) showFloatMiss(defenderEl);

    renderFighter(attackerSide, attacker);
    // Render defender at the pre-passive-heal HP (defHpSnap) so the damage drop is visible
    // on the HP bar before any self-heal (e.g. Fire Storm) animates and corrects it upward.
    { const _savedHp = defender.hp; defender.hp = defHpSnap; renderFighter(defenderSide, defender); defender.hp = _savedHp; }
    renderReserves('player');
    renderReserves('ai');

    const cls = attackerSide === 'player' ? 'log-player' : 'log-ai';
    const typeTag = dmgTypeTag(attacker);
    if (blocked && !parryBlocked) {
      addLog(`<span class="${cls}">${attacker.name}</span> attacks — <strong>BLOCKED</strong> by Shield!`);
    } else if (parryBlocked || horseBlocked) {
      // Parry / horse absorption already logged above — no extra line needed
    } else if (dmg === 0) {
      addLog(`<span class="${cls}">${attacker.name}</span> <strong>MISSES!</strong> No damage dealt.`);
    } else {
      const shieldNote = defShieldSnap > 0 ? ` +🛡${defShieldSnap}` : '';
      addLog(`<span class="${cls}">${attacker.name}</span> attacks for <strong>${dmg}</strong> ${typeTag} → ${defender.name} has <strong>${defHpSnap}</strong> HP${shieldNote}`);
    }

    if (newlyBerserk) {
      addLog(`<span class="log-event" style="color:#ff4444;font-weight:700;">💢 ${defender.name} GOES BERSERK! Deals and takes double damage!</span>`);
    }

    // ── End-of-turn effects ──────────────────────────────────
    const isNecroTurn = attacker.passiveKey === 'sacrifice' || attacker.passiveKey === 'reborn';
    if (isNecroTurn) {
      const selfDmg = 20;
      // Self-damage hits active shield first, then HP.
      const shieldAbs = Math.min(attacker.shieldHp || 0, selfDmg);
      attacker.shieldHp = (attacker.shieldHp || 0) - shieldAbs;
      attacker.hp = Math.max(0, attacker.hp - (selfDmg - shieldAbs));
      const shieldNote = shieldAbs > 0 ? ` (🛡 ${shieldAbs} absorbed by shield)` : '';
      addLog(`<span class="log-event">💀 ${attacker.name} takes ${selfDmg} self-damage!${shieldNote} (${attacker.hp} HP remaining)</span>`);
      if (attacker.passiveKey === 'reborn' && attacker.necroTurnCount >= 3 && !attacker.rebornUsed) {
        const aSidePicks = attackerSide === 'player' ? state.playerPicks : state.aiPicks;
        const deadAlly = aSidePicks.find(f => f.dead && f !== attacker);
        if (deadAlly) {
          attacker.rebornUsed = true;
          deadAlly.dead   = false;
          deadAlly.hp     = Math.max(1, Math.floor(deadAlly.maxHp * 0.5));
          deadAlly.damage = Math.max(1, Math.floor(deadAlly.baseDamage * 0.5));
          deadAlly.reborn = true;
          addLog(`<span class="log-event">💀 Reborn! ${deadAlly.name} rises with ${deadAlly.hp} HP!</span>`);
          renderReserves('player');
          renderReserves('ai');
        }
      }
      if (attacker.necroTurnCount > 0 && attacker.necroTurnCount % 3 === 0) {
        setTimeout(() => triggerFireStorm(attacker, attackerSide), 200);
      }
      renderFighter(attackerSide, attacker);
    }

    if (attacker.passiveKey === 'chainheal' && attacker.shamHealCount > 0 && attacker.shamHealCount % 2 === 0) {
      setTimeout(() => triggerChainHeal(attacker, attackerSide), 200);
    }
    if (attacker.passiveKey === 'lavablast' && attacker.shamLavaCount > 0 && attacker.shamLavaCount % 3 === 0) {
      setTimeout(() => triggerLavaBlast(attacker, attackerSide, defender, defenderSide), 200);
    }
    if (attacker.passiveKey === 'revival' && !attacker.isMounted && !attacker.horseReviveUsed && attacker.dismountedAttacks >= 2) {
      setTimeout(() => remountRider(attacker, attackerSide), 200);
    }

    setTimeout(callback, isNecroTurn ? 900 : thunderlordFired ? 700 : 300);
  }, 180);
}

// ── PASSIVES ──────────────────────────────────────────────
function isBaseAttackMagical(fighter) {
  const key = fighter.passiveKey;
  // Cleric (wand attacks) and Mage passives are fully magical
  if (key === 'shield' || key === 'nerfer') return true;
  if (key === 'burn' || key === 'thunderlord') return true;
  // Druid pre-transform (bearform/wolfform first attack) is magical
  if ((key === 'bearform' || key === 'wolfform') && fighter.attackCount <= 1) return true;
  // Necromancer and Shaman are fully magical
  if (key === 'sacrifice' || key === 'reborn') return true;
  if (key === 'chainheal' || key === 'lavablast') return true;
  // Dragon — both base attack and Inferno fireball bypass armor
  if (key === 'dragonfire') return true;
  // Wizard — fully magical attacker
  if (key === 'wizardfirestorm') return true;
  // Demon — alternates: even attackCount = fireball (magical), odd = slash (physical)
  if (key === 'demonblood') return fighter.attackCount % 2 === 0;
  return false;
}

function applyPassiveAttack(fighter, dmg) {
  fighter._magicBonus = 0;

  // Rider: anger bonus grows +20 (+ spellbookBonus) per attack while dismounted (physical)
  if ((fighter.passiveKey === 'revival' || fighter.passiveKey === 'parry') && !fighter.isMounted) {
    fighter.dismountBonus += 20 + (fighter.spellbookBonus || 0);
    dmg += fighter.dismountBonus;
    addLog(`<span class="log-event">🐭 Dismount Rage! +${fighter.dismountBonus} anger bonus!</span>`);
  }

  // Ultimate boosts (clear flag here for damage-boosting ultimates)
  if (fighter.ultimateReady) {
    if (fighter.passiveKey === 'bloodthirst') {
      const ultDmg = 10 + (fighter.spellbookBonus || 0);
      dmg += ultDmg;
      addLog(`<span class="log-event">⚡ Barbarian Ultimate! +${ultDmg} damage!</span>`);
    } else if (fighter.passiveKey === 'rage') {
      const ultDmg = 10 + (fighter.spellbookBonus || 0);
      dmg += ultDmg;
      // Do NOT clear ultimateReady here — applyPassiveHeal (called next) checks it for the heal
      addLog(`<span class="log-event">⚡ Barbarian Ultimate! +${ultDmg} damage!</span>`);
    } else if (fighter.passiveKey === 'firststrike') {
      // Assassin ultimate bonus is magical; skip if First Strike fires on same attack
      if (fighter.attackCount !== 0) {
        const assUltBonus = 20 + (fighter.spellbookBonus || 0);
        dmg += assUltBonus;
        fighter._magicBonus += assUltBonus;
        addLog(`<span class="log-event">⚡ Assassin Ultimate! +${assUltBonus} <span class="log-mag">✨ Magical</span> damage!</span>`);
      }
      fighter.ultimateReady = false;
    } else if (fighter.passiveKey === 'evasion') {
      // Assassin ultimate bonus is magical
      const assUltBonus = 20 + (fighter.spellbookBonus || 0);
      dmg += assUltBonus;
      fighter._magicBonus += assUltBonus;
      fighter.ultimateReady = false;
      addLog(`<span class="log-event">⚡ Assassin Ultimate! +${assUltBonus} <span class="log-mag">✨ Magical</span> damage!</span>`);
    }
  }

  // Death Grip bonus attack (magical)
  if (fighter.deathGripBonus > 0) {
    const gripBonus = fighter.deathGripBonus + (fighter.spellbookBonus || 0);
    fighter.deathGripBonus = 0;
    fighter._magicBonus += gripBonus;
    addLog(`<span class="log-event">💀 Death Grip strike! +${gripBonus} <span class="log-mag">✨ Magical</span> bonus damage!</span>`);
    dmg += gripBonus;
  }

  // First Strike: magical bonus on very first attack
  if (fighter.passiveKey === 'firststrike' && fighter.attackCount === 0) {
    const fsBonus = 30 + (fighter.spellbookBonus || 0);
    fighter._magicBonus += fsBonus;
    addLog(`<span class="log-event">⚡ First Strike bonus! +${fsBonus} <span class="log-mag">✨ Magical</span> damage!</span>`);
    return dmg + fsBonus;
  }

  // Steady Aim: +20 per prior attack
  if (fighter.passiveKey === 'steadyaim') {
    // Read current bonus BEFORE incrementing so attack-1 gives 0, attack-2 gives +20, etc.
    // steadyAimBonus is NOT reset on soft-reset (wave boundary) — only on hard-reset (10-wave).
    const bonus     = fighter.steadyAimBonus || 0;
    const increment = 20 + (fighter.spellbookBonus || 0); // Spellbook raises the per-attack step
    fighter.steadyAimBonus = bonus + increment;
    if (bonus > 0) addLog(`<span class="log-event">🎯 Steady Aim +${bonus} bonus damage</span>`);
    return dmg + bonus;
  }

  // Rage: +10% base damage per 20 HP missing (counts both actual HP lost AND shield consumed)
  if (fighter.passiveKey === 'rage') {
    const missing = (fighter.maxHp - fighter.hp) + (fighter.shieldHpMax - fighter.shieldHp);
    const tiers = Math.floor(missing / 20);
    const rageBonus = Math.floor(tiers * fighter.baseDamage * 0.1);
    if (rageBonus > 0) addLog(`<span class="log-event">💢 Rage! +${rageBonus} damage (${tiers * 10}% bonus)</span>`);
    return dmg + rageBonus;
  }

  // Joker: RNG attack system (33% miss / 33% normal / 33% crit 2×)
  if (fighter.passiveKey === 'luckofthedraw' || fighter.passiveKey === 'theace') {
    let bonus = 0;

    // Luck of the Draw: coin flip every other attack
    if (fighter.passiveKey === 'luckofthedraw') {
      fighter.lotdTurnCount++;
      if (fighter.lotdTurnCount % 2 === 1) {
        if (Math.random() < 0.5) {
          bonus = 20 + (fighter.spellbookBonus || 0);
          addLog(`<span class="log-event">🎴 Luck of the Draw: HEADS! +${bonus} bonus damage!</span>`);
        } else {
          addLog(`<span class="log-event">🎴 Luck of the Draw: TAILS — no bonus.</span>`);
        }
      }
    }

    // RNG roll: 33% miss / 33% normal / 33% crit
    const roll = Math.floor(Math.random() * 3);
    if (roll === 0) {
      if (bonus > 0) {
        fighter._jokerResult = 'hit';
        addLog(`<span class="log-event">🎰 MISS! But Luck saves the day — ${bonus} damage still dealt!</span>`);
        return bonus;
      }
      fighter._jokerResult = 'miss';
      addLog(`<span class="log-event">🎰 MISS! 0 damage!</span>`);
      return 0;
    } else if (roll === 1) {
      fighter._jokerResult = 'hit';
      if (bonus > 0) addLog(`<span class="log-event">🎰 Normal attack (+${bonus} bonus from Luck).</span>`);
      return dmg + bonus;
    } else {
      fighter._jokerResult = 'crit';
      const total = (dmg + bonus) * 2;
      addLog(`<span class="log-event">🎰 CRITICAL HIT! 2× damage = ${total}!</span>`);
      return total;
    }
  }

  return dmg;
}

function applyPassiveDefend(defender, dmg, trueDmgPart = 0) {
  // trueDmgPart (Champion True Damage) bypasses all reductions — only physDmg is reduced.
  const physDmg = dmg - trueDmgPart;

  // Shield item stacks: each gives 10% physical damage reduction
  const shieldStacks  = (state.waveMode && defender.items)
    ? defender.items.filter(i => i.id === 'shield').length
    : 0;
  const itemReduction = shieldStacks * 0.10;

  let reducedPhys = physDmg;
  if (defender.passiveKey === 'fortify') {
    // Fortify: 33% base; each Spellbook compounds it by ×1.10 (multiplicative, not additive):
    //   0 books → 33%,  1 → 36.3%,  2 → 39.9%,  3 → 43.9%
    // Shield item stacks remain additive on top of the compounded base.
    const spellbookCount = Math.round((defender.spellbookBonus || 0) / 10);
    const baseReduction  = 0.33 * Math.pow(1.10, spellbookCount);
    const totalReduction = baseReduction + itemReduction;
    reducedPhys = Math.round(physDmg * (1 - totalReduction));
  } else if (itemReduction > 0) {
    reducedPhys = Math.round(physDmg * (1 - itemReduction));
  }

  const total = reducedPhys + trueDmgPart;
  // Minimum 1 total damage (only enforced when there was a physical component to reduce)
  return physDmg > 0 ? Math.max(1, total) : total;
}

function applyPassiveHeal(fighter) {
  const healReduction = fighter.healingReductionPct || 0;
  if (fighter.passiveKey === 'bloodthirst') {
    let healRaw = 15 + (fighter.spellbookBonus || 0);
    if (fighter.ultimateReady) {
      const ultHeal = 10 + (fighter.spellbookBonus || 0);
      healRaw += ultHeal;
      fighter.ultimateReady = false;
      addLog(`<span class="log-event">⚡ Barbarian Ultimate! +${ultHeal} extra healing!</span>`);
    }
    const heal = healReduction > 0 ? Math.floor(healRaw * (1 - healReduction)) : healRaw;
    fighter.hp = Math.min(fighter.maxHp, fighter.hp + heal);
    const debuffNote = healReduction > 0 ? ' (healing reduced)' : '';
    addLog(`<span class="log-event">💉 Bloodthirst heals ${fighter.name} for ${heal} HP${debuffNote}</span>`);
  } else if (fighter.passiveKey === 'rage' && fighter.ultimateReady) {
    const rageHealRaw = 10 + (fighter.spellbookBonus || 0);
    const rageHeal = healReduction > 0 ? Math.floor(rageHealRaw * (1 - healReduction)) : rageHealRaw;
    fighter.ultimateReady = false;
    fighter.hp = Math.min(fighter.maxHp, fighter.hp + rageHeal);
    const debuffNote = healReduction > 0 ? ' (healing reduced)' : '';
    addLog(`<span class="log-event">⚡ Barbarian Ultimate! +${rageHeal} HP healed!${debuffNote}</span>`);
  }
}

// ── RIDER MECHANICS ───────────────────────────────────────

function dismountRider(fighter, side) {
  fighter.isMounted = false;
  fighter.image = 'Images/mouse.png';
  if (fighter.passiveKey === 'parry') fighter.parryToggle = true;
  addLog(`<span class="log-event">🐴 The horse was defeated! ${fighter.name} dismounts as a mouse!</span>`);
  renderFighter(side, fighter);
}

function remountRider(fighter, side) {
  const reviveHp = Math.min(80, 40 + (fighter.spellbookBonus || 0));
  fighter.isMounted         = true;
  fighter.horseHp           = reviveHp;
  fighter.horseHpMax        = reviveHp;
  fighter.horseReviveUsed   = true;
  fighter.dismountBonus     = 0;
  fighter.dismountedAttacks = 0;
  fighter.image             = 'Images/rider.png';
  addLog(`<span class="log-event">🐴 ${fighter.name}'s horse revives with ${reviveHp} HP! Remounted! Anger bonus resets.</span>`);
  renderFighter(side, fighter);
}

// ── NECROMANCER MECHANICS ──────────────────────────────────

function spawnGhoul(necro, side) {
  necro.ghoulSpawned = true;
  const ghoul = {
    id: 'ghoul_' + Date.now(),
    name: 'Ghoul',
    image: 'Images/ghoul.png',
    hp: necro.ghoulHp,
    maxHp: necro.ghoulHpMax,
    damage: necro.ghoulDamage,
    baseDamage: necro.ghoulDamage,
    armorType: 'cloth', armorValue: 0,
    passiveKey: 'ghoul', passiveName: 'Risen',
    passive: `Physical attacker spawned from ${necro.name}'s sacrifice.`,
    passives: [{ key: 'ghoul', name: 'Risen', description: 'Physical attacker.' }],
    ultimateThreshold: 9999, ultimateCharge: 0, ultimateReady: false,
    attackCount: 0, dead: false,
    shieldHp: 0, shieldHpMax: 0,
    burnDamage: 10, shieldMultiplier: 1, burnAmount: 0,
    shieldBlockAvailable: false, evasionAttackCount: 0, evasionUsed: false,
    doubleshotCount: 0, thunderlordPendingStrike: false,
    healStack: 0, deathGripCount: 0, fearCount: 0, deathGripBonus: 0,
    lotdTurnCount: 0, aceFlipped: false, aceResult: null, _jokerResult: null,
    transformed: false, wolfForm: false,
    _magicBonus: 0, attacksReceived: 0, berserk: false,
    isMounted: false, horseHp: 0, horseHpMax: 0,
    dismountedAttacks: 0, dismountBonus: 0, horseReviveUsed: false, parryToggle: false,
    necroTurnCount: 0, ghoulHp: 0, ghoulHpMax: 0, ghoulDamage: 0,
    ghoulSpawned: false, rebornUsed: false, reborn: false,
    lightningShieldActive: false, shamHealCount: 0, shamLavaCount: 0,
    // Wave-mode item fields — required so loot overlay doesn't crash.
    // Items given to the Ghoul are mirrored onto _necromancer so they survive the hard reset.
    items:                [],
    spellbookBonus:       necro.spellbookBonus       || 0,
    lifeStealStacks:      necro.lifeStealStacks       || 0,
    hasSpeed:             necro.hasSpeed              || false,
    angelRevived:         false,
    physicalDmgReduction: necro.physicalDmgReduction  || 0,
    spikyRetaliDmg:       necro.spikyRetaliDmg        || 0,
    magicDmgReduction:    necro.magicDmgReduction     || 0,
    allDmgReductionPct:   necro.allDmgReductionPct    || 0,
    healingReductionPct:  necro.healingReductionPct   || 0,
    _necromancer: necro,  // items given to the Ghoul are forwarded to the Necromancer
  };

  const picks = side === 'player' ? state.playerPicks : state.aiPicks;
  const necroIdx = picks.indexOf(necro);
  if (necroIdx !== -1) picks[necroIdx] = ghoul;

  if (side === 'player') state.playerActive = ghoul;
  else state.aiActive = ghoul;

  logEvent(`💀 ${necro.name} falls... but the Ghoul rises! (${ghoul.hp} HP / ${ghoul.damage} ⚔ Physical DMG)`);
  applyShieldToEntering(ghoul, side);
  renderBattleScreen();
  checkBothReady();
}

function triggerFireStorm(necro, necroSide) {
  const oppSide   = necroSide === 'player' ? 'ai' : 'player';
  const oppPicks  = necroSide === 'player' ? state.aiPicks : state.playerPicks;
  const oppActive = necroSide === 'player' ? state.aiActive : state.playerActive;
  const necroEl   = document.getElementById(`${necroSide}-fighter`);
  const activeEl  = document.getElementById(`${oppSide}-fighter`);

  playSound('sound-fireball');
  animateProjectile('FireballAni.png', necroEl, activeEl, { flip: necroSide === 'ai' });

  setTimeout(() => {
    const stormDmg = 30 + (necro.spellbookBonus || 0);
    // Hit active opponent (let checkDeaths handle death, don't set dead here)
    if (oppActive && !oppActive.dead && oppActive.hp > 0) {
      const dmgDealt = stormDmg * (oppActive.berserk ? 2 : 1);
      oppActive.hp = Math.max(0, oppActive.hp - dmgDealt);
      addLog(`<span class="log-event">🔥 Fire Storm! ${oppActive.name} hit for ${dmgDealt} <span class="log-mag">✨ Magical</span>! (${oppActive.hp} HP)</span>`);
    }
    // Hit living reserves (mark dead directly since checkDeaths ignores reserves)
    oppPicks.forEach(f => {
      if (f.dead || f === oppActive || f.hp <= 0) return;
      const dmgDealt = stormDmg * (f.berserk ? 2 : 1);
      const reserveEl = document.querySelector(`#${oppSide}-reserves [data-fighter-id="${f.id}"]`);
      if (reserveEl) animateProjectile('FireballAni.png', necroEl, reserveEl, { flip: necroSide === 'ai' });
      f.hp = Math.max(0, f.hp - dmgDealt);
      if (f.hp <= 0) f.dead = true;
      addLog(`<span class="log-event">🔥 Fire Storm! ${f.name} hit for ${dmgDealt} <span class="log-mag">✨ Magical</span>! (${f.hp} HP)</span>`);
    });

    renderFighter(oppSide, oppActive);
    renderReserves('player');
    renderReserves('ai');
  }, 350);
}

// ── SHAMAN MECHANICS ──────────────────────────────────────

function triggerChainHeal(shaman, shamSide) {
  const picks   = shamSide === 'player' ? state.playerPicks : state.aiPicks;
  const shamEl  = document.getElementById(`${shamSide}-fighter`);
  const baseAmt = 20 + (shaman.spellbookBonus || 0);

  // Heal shaman (respect its own healingReductionPct)
  const shamReduct = shaman.healingReductionPct || 0;
  const shamHeal   = shamReduct > 0 ? Math.floor(baseAmt * (1 - shamReduct)) : baseAmt;
  shaman.hp = Math.min(shaman.maxHp, shaman.hp + shamHeal);

  // Heal each living ally (respect each ally's own healingReductionPct)
  picks.forEach(ally => {
    if (ally.dead || ally === shaman) return;
    const allyReduct = ally.healingReductionPct || 0;
    const allyHeal   = allyReduct > 0 ? Math.floor(baseAmt * (1 - allyReduct)) : baseAmt;
    ally.hp = Math.min(ally.maxHp, ally.hp + allyHeal);
  });

  playSound('sound-heal');
  animateProjectile('HealAni.png', null, shamEl, { isImpact: true });
  document.querySelectorAll(`#${shamSide}-reserves [data-fighter-id]`)
    .forEach(card => animateProjectile('HealAni.png', null, card, { isImpact: true }));

  const anyDebuffed = [shaman, ...picks].some(f => !f.dead && (f.healingReductionPct || 0) > 0);
  addLog(`<span class="log-event">⛓ Chain Heal! ${shaman.name} and allies restored ${baseAmt} HP!${anyDebuffed ? ' (some cards healed less due to debuff)' : ''}</span>`);
  renderFighter(shamSide, shaman);
  renderReserves(shamSide);
}

function triggerLavaBlast(shaman, shamSide, defender, defenderSide) {
  if (!defender || defender.hp <= 0) return;

  const oppSide  = shamSide === 'player' ? 'ai' : 'player';
  const oppPicks = shamSide === 'player' ? state.aiPicks : state.playerPicks;
  const shamEl   = document.getElementById(`${shamSide}-fighter`);
  const defEl    = document.getElementById(`${defenderSide}-fighter`);

  const lavaDmg = (60 + (shaman.spellbookBonus || 0)) * (defender.berserk ? 2 : 1);
  let overkill = 0;
  let lavaHitHorse = false;
  let horseOverkillOnRider = 0; // overkill from killing horse that bleeds directly into Rider (no reserve chain)
  if (defender.isMounted) {
    // Horse absorbs the Lava Blast — state updated synchronously
    lavaHitHorse = true;
    const prevHorseHp = defender.horseHp;
    defender.horseHp = Math.max(0, defender.horseHp - lavaDmg);
    overkill = 0; // no reserve chain when horse is involved
    if (defender.horseHp <= 0) {
      defender.isMounted = false;
      defender.image = 'Images/mouse.png';
      if (defender.passiveKey === 'parry') defender.parryToggle = true;
      // Excess damage from killing the horse bleeds into the Rider — stops there (no further reserve chain)
      horseOverkillOnRider = Math.max(0, lavaDmg - prevHorseHp);
      if (horseOverkillOnRider > 0) {
        defender.hp = Math.max(0, defender.hp - horseOverkillOnRider);
      }
    }
  } else {
    overkill = Math.max(0, lavaDmg - defender.hp);
    defender.hp = Math.max(0, defender.hp - lavaDmg);
  }
  // Don't mark defender dead here — checkDeaths handles the active fighter's death

  playSound('sound-fireball');
  animateProjectile('FireballAni.png', shamEl, defEl, { large: true, flip: shamSide === 'ai' });

  setTimeout(() => {
    showFloatDmg(defEl, lavaDmg);
    if (lavaHitHorse) {
      addLog(`<span class="log-event">🌋 Lava Blast hits the horse! (${defender.horseHp}/${defender.horseHpMax} HP)</span>`);
      if (!defender.isMounted) {
        addLog(`<span class="log-event">🐴 The horse was defeated! ${defender.name} dismounts as a mouse!</span>`);
        if (horseOverkillOnRider > 0) {
          addLog(`<span class="log-event">🌋 Lava overkill from horse! ${defender.name} takes ${horseOverkillOnRider} damage! (${defender.hp} HP)</span>`);
        }
      }
    } else {
      addLog(`<span class="log-event">🌋 Lava Blast! ${defender.name} hit for ${lavaDmg} <span class="log-mag">✨ Magical</span>! (${defender.hp} HP)</span>`);
    }

    if (overkill > 0) {
      const nextTarget = oppPicks.find(f => !f.dead && f !== defender && f.hp > 0);
      if (nextTarget) {
        const oDmg = Math.round(overkill * (nextTarget.berserk ? 2 : 1));
        nextTarget.hp = Math.max(0, nextTarget.hp - oDmg);
        if (nextTarget.hp <= 0) nextTarget.dead = true;
        addLog(`<span class="log-event">🌋 Lava overkill! ${nextTarget.name} hit for ${oDmg} overflow damage!</span>`);
      }
    }

    renderFighter(defenderSide, defender);
    renderReserves('player');
    renderReserves('ai');
  }, 350);
}

// Nerfer fires a random benched opponent nerf
function applyNerfer(attackerSide, attacker, currentDefender) {
  const oppPicks = attackerSide === 'player' ? state.aiPicks : state.playerPicks;
  // Only target benched (not the currently active defender)
  const targets = oppPicks.filter(f => !f.dead && f !== currentDefender);

  if (targets.length === 0) {
    addLog(`<span class="log-event">🔻 Nerfer: no valid benched targets.</span>`);
    return;
  }

  const target   = targets[Math.floor(Math.random() * targets.length)];
  const nerfAmt  = 10 + (attacker.spellbookBonus || 0);
  target.damage  = Math.max(10, target.damage - nerfAmt);
  addLog(`<span class="log-event">🔻 Nerfer! ${target.name}'s damage reduced by ${nerfAmt} (now ${target.damage}).</span>`);
  renderReserves('player');
  renderReserves('ai');
}

// Thunderlord kill handler
function handleThunderlordKill(mage, mageSide) {
  if (!mage || mage.dead || mage.passiveKey !== 'thunderlord') return;
  const killHpBonus  = 30 + (mage.spellbookBonus || 0);
  const killDmgBonus = 20 + (mage.spellbookBonus || 0);
  mage.maxHp                 += killHpBonus;
  mage.thunderlordMaxHpBonus += killHpBonus;  // track for 10-wave reset
  mage.hp     = Math.min(mage.maxHp, mage.hp + killHpBonus);
  mage.damage += killDmgBonus;
  mage.thunderlordPendingStrike = true;
  addLog(`<span class="log-event">⚡ Thunderlord! ${mage.name} gains +${killHpBonus} max HP (${mage.hp}/${mage.maxHp}) and +${killDmgBonus} DMG (${mage.damage}), next enemy struck!</span>`);
  renderFighter(mageSide, mage);
}

// Evasion: assassin retreats after 2 attacks
function triggerEvasion(attackerSide, assassin) {
  const myPicks = attackerSide === 'player' ? state.playerPicks : state.aiPicks;
  const allies = myPicks.filter(f => !f.dead && f !== assassin);

  if (allies.length === 0) {
    logEvent(`💨 Evasion ready, but no allies available to switch to.`);
    // Can't retreat — continue normally
    state.currentTurn = attackerSide === 'player' ? 'ai' : 'player';
    renderTurnIndicator();
    if (!state.paused) state.battleTimeout = setTimeout(runBattleTick, 1400);
    return;
  }

  // Consume Evasion
  assassin.evasionUsed = true;
  const lostHp    = assassin.maxHp - assassin.hp;
  const heal      = Math.floor(lostHp * 0.5);
  const evaDmgGain = 20 + (assassin.spellbookBonus || 0);
  assassin.hp = Math.min(assassin.maxHp, assassin.hp + heal);
  assassin.damage += evaDmgGain;
  logEvent(`💨 Evasion! ${assassin.name} retreats to bench! Healed ${heal} HP, gained +${evaDmgGain} damage permanently!`);

  if (attackerSide === 'player') {
    state.playerActive = null;
    if (allies.length === 1) {
      // Auto-assign the only remaining ally
      state.playerActive = allies[0];
      applyShieldToEntering(allies[0], 'player');
      renderBattleScreen();
      logEvent(`${allies[0].name} enters the battle!`);
      checkBothReady();
    } else {
      document.getElementById('choose-title').textContent = 'Send in a Fighter';
      document.getElementById('choose-subtitle').textContent =
        'Your Assassin evaded back to the bench. Choose who enters next.';
      renderChooseScreen(allies, (chosen) => {
        state.playerActive = chosen;
        applyShieldToEntering(chosen, 'player');
        showScreen('battle');
        renderBattleScreen();
        logEvent(`${chosen.name} enters the battle!`);
        checkBothReady();
      });
      showScreen('choose');
    }
  } else {
    const next = allies[Math.floor(Math.random() * allies.length)];
    state.aiActive = next;
    applyShieldToEntering(next, 'ai');
    renderBattleScreen();
    logEvent(`Enemy ${next.name} enters the battle!`);
    checkBothReady();
  }
}

// Double Shot: deal 30 to a random benched opponent
function triggerDoubleShot(attackerSide, attacker, currentDefender) {
  const oppPicks = attackerSide === 'player' ? state.aiPicks : state.playerPicks;
  const targets = oppPicks.filter(f => !f.dead && f !== currentDefender);

  if (targets.length === 0) {
    logEvent(`🎯 Double Shot: no valid benched targets.`);
    state.currentTurn = attackerSide === 'player' ? 'ai' : 'player';
    renderTurnIndicator();
    if (!state.paused) state.battleTimeout = setTimeout(runBattleTick, 1400);
    return;
  }

  const target   = targets[Math.floor(Math.random() * targets.length)];
  const oppSide  = attackerSide === 'player' ? 'ai' : 'player';
  const atkEl    = document.getElementById(`${attackerSide}-fighter`);
  const targetCard = document.querySelector(`#${oppSide}-reserves [data-fighter-id="${target.id}"]`);

  playSound('sound-arrow');
  animateProjectile('ArrowAni.png', atkEl, targetCard || atkEl, { rotate: true });

  setTimeout(() => {
    let dsBase = (attacker.berserk ? 60 : 30) + (attacker.spellbookBonus || 0);
    if (target.berserk) dsBase = Math.round(dsBase * 2);
    const dsArmor   = target.armorValue || 0;
    const dsAbsorb  = Math.min(dsArmor, dsBase);
    let dsDmg       = dsBase - dsAbsorb;
    if (dsAbsorb > 0) logEvent(`<span class="log-event">🛡 ${target.name}'s armor absorbs ${dsAbsorb} physical damage!</span>`);
    target.hp = Math.max(0, target.hp - dsDmg);
    logEvent(`🎯 Double Shot! ${target.name} hit for ${dsDmg} <span class="log-phys">⚔ Physical</span>! (${target.hp} HP remaining)`);
    if (target.hp <= 0) {
      // Death's Door: already protected — keep at 1 HP
      if (target.deathsDoorActive) {
        target.hp = 1;
      // Death's Door: chance to survive at 1 HP (wave mode, AI targets only, wave > 10)
      } else if (attackerSide === 'player' && state.waveMode && state.currentWave > 10) {
        const ddChance = Math.min(0.10, Math.floor((state.currentWave - 1) / 10) * 0.025);
        if (Math.random() < ddChance) {
          target.hp = 1;
          target.deathsDoorActive = true;
          logEvent(`☠ Death's Door! ${target.name} clings to life at 1 HP!`);
        } else {
          target.dead = true;
          logEvent(`💀 ${target.name} was eliminated by Double Shot!`);
        }
      } else {
        target.dead = true;
        logEvent(`💀 ${target.name} was eliminated by Double Shot!`);
      }
    }
    renderReserves('player');
    renderReserves('ai');
    state.currentTurn = attackerSide === 'player' ? 'ai' : 'player';
    renderTurnIndicator();
    if (!state.paused) state.battleTimeout = setTimeout(runBattleTick, 1400);
  }, 350);
}

// ── NEW CLASS ABILITIES ───────────────────────────────────

// The Ace: fires once when a Joker enters the active slot
function applyOnEnterEffects(fighter, side) {
  if (!fighter || fighter.dead) return;
  if (fighter.passiveKey === 'theace' && !fighter.aceFlipped) {
    fighter.aceFlipped = true;
    const heads = Math.random() < 0.5;
    if (heads) {
      fighter.aceResult   = 'heads';
      const aceHpGain     = 50 + (fighter.spellbookBonus || 0);
      const aceDmgGain    = 10 + (fighter.spellbookBonus || 0);
      fighter.maxHp      += aceHpGain;
      fighter.hp          = Math.min(fighter.maxHp, fighter.hp + aceHpGain);
      fighter.damage     += aceDmgGain;
      fighter.aceHpBonus  = aceHpGain;   // tracked for 10-wave reset
      logEvent(`🃏 The Ace! HEADS! ${fighter.name} surges — +${aceHpGain} HP, +${aceDmgGain} DMG permanently!`);
      renderFighter(side, fighter);
    } else {
      fighter.aceResult = 'tails';
      logEvent(`🃏 The Ace: TAILS — no bonus for ${fighter.name}.`);
    }
  }
}

// Death Grip: pull a random benched enemy and strike them immediately
function triggerDeathGrip(attackerSide, dk) {
  const oppPicks = attackerSide === 'player' ? state.aiPicks : state.playerPicks;
  const oppActive = attackerSide === 'player' ? state.aiActive : state.playerActive;
  const benched = oppPicks.filter(f => !f.dead && f !== oppActive);

  if (benched.length === 0) {
    logEvent(`💀 Death Grip fizzles — no benched targets!`);
    state.currentTurn = attackerSide === 'player' ? 'ai' : 'player';
    renderTurnIndicator();
    if (!state.paused) state.battleTimeout = setTimeout(runBattleTick, 1400);
    return;
  }

  const pulled    = benched[Math.floor(Math.random() * benched.length)];
  const oppSide   = attackerSide === 'player' ? 'ai' : 'player';
  const atkEl     = document.getElementById(`${attackerSide}-fighter`);
  const pulledCard = document.querySelector(`#${oppSide}-reserves [data-fighter-id="${pulled.id}"]`);

  playSound('sound-chain');
  animateProjectile('ChainAni.png', atkEl, pulledCard || atkEl, { rotate: true });

  setTimeout(() => {
    if (attackerSide === 'player') {
      state.aiActive = pulled;
    } else {
      state.playerActive = pulled;
    }

    logEvent(`💀 Death Grip! ${pulled.name} is wrenched into battle!`);
    renderBattleScreen();

    dk.deathGripBonus = 20;
    const newDefender = attackerSide === 'player' ? state.aiActive : state.playerActive;

    state.battleTimeout = setTimeout(() => {
      executeAttack(attackerSide, dk, newDefender);
    }, 700);
  }, 350);
}

// Wolf Form: second hit after every primary attack (always 10 damage)
function triggerWolfBite(attackerSide, wolf, defender) {
  const defenderSide = attackerSide === 'player' ? 'ai' : 'player';
  const defenderEl = document.getElementById(`${defenderSide}-fighter`);
  const attackerEl = document.getElementById(`${attackerSide}-fighter`);

  let wbBase = (wolf.berserk ? 50 : 25) + (wolf.spellbookBonus || 0);
  if (defender.berserk) wbBase = Math.round(wbBase * 2);

  let wbDmg = wbBase;
  let wbHorseBlock = false;
  if (defender.isMounted && wbBase > 0) {
    // Rider: horse absorbs wolf bite
    const wbHorseAbsorb = Math.min(defender.horseHp, wbBase);
    defender.horseHp -= wbHorseAbsorb;
    logEvent(`<span class="log-event">🐴 Wolf Bite hits the horse! (${defender.horseHp}/${defender.horseHpMax} HP remaining)</span>`);
    wbHorseBlock = true;
    wbDmg = 0;
    if (defender.horseHp <= 0) dismountRider(defender, defenderSide);
  } else {
    const wbArmor   = defender.armorValue || 0;
    const wbAbsorb  = Math.min(wbArmor, wbBase);
    wbDmg           = wbBase - wbAbsorb;
    if (wbAbsorb > 0) logEvent(`<span class="log-event">🛡 ${defender.name}'s armor absorbs ${wbAbsorb} physical damage!</span>`);
    const wbShieldAbs = Math.min(defender.shieldHp, wbDmg);
    defender.shieldHp -= wbShieldAbs;
    defender.hp = Math.max(0, defender.hp - (wbDmg - wbShieldAbs));
    const wbShieldNote = defender.shieldHp > 0 ? ` +🛡${defender.shieldHp}` : '';
    logEvent(`🐺 Wolf Bite! ${wolf.name} strikes again for ${wbDmg} <span class="log-phys">⚔ Physical</span>! (${defender.hp} HP${wbShieldNote})`);
  }

  playSound('sound-sword');
  animateProjectile('SlashAni.png', attackerEl, defenderEl, { isImpact: true, flip: attackerSide === 'ai' });
  triggerAnim(attackerEl, attackerSide === 'player' ? 'do-attack-right' : 'do-attack-left', 350);

  setTimeout(() => {
    triggerAnim(defenderEl, 'do-flash', 350);
    triggerAnim(defenderEl, 'do-shake', 400);
    if (!wbHorseBlock && wbDmg > 0) showFloatDmg(defenderEl, wbDmg);
    else if (!wbHorseBlock && wbDmg === 0) showFloatMiss(defenderEl);
    renderFighter(defenderSide, defender);

    if (!wbHorseBlock && defender.hp <= 0) {
      defender.dead = true;
      logEvent(`💀 ${defender.name} was eliminated by the Wolf Bite!`);
      // Necromancer Sacrifice: ghoul rises instead of normal death
      if (defender.passiveKey === 'sacrifice' && !defender.ghoulSpawned) {
        spawnGhoul(defender, defenderSide);
        return;
      }
      handleThunderlordKill(wolf, attackerSide);
      animateDeath(defenderSide, () => {
        if (defenderSide === 'player') {
          const next = chooseNextPlayerCard();
          if (!next) endGame(false);
        } else {
          chooseNextAICard();
        }
      });
      return;
    }

    setTimeout(() => {
      state.currentTurn = attackerSide === 'player' ? 'ai' : 'player';
      renderTurnIndicator();
      if (!state.paused) state.battleTimeout = setTimeout(runBattleTick, 1400);
    }, 300);
  }, 180);
}

// ── ULTIMATES ─────────────────────────────────────────────
function triggerUltimate(attacker, defender, attackerSide) {
  if (attacker.passiveKey === 'fortify' || attacker.passiveKey === 'shieldblock') {
    // Protector ultimate: +20 HP self (+ spellbook), +5 DMG to allies (+ spellbook each)
    const selfHealRaw = 20 + (attacker.spellbookBonus || 0);
    const healReduct  = attacker.healingReductionPct || 0;
    const selfHeal    = healReduct > 0 ? Math.floor(selfHealRaw * (1 - healReduct)) : selfHealRaw;
    const allyBonus   =  5 + (attacker.spellbookBonus || 0);
    attacker.hp = Math.min(attacker.maxHp, attacker.hp + selfHeal);
    const myPicks = attackerSide === 'player' ? state.playerPicks : state.aiPicks;
    let rallyCount = 0;
    myPicks.forEach(ally => {
      if (!ally.dead && ally !== attacker) { ally.damage += allyBonus; rallyCount++; }
    });
    const rallyMsg = rallyCount > 0
      ? `, rallies ${rallyCount} ${rallyCount === 1 ? 'ally' : 'allies'} (+${allyBonus} DMG each)`
      : '';
    const debuffNote = healReduct > 0 ? ' (healing reduced)' : '';
    addLog(`<span class="log-event">✨ ${attacker.name} Ultimate! Restores ${selfHeal} HP (${attacker.hp}/${attacker.maxHp})${debuffNote}${rallyMsg}</span>`);
  } else if (attacker.passiveKey === 'bloodthirst') {
    attacker.ultimateReady = true;
    addLog(`<span class="log-event">✨ ${attacker.name} Ultimate! Next attack boosted!</span>`);
  } else if (attacker.passiveKey === 'rage') {
    attacker.ultimateReady = true;
    addLog(`<span class="log-event">✨ ${attacker.name} Ultimate! Next attack boosted!</span>`);
  } else if (attacker.passiveKey === 'shield') {
    attacker.shieldMultiplier *= 2;
    const newShieldPerTurn = (20 + (attacker.spellbookBonus || 0)) * attacker.shieldMultiplier;
    addLog(`<span class="log-event">✨ ${attacker.name} Ultimate! Shield generation doubled (${newShieldPerTurn}/turn)</span>`);
  } else if (attacker.passiveKey === 'nerfer') {
    const nerferHealRaw = 20 + (attacker.spellbookBonus || 0);
    const healReductN   = attacker.healingReductionPct || 0;
    const nerferHeal    = healReductN > 0 ? Math.floor(nerferHealRaw * (1 - healReductN)) : nerferHealRaw;
    attacker.hp = Math.min(attacker.maxHp, attacker.hp + nerferHeal);
    const debuffNoteN = healReductN > 0 ? ' (healing reduced)' : '';
    addLog(`<span class="log-event">✨ ${attacker.name} Ultimate! Healed ${nerferHeal} HP (${attacker.hp}/${attacker.maxHp})${debuffNoteN}</span>`);
  } else if (attacker.passiveKey === 'burn') {
    // Ultimate grows burnDamage by a flat 10 (spellbookBonus is added separately when burn is applied)
    attacker.burnDamage += 10;
    const newBurnTotal = attacker.burnDamage + (attacker.spellbookBonus || 0);
    if (defender.burnAmount > 0) defender.burnAmount = newBurnTotal;
    addLog(`<span class="log-event">✨ ${attacker.name} Ultimate! Burn damage increased to ${newBurnTotal}</span>`);
  } else if (attacker.passiveKey === 'thunderlord') {
    const thunderDmg = 10 + (attacker.spellbookBonus || 0);
    const defSide = attackerSide === 'player' ? 'ai' : 'player';
    const defEl   = document.getElementById(`${defSide}-fighter`);
    const atkEl   = document.getElementById(`${attackerSide}-fighter`);
    setTimeout(() => {
      if (defender.dead) return;
      const thunderAbs = Math.min(defender.shieldHp, thunderDmg);
      defender.shieldHp -= thunderAbs;
      defender.hp = Math.max(0, defender.hp - (thunderDmg - thunderAbs));
      playSound('sound-lightning');
      animateProjectile('LightningballAni.png', atkEl, defEl, { flip: attackerSide === 'ai' });
      showFloatDmg(defEl, thunderDmg);
      renderFighter(defSide, defender);
      addLog(`<span class="log-event">⚡ Thunderlord strikes! ${defender.name} hit for ${thunderDmg} <span class="log-mag">✨ Magical</span>! (${defender.hp} HP${defender.shieldHp > 0 ? ` +🛡${defender.shieldHp}` : ''})</span>`);
    }, 500);
  } else if (attacker.passiveKey === 'firststrike') {
    attacker.ultimateReady = true;
    addLog(`<span class="log-event">✨ ${attacker.name} Ultimate! Next attack boosted!</span>`);
  } else if (attacker.passiveKey === 'evasion') {
    attacker.ultimateReady = true;
    addLog(`<span class="log-event">✨ ${attacker.name} Ultimate! Next attack boosted!</span>`);
  } else if (attacker.passiveKey === 'steadyaim') {
    attacker.ultimateReady = true;
    addLog(`<span class="log-event">✨ ${attacker.name} Ultimate! Bonus attack incoming!</span>`);
  } else if (attacker.passiveKey === 'doubleshot') {
    attacker.ultimateReady = true;
    addLog(`<span class="log-event">✨ ${attacker.name} Ultimate! Bonus attack incoming!</span>`);
  } else if (attacker.passiveKey === 'deathgrip' || attacker.passiveKey === 'fearofthedead') {
    // Death Knight: exponential healing — doubles each time, capped at 40 + spellbookBonus
    const healCap    = 40 + (attacker.spellbookBonus || 0);
    const healRaw    = 10 * Math.pow(2, attacker.healStack);
    const healPre    = Math.min(healCap, healRaw);
    const capped     = healRaw > healCap;
    const healReductDK = attacker.healingReductionPct || 0;
    const heal       = healReductDK > 0 ? Math.floor(healPre * (1 - healReductDK)) : healPre;
    attacker.healStack++;
    attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal);
    const debuffNoteDK = healReductDK > 0 ? ' (healing reduced)' : '';
    addLog(`<span class="log-event">✨ Death Knight Ultimate! Healed ${heal} HP (${attacker.hp}/${attacker.maxHp})${capped ? ` — <em>heal capped at ${healCap}</em>` : ''}${debuffNoteDK}</span>`);
  } else if (attacker.passiveKey === 'bearform') {
    if (!attacker.transformed) {
      const upgradeHp  = attacker.upgradeMaxHp || 0;
      const upgradeDmg = attacker.baseDamage - (attacker._origBaseDmg || attacker.baseDamage);
      const spellBear  = attacker.spellbookBonus || 0;
      // Preserve any rally bonus from Protector ultimate (lives in .damage, not .baseDamage)
      const rallyBonus = Math.max(0, attacker.damage - attacker.baseDamage);
      attacker.transformed = true;
      attacker.ultimateThreshold = 9999;
      attacker.image   = 'Images/Bear.png';
      attacker.maxHp   = 150 + upgradeHp + spellBear;
      attacker.hp      = attacker.maxHp;   // fully healed to new max
      attacker.damage  = 50 + upgradeDmg + spellBear + rallyBonus;
      attacker.armorValue = (attacker.armorValue || 0) + 15; // Bear Form: +15 armor bonus
      attacker.passiveName = 'Bear Form';
      attacker.passive = `Transformed! ${attacker.maxHp} HP / ${attacker.damage} DMG — fully healed.`;
      addLog(`<span class="log-event">🐻 TRANSFORMATION! Druid becomes a mighty Bear! HP fully restored to ${attacker.maxHp}! (+15 armor)</span>`);
    }
  } else if (attacker.passiveKey === 'wolfform') {
    if (!attacker.transformed) {
      const upgradeHp  = attacker.upgradeMaxHp || 0;
      const upgradeDmg = attacker.baseDamage - (attacker._origBaseDmg || attacker.baseDamage);
      const spellWolf  = attacker.spellbookBonus || 0;
      // Preserve any rally bonus from Protector ultimate (lives in .damage, not .baseDamage)
      const rallyBonus = Math.max(0, attacker.damage - attacker.baseDamage);
      attacker.transformed = true;
      attacker.wolfForm    = true;
      attacker.ultimateThreshold = 9999;
      attacker.image  = 'Images/Wolf.png';
      attacker.maxHp  = attacker.baseHp + upgradeHp + 50 + spellWolf;
      attacker.hp     = Math.min(attacker.maxHp, attacker.hp + 50 + spellWolf);
      attacker.damage = 60 + upgradeDmg + spellWolf + rallyBonus;
      attacker.passiveName = 'Wolf Form';
      attacker.passive = `Transformed! ${attacker.maxHp} HP / ${attacker.damage} DMG — attacks twice per turn + ${25 + spellWolf} Wolf Bite.`;
      addLog(`<span class="log-event">🐺 TRANSFORMATION! Druid becomes a swift Wolf! Attacks now come in pairs!</span>`);
    }
  } else if (attacker.passiveKey === 'chainheal' || attacker.passiveKey === 'lavablast') {
    if (!attacker.lightningShieldActive) {
      attacker.lightningShieldActive = true;
      attacker.ultimateThreshold = 9999;
      addLog(`<span class="log-event">⚡ ${attacker.name} activates Lightning Shield! Incoming damage -10; attackers take 10 retaliation!</span>`);
      renderFighter(attackerSide, attacker);
    }
  }
}

// ── DEATHS ────────────────────────────────────────────────
function checkDeaths() {
  const playerDied = state.playerActive.hp <= 0;
  const aiDied     = state.aiActive.hp <= 0;

  if (!playerDied && !aiDied) return false;

  // Demonblood: intercept AI death — Demon rises to full HP once before normal death processing.
  // Returns true and immediately schedules the Demon's own turn so it acts next, not the player.
  if (aiDied && !playerDied && state.aiActive.passiveKey === 'demonblood' && !state.aiActive.demonReviveUsed) {
    state.aiActive.demonReviveUsed = true;
    state.aiActive.hp = state.aiActive.maxHp;
    addLog(`<span class="log-event">🩸 DEMONBLOOD! ${state.aiActive.name} refuses to die — rising at full HP!</span>`);
    renderFighter('ai', state.aiActive);
    state.currentTurn = 'ai';   // demon goes next, not the player
    renderTurnIndicator();
    if (!state.paused) state.battleTimeout = setTimeout(runBattleTick, 1400);
    return true;  // stop any follow-up attacks this turn
  }

  // Death's Door: AI fighter is already under Death's Door protection — keep at 1 HP.
  if (aiDied && !playerDied && state.aiActive.deathsDoorActive) {
    state.aiActive.hp = 1;
    return false;  // still alive, combat continues normally
  }

  // Death's Door: chance for an AI enemy to survive at 1 HP (wave mode, wave > 10).
  if (aiDied && !playerDied && state.waveMode && state.currentWave > 10) {
    const ddChance = Math.min(0.10, Math.floor((state.currentWave - 1) / 10) * 0.025);
    if (Math.random() < ddChance) {
      state.aiActive.hp = 1;
      state.aiActive.deathsDoorActive = true;
      addLog(`<span class="log-event">☠ Death's Door! ${state.aiActive.name} clings to life at 1 HP!</span>`);
      renderFighter('ai', state.aiActive);
      return false;  // not dead; combat continues
    }
  }

  // Wave mode: Angel item intercepts player death before normal processing.
  if (state.waveMode && playerDied && state.playerActive.items) {
    const angelIdx = state.playerActive.items.findIndex(i => i.id === 'angel');
    if (angelIdx !== -1) {
      state.playerActive.items.splice(angelIdx, 1);   // consume Angel
      state.playerActive.maxHp      += 50;
      state.playerActive.hp          = state.playerActive.maxHp;
      state.playerActive.baseDamage += 30;
      state.playerActive.damage      = Math.max(state.playerActive.damage, state.playerActive.baseDamage);
      state.playerActive.spellbookBonus = (state.playerActive.spellbookBonus || 0) + 10;
      state.playerActive.angelRevived   = true;
      addLog(`<span class="log-event">👼 ANGEL! ${state.playerActive.name} cheats death! +50 max HP, +30 DMG, +10 passive DMG! ✨ Golden aura!</span>`);
      renderFighter('player', state.playerActive);
      renderReserves('player');
      // If AI also died this turn, process that side normally
      if (aiDied) {
        handleThunderlordKill(state.playerActive, 'player');
        state.aiActive.dead = true;
        logEvent(`💀 ${state.aiActive.name} was defeated!`);
        animateDeath('ai', () => chooseNextAICard());
      } else {
        // Only player died — Angel revived them. Resume combat with a turn flip.
        // Without this, the battle tick would die here and the game would freeze.
        state.currentTurn = state.currentTurn === 'player' ? 'ai' : 'player';
        renderTurnIndicator();
        if (!state.paused) state.battleTimeout = setTimeout(runBattleTick, 1800);
      }
      return true;
    }
  }

  // Detect if the opposite side's sacrifice branch will handle the animation,
  // so we don't call animateDeath() twice and spin up two battle loops.
  const playerSacrificeWillHandle = playerDied && state.playerActive.passiveKey === 'sacrifice' && !state.playerActive.ghoulSpawned;
  const aiSacrificeWillHandle     = aiDied     && state.aiActive.passiveKey     === 'sacrifice' && !state.aiActive.ghoulSpawned;

  if (aiDied) {
    // Sacrifice: Necromancer's ghoul rises instead of normal death
    if (state.aiActive.passiveKey === 'sacrifice' && !state.aiActive.ghoulSpawned) {
      // If the player also died this same turn, mark them dead NOW so checkBothReady
      // (called inside spawnGhoul) doesn't restart the battle with a 0-HP player.
      if (playerDied) state.playerActive.dead = true;
      spawnGhoul(state.aiActive, 'ai');
      if (playerDied) {
        logEvent(`💀 ${state.playerActive.name} was defeated!`);
        animateDeath('player', () => {
          const next = chooseNextPlayerCard();
          if (!next) endGame(false);
        });
      }
      return true;
    }
    // Player's active killed the AI card — check Thunderlord
    handleThunderlordKill(state.playerActive, 'player');
    state.aiActive.dead = true;
    logEvent(`💀 ${state.aiActive.name} was defeated!`);
    // Skip animateDeath here if the player's sacrifice branch (below) will call it —
    // calling it twice would start two parallel battle loops.
    if (!playerSacrificeWillHandle) {
      animateDeath('ai', () => chooseNextAICard());
    }
  }

  if (playerDied) {
    // Sacrifice: Necromancer's ghoul rises instead of normal death
    if (state.playerActive.passiveKey === 'sacrifice' && !state.playerActive.ghoulSpawned) {
      if (aiDied) state.aiActive.dead = true;
      spawnGhoul(state.playerActive, 'player');
      if (aiDied) {
        logEvent(`💀 ${state.aiActive.name} was defeated!`);
        animateDeath('ai', () => chooseNextAICard());
      }
      return true;
    }
    // AI's active killed the player card — check Thunderlord
    handleThunderlordKill(state.aiActive, 'ai');
    state.playerActive.dead = true;
    logEvent(`💀 ${state.playerActive.name} was defeated!`);
    // Skip animateDeath here if the AI's sacrifice branch (above) already called it.
    if (!aiSacrificeWillHandle) {
      animateDeath('player', () => {
        const next = chooseNextPlayerCard();
        if (!next) endGame(false);
      });
    }
  }

  return true;
}

// Shield absorbs damage first; returns the actual damage dealt to HP
function applyDamage(fighter, amount) {
  if (amount <= 0) return 0;
  const shieldAbs = Math.min(fighter.shieldHp, amount);
  fighter.shieldHp -= shieldAbs;
  const hpDmg = amount - shieldAbs;
  fighter.hp = Math.max(0, fighter.hp - hpDmg);
  return amount; // total damage attempted (for log purposes)
}

function applyShieldToEntering(fighter, side) {
  const pool = side === 'player' ? 'playerShield' : 'aiShield';
  if (state[pool] > 0) {
    fighter.shieldHp    += state[pool];
    fighter.shieldHpMax += state[pool];
    logEvent(`🛡 ${fighter.name} enters with +${state[pool]} HP shield from Cleric!`);
    state[pool] = 0;
    setTimeout(() => {
      playSound('sound-heal');
      animateProjectile('HealAni.png', null, document.getElementById(`${side}-fighter`), { isImpact: true });
    }, 150);
  }
}

// ── CHOOSE NEXT PLAYER CARD ───────────────────────────────
function chooseNextPlayerCard() {
  const reserves = state.playerPicks.filter(f => !f.dead && f !== state.playerActive);
  if (reserves.length === 0) return null;

  if (reserves.length === 1) {
    state.playerActive = reserves[0];
    applyShieldToEntering(reserves[0], 'player');
    renderBattleScreen();
    logEvent(`${reserves[0].name} enters the battle!`);
    checkBothReady();
    return reserves[0];
  }

  document.getElementById('choose-title').textContent = 'Choose Your Next Fighter';
  document.getElementById('choose-subtitle').textContent = 'Your card was defeated. Select a reserve to continue.';
  renderChooseScreen(reserves, null);
  showScreen('choose');
  return reserves[0];
}

function renderChooseScreen(reserves, onPick) {
  const grid = document.getElementById('choose-grid');
  grid.innerHTML = '';
  reserves.forEach(fighter => {
    const card = buildCardEl(fighter, 'full');
    card.addEventListener('click', () => {
      if (onPick) {
        onPick(fighter);
      } else {
        state.playerActive = fighter;
        applyShieldToEntering(fighter, 'player');
        showScreen('battle');
        renderBattleScreen();
        logEvent(`${fighter.name} enters the battle!`);
        checkBothReady();
      }
    });
    grid.appendChild(card);
  });
}

// ── CHOOSE NEXT AI CARD ───────────────────────────────────
function chooseNextAICard() {
  // Wave mode: if the just-defeated enemy carried loot, show the picker first.
  if (state.waveMode && state.aiActive && state.aiActive.lootItem && !state.aiActive._lootGranted) {
    showWaveLoot(state.aiActive.lootItem);
    return; // showWaveLoot() calls chooseNextAICard() again after player picks
  }

  const reserves = state.aiPicks.filter(f => !f.dead && f !== state.aiActive);
  if (reserves.length === 0) {
    if (state.waveMode) {
      endWave();
    } else {
      endGame(true);
    }
    return;
  }
  const next = reserves[Math.floor(Math.random() * reserves.length)];
  state.aiActive = next;
  applyShieldToEntering(next, 'ai');
  renderBattleScreen();
  logEvent(`Enemy ${next.name} enters the battle!`);
  checkBothReady();
}

// Called after a new fighter enters — handles Thunderlord pending strike, then coin-flip
function checkBothReady() {
  if (state.playerActive && !state.playerActive.dead &&
      state.aiActive    && !state.aiActive.dead) {

    let extraDelay = 0;

    // Thunderlord pending strike — player mage hits incoming AI card
    if (state.playerActive.passiveKey === 'thunderlord' && state.playerActive.thunderlordPendingStrike) {
      state.playerActive.thunderlordPendingStrike = false;
      const tDmg1 = 30 + (state.playerActive.spellbookBonus || 0);
      const tAbs1 = Math.min(state.aiActive.shieldHp, tDmg1);
      state.aiActive.shieldHp -= tAbs1;
      state.aiActive.hp = Math.max(0, state.aiActive.hp - (tDmg1 - tAbs1));
      logEvent(`⚡ Thunderlord strike! ${state.aiActive.name} takes ${tDmg1} damage as they enter! (${state.aiActive.hp} HP${state.aiActive.shieldHp > 0 ? ` +🛡${state.aiActive.shieldHp}` : ''})`);
      renderBattleScreen();
      if (state.aiActive.hp <= 0) {
        state.aiActive.dead = true;
        handleThunderlordKill(state.playerActive, 'player');
        logEvent(`💀 ${state.aiActive.name} was defeated by the Thunderlord strike!`);
        animateDeath('ai', () => chooseNextAICard());
        return;
      }
      extraDelay = 700;
    }

    // Thunderlord pending strike — AI mage hits incoming player card
    if (state.aiActive.passiveKey === 'thunderlord' && state.aiActive.thunderlordPendingStrike) {
      state.aiActive.thunderlordPendingStrike = false;
      const tAbs2 = Math.min(state.playerActive.shieldHp, 30);
      state.playerActive.shieldHp -= tAbs2;
      state.playerActive.hp = Math.max(0, state.playerActive.hp - (30 - tAbs2));
      logEvent(`⚡ Enemy Thunderlord strike! ${state.playerActive.name} takes 30 damage as they enter! (${state.playerActive.hp} HP${state.playerActive.shieldHp > 0 ? ` +🛡${state.playerActive.shieldHp}` : ''})`);
      renderBattleScreen();
      if (state.playerActive.hp <= 0) {
        state.playerActive.dead = true;
        handleThunderlordKill(state.aiActive, 'ai');
        logEvent(`💀 ${state.playerActive.name} was defeated by Thunderlord strike!`);
        animateDeath('player', () => {
          const next = chooseNextPlayerCard();
          if (!next) endGame(false);
        });
        return;
      }
      extraDelay = 700;
    }

    applyOnEnterEffects(state.playerActive, 'player');
    applyOnEnterEffects(state.aiActive, 'ai');
    initCombatTurn(state.playerActive, state.aiActive);
    if (!state.paused) {
      state.battleTimeout = setTimeout(runBattleTick, 1200 + extraDelay);
    }
  }
}

function renderTurnIndicator() {
  const el = document.getElementById('turn-info');
  if (!el) return;
  const waveBadge = state.waveMode
    ? `<div class="wave-badge">🌊 Wave ${state.currentWave} / 50</div>`
    : '';
  if (state.currentTurn === 'player') {
    el.innerHTML = `${waveBadge}<span style="color:var(--accent)">▶ Your turn</span>`;
  } else {
    el.innerHTML = `${waveBadge}<span style="color:var(--accent2)">▶ Enemy's turn</span>`;
  }
}

// ── END GAME ──────────────────────────────────────────────
function endGame(playerWon) {
  clearTimeout(state.battleTimeout);
  document.getElementById('battle-log')?.classList.remove('log-visible');
  document.getElementById('btn-log')?.classList.remove('log-open');
  document.removeEventListener('click', _logOutsideHandler);
  const title    = document.getElementById('end-title');
  const subtitle = document.getElementById('end-subtitle');

  title.textContent = playerWon ? 'Victory!' : 'Defeat!';
  title.className   = 'end-title ' + (playerWon ? 'victory' : 'defeat');
  if (state.waveMode && !playerWon) {
    subtitle.textContent = `You reached wave ${state.currentWave} of 50. Better luck next time!`;
  } else {
    subtitle.textContent = playerWon
      ? 'Your team crushed the enemy. Well chosen!'
      : 'All your fighters were defeated. Choose more carefully next time.';
  }

  const battleLog = document.getElementById('battle-log');
  const endLog    = document.getElementById('end-log');
  if (battleLog && endLog) {
    endLog.innerHTML = battleLog.innerHTML;
    setTimeout(() => { endLog.scrollTop = endLog.scrollHeight; }, 50);
  }

  setTimeout(() => showScreen('end'), 600);
}

// ── RESTART ───────────────────────────────────────────────
function restartGame() {
  clearTimeout(state.battleTimeout);
  document.body.classList.add('fade-out');
  setTimeout(() => {
    document.body.classList.remove('fade-out');
    resetState();
    clearLog();
    document.getElementById('selection-grid').innerHTML = '';
    document.getElementById('player-team-reveal').innerHTML = '';
    document.getElementById('ai-team-reveal').innerHTML = '';
    document.getElementById('player-fighter').innerHTML = '';
    document.getElementById('ai-fighter').innerHTML = '';
    document.getElementById('player-reserves').innerHTML = '';
    document.getElementById('ai-reserves').innerHTML = '';
    document.getElementById('choose-grid').innerHTML = '';
    document.getElementById('passive-pick-options').innerHTML = '';
    document.getElementById('end-log').innerHTML = '';
    document.getElementById('choose-title').textContent = 'Choose Your Next Fighter';
    document.getElementById('choose-subtitle').textContent = 'Your card was defeated. Select a reserve to continue.';
    const pauseBtn = document.getElementById('btn-pause');
    pauseBtn.textContent = '⏸ Pause';
    pauseBtn.classList.remove('is-paused');
    // Close loot overlay and bag tooltip if open
    const lootOverlay = document.getElementById('wave-loot-overlay');
    if (lootOverlay) lootOverlay.style.display = 'none';
    const bagTt = document.getElementById('item-bag-tooltip');
    if (bagTt) bagTt.style.display = 'none';
    showScreen('menu');
  }, 420);
}

// ── CARD BUILDER ──────────────────────────────────────────
function getDmgType(data) {
  const id = data.id || '';
  if (id === 'support' || id === 'mage') {
    return { icon: '✨', label: 'Magical', cls: 'dmg-magical' };
  }
  if (id === 'druid') {
    if (data.transformed) return { icon: '⚔', label: 'Physical', cls: 'dmg-physical' };
    return { icon: '⚔✨', label: 'Magical (pre-transform) → Physical', cls: 'dmg-mixed' };
  }
  if (id === 'assassin') {
    return { icon: '⚔✨', label: 'Physical + Magical bonuses', cls: 'dmg-mixed' };
  }
  if (id === 'deathknight') {
    if (data.passiveKey === 'fearofthedead') return { icon: '⚔', label: 'Physical', cls: 'dmg-physical' };
    return { icon: '⚔✨', label: 'Physical + Magical (Death Grip)', cls: 'dmg-mixed' };
  }
  if (id === 'necromancer') return { icon: '✨', label: 'Magical', cls: 'dmg-magical' };
  if (id === 'shaman')      return { icon: '✨', label: 'Magical', cls: 'dmg-magical' };
  return { icon: '⚔', label: 'Physical', cls: 'dmg-physical' };
}

function dmgTypeTag(attacker) {
  if (isBaseAttackMagical(attacker)) return '<span class="log-mag">✨ Magical</span>';
  if ((attacker._magicBonus || 0) > 0) return '<span class="log-mixed">⚔✨ Mixed</span>';
  return '<span class="log-phys">⚔ Physical</span>';
}

function armorBadgeHtml(data) {
  const type = data.armorType;
  if (!type) return '';
  const val = data.armorValue || 0;
  const icon = `Images/Armor${type.charAt(0).toUpperCase() + type.slice(1)}.png`;
  const label = val > 0 ? `+${val}` : '';
  return `<div class="armor-badge"><img class="armor-icon" src="${icon}" alt="${type}" />${label ? `<span class="armor-val">${label}</span>` : ''}</div>`;
}

function buildCardEl(data, size) {
  const card = document.createElement('div');
  card.className = 'card';

  const hp  = data.hp  ?? data.baseHp;
  const dmg = data.damage ?? data.baseDamage;

  let passiveHtml = '';
  if (data.passiveName) {
    // Fighter instance: show only the passive name; full details on hover
    passiveHtml = `<p class="passive-label"><strong>${data.passiveName}</strong></p>`;
  } else if (data.passives) {
    // Class definition (not yet picked): show both option names
    passiveHtml = `<p class="passive-label" style="color:var(--muted)">A: ${data.passives[0].name} | B: ${data.passives[1].name}</p>`;
  }

  card.innerHTML = `
    <div class="card-image">
      <img src="${data.image}" alt="${data.name}" />
      ${armorBadgeHtml(data)}
    </div>
    <div class="card-info">
      <h3>${data.name}</h3>
      <div class="stats">
        <span class="hp">HP ${hp}</span>
        <span class="dmg">DMG ${dmg}</span>
      </div>
      ${passiveHtml}
    </div>
  `;
  return card;
}

// ── ANIMATIONS ────────────────────────────────────────────
function triggerAnim(el, className, duration) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), duration);
}

function animateDeath(side, callback) {
  const el = document.getElementById(`${side}-fighter`);
  if (!el) { callback(); return; }
  el.classList.add('do-death');
  setTimeout(() => {
    el.classList.remove('do-death');
    callback();
  }, 650);
}

function showFloatDmg(parentEl, amount) {
  if (!parentEl) return;
  const span = document.createElement('span');
  span.className = 'float-dmg';
  span.textContent = `-${amount}`;
  parentEl.style.position = 'relative';
  parentEl.appendChild(span);
  setTimeout(() => span.remove(), 950);
}

function showFloatMiss(parentEl) {
  if (!parentEl) return;
  const span = document.createElement('span');
  span.className = 'float-dmg float-miss';
  span.textContent = 'MISS';
  parentEl.style.position = 'relative';
  parentEl.appendChild(span);
  setTimeout(() => span.remove(), 950);
}

// ── BATTLE LOG ────────────────────────────────────────────
function addLog(html) {
  const log = document.getElementById('battle-log');
  const line = document.createElement('div');
  line.innerHTML = html;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

function logEvent(text) {
  addLog(`<span class="log-event">${text}</span>`);
}

function clearLog() {
  const log = document.getElementById('battle-log');
  if (log) log.innerHTML = '';
}

// ── UTILITY ───────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function playSound(soundId) {
  const audio = document.getElementById(soundId);
  if (!audio) return;
  audio.currentTime = 0;
  const p = audio.play();
  if (p !== undefined) p.catch(err => console.warn(`Audio failed: ${soundId}`, err.message));
}

function playAttackSound(fighter) {
  // Druid: first attack is pre-transform (Holy), subsequent are post-transform (sword)
  if (fighter.passiveKey === 'bearform' || fighter.passiveKey === 'wolfform') {
    playSound(fighter.attackCount <= 1 ? 'sound-holy' : 'sound-sword');
    return;
  }
  const soundMap = {
    steadyaim:    'sound-arrow',
    doubleshot:   'sound-arrow',
    burn:         'sound-fireball',
    thunderlord:  'sound-fireball',
    fortify:      'sound-sword',
    shieldblock:  'sound-sword',
    bloodthirst:  'sound-sword',
    rage:         'sound-sword',
    firststrike:  'sound-sword',
    evasion:      'sound-sword',
    deathgrip:    'sound-sword',
    fearofthedead:'sound-sword',
    luckofthedraw:'sound-sword',
    theace:       'sound-sword',
    shield:       'sound-wand',
    nerfer:       'sound-wand',
    revival:      'sound-sword',
    parry:        'sound-sword',
    sacrifice:    'sound-fireball',
    reborn:       'sound-fireball',
    chainheal:    'sound-lightning',
    lavablast:    'sound-lightning',
    ghoul:             'sound-sword',
    dartpeon:          'sound-arrow',
    peon_doubleattack: 'sound-sword',
    knightblock:       'sound-sword',
    dragonfire:        'sound-fireball',
    wizardfirestorm:   'sound-fireball',
    truedamage:        'sound-sword',
  };
  // Demon alternates sounds to match its alternating animation
  if (fighter.passiveKey === 'demonblood') {
    playSound(fighter.attackCount % 2 === 0 ? 'sound-fireball' : 'sound-sword');
    return;
  }
  const soundId = soundMap[fighter.passiveKey];
  if (!soundId) return;
  playSound(soundId);
}

function getAttackAni(fighter) {
  const key = fighter.passiveKey;
  if (key === 'steadyaim' || key === 'doubleshot') {
    return { src: 'ArrowAni.png', rotate: true };
  }
  if (key === 'burn' || key === 'thunderlord') {
    return { src: 'FireballAni.png' };
  }
  if (key === 'shield' || key === 'nerfer') {
    return { src: 'HolyballAni.png' };
  }
  if ((key === 'bearform' || key === 'wolfform') && fighter.attackCount <= 1) {
    return { src: 'HolyballAni.png' };
  }
  if (key === 'revival' || key === 'parry' || key === 'ghoul') {
    return { src: 'SlashAni.png', isImpact: true };
  }
  if (key === 'sacrifice' || key === 'reborn') {
    return { src: 'FireballAni.png' };
  }
  if (key === 'chainheal' || key === 'lavablast') {
    return { src: 'LightningballAni.png', isImpact: true };
  }
  if (key === 'dartpeon') {
    return { src: 'ArrowAni.png', rotate: true };
  }
  if (key === 'peon_doubleattack' || key === 'knightblock') {
    return { src: 'SlashAni.png', isImpact: true };
  }
  if (key === 'dragonfire') {
    return { src: 'FireballAni.png' };
  }
  if (key === 'wizardfirestorm') {
    return { src: 'FireballAni.png' };
  }
  if (key === 'truedamage') {
    return { src: 'SlashAni.png', isImpact: true };
  }
  if (key === 'demonblood') {
    // Alternates between slash and fireball each attack for the "combination" look
    return fighter.attackCount % 2 === 0
      ? { src: 'FireballAni.png' }
      : { src: 'SlashAni.png', isImpact: true };
  }
  return { src: 'SlashAni.png', isImpact: true };
}

function animateProjectile(src, fromEl, toEl, opts) {
  const { isImpact = false, rotate = false, flip = false, large = false } = opts || {};
  if (!toEl) return;

  const img = document.createElement('img');
  img.src = `Images/${src}`;
  img.className = 'projectile' + (isImpact ? (' impact' + (flip ? ' flip' : '')) : '');
  if (large) { img.style.width = '256px'; img.style.height = '256px'; }
  document.body.appendChild(img);

  const toRect = toEl.getBoundingClientRect();
  const endX   = toRect.left + toRect.width  / 2;
  const endY   = toRect.top  + toRect.height / 2;

  if (isImpact || !fromEl) {
    img.style.left = `${endX}px`;
    img.style.top  = `${endY}px`;
    setTimeout(() => img.remove(), 700);
    return;
  }

  const fromRect = fromEl.getBoundingClientRect();
  const startX   = fromRect.left + fromRect.width  / 2;
  const startY   = fromRect.top  + fromRect.height / 2;

  if (rotate) {
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
    img.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  } else if (flip) {
    img.style.transform = `translate(-50%, -50%) scaleX(-1)`;
  }

  img.style.left = `${startX}px`;
  img.style.top  = `${startY}px`;

  requestAnimationFrame(() => requestAnimationFrame(() => {
    img.style.left = `${endX}px`;
    img.style.top  = `${endY}px`;
  }));

  setTimeout(() => img.remove(), 900);
}

function initAudio() {
  const sfxIds = ['sound-button', 'sound-hit', 'sound-arrow', 'sound-fireball',
                  'sound-sword', 'sound-wand', 'sound-chain', 'sound-heal',
                  'sound-holy', 'sound-lightning'];
  sfxIds.forEach(id => {
    const audio = document.getElementById(id);
    if (audio) {
      audio.volume = 0;
      audio.play().catch(() => {});
      audio.pause();
      audio.volume = getSFXVolume();
    }
  });
  // Prime all music tracks at their stored volume
  ['sound-menu', 'sound-menu2', 'sound-game', 'sound-game2'].forEach(id => {
    const audio = document.getElementById(id);
    if (audio) audio.volume = getMusicVolume();
  });
}

// ── MENU & MODAL ───────────────────────────────────────────
document.getElementById('menu-btn').addEventListener('click', toggleMenu);
document.getElementById('menu-rulebook').addEventListener('click', () => showModal('rulebook'));
document.getElementById('menu-terms').addEventListener('click', () => showModal('terms'));
document.getElementById('menu-creator').addEventListener('click', () => showModal('creator'));
document.getElementById('menu-settings').addEventListener('click', () => showModal('settings'));
document.getElementById('menu-credits').addEventListener('click', () => showModal('credits'));
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-backdrop').addEventListener('click', closeModal);

function toggleMenu() {
  const dropdown = document.getElementById('menu-dropdown');
  const btn = document.getElementById('menu-btn');
  dropdown.classList.toggle('active');
  btn.classList.toggle('active');
}

function showModal(section) {
  const modal   = document.getElementById('info-modal');
  const title   = document.getElementById('modal-title');
  const content = document.getElementById('modal-content');

  closeMenuDropdown();

  if (section === 'rulebook') {
    title.textContent = 'Rulebook';
    content.innerHTML = `
      <h3>How to Play</h3>

      <h4>Objective</h4>
      <p>Defeat all <strong>3 enemy cards</strong> before the AI defeats yours.</p>

      <hr>

      <h4>Building Your Team</h4>
      <p>Choose <strong>3 of the 9 available classes</strong>. Your first pick leads the battle.</p>
      <p>When you click a class, you are shown <strong>2 passive options</strong>. Pick one — your choice is locked for the entire match.</p>
      <p>The AI also picks 3 cards randomly and <strong>randomly chooses</strong> one of the two passives per card (50/50). Both teams and their chosen passives are revealed before battle starts.</p>

      <hr>

      <h4>Battle</h4>
      <p>Cards fight one-versus-one automatically. Turn order is decided by a coin flip (Assassin First Strike overrides this). Damage, HP, and passive effects persist throughout the match. HP does not reset between fights.</p>

      <hr>

      <h4>Choosing Your Next Fighter</h4>
      <p>When one of your cards is defeated, choose a reserve. The AI picks randomly. Your final card enters automatically.</p>

      <hr>

      <h3>Armor &amp; Damage Types</h3>

      <h4>Armor</h4>
      <p>Every card wears one of three armor types, shown as a small icon in the top-left of the card:</p>
      <ul>
        <li><strong>Mail (+20)</strong> — Heavy armor. Reduces incoming physical damage by 20 per hit.</li>
        <li><strong>Leather (+10)</strong> — Medium armor. Reduces incoming physical damage by 10 per hit.</li>
        <li><strong>Cloth (+0)</strong> — No armor. Takes full physical damage.</li>
      </ul>
      <p>Armor reduces <em>physical</em> damage only. It has no effect against magical attacks.</p>

      <h4>Damage Types</h4>
      <p><strong>Physical damage</strong> — reduced by the defender's armor value. Dealt by: Protector, Barbarian, Assassin (base attack), Marksman (base attack + Double Shot), Death Knight (base attack), Joker, Druid post-transform (base attack + Wolf Bite).</p>
      <p><strong>Magical damage</strong> — bypasses armor entirely. Dealt by: Cleric (all attacks), Mage (all attacks), Druid pre-transform (first attack only).</p>
      <p><strong>Mixed damage</strong> — some attacks from these classes split between physical and magical:</p>
      <ul>
        <li><strong>Assassin:</strong> base attack is physical; First Strike +30 bonus and ultimate +20 bonus are magical.</li>
        <li><strong>Death Knight:</strong> base attack is physical; Death Grip +20 bonus damage is magical.</li>
      </ul>

      <hr>

      <h3>Winning</h3>
      <p>Destroy all 3 enemy cards to win. If all your cards fall first, you lose.</p>

      <hr>
      
      <h3>Classes &amp; Passives</h3>
      <p>Every class has <strong>two passive options</strong>. Only the selected one is active.</p>

      <h4>Protector — 170 HP • 30 Damage • Mail Armor (+20)</h4>
      <p><strong>Option A — Fortify:</strong> Reduces all incoming damage by 33%.</p>
      <p><strong>Option B — Shield Block:</strong> Blocks all direct damage from the opponent's very first attack. Activates once per Protector life. After that first hit the shield is permanently consumed — it does not reactivate when fighting a new opponent. Secondary effects (burn, etc.) still apply normally.</p>
      <p><em>Ultimate (every 3 attacks):</em> Restores 20 HP to self. All living allies permanently gain +5 damage.</p>

      <hr>

      <h4>Barbarian — 130 HP • 40 Damage • Mail Armor (+20)</h4>
      <p><strong>Option A — Bloodthirst:</strong> Heals 15 HP after every attack.</p>
      <p><strong>Option B — Rage:</strong> For every 20 HP missing, deals +10% bonus damage (always calculated from base damage of 40). Dynamically updates as HP changes. Examples: 0–19 HP missing = +0%, 20–39 = +10%, 40–59 = +20%, 60–79 = +30%, 80–99 = +40%.</p>
      <p><em>Ultimate (every 2 attacks):</em> Next attack deals +10 extra damage and heals 10 HP — same effect for both Bloodthirst and Rage.</p>

      <hr>

      <h4>Cleric — 110 HP • 20 Damage • Cloth Armor (+0) • Magical Attacks</h4>
      <p><strong>Option A — Shielding:</strong> Each turn survived grants +20 HP shield to both benched allies. Shields persist between waves.</p>
      <p><strong>Option B — Nerfer:</strong> At the end of each turn the Cleric survives, randomly selects 1 living <em>benched</em> opponent card and permanently reduces its damage by 10. Never targets the active opponent. Never targets dead cards. If no benched targets exist, nothing happens. Minimum damage floor: 10. The same card can be targeted multiple times, and reductions stack.</p>
      <p><em>Ultimate:</em> Shielding (every 3 attacks) — doubles shield generation for the rest of its life. Nerfer (every 2 attacks) — heals itself for 20 HP.</p>

      <hr>

      <h4>Mage — 90 HP • 50 Damage • Cloth Armor (+0) • Magical Attacks</h4>
      <p><strong>Option A — Burn:</strong> Attacks apply a permanent Burn status (10 damage at the start of each of that enemy's turns). Once burning, the target stays burning for the rest of its life.</p>
      <p><strong>Option B — Thunderlord:</strong> Every time the Mage knocks out an opponent card (including via burn): (1) Heal 30 HP, (2) Permanently gain +20 damage, (3) Set a pending strike — when the opponent's next card enters battle it immediately takes 30 damage before normal combat begins. If that strike kills the new card, another Thunderlord kill triggers. The +20 stacks after each knockout.</p>
      <p><em>Ultimate (every 2 attacks):</em> Increases Burn damage by a flat 10 per turn (does not scale with Spellbook).</p>

      <hr>

      <h4>Assassin — 100 HP • 40 Damage • Leather Armor (+10) • Mixed Damage</h4>
      <p><strong>Option A — First Strike:</strong> Always attacks first when entering battle. First attack in any fight deals +30 magical bonus damage (bypasses armor).</p>
      <p><strong>Option B — Evasion (one-time only):</strong> After completing exactly 2 attacks, the Assassin automatically retreats to the bench, heals 50% of all HP lost at that moment, and permanently gains +20 damage. If another living ally exists, the player then selects who enters next (the Assassin cannot re-enter immediately). The AI randomly selects a different ally. If no other ally is alive, Evasion cannot activate and the Assassin stays in battle. Evasion can fire only once per match — the healing, retreat, and damage bonus are strictly one-time, and attack counters are never reset.</p>
      <p><em>Ultimate (every 2 attacks):</em> Next attack deals +20 extra magical damage (bypasses armor).</p>

      <hr>

      <h4>Marksman — 90 HP • 40 Damage • Leather Armor (+10)</h4>
      <p><strong>Option A — Steady Aim:</strong> Gains +20 damage permanently after every attack, growing stronger the longer it fights.</p>
      <p><strong>Option B — Double Shot:</strong> After every 2 attacks, deals 30 damage to 1 random living <em>benched</em> opponent. Never targets the active opponent or dead cards. If two valid targets exist, one is chosen randomly. If none exist, nothing happens. The 30 damage persists when that card later enters battle. Double Shot does not count as a normal attack and does not trigger itself.</p>
      <p><em>Ultimate (every 3 attacks):</em> Fires an additional attack immediately.</p>

      <hr>

      <h4>Death Knight — 150 HP • 40 Damage • Mail Armor (+20) • Mixed Damage</h4>
      <p><strong>Option A — Death Grip:</strong> After every 3 attacks, activates Death Grip. A random benched enemy card is forcibly pulled into the active position (the previous active card moves to the bench), and the Death Knight immediately performs a free attack against it with +20 magical bonus damage (bypasses armor). Combat then continues against the newly pulled card. If no benched targets exist, Death Grip fizzles.</p>
      <p><strong>Option B — Fear of the Dead:</strong> After every 3 attacks, the opponent is overwhelmed with fear and must skip their very next turn completely. If the Death Knight triggers fear again before the skip is used, the previous skip is overwritten (not stacked).</p>
      <p><em>Ultimate (every 2 attacks):</em> Heals exponentially — first trigger heals +10 HP, second +20 HP, third +40 HP, and so on (doubles each time). This healing stacks indefinitely.</p>

      <hr>

      <h4>Joker — 100 HP • 30 Damage • Cloth Armor (+0)</h4>
      <p>The Joker is a wildcard. Every single attack the Joker makes goes through a random outcome roll first: <strong>33% miss</strong> (deals 0 damage), <strong>33% normal</strong> (standard damage), or <strong>33% critical hit</strong> (all damage for that attack is doubled). The Joker has no traditional ultimate charge — the RNG is always active.</p>
      <p><strong>Option A — Luck of the Draw:</strong> Every other attack (attacks 1, 3, 5…), flip a coin. Heads gives +20 bonus damage that turn. Tails gives nothing. Crucially, if the RNG rolls a miss but the coin showed heads, the +20 bonus still gets through — a miss only cancels the base damage, not the Luck bonus.</p>
      <p><strong>Option B — The Ace:</strong> Only once, when the Joker first enters battle (whether as a starting fighter or a reserve), flip a coin. Heads grants the Joker +50 HP and +10 damage permanently for the rest of the match. Tails gives nothing. This flip is instant and happens before any combat.</p>
      <p><em>No traditional ultimate bar.</em> The RNG system replaces it — every attack is already a gamble.</p>

      <hr>

      <h4>Druid — 70 HP • 30 Damage (base form) • Leather Armor (+10) • Mixed Damage</h4>
      <p>The Druid starts fragile but transforms after its very first attack into a powerful new form based on the chosen passive. The transformation is permanent and the Druid keeps its current HP (adjusted by the stat bonus) for the rest of the match. The Druid's pre-transform first attack is magical (bypasses armor); all attacks after transformation deal physical damage.</p>
      <p><strong>Option A — Bear Form:</strong> After the first attack, the Druid transforms into a Bear: maximum HP becomes 150, attack damage becomes 50, and HP is immediately restored to full (150). On transformation the Bear also gains <strong>+15 armor</strong>. The Bear is a durable tank-style fighter. <em>Wave Mode only:</em> the first time the Bear's HP drops below 33% of maximum in a wave, it instantly heals 30% of its maximum HP — this surge can happen only once per wave.</p>
      <p><strong>Option B — Wolf Form:</strong> After the first attack, the Druid transforms into a Wolf: maximum HP increases by +50 (to 120), HP also increases by +50, and attack damage becomes 60. The Wolf also attacks twice every turn — the first attack deals full normal damage, while the second hit (Wolf Bite) always deals exactly 25 fixed physical damage (reduced by the defender's armor).</p>
      <p><em>Ultimate (once — first attack):</em> Triggers the transformation. After transforming, the Druid no longer has an ultimate bar.</p>

      <hr>

      <h4>Rider — 70 HP • 40 Damage • Mail Armor (+20)</h4>
      <p>The Rider starts every match mounted on a <strong>horse with 80 HP</strong>. While mounted, <em>all</em> incoming damage is fully absorbed by the horse — the Rider itself takes nothing and damage does not overflow. On dismount the Rider permanently gains <strong>+20 physical bonus damage per attack</strong> (stacks with each attack until remounted or reset).</p>
      <p><strong>Option A — Revival:</strong> After attacking twice while dismounted, the horse automatically revives with 40 HP and the Rider remounts. The anger bonus resets to 0. Revival is one-time only.</p>
      <p><strong>Option B — Parry:</strong> While dismounted, the Rider blocks every other incoming attack.</p>
      <p><em>No traditional ultimate bar.</em> The horse system is a permanent mechanic active for the entire match.</p>

      <hr>

      <h4>Necromancer — 200 HP • 20 Damage • Cloth Armor (+0) • Magical Attacks</h4>
      <p>The Necromancer is a high-risk powerhouse. Every turn it takes <strong>20 self-damage</strong>. To compensate, every 3rd turn it unleashes a <strong>Fire Storm</strong> that hits ALL living opponents for 30 magical damage (bypasses armor). Its own base attacks are also magical.</p>
      <p><strong>Option A — Sacrifice:</strong> A Ghoul grows in the background each turn (+30 max HP and +10 damage per turn; starts at 10 HP / 10 DMG). When the Necromancer dies, the Ghoul rises in its place as a physical attacker — effectively giving you a second life.</p>
      <p><strong>Option B — Reborn:</strong> Starting on the Necromancer's 3rd turn, it automatically revives one fallen ally at 50% HP and 50% damage. One-time only. The revived card is shown darkened to indicate its weakened state.</p>
      <p><em>No traditional ultimate bar.</em> Fire Storm and the passive both trigger automatically on a fixed schedule.</p>

      <hr>

      <h4>Shaman — 120 HP • 30 Damage • Leather Armor (+10) • Magical Attacks</h4>
      <p>The Shaman's attacks are purely magical (bypass armor). It begins every match with an active <strong>Lightning Shield</strong>: reduces all incoming physical damage by 10 and retaliates with 10 magical damage against any physical attacker (if the attacker is mounted on a horse, the horse absorbs the retaliation).</p>
      <p><strong>Option A — Chain Heal:</strong> Every 2 attacks, heals the Shaman and all living allies for 20 HP each.</p>
      <p><strong>Option B — Lava Blast:</strong> Every 3 attacks, fires a massive 60 magical blast. Any overkill damage automatically carries over to the next living opponent.</p>
      <p><em>No traditional ultimate bar.</em> Lightning Shield replaces it as an always-on passive.</p>

      <hr>

      <h3>🌊 Wave Mode</h3>
      <p>A 50-wave survival challenge. Pick 3 fighters, then face increasingly powerful enemy teams. HP and stats carry over between waves — choose wisely.</p>

      <h4>Structure</h4>
      <ul>
        <li><strong>Waves 1–10:</strong> Peons only (wave 10 introduces the first Knight).</li>
        <li><strong>Waves 11–20:</strong> Mix of Peons and Knights, shifting toward more Knights.</li>
        <li><strong>Waves 21–49:</strong> Mostly Knights with occasional Peon breather waves.</li>
        <li><strong>Wave 50:</strong> 🐉 Dragon boss — alone.</li>
      </ul>

      <h4>Starting Bonus</h4>
      <p>Before wave 1 begins you pick a free permanent upgrade for your team — same pool as the mid-run rewards. Use it to set your strategy from the start.</p>

      <h4>Between Waves</h4>
      <p>After each wave you choose which fighter leads the next one. <strong>Single click</strong> to select, then press <strong>Enter</strong> or click Fight — or <strong>double-click</strong> a card to select and start immediately. Dead fighters cannot be chosen.</p>

      <h4>Every 10 Waves — Upgrade &amp; Reset</h4>
      <p>Reaching waves 11, 21, 31, and 41 triggers a special event:</p>
      <ul>
        <li>All in-combat permanent bonuses are stripped (Thunderlord max HP gains, Ace HP, Mage burn stacks, Death Knight heal stacks, Cleric shield multiplier). Wave-upgrade bonuses are <em>not</em> stripped.</li>
        <li>Druid reverts to base form — it will transform again on its first attack of the new set.</li>
        <li>You choose one upgrade from three random options (common, rare, or legendary).</li>
        <li>All fighters are fully healed and revived.</li>
      </ul>

      <h4>Wave Upgrades</h4>
      <p>Upgrades are permanent buffs to your team that survive across all future waves and 10-wave resets. HP upgrades applied to a Druid are preserved even through form resets — and the transformation formulas automatically include them.</p>
      <ul>
        <li><strong>Common:</strong> +20 HP & +10 DMG (all), +40 HP (all), +20 DMG (all), +50 HP & +20 DMG (1 card), +90 HP (1 card), +40 DMG (1 card), +10 Armor & +10 Magic Resist (all), +25 Armor & +25 Magic Resist (1 card), +10% Damage Reduction (all), +20% Damage Reduction (1 card).</li>
        <li><strong>Rare:</strong> 🐉 Dragon Power (1 card — +40 DMG and +10 to all ability effects), ⚡ Always First — win the coin flip every wave.</li>
        <li><strong>Legendary:</strong> 🌟 +100 HP & +40 DMG to all cards.</li>
      </ul>

      <h4>Enemies &amp; Scaling</h4>
      <p>Enemies grow stronger every 10 waves (each completed set of 10):</p>
      <ul>
        <li><strong>Peon</strong> — 60 HP / 35 DMG / Leather Armor. <em>Double Strike:</em> attacks twice every other turn. Scales: +10 HP and +5 DMG per 10 waves.</li>
        <li><strong>Dart-Peon</strong> — 60 HP / 30 DMG / Leather Armor. Appears from wave 6 onward. <em>Poison Dart:</em> every attack inflicts Poison on the target — 10 magical damage per turn and −50% healing effectiveness. The poison clears when the affected card is benched or dies. Scales every other set: +15 HP and +5 DMG at sets 2 and 4.</li>
        <li><strong>Knight</strong> — 100 HP / 55 DMG / Mail Armor. <em>Iron Guard:</em> blocks the first direct attack from each new player fighter. Scales: +15 HP and +10 DMG per 10 waves.</li>
        <li><strong>Dragon</strong> — 1200 HP / 130 DMG / Mail Armor. Both its base attack and <em>Inferno</em> are fully magical (bypass armor). <em>Inferno:</em> every 3rd attack breathes fire on all living player cards for 50 magical damage and inflicts −50% healing and −10 magic resistance on the active target. Wave 50 only — does not scale.</li>
      </ul>

      <hr>

      <h4>Tips</h4>
      <ul>
        <li>Shield Block is powerful against burst damage classes like Mage or Assassin.</li>
        <li>Rage Barbarian becomes a monster at low HP — don't underestimate it.</li>
        <li>Nerfer quietly cripples high-damage reserve cards before they enter battle.</li>
        <li>Thunderlord Mage snowballs rapidly — it rewards aggressive play.</li>
        <li>Evasion Assassin is great for hit-and-run tactics, banking the +20 damage early.</li>
        <li>Double Shot Marksman pressures the entire enemy roster, not just the active card.</li>
        <li>Death Grip punishes teams that rely on keeping their strongest card on the bench.</li>
        <li>Fear of the Dead combos with the Death Knight's exponential healing — skip turns = more time to stack heals.</li>
        <li>Joker is high-risk, high-reward. Pair it with Luck of the Draw for clutch moments even on misses.</li>
        <li>Druid in Wolf Form deals 85 total damage per turn (60 + 25). Plan around the one-attack delay before transformation.</li>
        <li>Clerics become more valuable the longer they stay alive.</li>
      </ul>
      <p>Good luck, and may the best team win!</p>
    `;
  } else if (section === 'terms') {
    title.textContent = 'Terms & Conditions';
    content.innerHTML = `
      <p style="color:var(--muted);font-size:0.85em;">Last updated: July 29, 2026</p>

      <h3>1. Acceptance</h3>
      <p>By accessing or playing this game, you agree to these Terms &amp; Conditions. If you do not agree, please stop using the game.</p>

      <h3>2. About the Game</h3>
      <p>This game is an independent project developed by Xinesh as a portfolio and personal game development project.</p>
      <p>The game is provided free of charge and is intended for entertainment purposes.</p>

      <h3>3. No Warranty</h3>
      <p>This game is provided "as is" without any warranties or guarantees. While every effort has been made to create a stable experience, bugs, balancing issues, unexpected behavior, or temporary downtime may occur. The developer is not responsible for any inconvenience or loss resulting from the use of this game.</p>

      <h3>4. Gameplay</h3>
      <p>The rules and balance of the game may change over time. The developer may:</p>
      <ul>
        <li>Add or remove features.</li>
        <li>Change class abilities.</li>
        <li>Adjust game balance.</li>
        <li>Modify artwork or animations.</li>
        <li>Reset progress if persistent progression is added in the future.</li>
      </ul>

      <h3>5. Intellectual Property</h3>
      <p>Unless otherwise stated, all original game content is the property of the developer, including but not limited to: game design, original gameplay mechanics, artwork created specifically for the game, character designs, logos, user interface, written content, and sound effects.</p>
      <p>You may not copy, redistribute, sell, or commercially use any part of this project without permission.</p>

      <h3>6. Open Source</h3>
      <p>The source code may be publicly available through GitHub for educational and portfolio purposes. Viewing, learning from, or contributing to the code is encouraged where permitted by the project's license. Any assets not released under the project's license remain the intellectual property of their respective owner.</p>

      <h3>7. Fair Play</h3>
      <p>If online multiplayer is added in the future, players may not use cheats or modified clients, exploit unintended bugs, intentionally disrupt matches, or attempt to gain an unfair advantage through external software. The developer reserves the right to remove access to multiplayer features for repeated violations.</p>

      <h3>8. Privacy</h3>
      <p>The current version of the game does not intentionally collect personal information. If online accounts, cloud saves, analytics, or multiplayer services are added in the future, a separate Privacy Policy will explain what information is collected and how it is used.</p>

      <h3>9. Third-Party Services</h3>
      <p>Future versions of the game may use third-party services for hosting, multiplayer, analytics, or authentication. Those services may have their own terms and privacy policies.</p>

      <h3>10. Limitation of Liability</h3>
      <p>To the fullest extent permitted by law, the developer shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this game.</p>

      <h3>11. Changes to These Terms</h3>
      <p>These Terms &amp; Conditions may be updated at any time. Continued use of the game after changes have been published constitutes acceptance of the updated Terms.</p>

      <h3>12. Contact</h3>
      <p>Questions, suggestions, bug reports, or feedback are always welcome. Please contact the developer through the official GitHub repository or any official Xinesh communication channel.</p>

      <hr>
      <p style="color:var(--muted);text-align:center;">Thank you for playing and supporting the project. Have fun, and good luck in battle!</p>
    `;
  } else if (section === 'creator') {
    title.textContent = 'About the Creator';
    content.innerHTML = `
      <p>Hi, I'm <strong>Tony Jansen</strong>, the creator of this game and founder of <strong>Xinesh</strong>.</p>

      <p>I developed this project as part of my journey toward becoming a web developer. The game was built using HTML, CSS, and vanilla JavaScript, with a focus on creating clear game mechanics, responsive design, visual feedback, and an enjoyable user experience.</p>

      <p>What started as a small portfolio project gradually grew into a complete card-battle game with multiple classes, unique passives, ultimate abilities, strategic team selection, an AI opponent, animations, and custom artwork.</p>

      <p>A major part of the development process involved testing, balancing, fixing bugs, and improving the game based on how the different classes interact. I wanted each class to feel distinct and to have its own strengths, weaknesses, and role within a team.</p>

      <p>This project demonstrates my interest in both web development and game design. It also reflects how I like to work: building an idea step by step, experimenting with new features, solving technical problems, and continuing to improve the final result.</p>

      <p>The game may receive more updates in the future, including new classes, additional animations, improved AI, and possibly online multiplayer.</p>

      <hr>
      <p style="color:var(--muted);text-align:center;">Thank you for playing. Feedback, suggestions, and bug reports are always appreciated.</p>
    `;
  } else if (section === 'settings') {
    title.textContent = 'Settings';
    const musicVol = Math.round(getMusicVolume() * 100);
    const sfxVol   = Math.round(getSFXVolume()   * 100);
    content.innerHTML = `
      <div style="margin-top:20px;display:flex;flex-direction:column;gap:24px;">
        <label style="display:flex;flex-direction:column;gap:8px;">
          <span style="color:var(--text);font-weight:700;">🎵 Music Volume</span>
          <div style="display:flex;gap:12px;align-items:center;">
            <input type="range" id="music-slider" min="0" max="100" value="${musicVol}"
              style="flex:1;cursor:pointer;height:6px;" />
            <span id="music-display" style="color:var(--accent);font-weight:700;min-width:35px;">${musicVol}%</span>
          </div>
        </label>
        <label style="display:flex;flex-direction:column;gap:8px;">
          <span style="color:var(--text);font-weight:700;">🔊 Sound Effects</span>
          <div style="display:flex;gap:12px;align-items:center;">
            <input type="range" id="sfx-slider" min="0" max="100" value="${sfxVol}"
              style="flex:1;cursor:pointer;height:6px;" />
            <span id="sfx-display" style="color:var(--accent);font-weight:700;min-width:35px;">${sfxVol}%</span>
          </div>
        </label>
      </div>
    `;
    setTimeout(() => {
      const musicSlider = document.getElementById('music-slider');
      const musicDisplay = document.getElementById('music-display');
      if (musicSlider) {
        musicSlider.addEventListener('input', (e) => {
          setMusicVolume(parseInt(e.target.value) / 100);
          musicDisplay.textContent = e.target.value + '%';
        });
      }
      const sfxSlider = document.getElementById('sfx-slider');
      const sfxDisplay = document.getElementById('sfx-display');
      if (sfxSlider) {
        sfxSlider.addEventListener('input', (e) => {
          setSFXVolume(parseInt(e.target.value) / 100);
          sfxDisplay.textContent = e.target.value + '%';
        });
      }
    }, 0);
  } else if (section === 'credits') {
    title.textContent = 'Credits';
    content.innerHTML = `
      <h3>Sounds</h3>
      <p>Sound effects used in this game were sourced from Freesound.org.</p>
      <p>All sounds downloaded by the creator can be found here:<br>
        <a href="https://freesound.org/people/tonyjansen19/?downloaded_sounds=javascript%3Avoid%280%29%3B"
           target="_blank" rel="noopener noreferrer"
           style="color:var(--accent);word-break:break-all;">
          freesound.org — tonyjansen19 downloaded sounds
        </a>
      </p>
      <hr>
      <p style="color:var(--muted);text-align:center;">Thank you to the Freesound community for making these sounds available.</p>
    `;
  }

  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('info-modal').classList.remove('active');
}

function closeMenuDropdown() {
  const dropdown = document.getElementById('menu-dropdown');
  const btn = document.getElementById('menu-btn');
  dropdown.classList.remove('active');
  btn.classList.remove('active');
}

// ── WAVE MODE ─────────────────────────────────────────────

function resetKnightGuard() {
  if (state.aiActive && state.aiActive.passiveKey === 'knightblock') {
    state.aiActive.shieldBlockAvailable = true;
  }
}

// Clears per-combat flags so player fighters can reuse between waves.
// Persistent: hp, maxHp, damage, baseDamage, dead, transformed, wolfForm, aceFlipped,
//             isMounted, horseHp (horse doesn't auto-revive), lightningShieldActive.
function softResetFighter(fighter) {
  // Druid: if already transformed keep attackCount > 1 so pre-transform checks stay correct
  if ((fighter.passiveKey === 'bearform' || fighter.passiveKey === 'wolfform') && fighter.transformed) {
    fighter.attackCount = 2;
  } else {
    fighter.attackCount = 0;
  }
  fighter.ultimateCharge          = 0;
  fighter.ultimateReady           = false;
  fighter.burnAmount              = 0;
  fighter.attacksReceived         = 0;
  fighter.berserk                 = false;
  // shieldHp intentionally NOT cleared here so Cleric-granted shields on benched cards
  // persist into the next wave. shieldHpMax is also kept as the running-max across waves
  // (used by Barbarian Rage). Both are zeroed in hardResetFighter at 10-wave boundaries.
  fighter._magicBonus             = 0;
  fighter._jokerResult            = null;
  fighter.evasionAttackCount      = 0;
  fighter.evasionUsed             = false;   // resets each wave (new battle)
  fighter.doubleshotCount         = 0;
  fighter.deathGripCount          = 0;
  fighter.fearCount               = 0;
  fighter.deathGripBonus          = 0;
  fighter.lotdTurnCount           = 0;
  fighter.necroTurnCount          = 0;
  fighter.ghoulSpawned            = false;
  fighter.rebornUsed              = false;
  fighter.reborn                  = false;
  fighter.shamHealCount           = 0;
  fighter.shamLavaCount           = 0;
  fighter.thunderlordPendingStrike= false;
  fighter.dismountedAttacks       = 0;
  fighter.dismountBonus           = 0;
  fighter.horseReviveUsed         = false;
  if (fighter.passiveKey === 'parry')       fighter.parryToggle         = false;
  if (fighter.passiveKey === 'shieldblock') fighter.shieldBlockAvailable= true;
  // Reset shieldMultiplier so Cleric ultimate (which sets it to 2) doesn't stack
  // across waves — otherwise every 10-wave set doubles the shield output.
  fighter.shieldMultiplier   = 1;
  // Reset per-wave debuffs and one-shot passives
  fighter.healingReductionPct = 0;
  fighter.poisonDotAmount     = 0;    // poison clears when benched (wave ends)
  fighter.bearHealUsed        = false; // Bear Form surge resets each wave
}

function startWaveMode() {
  initAudio();
  resetState();
  state.waveMode = true;   // override the false set by resetState
  renderCardSelection();
  showScreen('selection');
}

function showWaveLobby() {
  const wave = state.currentWave;
  document.getElementById('wave-lobby-title').textContent   = `Wave ${wave} of 50`;
  document.getElementById('wave-lobby-subtitle').textContent =
    wave === 1 ? '⚔ Choose your starting fighter for this wave:' : `⚔ Choose who leads the charge for Wave ${wave}:`;

  // Heal/revive banner on waves 11, 21, 31, 41 (right after completing a 10-wave set)
  const isHealWave = wave > 1 && (wave - 1) % 10 === 0;
  const healBanner = document.getElementById('wave-heal-banner');
  healBanner.style.display = isHealWave ? 'block' : 'none';

  if (isHealWave) {
    state.playerPicks.forEach(f => { f.hp = f.maxHp; f.dead = false; });
  }

  state.waveSelectedActive = null;
  document.getElementById('btn-wave-fight').disabled = true;

  renderWaveLobbyTeam();
  showScreen('wavelobby');
}

function renderWaveLobbyTeam() {
  const container = document.getElementById('wave-lobby-team');
  container.innerHTML = '';
  state.playerPicks.forEach(fighter => {
    const card = buildCardEl(fighter, 'full');
    if (fighter.dead) {
      card.classList.add('dead');
    } else {
      card.addEventListener('click', () => selectWaveActive(fighter, card));
      // Double-click: select card and immediately start the wave
      card.addEventListener('dblclick', () => { selectWaveActive(fighter, card); startWave(); });
    }
    // Bag icon on lobby cards (even if dead, to inspect items)
    if (fighter.items && fighter.items.length > 0) {
      attachBagIcon(card, fighter);
    }
    container.appendChild(card);
  });
}

function selectWaveActive(fighter, cardEl) {
  if (fighter.dead) return;
  document.querySelectorAll('#wave-lobby-team .card').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  state.waveSelectedActive = fighter;
  document.getElementById('btn-wave-fight').disabled = false;
}

function startWave() {
  if (!state.waveSelectedActive) return;

  const waveIdx       = state.currentWave - 1;
  const composition   = WAVE_TABLE[waveIdx] || ['peon'];

  // Build fresh AI team from WAVE_TABLE
  state.aiPicks  = composition.map(type => buildWaveEnemy(type));
  state.aiActive = state.aiPicks[0];

  // Waves 10, 20, 30, 40: guarantee the last enemy carries a random loot drop
  if ([10, 20, 30, 40].includes(state.currentWave)) {
    const lastEnemy = state.aiPicks[state.aiPicks.length - 1];
    if (!lastEnemy.lootItem) lastEnemy.lootItem = rollLootItem();
  }

  // Soft-reset living player fighters and set the chosen active card
  state.playerPicks.forEach(f => { if (!f.dead) softResetFighter(f); });
  state.playerActive       = state.waveSelectedActive;
  state.waveSelectedActive = null;

  // Reset shared combat flags
  // Note: playerShield / aiShield (Cleric pool) intentionally NOT reset here —
  // the pool persists between waves so shielding built up carries forward.
  // It is only cleared at 10-wave hard-reset boundaries (endWave hard-reset block).
  state.playerSkipNextTurn = false;
  state.aiSkipNextTurn     = false;
  state.paused             = false;

  clearLog();
  showScreen('battle');
  renderBattleScreen();
  logEvent(`⚔ Wave ${state.currentWave} begins!`);
  checkBothReady();
}

// Called at every 10-wave boundary to strip in-combat permanent bonuses.
// Wave-upgrade bonuses (in baseDamage / upgraded maxHp) are preserved.
function hardResetFighter(fighter) {
  // Damage: strip all in-combat bonuses back to baseDamage (which already includes upgrade bonuses).
  // For Druid this resets any bonus damage gained during the transformed state — the correct
  // baseDamage already reflects wave upgrades, so the transform formula re-applies cleanly next cycle.
  fighter.damage = fighter.baseDamage;

  // Druid: revert to pre-transform (base) form so the transformation triggers fresh next cycle.
  if ((fighter.passiveKey === 'bearform' || fighter.passiveKey === 'wolfform') && fighter.transformed) {
    fighter.transformed       = false;
    fighter.wolfForm          = false;
    fighter.image             = fighter._origImage  || fighter.image;
    fighter.passive           = fighter._origPassive || fighter.passive;
    fighter.ultimateThreshold = 1;
    // Restore maxHp to base HP + upgrade bonuses only (strips Bear/Wolf form HP inflation)
    fighter.maxHp = fighter.baseHp + (fighter.upgradeMaxHp || 0);
    fighter.hp    = Math.min(fighter.hp, fighter.maxHp);
  }

  // Thunderlord maxHp bonus (+30 per kill): subtract and reset
  const tlBonus = fighter.thunderlordMaxHpBonus || 0;
  if (tlBonus > 0) {
    fighter.maxHp = Math.max(1, fighter.maxHp - tlBonus);
    fighter.hp    = Math.min(fighter.hp, fighter.maxHp);
    fighter.thunderlordMaxHpBonus = 0;
  }

  // Joker Ace maxHp bonus (+50 on heads): subtract so Ace can fire again next cycle
  const aceBonus = fighter.aceHpBonus || 0;
  if (aceBonus > 0) {
    fighter.maxHp = Math.max(1, fighter.maxHp - aceBonus);
    fighter.hp    = Math.min(fighter.hp, fighter.maxHp);
    fighter.aceHpBonus = 0;
  }
  fighter.aceFlipped = false;   // allow Ace to trigger again next cycle

  fighter.burnDamage       = 10;  // Mage: strips burn-damage-up stacks
  fighter.healStack        = 0;   // Death Knight: strips exponential heal stacks
  fighter.shieldMultiplier = 1;   // Cleric: strips doubled-shield stacks
  fighter.shieldHp         = 0;   // Cleric-granted shields: wiped at 10-wave boundary
  fighter.shieldHpMax      = 0;   // Barbarian Rage: clear consumed-shield history at boundary
  fighter.steadyAimBonus   = 0;  // Marksman Steady Aim: strips cross-wave accumulated bonus

  // Necromancer: reset ghoul spawn stats to base so the next ghoul starts fresh each set
  if (fighter.passiveKey === 'sacrifice' || fighter.passiveKey === 'reborn') {
    fighter.ghoulHp    = 10;
    fighter.ghoulHpMax = 10;
    fighter.ghoulDamage = 10;
  }

  // Rider: fully remount with a fresh horse at 10-wave boundary
  if (fighter.passiveKey === 'revival' || fighter.passiveKey === 'parry') {
    fighter.isMounted         = true;
    fighter.horseHp           = fighter.horseHpMax; // restore to full (80 HP)
    fighter.image             = 'Images/rider.png';
    fighter.dismountBonus     = 0;
    fighter.horseReviveUsed   = false;
  }
}

function endWave() {
  clearTimeout(state.battleTimeout);

  if (state.currentWave >= 50) {
    setTimeout(() => showScreen('wavevictory'), 700);
    return;
  }

  state.currentWave++;

  // Every 10th completed wave (entering 11, 21, 31, 41) → hard-reset combat bonuses,
  // show upgrade picker, then lobby (lobby applies the full heal/revive)
  if ((state.currentWave - 1) % 10 === 0) {
    // If any player card is a Ghoul (Necromancer placeholder), restore the Necromancer
    // so it revives at the 10-wave boundary with any items that were given to the Ghoul.
    state.playerPicks = state.playerPicks.map(f => {
      if (f.passiveKey === 'ghoul' && f._necromancer) return f._necromancer;
      return f;
    });
    if (state.playerActive && state.playerActive.passiveKey === 'ghoul' && state.playerActive._necromancer) {
      state.playerActive = state.playerActive._necromancer;
    }
    state.playerPicks.forEach(hardResetFighter);
    // Also wipe the Cleric shield pool and Rage shield history at the 10-wave boundary
    state.playerShield = 0;
    state.aiShield     = 0;
    setTimeout(showWaveUpgrade, 700);
  } else {
    setTimeout(showWaveLobby, 700);
  }
}

// Pick 3 weighted-random upgrades (no duplicates) and render the overlay.
function showWaveUpgrade() {
  const pool         = [...WAVE_UPGRADES];
  const picked       = [];
  let   totalWeight  = pool.reduce((s, u) => s + u.weight, 0);

  for (let i = 0; i < 3 && pool.length > 0; i++) {
    let rnd = Math.random() * totalWeight;
    let idx = 0;
    for (idx = 0; idx < pool.length - 1; idx++) {
      rnd -= pool[idx].weight;
      if (rnd <= 0) break;
    }
    const chosen = pool.splice(idx, 1)[0];
    totalWeight -= chosen.weight;
    picked.push(chosen);
  }

  const container = document.getElementById('wave-upgrade-options');
  container.innerHTML = '';
  const isStartBonus = state.currentWave === 1;
  document.getElementById('wave-upgrade-title').textContent = isStartBonus ? '🎁 Starting Bonus!' : '🎁 Set Complete!';
  // Death's Door note: show upcoming set's chance (currentWave / 10 gives next set index)
  const upcomingDdChance = !isStartBonus ? Math.min(0.10, Math.floor(state.currentWave / 10) * 0.025) : 0;
  const ddNote = upcomingDdChance > 0
    ? `<br><small style="color:var(--muted);font-size:0.8em">☠ Next set: enemies have a ${(upcomingDdChance * 100).toFixed(1)}% chance to survive at 1 HP (Death's Door)</small>`
    : '';
  document.getElementById('wave-upgrade-subtitle').innerHTML = isStartBonus
    ? 'Pick a permanent bonus before the run begins:'
    : `Choose a reward for your team:${ddNote}`;

  picked.forEach(upgrade => {
    const btn = document.createElement('button');
    btn.className = `wave-upgrade-btn rarity-${upgrade.rarity}`;
    btn.innerHTML = `<strong>${upgrade.title}</strong><span>${upgrade.desc}</span>`;

    if (upgrade.target === 'single') {
      btn.addEventListener('click', () => showSingleTargetPicker(upgrade));
    } else {
      btn.addEventListener('click', () => {
        applyUpgrade(upgrade, null);
        showWaveLobby();
      });
    }
    container.appendChild(btn);
  });

  showScreen('waveupgrade');
}

// Replace upgrade options with a card-picker for single-target upgrades.
function showSingleTargetPicker(upgrade) {
  const container = document.getElementById('wave-upgrade-options');
  container.innerHTML = '';
  document.getElementById('wave-upgrade-subtitle').textContent = 'Choose which card gets the upgrade:';

  state.playerPicks.forEach(fighter => {
    const btn = document.createElement('button');
    btn.className = 'wave-upgrade-btn rarity-common';
    const deadTag = fighter.dead ? ' <span style="color:var(--accent2)">(Dead)</span>' : '';
    btn.innerHTML = `<strong>${fighter.name}${deadTag}</strong><span>HP ${fighter.hp}/${fighter.maxHp} · DMG ${fighter.damage}</span>`;
    btn.addEventListener('click', () => {
      applyUpgrade(upgrade, fighter);
      showWaveLobby();
    });
    container.appendChild(btn);
  });
}

function applyUpgrade(upgrade, target) {
  // upgradeMaxHp tracks HP granted by upgrades so hardResetFighter can restore the correct
  // maxHp for transformed Druids (bear/wolf form HP is stripped; upgrade HP is preserved).
  switch (upgrade.id) {
    case 'all_hp_dmg':
      state.playerPicks.forEach(f => {
        f.maxHp += 20; f.hp = Math.min(f.hp + 20, f.maxHp);
        f.baseDamage += 10; f.damage += 10;
        f.upgradeMaxHp = (f.upgradeMaxHp || 0) + 20;
      });
      break;
    case 'all_hp':
      state.playerPicks.forEach(f => {
        f.maxHp += 40; f.hp = Math.min(f.hp + 40, f.maxHp);
        f.upgradeMaxHp = (f.upgradeMaxHp || 0) + 40;
      });
      break;
    case 'all_dmg':
      state.playerPicks.forEach(f => { f.baseDamage += 20; f.damage += 20; });
      break;
    case 'single_hp_dmg':
      if (target) {
        target.maxHp += 50; target.hp = Math.min(target.hp + 50, target.maxHp);
        target.baseDamage += 20; target.damage += 20;
        target.upgradeMaxHp = (target.upgradeMaxHp || 0) + 50;
      }
      break;
    case 'single_hp':
      if (target) {
        target.maxHp += 90; target.hp = Math.min(target.hp + 90, target.maxHp);
        target.upgradeMaxHp = (target.upgradeMaxHp || 0) + 90;
      }
      break;
    case 'single_dmg':
      if (target) { target.baseDamage += 40; target.damage += 40; }
      break;
    case 'all_armor_magic':
      state.playerPicks.forEach(f => {
        f.armorValue       = (f.armorValue       || 0) + 10;
        f.magicDmgReduction = (f.magicDmgReduction || 0) + 10;
      });
      break;
    case 'single_armor_magic':
      if (target) {
        target.armorValue       = (target.armorValue       || 0) + 25;
        target.magicDmgReduction = (target.magicDmgReduction || 0) + 25;
      }
      break;
    case 'all_dmg_reduction':
      state.playerPicks.forEach(f => {
        f.allDmgReductionPct = (f.allDmgReductionPct || 0) + 0.10;
      });
      break;
    case 'single_dmg_reduction':
      if (target) {
        target.allDmgReductionPct = (target.allDmgReductionPct || 0) + 0.20;
      }
      break;
    case 'single_dmg_ability':
      if (target) {
        target.baseDamage  += 40; target.damage += 40;
        target.spellbookBonus = (target.spellbookBonus || 0) + 10;
      }
      break;
    case 'first_flip':
      state.waveAlwaysFirstFlip = true;
      break;
    case 'all_big':
      state.playerPicks.forEach(f => {
        f.maxHp += 100; f.hp = Math.min(f.hp + 100, f.maxHp);
        f.baseDamage += 40; f.damage += 40;
        f.upgradeMaxHp = (f.upgradeMaxHp || 0) + 100;
      });
      break;
  }
}

// Dragon Inferno: hits ALL living opponents with a 30-damage magical fireball.
function triggerDragonFireball(dragon, dragonSide, callback) {
  const oppSide   = dragonSide === 'player' ? 'ai' : 'player';
  const oppPicks  = oppSide  === 'player' ? state.playerPicks  : state.aiPicks;
  const oppActive = oppSide  === 'player' ? state.playerActive : state.aiActive;
  const dragonEl  = document.getElementById(`${dragonSide}-fighter`);
  const targetEl  = document.getElementById(`${oppSide}-fighter`);
  const fireDmg   = 50;

  logEvent(`🔥 Inferno! ${dragon.name} breathes fire on all enemies!`);
  playSound('sound-fireball');
  animateProjectile('FireballAni.png', dragonEl, targetEl, { flip: dragonSide === 'ai' });

  setTimeout(() => {
    // Hit active opponent; then apply Inferno debuffs: -50% healing, -10 magic resist.
    if (oppActive && !oppActive.dead && oppActive.hp > 0) {
      const abs = Math.min(oppActive.shieldHp, fireDmg);
      oppActive.shieldHp -= abs;
      oppActive.hp = Math.max(0, oppActive.hp - (fireDmg - abs));
      addLog(`<span class="log-event">🔥 ${oppActive.name} takes ${fireDmg - abs} fire damage!${abs > 0 ? ` (🛡 ${abs} absorbed)` : ''} (${oppActive.hp} HP)</span>`);
      // Inferno debuffs on the active target (not bench)
      oppActive.healingReductionPct = Math.min(1, (oppActive.healingReductionPct || 0) + 0.50);
      const prevMagicRes = oppActive.magicDmgReduction || 0;
      oppActive.magicDmgReduction = Math.max(0, prevMagicRes - 10);
      addLog(`<span class="log-event">🔥 Inferno scorches ${oppActive.name}! -50% healing, -10 magic resist for this wave!</span>`);
    }

    // Hit living reserves
    oppPicks.forEach(f => {
      if (f.dead || f === oppActive || f.hp <= 0) return;
      const el = document.querySelector(`#${oppSide}-reserves [data-fighter-id="${f.id}"]`);
      if (el) animateProjectile('FireballAni.png', dragonEl, el, { flip: dragonSide === 'ai' });
      const abs = Math.min(f.shieldHp, fireDmg);
      f.shieldHp -= abs;
      f.hp = Math.max(0, f.hp - (fireDmg - abs));
      addLog(`<span class="log-event">🔥 ${f.name} takes ${fireDmg - abs} fire damage!${abs > 0 ? ` (🛡 ${abs} absorbed)` : ''} (${f.hp} HP)</span>`);
      if (f.hp <= 0) { f.dead = true; logEvent(`💀 ${f.name} was incinerated!`); }
    });

    renderBattleScreen();

    // Check if active opponent was killed by the fireball
    if (oppActive && !oppActive.dead && oppActive.hp <= 0) {
      oppActive.dead = true;
      logEvent(`💀 ${oppActive.name} was incinerated by Dragon's Inferno!`);
      animateDeath(oppSide, () => {
        if (oppSide === 'player') {
          const next = chooseNextPlayerCard();
          if (!next) endGame(false);
        } else {
          chooseNextAICard();
        }
      });
      return;
    }

    callback();
  }, 420);
}

// ── Volume management ─────────────────────────────────────

function getSFXVolume() {
  const stored = localStorage.getItem('gameVolume');
  return stored !== null ? parseFloat(stored) : 1;
}
function setSFXVolume(vol) {
  vol = Math.max(0, Math.min(1, vol));
  localStorage.setItem('gameVolume', vol);
  applyVolumeToAllSounds(vol);
}
function applyVolumeToAllSounds(vol) {
  const sfxIds = ['sound-button', 'sound-hit', 'sound-arrow', 'sound-fireball',
                  'sound-sword', 'sound-wand', 'sound-chain', 'sound-heal',
                  'sound-holy', 'sound-lightning'];
  sfxIds.forEach(id => {
    const audio = document.getElementById(id);
    if (audio) audio.volume = vol;
  });
}

function getMusicVolume() {
  const stored = localStorage.getItem('musicVolume');
  return stored !== null ? parseFloat(stored) : 0.5;
}
function setMusicVolume(vol) {
  vol = Math.max(0, Math.min(1, vol));
  localStorage.setItem('musicVolume', vol);
  applyMusicVolume(vol);
}
function applyMusicVolume(vol) {
  ['sound-menu', 'sound-menu2', 'sound-game', 'sound-game2'].forEach(id => {
    const audio = document.getElementById(id);
    if (audio) audio.volume = vol;
  });
}

// ── Random music switching ─────────────────────────────────
// Randomly picks A or B track for each context (menu/game).
// After 2–4 loops it switches to the other track.
const _musicCtx = { kind: null, which: null, loopCount: 0, targetLoops: 0 };
let _musicVer   = 0; // incremented each play call; stale 'ended' handlers ignore mismatches

function _musicTrackId(kind, which) {
  return which === 'A' ? `sound-${kind}` : `sound-${kind}2`;
}

function _startMusicTrack(kind, which) {
  // Pause all music tracks
  ['sound-menu', 'sound-menu2', 'sound-game', 'sound-game2'].forEach(id => {
    const a = document.getElementById(id);
    if (a) { a.pause(); a.currentTime = 0; }
  });

  _musicCtx.kind        = kind;
  _musicCtx.which       = which;
  _musicCtx.loopCount   = 0;
  _musicCtx.targetLoops = 2 + Math.floor(Math.random() * 3); // 2, 3, or 4 loops

  const ver   = ++_musicVer;
  const id    = _musicTrackId(kind, which);
  const audio = document.getElementById(id);
  if (!audio) return;

  function onEnded() {
    if (_musicVer !== ver) return; // superseded by a newer play call
    _musicCtx.loopCount++;
    if (_musicCtx.loopCount >= _musicCtx.targetLoops) {
      // Switch to the other variant
      _startMusicTrack(_musicCtx.kind, _musicCtx.which === 'A' ? 'B' : 'A');
    } else {
      // Replay the same track
      audio.addEventListener('ended', onEnded, { once: true });
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }

  audio.addEventListener('ended', onEnded, { once: true });
  audio.volume = getMusicVolume();
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function playMenuMusic() {
  if (_musicCtx.kind === 'menu') return; // already playing menu music
  _startMusicTrack('menu', Math.random() < 0.5 ? 'A' : 'B');
}
function playBattleMusic() {
  if (_musicCtx.kind === 'game') return; // already playing game music
  _startMusicTrack('game', Math.random() < 0.5 ? 'A' : 'B');
}
function stopAllMusic() {
  ++_musicVer; // invalidate any pending 'ended' handlers
  ['sound-menu', 'sound-menu2', 'sound-game', 'sound-game2'].forEach(id => {
    const audio = document.getElementById(id);
    if (audio) { audio.pause(); audio.currentTime = 0; }
  });
  _musicCtx.kind = null;
}

// Button click sound — fires for every button press
document.addEventListener('click', (e) => {
  if (e.target.closest('button')) playSound('sound-button');
});

window.addEventListener('load', () => {
  applyVolumeToAllSounds(getSFXVolume());
  applyMusicVolume(getMusicVolume());
});
