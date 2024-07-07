"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateLocalizationData = GenerateLocalizationData;
function GenerateLocalizationData() {
    // This section can be safely ignored, as it is only logic.
    //#region Localization logic
    // Arrays
    var Abilities = new Array();
    var Modifiers = new Array();
    var StandardTooltips = new Array();
    // Create object of arrays
    var localization_info = {
        AbilityArray: Abilities,
        ModifierArray: Modifiers,
        StandardArray: StandardTooltips,
    };
    //#endregion
    Abilities.push({
        ability_classname: "modifiable_ability",
        name: "Modifiable Ability",
        description: "The values of this ability can be changed by the UI."
    });
    //#region Relentless
    Abilities.push({
        ability_classname: "troll_berserker_relentless",
        name: "Relentless",
        description: "The lower the Troll Berserker's health is, the higher his status and magic resistance.",
        ability_specials: [
            {
                ability_special: "health_for_max_bonus",
                text: "HEALTH FOR MAX BONUS:",
                percentage: true,
            },
            {
                ability_special: "max_status_resistance",
                text: "MAX STATUS RESISTANCE:",
                percentage: true,
            },
            {
                ability_special: "max_magic_resistance",
                text: "MAX MAGIC RESISTANCE:",
                percentage: true,
            },
        ],
    });
    //#endregion
    //#region Rallying Cry
    Abilities.push({
        ability_classname: "troll_berserker_rallying_cry",
        name: "Rallying Cry",
        description: "The Troll Berserker belts out an inspiring cry, gaining damage and armor for every enemy unit nearby. Allies within range receive a portion of the bonus.",
        lore: "Things are looking bad, but his enthusiasm is infectious!",
        scepter_description: "Increases status resistance for the duration. Enemies within range now have their stats decreased by the same amount that allies have theirs increased. Increases duration.",
        shard_description: "Now increases max health and movement speed for the duration. Reduces cooldown by {bonus_AbilityCooldown}.",
        ability_specials: [
            {
                ability_special: "radius",
                text: "RADIUS:"
            },
            {
                ability_special: "damage_per_unit",
                text: "DAMAGE PER UNIT:"
            },
            {
                ability_special: "armor_per_unit",
                text: "ARMOR PER UNIT:"
            },
            {
                ability_special: "talent_attack_speed_per_unit",
                text: "ATTACK SPEED PER UNIT:"
            },
            {
                ability_special: "allied_effect",
                text: "ALLIED EFFECT:",
                percentage: true
            },
            {
                ability_special: "shard_max_health_per_unit",
                text: "MAX HEALTH PER UNIT:"
            },
            {
                ability_special: "shard_movespeed_per_unit",
                text: "MOVEMENT SPEED PER UNIT:",
                percentage: true
            },
            {
                ability_special: "scepter_status_resistance",
                text: "STATUS RESISTANCE:",
                percentage: true
            },
            {
                ability_special: "scepter_enemy_effect",
                text: "ENEMY EFFECT:",
                percentage: true
            },
            {
                ability_special: "duration",
                text: "DURATION:"
            },
            {
                ability_special: "facet_stun_duration",
                text: "STUN DURATION:"
            },
            {
                ability_special: "facet_rallying_cry_verbal_assault",
                text: "Rallying Cry now stuns nearby enemies when cast, but has a weaker effect on allies."
            },
        ]
    });
    Abilities.push({ ability_classname: "special_bonus_unique_rallying_cry_talent_10", name: "+{s:bonus_allied_effect}% Allied Effect" });
    Abilities.push({ ability_classname: "special_bonus_unique_rallying_cry_talent_15", name: "+{s:bonus_damage_per_unit} Damage Per Unit" });
    Abilities.push({ ability_classname: "special_bonus_unique_rallying_cry_talent_20", name: "+{s:bonus_talent_attack_speed_per_unit} Attack Speed Per Unit" });
    Abilities.push({ ability_classname: "special_bonus_unique_rallying_cry_talent_25", name: "Strong Dispel Self", description: "Can be cast while disabled." });
    Modifiers.push({
        modifier_classname: "modifier_troll_berserker_rallying_cry_ally",
        name: "Rallied!",
        description: "You've heard the Troll Berserker's cry!"
    });
    Modifiers.push({
        modifier_classname: "modifier_troll_berserker_rallying_cry_enemy",
        name: "Harried!",
        description: "You've heard the Troll Berserker's cry!"
    });
    StandardTooltips.push({
        classname: "DOTA_Tooltip_facet_rallying_cry_verbal_assault",
        name: "Verbal Assault"
    });
    StandardTooltips.push({
        classname: "DOTA_Tooltip_facet_rallying_cry_verbal_assault_Description",
        name: "Rallying Cry now stuns nearby enemies when cast, but has a weaker effect on allies."
    });
    //#endregion
    //#region Spiked Shield
    Abilities.push({
        ability_classname: "troll_berserker_spiked_shield",
        name: "Spiked Shield",
        description: "When attacked, the Troll Berserker has a chance to retaliate, blocking some of the damage and dealing a counter attack. Chance increases the more enemies there are nearby, up to a cap. Can only counter attack targets within the radius.",
        lore: "Block with bark, strike with bite...",
        scepter_description: "Can now be activated, disabling the damage block and counter attacks. While active, all of the Troll Berserker's attacks will be followed by an increased damage counter attack, following the counter attack cooldown.",
        shard_description: "Increases the Damage Block and Counter Attack Damage while affected by Rallying Cry. Reduces the counter attack cooldown.",
        ability_specials: [
            {
                ability_special: "radius",
                text: "RADIUS:"
            },
            {
                ability_special: "base_block_chance",
                text: "BASE BLOCK CHANCE:",
                percentage: true
            },
            {
                ability_special: "block_chance_per_unit",
                text: "BLOCK CHANCE PER UNIT:",
                percentage: true
            },
            {
                ability_special: "maximum_block_chance",
                text: "MAX BLOCK CHANCE:",
                percentage: true
            },
            {
                ability_special: "damage_block",
                text: "DAMAGE BLOCK:"
            },
            {
                ability_special: "counter_attack_damage",
                text: "COUNTER ATTACK DAMAGE:",
                percentage: true
            },
            {
                ability_special: "counter_attack_cooldown",
                text: "COUNTER ATTACK COOLDOWN:"
            },
            {
                ability_special: "counter_attack_cooldown",
                text: "COUNTER ATTACK COOLDOWN:"
            },
            {
                ability_special: "shard_rallying_cry_multiplier",
                text: "RALLYING CRY MULTIPLIER:"
            },
            {
                ability_special: "scepter_active_counter_attack_damage",
                text: "ACTIVE COUNTER ATTACK:",
                percentage: true
            },
            {
                ability_special: "facet_spiked_shield_courserhide_shield",
                text: "Can now block all types of damage, but chance is reduced."
            },
        ],
    });
    Abilities.push({ ability_classname: "special_bonus_unique_spiked_shield_talent_10", name: "+{s:bonus_block_chance_per_unit}% Block Chance Per Unit" });
    Abilities.push({ ability_classname: "special_bonus_unique_spiked_shield_talent_15", name: "+{s:bonus_damage_block} Damage Block" });
    Abilities.push({ ability_classname: "special_bonus_unique_spiked_shield_talent_20", name: "+{s:bonus_counter_attack_damage}% Counter Attack Damage" });
    Abilities.push({ ability_classname: "special_bonus_unique_spiked_shield_talent_25", name: "Counter Attack Uses Modifiers" });
    Modifiers.push({
        modifier_classname: "modifier_troll_berserker_spiked_shield",
        name: "Block Chance",
        description: "Your percent chance for Spiked Shield to proc."
    });
    Modifiers.push({
        modifier_classname: "modifier_troll_berserker_spiked_shield_scepter",
        name: "Spiked Shield",
        description: "Your attacks are followed by another attack, but passive damage block and counter attacks are disabled."
    });
    StandardTooltips.push({
        classname: "DOTA_Tooltip_facet_spiked_shield_courserhide_shield",
        name: "Courserhide Shield"
    });
    StandardTooltips.push({
        classname: "DOTA_Tooltip_facet_spiked_shield_courserhide_shield_Description",
        name: "Spiked Shield can now block all types of damage, but chance is reduced."
    });
    //#endregion
    //#region Brutal Strike
    Abilities.push({
        ability_classname: "troll_berserker_brutal_strike",
        name: "Brutal Strike",
        description: "The Troll Berserker has a chance to critically strike, dealing additional damage and forcing the enemy to fight back. The same unit cannot be taunted again for some time.",
        lore: "A well-placed strike can incite even the most stalwart of opponents.",
        scepter_description: "Increases status resistance for the duration. Enemies within range now have their stats decreased by the same amount that allies have theirs increased. Increases duration.",
        shard_description: "Now increases max health and movement speed for the duration. Reduces cooldown by {bonus_AbilityCooldown}.",
        ability_specials: [
            {
                ability_special: "crit_chance",
                text: "CRITICAL CHANCE:",
                percentage: true,
            },
            {
                ability_special: "crit_damage",
                text: "CRITICAL DAMAGE:",
                percentage: true,
            },
            {
                ability_special: "taunt_duration",
                text: "TAUNT DURATION:",
            },
            {
                ability_special: "taunt_cooldown",
                text: "TAUNT COOLDOWN:",
            },
            {
                ability_special: "shard_crit_damage_per_stack",
                text: "CRITICAL DAMAGE PER STACK:",
                percentage: true,
            },
            {
                ability_special: "shard_max_stacks",
                text: "MAX STACKS:",
            },
            {
                ability_special: "shard_stack_duration",
                text: "STACK DURATION:",
            },
            {
                ability_special: "shard_stack_duration",
                text: "STACK DURATION:",
            },
            {
                ability_special: "facet_brutal_strike_calculated_brutality",
                text: "Brutal Strike is now cooldown based instead of chance based. Critical damage is improved, and instead of taunting it now stuns."
            },
        ],
    });
    Abilities.push({ ability_classname: "special_bonus_unique_brutal_strike_talent_10", name: "+{s:bonus_taunt_duration}s Taunt Duration" });
    Abilities.push({ ability_classname: "special_bonus_unique_brutal_strike_talent_15", name: "+{s:bonus_crit_chance}% Critical Chance" });
    Abilities.push({ ability_classname: "special_bonus_unique_brutal_strike_talent_20", name: "+{s:bonus_crit_damage}% Critical Damage" });
    Abilities.push({ ability_classname: "special_bonus_unique_brutal_strike_talent_25", name: "-{s:bonus_taunt_cooldown}s Taunt Cooldown" });
    Modifiers.push({
        modifier_classname: "modifier_troll_berserker_brutal_strike_cc",
        name: "Brutal Strike",
        description: "You are taunted or stunned!"
    });
    Modifiers.push({
        modifier_classname: "modifier_troll_berserker_brutal_strike_cc_cooldown",
        name: "Brutal Strike Cooldown",
        description: "You can't be taunted or stunned by the Troll Berserker."
    });
    Modifiers.push({
        modifier_classname: "modifier_troll_berserker_brutal_strike_shard_stacks",
        name: "Brutal Strike Stacks",
        description: "Every stack increases the damage of the Troll Berserker's critical strikes."
    });
    StandardTooltips.push({
        classname: "DOTA_Tooltip_facet_brutal_strike_calculated_brutality",
        name: "Calculated Brutality"
    });
    StandardTooltips.push({
        classname: "DOTA_Tooltip_facet_brutal_strike_calculated_brutality_Description",
        name: "Brutal Strike is now cooldown based instead of chance based. Critical damage is improved, and instead of taunting it now stuns."
    });
    //#endregion
    StandardTooltips.push({
        classname: "npc_dota_hero_alchemist",
        name: "Troll Berserker"
    });
    return localization_info;
}
