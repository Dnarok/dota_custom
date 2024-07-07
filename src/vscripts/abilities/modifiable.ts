import { registerAbility, BaseAbility, BaseModifier, registerModifier } from "../lib/dota_ts_adapter";


@registerAbility()
export class modifiable_ability extends BaseAbility
{
    data ?: ModifiableAbilityData;
    cast_error : string = "";

    CheckNettables()
    {
        const data = CustomNetTables.GetTableValue("modifiable_ability_data", "data");
        if (data == undefined)
        {
            return;
        }
        
        this.data = {
            player_id : data.player_id,
            ability_behavior : data.ability_behavior,
            cast_behavior : data.cast_behavior,
            unit_target_types : data.unit_target_types,
            unit_target_teams : data.unit_target_teams,
            unit_target_flags : data.unit_target_flags,
            cast_animation : data.cast_animation,
            cast_range : data.cast_range,
            cast_point : data.cast_point,
            backswing : data.backswing,
            ability_texture : data.ability_texture,
            hidden : data.hidden == 1,
            ability_name : data.ability_name,
            damage : data.damage,
            damage_type : data.damage_type,
            manacost : data.manacost,
            healthcost : data.healthcost,
            goldcost : data.goldcost,
            cooldown : data.cooldown,
            // modifiers : toArray(new_data.modifiers),
        };

        if (IsServer())
        {
            this.MarkAbilityButtonDirty();
        }
    }

    GetCooldown(_ : number) : number 
    {
        if (this.data == undefined)
        {
            return 0;
        }
        else
        {
            return this.data.cooldown;
        }
    }

    GetIntrinsicModifierName() 
    {
        return modifiable_ability_listener.name;
    }

    IsHidden() : boolean
    {
        if (this.data == undefined)
        {
            return false;
        }
        else
        {
            return this.data.hidden;
        }
    }

    // GetAbilityName() : string
    // {
    //     if (this.data == undefined)
    //     {
    //         return "";
    //     }
    //     else
    //     {
    //         return this.data.ability_name;
    //     }
    // }

    CastFilterResult() : UnitFilterResult 
    {
        if (this.data == undefined)
        {
            this.cast_error = "Define the ability first!";
            return UnitFilterResult.FAIL_OTHER;
        }
        else if ((this.data.ability_behavior & AbilityBehavior.NO_TARGET) != AbilityBehavior.NO_TARGET)
        {
            return UnitFilterResult.FAIL_OTHER;
        }
        else
        {
            return UnitFilterResult.SUCCESS;
        }
    }

    CastFilterResultLocation(_ : Vector) : UnitFilterResult 
    {
        if (this.data == undefined)
        {
            this.cast_error = "Define the ability first!";
            return UnitFilterResult.FAIL_OTHER;
        }
        else if ((this.data.ability_behavior & AbilityBehavior.POINT) != AbilityBehavior.POINT)
        {
            return UnitFilterResult.FAIL_INVALID_LOCATION;
        }
        else
        {
            return UnitFilterResult.SUCCESS;
        }
    }

    CastFilterResultTarget(target : CDOTA_BaseNPC) : UnitFilterResult 
    {
        if (this.data == undefined)
        {
            this.cast_error = "Define the ability first!";
            return UnitFilterResult.FAIL_OTHER;
        }
        else if ((this.data.ability_behavior & AbilityBehavior.UNIT_TARGET) != AbilityBehavior.UNIT_TARGET)
        {
            return UnitFilterResult.FAIL_INVALID_LOCATION;
        }
        else
        {
            // teams
            let target_team = target.GetTeamNumber();
            if (target_team == this.GetCaster().GetTeamNumber() && ((this.data.unit_target_teams & UnitTargetTeam.FRIENDLY) != UnitTargetTeam.FRIENDLY))
            {
                return UnitFilterResult.FAIL_FRIENDLY;
            }
            else if (target_team != this.GetCaster().GetTeamNumber() && ((this.data.unit_target_teams & UnitTargetTeam.ENEMY) != UnitTargetTeam.ENEMY))
            {
                return UnitFilterResult.FAIL_ENEMY;
            }

            // types
            if (target.IsHero() && (this.data.unit_target_types & UnitTargetType.HERO) != UnitTargetType.HERO)
            {
                return UnitFilterResult.FAIL_HERO;
            }
            else if (target.IsCreep() && (this.data.unit_target_types & UnitTargetType.CREEP) != UnitTargetType.CREEP)
            {
                return UnitFilterResult.FAIL_CREEP;
            }
            else if (target.IsBuilding() && (this.data.unit_target_types & UnitTargetType.BUILDING) != UnitTargetType.BUILDING)
            {
                return UnitFilterResult.FAIL_BUILDING;
            }

            // flags
            if (target.IsInvulnerable() && (this.data.unit_target_flags & UnitTargetFlags.INVULNERABLE) != UnitTargetFlags.INVULNERABLE)
            {
                return UnitFilterResult.FAIL_INVULNERABLE;
            }
            else if (target.IsMagicImmune())
            {
                if (target_team != this.GetCaster().GetTeamNumber() && (this.data.unit_target_flags & UnitTargetFlags.MAGIC_IMMUNE_ENEMIES) != UnitTargetFlags.MAGIC_IMMUNE_ENEMIES)
                {
                    return UnitFilterResult.FAIL_MAGIC_IMMUNE_ENEMY;
                }
                else if ((this.data.unit_target_flags & UnitTargetFlags.NOT_MAGIC_IMMUNE_ALLIES) == UnitTargetFlags.NOT_MAGIC_IMMUNE_ALLIES)
                {
                    return UnitFilterResult.FAIL_MAGIC_IMMUNE_ALLY;
                }
            }

            return UnitFilterResult.SUCCESS;
        }
    }

