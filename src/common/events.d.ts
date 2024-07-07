/**
 * This file contains types for the events you want to send between the UI (Panorama)
 * and the server (VScripts).
 * 
 * IMPORTANT: 
 * 
 * The dota engine will change the type of event data slightly when it is sent, so on the
 * Panorama side your event handlers will have to handle NetworkedData<EventType>, changes are:
 *   - Booleans are turned to 0 | 1
 *   - Arrays are automatically translated to objects when sending them as event. You have
 *     to change them back into arrays yourself! See 'toArray()' in src/panorama/hud.ts
 */

// To declare an event for use, add it to this table with the type of its data
interface CustomGameEventDeclarations {
    example_event: ExampleEventData,
    ability_modified_event : ModifiableAbilityData,
}

// Define the type of data sent by the example_event event
interface ExampleEventData {
    myNumber: number;
    myBoolean: boolean;
    myString: string;
    myArrayOfNumbers: number[]
}

declare enum CastBehavior
{
    INSTANT,
    PROJECTILE,
}

interface ModifiableModifierData
{
    hidden : boolean,
    debuff : boolean,
    purgable : boolean,
}

interface ModifiableAbilityData 
{
    player_id : PlayerID,

    ability_behavior : AbilityBehavior,
    cast_behavior : CastBehavior,
    unit_target_types : UnitTargetType,
    unit_target_teams : UnitTargetTeam,
    unit_target_flags : UnitTargetFlags,
    cast_animation : GameActivity,
    cast_range : number,
    cast_point : number,
    backswing : number,
    ability_texture : string,
    hidden : boolean,
    ability_name : string,

    damage : number,
    damage_type : DamageTypes,
    manacost : number,
    healthcost : number,
    goldcost : number,
    cooldown : number,

    // modifiers : ModifiableModifierData[],
}