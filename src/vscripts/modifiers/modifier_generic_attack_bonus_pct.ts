import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier()
export class modifier_generic_attack_bonus_pct extends BaseModifier
{
    damage : number = 0;

    OnCreated(params : any)
    {
        if (!IsServer())
        {
            return;
        }
        
        if (params.damage != undefined)
        {
            this.damage = params.damage - 100;
        }
        else
        {
            this.damage = 0;
        }
    }

    DeclareFunctions() : ModifierFunction[] 
    {
        return [
            ModifierFunction.DAMAGEOUTGOING_PERCENTAGE
        ];
    }

    GetModifierDamageOutgoing_Percentage(event: ModifierAttackEvent) : number 
    {
        return this.damage;
    }

    IsHidden() : boolean 
    {
        return true;
    }
}