    GetCustomCastError() : string 
    {
        return this.cast_error;
    }

    // "AbilityUnitTargetTeam"         "DOTA_UNIT_TARGET_TEAM_ENEMY"
    // "AbilityUnitTargetType"         "DOTA_UNIT_TARGET_HERO"

    GetAbilityTargetFlags() : UnitTargetFlags 
    {
        print("GetAbilityTargetFlags called.");
        if (this.data == undefined)
        {
            return UnitTargetFlags.NONE;
        }
        else
        {
            return this.data.unit_target_flags;
        }
    }

    GetCastRange() : number
    {
        if (this.data == undefined)
        {
            return 0;
        }
        else
        {
            return this.data.cast_range;
        }
    }

    GetCastPoint() : number
    {
        if (this.data == undefined)
        {
            return 0;
        }
        else
        {
            return this.data.cast_point;
        }
    }

    GetBackswingTime() : number 
    {
        if (this.data == undefined)
        {
            return 0;
        }
        else
        {
            return this.data.backswing;
        }
    }

    GetBehavior() : AbilityBehavior | Uint64
    {
        if (this.data == undefined)
        {
            return AbilityBehavior.NO_TARGET;
        }
        else
        {
            return this.data.ability_behavior;
        }
    }

    GetCastAnimation() : GameActivity 
    {
        if (this.data == undefined)
        {
            return GameActivity.RESET;
        }
        else
        {
            return this.data.cast_animation;
        }
    }

    GetAbilityDamage() : number 
    {
        if (this.data == undefined)
        {
            return 0;
        }
        else
        {
            return this.data.damage;
        }
    }

    GetManaCost(level : number) : number 
    {
        if (this.data == undefined)
        {
            return 0;
        }
        else
        {
            return this.data.manacost;
        }
    }

    GetHealthCost(level : number) : number 
    {
        if (this.data == undefined)
        {
            return 0;
        }
        else
        {
            return this.data.healthcost;
        }
    }

    GetGoldCost(level: number) : number 
    {
        if (this.data == undefined)
        {
            return 0;
        }
        else
        {
            return this.data.goldcost;
        }
    }

    GetAbilityDamageType() : DamageTypes 
    {
        if (this.data == undefined)
        {
            return 0;
        }
        else
        {
            return this.data.damage_type;
        }
    }

    GetAbilityTextureName() : string 
    {
        if (this.data == undefined)
        {
            return "";
        }
        else
        {
            return this.data.ability_texture;
        }
    }

    GetCastBehavior() : CastBehavior
    {
        if (this.data == undefined)
        {
            return CastBehavior.INSTANT;
        }
        else
        {
            return this.data.cast_behavior;
        }
    }

    OnSpellStart() : void 
    {
        if (this.data == undefined)
        {
            return;
        }

        switch (this.data.ability_behavior)
        {
            case AbilityBehavior.UNIT_TARGET:
            {
                
            }
        }
    }

    HandleInstantCastBehavior() : void
    {
        
    }
}

@registerModifier()
export class modifiable_ability_listener extends BaseModifier
{
    IsHidden() { return true; };
    OnCreated() { this.StartIntervalThink(0.2); };
    OnIntervalThink() { (this.GetAbility() as modifiable_ability).CheckNettables(); };
}

@registerModifier()
export class modifiable_modifier extends BaseModifier
{
    data ?: ModifiableModifierData;

    
}