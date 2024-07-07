import { registerAbility, BaseAbility, BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";
import { modifier_generic_attack_bonus_pct } from "../../../modifiers/modifier_generic_attack_bonus_pct";
import { modifier_troll_berserker_rallying_cry_ally } from "./rallying_cry";

@registerAbility()
export class troll_berserker_spiked_shield extends BaseAbility
{
    static scepter_modifier_particle : string = "particles/items2_fx/mask_of_madness.vpcf";

	GetBehavior() : AbilityBehavior | Uint64 
	{
		const caster = this.GetCaster();
		if (caster.HasScepter())
		{
			return AbilityBehavior.NO_TARGET | AbilityBehavior.IMMEDIATE;
		}
		else
		{
			return AbilityBehavior.PASSIVE;
		}
	}

    GetCastRange(_1 : Vector, _2 : CDOTA_BaseNPC | undefined) : number 
    {
        return this.GetSpecialValueFor("radius");
    }

    IsPassive()
    {
        return !this.GetCaster().HasScepter();
    }

    GetIntrinsicModifierName() : string 
    {
        return modifier_troll_berserker_spiked_shield.name;
    }

    OnSpellStart() : void 
    {
        const caster = this.GetCaster();
        caster.AddNewModifier(caster, this, modifier_troll_berserker_spiked_shield_scepter.name, { duration : this.GetSpecialValueFor("scepter_duration") });
        EmitSoundOn("DOTA_Item.MaskOfMadness.Activate", caster);
        return;
    }
}

@registerModifier()
export class modifier_troll_berserker_spiked_shield extends BaseModifier
{
    base_block_chance               : number = 0;
    block_chance_per_unit           : number = 0;
    maximum_block_chance            : number = 0;
    damage_block                    : number = 0;
    counter_attack_damage           : number = 0;
    counter_attack_cooldown         : number = 0;
    radius                          : number = 0;
    last_time_hit                   : number = 0;
    shard_rallying_cry_multiplier   : number = 0;
    talent_use_modifiers            : boolean = false;
    facet_block_all_damage_types    : boolean = false;

    OnCreated()
    {
        this.OnRefresh();
        this.StartIntervalThink(0.2);
    }

    OnRefresh()
    {
        const ability = this.GetAbility() as troll_berserker_spiked_shield;
        this.base_block_chance              = ability.GetSpecialValueFor("base_block_chance");
        this.block_chance_per_unit          = ability.GetSpecialValueFor("block_chance_per_unit");
        this.maximum_block_chance           = ability.GetSpecialValueFor("maximum_block_chance");
        this.damage_block                   = ability.GetSpecialValueFor("damage_block");
        this.counter_attack_damage          = ability.GetSpecialValueFor("counter_attack_damage");
        this.counter_attack_cooldown        = ability.GetSpecialValueFor("counter_attack_cooldown");
        this.radius                         = ability.GetSpecialValueFor("radius");
        this.shard_rallying_cry_multiplier  = ability.GetSpecialValueFor("shard_rallying_cry_multiplier");
        this.talent_use_modifiers           = ability.GetSpecialValueFor("talent_counter_attack_procs_modifiers") == 1;
        this.facet_block_all_damage_types   = ability.GetSpecialValueFor("facet_block_all_damage_types") == 1;
    }

    OnIntervalThink() : void 
    {
        if (!IsServer())
        {
            return;
        }

        if (this.shard_rallying_cry_multiplier == 0)
        {
            const ability = this.GetAbility() as troll_berserker_spiked_shield;
            this.shard_rallying_cry_multiplier  = ability.GetSpecialValueFor("shard_rallying_cry_multiplier");
        }

        this.SetStackCount(this.GetBlockChance());
    }

    DeclareFunctions(): ModifierFunction[] 
    {
        return [
            ModifierFunction.INCOMING_DAMAGE_CONSTANT,
        ];
    }

    GetBlockChance() : number
    {
        const parent = this.GetParent();
		const units = FindUnitsInRadius(parent.GetTeam(), parent.GetAbsOrigin(), undefined, this.radius, UnitTargetTeam.ENEMY, UnitTargetType.HERO | UnitTargetType.CREEP, UnitTargetFlags.NONE, FindOrder.ANY, false);

        let block_chance = this.base_block_chance;
        block_chance += this.block_chance_per_unit * units.length;
        if (block_chance > this.maximum_block_chance)
        {
            block_chance = this.maximum_block_chance;
        }

        return block_chance;
    }

    GetModifierIncomingDamageConstant(event : ModifierAttackEvent) : number 
    {
        if (!IsServer())
        {
            return 0;
        }
        else if (!this.facet_block_all_damage_types)
        {
            if (event.damage_category != DamageCategory.ATTACK)
            {
                return 0;
            }
        }
        
        print("Incoming Damage: ", IsServer(), " ", event.damage_category);
        const parent = this.GetParent();
        if (parent.HasModifier(modifier_troll_berserker_spiked_shield_scepter.name))
        {
            return 0;
        }

        return this.TryBlock(event);
    }

    TryBlock(event : ModifierAttackEvent) : number
    {
        if (this.base_block_chance == 0)
        {
            return 0;
        }
        else if ((event.damage_flags & DamageFlag.BYPASSES_BLOCK) == DamageFlag.BYPASSES_BLOCK)
        {
            return 0;
        }
        else if ((event.damage_flags & DamageFlag.HPLOSS) == DamageFlag.HPLOSS)
        {
            return 0;
        }
        
        const parent = this.GetParent();
        const block_chance = this.GetBlockChance();
        let blocked = RollPseudoRandomPercentage(block_chance, (this.GetAbility() as troll_berserker_spiked_shield).entindex() + 1, parent);
        if (blocked)
        {
            if (GameRules.GetGameTime() > this.last_time_hit + this.counter_attack_cooldown)
            {
                this.TryCounterAttack(event);
            }

            let final_damage_block = this.damage_block;
            if (this.shard_rallying_cry_multiplier != 0 && parent.HasModifier(modifier_troll_berserker_rallying_cry_ally.name))
            {
                final_damage_block *= this.shard_rallying_cry_multiplier
            }
            SendOverheadEventMessage(undefined, OverheadAlert.BLOCK, parent, final_damage_block, undefined);
            return this.damage_block;
        }
        else
        {
            return 0;
        }
    }

    TryCounterAttack(event : ModifierAttackEvent) : void 
    {
        const parent = this.GetParent();
        const attacker = event.attacker;

        if (!attacker.IsAlive())
        {
            print(attacker.GetUnitName());
            return;
        }
        
        if (attacker.GetAbsOrigin().__sub(parent.GetAbsOrigin()).Length2D() > this.radius)
        {
            return;
        }

        this.last_time_hit = GameRules.GetGameTime();
        
        let final_counter_attack_damage = this.counter_attack_damage;
        if (this.shard_rallying_cry_multiplier != 0 && parent.HasModifier(modifier_troll_berserker_rallying_cry_ally.name))
        {
            final_counter_attack_damage *= this.shard_rallying_cry_multiplier
        }
        parent.AddNewModifier(parent, undefined, modifier_generic_attack_bonus_pct.name, { damage : final_counter_attack_damage });
        parent.PerformAttack(attacker, this.talent_use_modifiers, this.talent_use_modifiers, true, false, false, false, false);
        parent.RemoveModifierByName(modifier_generic_attack_bonus_pct.name);
    }
}

@registerModifier()
export class modifier_troll_berserker_spiked_shield_scepter extends BaseModifier
{
    scepter_active_counter_attack_damage : number = 0;
    talent_counter_attack_procs_modifiers : boolean = false;
    counter_attack_cooldown : number = 0;
    last_time_hit : number = 0;
    shard_rallying_cry_multiplier : number = 0;

    GetEffectName()
    {
        return troll_berserker_spiked_shield.scepter_modifier_particle;
    }

    OnCreated()
    {
        if (!IsServer())
        {
            return;
        }

        this.OnRefresh();
        this.StartIntervalThink(1.0);
    }

    OnRefresh()
    {
        const ability = this.GetAbility() as troll_berserker_spiked_shield;
        this.scepter_active_counter_attack_damage = ability.GetSpecialValueFor("scepter_active_counter_attack_damage");
        this.talent_counter_attack_procs_modifiers = ability.GetSpecialValueFor("talent_counter_attack_procs_modifiers") == 1;
        this.counter_attack_cooldown = ability.GetSpecialValueFor("counter_attack_cooldown");
    }

    OnIntervalThink() : void 
    {
        const ability = this.GetAbility() as troll_berserker_spiked_shield;
        this.shard_rallying_cry_multiplier  = ability.GetSpecialValueFor("shard_rallying_cry_multiplier");

        if (this.shard_rallying_cry_multiplier != 0)
        {
            this.StartIntervalThink(-1);
        }
    }

    DeclareFunctions(): ModifierFunction[] 
    {
        return [
            ModifierFunction.ON_ATTACK_LANDED
        ];
    }

    OnAttackLanded(event: ModifierAttackEvent) : void 
    {
        const parent = this.GetParent();

        if (event.damage_category != DamageCategory.ATTACK)
        {
            return;
        }
        else if (event.attacker != parent)
        {
            return;
        }

        if (GameRules.GetGameTime() > this.last_time_hit + this.counter_attack_cooldown)
        {
            this.TryExtraAttack(event);
        }
    }
    
    TryExtraAttack(event : ModifierAttackEvent) : void 
    {
        const parent = this.GetParent();
        const target = event.target;

        if (!target.IsAlive())
        {
            return;
        }
        
        this.last_time_hit = GameRules.GetGameTime();
        
        let final_scepter_active_counter_attack_damage = this.scepter_active_counter_attack_damage;
        if (this.shard_rallying_cry_multiplier != 0 && parent.HasModifier(modifier_troll_berserker_rallying_cry_ally.name))
        {
            final_scepter_active_counter_attack_damage *= this.shard_rallying_cry_multiplier
        }

        parent.AddNewModifier(parent, undefined, modifier_generic_attack_bonus_pct.name, { damage : final_scepter_active_counter_attack_damage });
        parent.PerformAttack(target, this.talent_counter_attack_procs_modifiers, this.talent_counter_attack_procs_modifiers, true, false, false, false, false);
        parent.RemoveModifierByName(modifier_generic_attack_bonus_pct.name);
    }
}