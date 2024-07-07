import { registerAbility, BaseAbility, BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";

@registerAbility()
export class troll_berserker_brutal_strike extends BaseAbility
{
    IsPassive()
    {
        return true;
    }

    GetIntrinsicModifierName()
    {
        return modifier_troll_berserker_brutal_strike.name;
    }
}

@registerModifier()
export class modifier_troll_berserker_brutal_strike extends BaseModifier
{
    IsHidden() { return true; }

    crit_chance : number = 0;
    crit_damage : number = 0;
    taunt_duration : number = 0;
    taunt_cooldown : number = 0;
    shard_crit_damage_per_stack : number = 0;
    shard_max_stacks : number = 0;
    shard_stack_duration : number = 0;
    facet_crit_uses_cooldown : boolean = false;
    facet_does_stun_instead : boolean = false;

    try_cc : boolean = false;

    OnCreated()
    {
        this.OnRefresh();
        this.StartIntervalThink(1.0);
    }

    OnIntervalThink()
    {
        const ability = this.GetAbility() as troll_berserker_brutal_strike;
        this.shard_crit_damage_per_stack = ability.GetSpecialValueFor("shard_crit_damage_per_stack");
        this.shard_max_stacks = ability.GetSpecialValueFor("shard_max_stacks");
        this.shard_stack_duration = ability.GetSpecialValueFor("shard_stack_duration");

        // can't lose shard... right?
        if (this.shard_crit_damage_per_stack != 0 && 
            this.shard_max_stacks != 0 && 
            this.shard_stack_duration != 0)
        {
            this.StartIntervalThink(-1);
        }
    }

    OnRefresh() 
    {
        const ability = this.GetAbility() as troll_berserker_brutal_strike;
        this.crit_chance = ability.GetSpecialValueFor("crit_chance");
        this.crit_damage = ability.GetSpecialValueFor("crit_damage");
        this.taunt_duration = ability.GetSpecialValueFor("taunt_duration");
        this.taunt_cooldown = ability.GetSpecialValueFor("taunt_cooldown");
        this.shard_crit_damage_per_stack = ability.GetSpecialValueFor("shard_crit_damage_per_stack");
        this.shard_max_stacks = ability.GetSpecialValueFor("shard_max_stacks");
        this.shard_stack_duration = ability.GetSpecialValueFor("shard_stack_duration");
        this.facet_crit_uses_cooldown = ability.GetSpecialValueFor("facet_crit_uses_cooldown") == 1;
        this.facet_does_stun_instead = ability.GetSpecialValueFor("facet_does_stun_instead") == 1;
    }

    DeclareFunctions()
    {
        return [
            ModifierFunction.PREATTACK_CRITICALSTRIKE,
            ModifierFunction.ON_ATTACK_LANDED,
        ];
    }

    GetModifierPreAttack_CriticalStrike(event : ModifierAttackEvent)
    {
        const parent = this.GetParent();
        const ability = this.GetAbility() as troll_berserker_brutal_strike;

        if (this.facet_crit_uses_cooldown)
        {
            if (!ability.IsCooldownReady())
            {
                return 100;
            }
        }
        else
        {
            let crit = RollPseudoRandomPercentage(this.crit_chance, ability.entindex() + 1, parent);
            if (!crit)
            {
                return 100;
            }
        }

        const target = event.target;
        this.try_cc = true;

        let shard_bonus = 0;
        if (this.shard_max_stacks != 0)
        {
            if (!target.HasModifier(modifier_troll_berserker_brutal_strike_shard_stacks.name))
            {
                target.AddNewModifier(parent, ability, modifier_troll_berserker_brutal_strike_shard_stacks.name, { duration : this.shard_stack_duration });
            }

            const stacks = target.FindModifierByName(modifier_troll_berserker_brutal_strike_shard_stacks.name) as modifier_troll_berserker_brutal_strike_shard_stacks;
            if (stacks.GetStackCount() < this.shard_max_stacks)
            {
                stacks.IncrementStackCount();
            }
            stacks.SetDuration(this.shard_stack_duration, true);

            shard_bonus += stacks.GetStackCount() * this.shard_crit_damage_per_stack;
        }

        return this.crit_damage + shard_bonus;
    }

    OnAttackLanded(event : ModifierAttackEvent)
    {
        const parent = this.GetParent();
        if (this.try_cc && event.attacker == parent)
        {
            this.try_cc = false;

            const target = event.target;
            const ability = this.GetAbility() as troll_berserker_brutal_strike;
            if (this.facet_crit_uses_cooldown)
            {
                target.AddNewModifier(parent, ability, "modifier_stunned", { duration : this.taunt_duration });
                ability.StartCooldown(ability.GetCooldown(ability.GetLevel()));
            }
            else if (!target.HasModifier(modifier_troll_berserker_brutal_strike_cc_cooldown.name))
            {
                target.AddNewModifier(parent, ability, modifier_troll_berserker_brutal_strike_cc.name, { duration : this.taunt_duration });
                target.AddNewModifier(parent, ability, modifier_troll_berserker_brutal_strike_cc_cooldown.name, { duration : this.taunt_cooldown });
            }
        }
    }
}

@registerModifier()
export class modifier_troll_berserker_brutal_strike_cc extends BaseModifier
{
    IsDebuff() { return true; }

    OnCreated()
    {
        const ability = this.GetAbility() as troll_berserker_brutal_strike;
        if (IsServer())
        {
            const parent = this.GetParent();
            if (this.GetCaster())
            {
                parent.MoveToTargetToAttack(this.GetCaster() as CDOTA_BaseNPC);
            }
        }
    }

    GetStatusEffectName() 
    {
        return "particles/status_fx/status_effect_beserkers_call.vpcf";
    }

    CheckState()
    {
        return { 
            [ModifierState.TAUNTED] : true, 
            [ModifierState.IGNORING_MOVE_AND_ATTACK_ORDERS] : true,
            [ModifierState.ATTACK_ALLIES] : true,
        };
    }
}

@registerModifier()
export class modifier_troll_berserker_brutal_strike_cc_cooldown extends BaseModifier
{
    IsDebuff() { return true; }
    IsPurgable() { return false; }
}

@registerModifier()
export class modifier_troll_berserker_brutal_strike_shard_stacks extends BaseModifier
{
    IsDebuff() { return true; }
    IsPurgable() { return true; }
}