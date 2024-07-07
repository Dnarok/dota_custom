import { registerAbility, BaseAbility, BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";

@registerAbility()
export class troll_berserker_rallying_cry extends BaseAbility
{
	static cast_particle : string = "particles/units/heroes/hero_sven/sven_spell_warcry.vpcf";
	static ally_modifier_particle : string = "particles/units/heroes/hero_sven/sven_warcry_buff.vpcf";
	static enemy_modifier_particle : string = "particles/units/heroes/hero_slardar/slardar_broken_shield.vpcf";

	sound : string = "Hero_Sven.WarCry";

	GetBehavior() : AbilityBehavior | Uint64 
	{
		const caster = this.GetCaster();
		if (this.GetSpecialValueFor("talent_does_strong_dispel") == 1)
		{
			return AbilityBehavior.NO_TARGET | AbilityBehavior.IGNORE_PSEUDO_QUEUE | AbilityBehavior.IGNORE_BACKSWING | AbilityBehavior.IMMEDIATE;
		}
		else
		{
			return AbilityBehavior.NO_TARGET | AbilityBehavior.IMMEDIATE;
		}
	}

	GetCastRange()
	{
		return this.GetSpecialValueFor("radius");
	}

	OnSpellStart()
	{
		const caster = this.GetCaster();
		const radius = this.GetSpecialValueFor("radius");
		
		let enemies = 0;
		const units = FindUnitsInRadius(caster.GetTeam(), caster.GetAbsOrigin(), undefined, radius, UnitTargetTeam.BOTH, UnitTargetType.HERO | UnitTargetType.CREEP, UnitTargetFlags.NONE, FindOrder.ANY, false);
		for (const unit of units)
		{
			if (unit.GetTeam() != caster.GetTeam())
			{
				++enemies;
			}
		}

		const damage_per_unit = this.GetSpecialValueFor("damage_per_unit");
		const armor_per_unit = this.GetSpecialValueFor("armor_per_unit");
		const attack_speed_per_unit = this.GetSpecialValueFor("talent_attack_speed_per_unit");
		const max_health_per_unit = this.GetSpecialValueFor("shard_max_health_per_unit");
		const movespeed_per_unit = this.GetSpecialValueFor("shard_movespeed_per_unit");

		const damage = enemies * damage_per_unit;
		const armor = enemies * armor_per_unit;
		const attack_speed = enemies * attack_speed_per_unit;
		const max_health = enemies * max_health_per_unit;
		const movespeed = enemies * movespeed_per_unit;
		const status_resistance = this.GetSpecialValueFor("scepter_status_resistance");

		const allied_effect = this.GetSpecialValueFor("allied_effect") / 100.0;
		const enemy_effect = this.GetSpecialValueFor("scepter_enemy_effect") / -100.0;
		const duration = this.GetSpecialValueFor("duration");
		const stun_duration = this.GetSpecialValueFor("facet_stun_duration");

		for (const unit of units)
		{
			if (unit == caster)
			{
				if (unit.HasModifier(modifier_troll_berserker_rallying_cry_ally.name))
				{
					unit.RemoveModifierByName(modifier_troll_berserker_rallying_cry_ally.name);
				}

				const parameters = 
				{ 
					duration 			: duration, 
					damage 				: damage,
					armor 				: armor,
					attack_speed 		: attack_speed,
					max_health 			: max_health,
					movespeed 			: movespeed,
					status_resistance 	: status_resistance,
				};
				unit.AddNewModifier(caster, this, modifier_troll_berserker_rallying_cry_ally.name, parameters) as modifier_troll_berserker_rallying_cry_ally;

				if (this.GetSpecialValueFor("talent_does_strong_dispel") == 1)
				{
					unit.Purge(false, true, false, true, true);
				}
			}
			else if (unit.GetTeam() == caster.GetTeam())
			{
				if (unit.HasModifier(modifier_troll_berserker_rallying_cry_ally.name))
				{
					unit.RemoveModifierByName(modifier_troll_berserker_rallying_cry_ally.name);
				}

				const parameters = 
				{ 
					duration 			: duration, 
					damage 				: damage * allied_effect,
					armor 				: armor * allied_effect,
					attack_speed 		: attack_speed * allied_effect,
					max_health 			: max_health * allied_effect,
					movespeed 			: movespeed * allied_effect,
					status_resistance 	: status_resistance * allied_effect,
				};
				unit.AddNewModifier(caster, this, modifier_troll_berserker_rallying_cry_ally.name, parameters) as modifier_troll_berserker_rallying_cry_ally;
			}
			else 
			{
				if (stun_duration > 0)
				{
					unit.AddNewModifier(caster, this, "modifier_stunned", { duration : stun_duration });
				}

				if (caster.HasScepter())
				{
					if (unit.HasModifier(modifier_troll_berserker_rallying_cry_enemy.name))
					{
						unit.RemoveModifierByName(modifier_troll_berserker_rallying_cry_enemy.name);
					}

					const parameters = 
					{ 
						duration 			: duration, 
						damage 				: damage * enemy_effect,
						armor 				: armor * enemy_effect,
						attack_speed 		: attack_speed * enemy_effect,
						max_health 			: max_health * enemy_effect,
						movespeed 			: movespeed * enemy_effect,
						status_resistance 	: status_resistance * enemy_effect,
					};
					unit.AddNewModifier(caster, this, modifier_troll_berserker_rallying_cry_enemy.name, parameters) as modifier_troll_berserker_rallying_cry_enemy;
				}
			}
		}

		// TODO particle and sound shit
		const FX = ParticleManager.CreateParticle(troll_berserker_rallying_cry.cast_particle, ParticleAttachment.POINT_FOLLOW, caster);
		ParticleManager.SetParticleControlEnt(FX, 0, caster, ParticleAttachment.ABSORIGIN_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
		ParticleManager.SetParticleControlEnt(FX, 2, caster, ParticleAttachment.POINT_FOLLOW, "attach_attack1", caster.GetAbsOrigin(), true);
		EmitSoundOn("Hero_TrollWarlord.BattleTrance.Cast", caster);
	}
}

@registerModifier()
export class modifier_troll_berserker_rallying_cry_ally extends BaseModifier
{
	damage ?: number;
	armor ?: number;
	attack_speed ?: number;
	max_health ?: number;
	movespeed ?: number;
	status_resistance ?: number;

	IsHidden() { return false; }
	IsDebuff() { return false; }
	IsPuragble() { return true };

	OnCreated(parameters : any)
	{
		const particle = ParticleManager.CreateParticle(troll_berserker_rallying_cry.ally_modifier_particle, ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent());
		ParticleManager.SetParticleControlEnt(particle, 0, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, "attach_hitloc", this.GetParent().GetAbsOrigin(), true);
		ParticleManager.SetParticleControlEnt(particle, 1, this.GetParent(), ParticleAttachment.OVERHEAD_FOLLOW, "attach_hitloc", this.GetParent().GetAbsOrigin(), true);
		this.AddParticle(particle, false, false, -1, false, true);

		if (!IsServer())
		{
			return;
		}

		this.damage = parameters.damage;
		this.armor = parameters.armor;
		this.attack_speed = parameters.attack_speed;
		this.max_health = parameters.max_health;
		this.movespeed = parameters.movespeed;
		this.status_resistance = parameters.status_resistance;

		this.SetHasCustomTransmitterData(true);
	}

	AddCustomTransmitterData()
	{
		return {
			damage : this.damage,
			armor : this.armor,
			attack_speed : this.attack_speed,
			max_health : this.max_health,
			movespeed : this.movespeed,
			status_resistance : this.status_resistance,
		};
	}

	HandleCustomTransmitterData(parameters : any)
	{
		this.damage = parameters.damage;
		this.armor = parameters.armor;
		this.attack_speed = parameters.attack_speed;
		this.max_health = parameters.max_health;
		this.movespeed = parameters.movespeed;
		this.status_resistance = parameters.status_resistance;
	}

	DeclareFunctions()
	{
		return [
			ModifierFunction.PREATTACK_BONUS_DAMAGE,
			ModifierFunction.PHYSICAL_ARMOR_BONUS,
			ModifierFunction.ATTACKSPEED_BONUS_CONSTANT,
			ModifierFunction.HEALTH_BONUS,
			ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
			ModifierFunction.STATUS_RESISTANCE_STACKING
		];
	}

	GetModifierPreAttack_BonusDamage() : number 
	{
		return this.damage as number;
	}

	GetModifierPhysicalArmorBonus(_ : ModifierAttackEvent) : number 
	{
		return this.armor as number;
	}

	GetModifierAttackSpeedBonus_Constant() : number 
	{
		return this.attack_speed as number;
	}

	GetModifierHealthBonus() : number 
	{
		return this.max_health as number;
	}

	GetModifierMoveSpeedBonus_Percentage() : number 
	{
		return this.movespeed as number;
	}

	GetModifierStatusResistanceStacking() : number 
	{
		return this.status_resistance as number;
	}
}

@registerModifier()
export class modifier_troll_berserker_rallying_cry_enemy extends BaseModifier
{
	damage ?: number;
	armor ?: number;
	attack_speed ?: number;
	max_health ?: number;
	movespeed ?: number;
	status_resistance ?: number;

	IsHidden() { return false; }
	IsDebuff() { return true; }
	IsPuragble() { return true };

	OnCreated(parameters : any)
	{
		const particle = ParticleManager.CreateParticle(troll_berserker_rallying_cry.enemy_modifier_particle, ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent());
		ParticleManager.SetParticleControlEnt(particle, 0, this.GetParent(), ParticleAttachment.OVERHEAD_FOLLOW, "attach_hitloc", this.GetParent().GetAbsOrigin(), true);
		ParticleManager.SetParticleControl(particle, 61, Vector(1.0, 0.0, 0.0));
		this.AddParticle(particle, false, false, -1, false, true);

		if (!IsServer())
		{
			return;
		}
		
		this.damage = parameters.damage;
		this.armor = parameters.armor;
		this.attack_speed = parameters.attack_speed;
		this.max_health = parameters.max_health;
		this.movespeed = parameters.movespeed;
		this.status_resistance = parameters.status_resistance;

		this.SetHasCustomTransmitterData(true);
	}

	AddCustomTransmitterData()
	{
		return {
			damage : this.damage,
			armor : this.armor,
			attack_speed : this.attack_speed,
			max_health : this.max_health,
			movespeed : this.movespeed,
			status_resistance : this.status_resistance,
		};
	}

	HandleCustomTransmitterData(parameters : any)
	{
		this.damage = parameters.damage;
		this.armor = parameters.armor;
		this.attack_speed = parameters.attack_speed;
		this.max_health = parameters.max_health;
		this.movespeed = parameters.movespeed;
		this.status_resistance = parameters.status_resistance;
	}

	DeclareFunctions()
	{
		return [
			ModifierFunction.PREATTACK_BONUS_DAMAGE,
			ModifierFunction.PHYSICAL_ARMOR_BONUS,
			ModifierFunction.ATTACKSPEED_BONUS_CONSTANT,
			ModifierFunction.HEALTH_BONUS,
			ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
			ModifierFunction.STATUS_RESISTANCE_STACKING
		];
	}

	GetModifierPreAttack_BonusDamage() : number 
	{
		return this.damage as number;
	}

	GetModifierPhysicalArmorBonus(_ : ModifierAttackEvent) : number 
	{
		return this.armor as number;
	}

	GetModifierAttackSpeedBonus_Constant() : number 
	{
		return this.attack_speed as number;
	}

	GetModifierHealthBonus() : number 
	{
		return this.max_health as number;
	}

	GetModifierMoveSpeedBonus_Percentage() : number 
	{
		return this.movespeed as number;
	}

	GetModifierStatusResistanceStacking() : number 
	{
		return this.status_resistance as number;
	}
}