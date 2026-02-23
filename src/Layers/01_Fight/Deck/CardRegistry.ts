import { PlayingCard, CardEffects } from '../../../types/card';
import { PlayerCreature } from '../../../types/creature';
import { getSlotEffectTotal } from '../resolveSlotEffects';

export interface CardTemplate {
  id: string;
  title: string;
  type: string;
  manaCost: number;
  value: number;
  description: string;
  effect: CardEffects;
}

type CardTemplateDef = Omit<CardTemplate, 'id'>;

// Auto-stamps `id` from the Record key — no need to repeat it in each entry.
function buildTemplates(defs: Record<string, CardTemplateDef>): Record<string, CardTemplate> {
  return Object.fromEntries(
    Object.entries(defs).map(([id, def]) => [id, { ...def, id }])
  );
}

const cardTemplates = buildTemplates({
  // ── Cricket ──
  'cricket-slash':      { title: 'Cricket Slash',  type: 'Attack',   manaCost: 1, value: 1, description: 'A quick slash. Deal 3 damage.',                         effect: { damage: 3 } },
  'cricket-chirp':      { title: 'Chirp',           type: 'Skill',    manaCost: 1, value: 0, description: 'Gain 4 block.',                                          effect: { addBlock: 4 } },
  'cricket-leap':       { title: 'Leap Strike',     type: 'Attack',   manaCost: 2, value: 2, description: 'Jump at an enemy. Deal 5 damage.',                       effect: { damage: 5 } },
  'cricket-summon-wall':{ title: 'Summon Wall',     type: 'Summon',   manaCost: 1, value: 0, description: 'Place a Stone Wall (8 HP) on an ally cell.',             effect: { summon: 'stone_wall' } },

  // ── Sun Spirit ──
  'sun-flare':          { title: 'Solar Flare',     type: 'Spell',    manaCost: 2, value: 3, description: 'A burst of solar energy. Deal 4 damage.',                effect: { damage: 4 } },
  'sun-heal':           { title: 'Sunlight',        type: 'Spell',    manaCost: 1, value: 2, description: 'Warm healing light. Heal 3 HP.',                         effect: { heal: 3 } },
  'sun-radiance':       { title: 'Radiance',        type: 'Spell',    manaCost: 3, value: 4, description: 'Blinding radiance. Deal 2 damage to all enemies.',       effect: { damage: 2 } },

  // ── Shared ──
  'mana-crystal':       { title: 'Mana Crystal',    type: 'Artifact', manaCost: 0, value: 1, description: 'A small crystal that pulses with energy. Gain 1 mana.',  effect: { addMana: 1 } },
  'guard':              { title: 'Guard',            type: 'Skill',    manaCost: 1, value: 1, description: 'Brace for impact. Gain 5 block.',                        effect: { addBlock: 5 } },

  // ── Beetle ──
  'beetle-bash':        { title: 'Beetle Bash',     type: 'Attack',   manaCost: 1, value: 3, description: 'A heavy headbutt. Deal 3 damage.',                       effect: { damage: 3 } },
  'beetle-shell':       { title: 'Shell Guard',     type: 'Skill',    manaCost: 1, value: 7, description: 'Retreat into shell. Gain 7 block.',                      effect: { addBlock: 7 } },
  'beetle-ram':         { title: 'Beetle Ram',      type: 'Attack',   manaCost: 2, value: 4, description: 'Charge an enemy. Deal 4 damage and push right 1.',       effect: { damage: 4, pushDirection: 'right', pushDistance: 1 } },

  // ── Moth ──
  'moth-scales':        { title: 'Healing Scales',  type: 'Spell',    manaCost: 1, value: 2, description: 'Scatter healing dust. Heal 2 HP.',                       effect: { heal: 2 } },
  'moth-gust':          { title: 'Gust',            type: 'Spell',    manaCost: 1, value: 0, description: 'A powerful gust pushes the target right 2.',             effect: { pushDirection: 'right', pushDistance: 2 } },
  'moth-veil':          { title: 'Dust Veil',       type: 'Skill',    manaCost: 1, value: 4, description: 'Surround an ally in dust. Gain 4 block.',                effect: { addBlock: 4 } },

  // ── Firefly ──
  'firefly-spark':      { title: 'Spark',           type: 'Attack',   manaCost: 1, value: 4, description: 'A focused spark. Deal 4 damage.',                        effect: { damage: 4 } },
  'firefly-flash':      { title: 'Flash',           type: 'Spell',    manaCost: 2, value: 2, description: 'A blinding flash. Deal 2 AOE damage in a square.',       effect: { aoeDamage: 2, aoeShape: 'square-1' } },
  'firefly-bolt':       { title: 'Light Bolt',      type: 'Spell',    manaCost: 1, value: 5, description: 'Fire a bolt down the row. Deal 5 line damage.',          effect: { lineDamage: 5 } },

  // ── Toad ──
  'toad-spit':          { title: 'Acid Spit',       type: 'Attack',   manaCost: 1, value: 3, description: 'Spit acid at an enemy. Deal 3 damage.',                  effect: { damage: 3 } },
  'toad-splash':        { title: 'Splash',          type: 'Spell',    manaCost: 2, value: 2, description: 'Splash acid in an area. Deal 2 AOE damage.',             effect: { aoeDamage: 2, aoeShape: '1' } },
  'toad-croak':         { title: 'Croak',           type: 'Skill',    manaCost: 1, value: 3, description: 'A defensive croak. Gain 3 block.',                       effect: { addBlock: 3 } },
  'toad-tongue':        { title: 'Tongue Lash',     type: 'Attack',   manaCost: 2, value: 6, description: 'Lash out with tongue. Deal 6 damage.',                   effect: { damage: 6 } },

  // ── Mantis ──
  'mantis-strike':      { title: 'Mantis Strike',   type: 'Attack',   manaCost: 1, value: 5, description: 'A precise strike. Deal 5 damage.',                      effect: { damage: 5 } },
  'mantis-slice':       { title: 'Slice',           type: 'Attack',   manaCost: 1, value: 4, description: 'A quick slice. Deal 4 damage.',                          effect: { damage: 4 } },
  'mantis-ambush':      { title: 'Ambush',          type: 'Attack',   manaCost: 3, value: 9, description: 'A devastating ambush. Deal 9 damage.',                   effect: { damage: 9 } },

  // ── Spider ──
  'spider-bite':        { title: 'Spider Bite',     type: 'Attack',   manaCost: 1, value: 3, description: 'A venomous bite. Deal 3 damage.',                        effect: { damage: 3 } },
  'spider-web':         { title: 'Web Shot',        type: 'Spell',    manaCost: 1, value: 0, description: 'Shoot a web that yanks the target left 2.',              effect: { pushDirection: 'left', pushDistance: 2 } },
  'spider-trap':        { title: 'Web Trap',        type: 'Spell',    manaCost: 2, value: 3, description: 'Lay a sticky trap. Deal 3 AOE damage in a line.',        effect: { aoeDamage: 3, aoeShape: 'line-h-1' } },
  'spider-spike-snare': { title: 'Spike Snare',     type: 'Summon',   manaCost: 2, value: 0, description: 'Place a Spike Trap (3 HP) in enemy territory.',         effect: { summon: 'spike_trap' } },

  // ── Dragonfly ──
  'dragonfly-dart':     { title: 'Dart',            type: 'Attack',   manaCost: 0, value: 2, description: 'A quick dart. Deal 2 damage.',                           effect: { damage: 2 } },
  'dragonfly-dive':     { title: 'Dive',            type: 'Attack',   manaCost: 1, value: 4, description: 'Dive at an enemy. Deal 4 damage.',                       effect: { damage: 4 } },
  'dragonfly-swoop':    { title: 'Swoop',           type: 'Spell',    manaCost: 2, value: 6, description: 'Swoop across the row. Deal 6 line damage.',              effect: { lineDamage: 6 } },
  'dragonfly-zip':      { title: 'Zip',             type: 'Skill',    manaCost: 1, value: 3, description: 'Zip away quickly. Gain 3 block.',                        effect: { addBlock: 3 } },

  // ── Snail ──
  'snail-slam':         { title: 'Shell Slam',      type: 'Attack',   manaCost: 2, value: 4, description: 'Slam with the shell. Deal 4 damage.',                    effect: { damage: 4 } },
  'snail-shell':        { title: 'Iron Shell',      type: 'Skill',    manaCost: 1, value: 8, description: 'An impenetrable defense. Gain 8 block.',                 effect: { addBlock: 8 } },
  'snail-slide':        { title: 'Slime Slide',     type: 'Spell',    manaCost: 2, value: 0, description: 'Slide into the target, pushing them left 3.',            effect: { pushDirection: 'left', pushDistance: 3 } },

  // ── Scarab ──
  'scarab-summon-wisp': { title: 'Conjure Wisp',   type: 'Summon',   manaCost: 1, value: 0, description: 'Summon a Spirit Wisp (3 HP) on an ally cell.',           effect: { summon: 'spirit_wisp' } },
  'scarab-summon-wall': { title: 'Raise Barrier',  type: 'Summon',   manaCost: 1, value: 0, description: 'Place a Stone Wall (8 HP) on an ally cell.',             effect: { summon: 'stone_wall' } },
  'scarab-scratch':     { title: 'Scarab Scratch', type: 'Attack',   manaCost: 1, value: 2, description: 'A quick scratch. Deal 2 damage.',                         effect: { damage: 2 } },
  'scarab-shell':       { title: 'Scarab Shell',   type: 'Skill',    manaCost: 1, value: 4, description: 'Retreat into shell. Gain 4 block.',                       effect: { addBlock: 4 } },

  // ── Phoenix ──
  'phoenix-immolate':   { title: 'Immolate',        type: 'Spell',    manaCost: 2, value: 3, description: 'Erupt in flame. Deal 3 damage to all enemies.',          effect: { aoeDamage: 3, aoeShape: '1' } },
  'phoenix-rebirth':    { title: 'Rebirth',         type: 'Spell',    manaCost: 3, value: 5, description: 'Channel life force. Heal an ally for 5 HP.',             effect: { heal: 5 } },
  'phoenix-ember':      { title: 'Ember',           type: 'Attack',   manaCost: 1, value: 4, description: 'Hurl a burning ember. Deal 4 damage.',                   effect: { damage: 4 } },
  'phoenix-ash-veil':   { title: 'Ash Veil',        type: 'Skill',    manaCost: 1, value: 5, description: 'Surround yourself in ash. Gain 5 block.',                effect: { addBlock: 5 } },

  // ── Scorpion ──
  'scorpion-sting':     { title: 'Venom Sting',     type: 'Attack',   manaCost: 2, value: 6,  description: 'A powerful sting. Deal 6 damage.',                     effect: { damage: 6 } },
  'scorpion-pincer':    { title: 'Pincer Crush',    type: 'Attack',   manaCost: 1, value: 3,  description: 'Crush with pincers. Deal 3 damage.',                    effect: { damage: 3 } },
  'scorpion-carapace':  { title: 'Carapace',        type: 'Skill',    manaCost: 1, value: 6,  description: 'Harden your exoskeleton. Gain 6 block.',               effect: { addBlock: 6 } },
  'scorpion-burrow':    { title: 'Burrow',          type: 'Skill',    manaCost: 2, value: 10, description: 'Dig underground for cover. Gain 10 block.',             effect: { addBlock: 10 } },

  // ── Centipede ──
  'centipede-flurry':   { title: 'Leg Flurry',      type: 'Attack',   manaCost: 1, value: 2, description: 'A rapid barrage of legs. Deal 2 damage.',                effect: { damage: 2 } },
  'centipede-bite':     { title: 'Venomous Bite',   type: 'Attack',   manaCost: 2, value: 5, description: 'Sink fangs into the target. Deal 5 damage.',             effect: { damage: 5 } },
  'centipede-coil':     { title: 'Coil',            type: 'Skill',    manaCost: 1, value: 4, description: 'Coil up defensively. Gain 4 block.',                     effect: { addBlock: 4 } },

  // ── Gold Weevil ──
  'weevil-gilt-slam':   { title: 'Gilt Slam',       type: 'Attack',   manaCost: 2, value: 5, description: 'Slam with a golden shell. Deal 5 damage.',               effect: { damage: 5 } },
  'weevil-gold-shell':  { title: 'Gold Shell',      type: 'Skill',    manaCost: 1, value: 7, description: 'Coat yourself in solid gold. Gain 7 block.',             effect: { addBlock: 7 } },
  'weevil-mint':        { title: 'Mint',            type: 'Skill',    manaCost: 0, value: 3, description: 'Produce a small golden shard. Gain 3 block.',            effect: { addBlock: 3 } },

  // ── Wraith Moth ──
  'wraith-drain':       { title: 'Soul Drain',      type: 'Spell',    manaCost: 2, value: 4, description: 'Drain life essence. Deal 4 damage and heal 2 HP.',       effect: { damage: 4, heal: 2 } },
  'wraith-haunt':       { title: 'Haunt',           type: 'Spell',    manaCost: 1, value: 3, description: 'A chilling presence. Deal 3 damage.',                    effect: { damage: 3 } },
  'wraith-shroud':      { title: 'Spectral Shroud', type: 'Skill',    manaCost: 1, value: 4, description: 'Wrap yourself in shadows. Gain 4 block.',                effect: { addBlock: 4 } },
});

// Instantiate a full PlayingCard[] from a creature's card ID list
export function getCardsForCreature(creature: PlayerCreature): PlayingCard[] {
  const instanceCounts: Record<string, number> = {};
  const costReduction = getSlotEffectTotal(creature, 'card_cost_reduction');
  return creature.cards
    .map(cardId => {
      const template = cardTemplates[cardId];
      if (!template) {
        console.warn(`Card template not found: ${cardId}`);
        return null;
      }
      // Track instance count so duplicate cards get unique IDs
      const count = (instanceCounts[cardId] ?? 0) + 1;
      instanceCounts[cardId] = count;
      return {
        ...template,
        id: `${creature.id}-${template.id}-${count}`,
        creatureId: creature.id,
        manaCost: Math.max(0, template.manaCost - costReduction),
        discard: false,
      } as PlayingCard;
    })
    .filter((c): c is PlayingCard => c !== null);
}

export { cardTemplates };
