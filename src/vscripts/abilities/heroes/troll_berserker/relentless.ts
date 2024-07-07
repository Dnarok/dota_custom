import { registerAbility, BaseAbility, BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";

@registerAbility()
export class troll_berserker_relentless extends BaseAbility
{
    GetIntrinsicModifierName() : string 
    {
        return modifier_troll_berserker_relentless.name;
    }

    IsPassive() : boolean
    {
        return true;
    }
}

@registerModifier()
export class modifier_troll_berserker_relentless extends BaseModifier
{
    health_for_max_bonus : number = 0;
    max_status_resistance : number = 0;
    max_magic_resistance : number = 0;

    OnCreated() : void 
    {
        const ability = this.GetAbility() as troll_berserker_relentless;
        this.health_for_max_bonus = ability.GetSpecialValueFor("health_for_max_bonus");
        this.max_status_resistance = ability.GetSpecialValueFor("max_status_resistance");
        this.max_magic_resistance = ability.GetSpecialValueFor("max_magic_resistance");
    }

    IsHidden() : boolean 
    {
        return true;
    }

    DeclareFunctions() : ModifierFunction[] 
    {
        return [
            ModifierFunction.STATUS_RESISTANCE_STACKING,
            ModifierFunction.MAGICAL_RESISTANCE_BONUS,
        ];
    }

    CalculateMultiplier() : number
    {
        const parent = this.GetParent();
        const health_percent = parent.GetHealthPercent();

        if (health_percent <= this.health_for_max_bonus)
        {
            return 1;
        }
        else
        {
            return (health_percent - this.health_for_max_bonus) / (100 - this.health_for_max_bonus) * (0.0 - 1.0) + 1.0;
        }

    }

    GetModifierStatusResistanceStacking() : number 
    {
        return this.max_status_resistance * this.CalculateMultiplier();
    }

    GetModifierMagicalResistanceBonus() : number 
    {
        return this.max_magic_resistance * this.CalculateMultiplier();
    }
}