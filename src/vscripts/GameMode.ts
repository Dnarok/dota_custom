import { modifiable_ability } from "./abilities/modifiable";
import { reloadable } from "./lib/tstl-utils";

const heroSelectionTime = 20;

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

/**
 * Turn a table object into an array.
 * @param obj The object to transform to an array.
 * @returns An array with items of the value type of the original object.
 */
function toArray<T>(obj: Record<number, T>): T[] {
    const result = [];
    
    let key = 1;
    while (obj[key]) {
        result.push(obj[key]);
        key++;
    }

    return result;
}

@reloadable
export class GameMode {
    public static Precache(this: void, context: CScriptPrecacheContext) {
        
    }

    public static Activate(this: void) {
        // When the addon activates, create a new instance of this GameMode class.
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();

        // Register event listeners for dota engine events
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);

        CustomGameEventManager.RegisterListener("ability_modified_event", (_, data) => {
            CustomNetTables.SetTableValue("modifiable_ability_data", "data", {
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
            });
        });
    }

    private configure(): void {
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 10);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 10);

        GameRules.SetShowcaseTime(0);
        GameRules.SetStrategyTime(5);
        GameRules.SetHeroSelectionTime(heroSelectionTime);
    }

    public OnStateChange(): void {
        const state = GameRules.State_Get();

        if (IsInToolsMode() && state == GameState.CUSTOM_GAME_SETUP) {
            for (let i = 0; i < 10; i++) {
                Tutorial.AddBot("npc_dota_hero_lina", "", "", false);
            }
        }

        if (state === GameState.CUSTOM_GAME_SETUP) {
            // Automatically skip setup in tools
            if (IsInToolsMode()) {
                Timers.CreateTimer(0.1, () => {
                    GameRules.FinishCustomGameSetup();
                });
            }
        }

        // Start game once pregame hits
        if (state === GameState.PRE_GAME) {
            Timers.CreateTimer(0.2, () => this.StartGame());
        }
    }

    private StartGame(): void {
        print("Game starting!");

        // Do some stuff here
    }

    // Called on script_reload
    public Reload() {
        print("Script reloaded!");

        // Do some stuff here
    }

    private OnNpcSpawned(event: NpcSpawnedEvent) {
        // // After a hero unit spawns, apply modifier_panic for 8 seconds
        // const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC; // Cast to npc since this is the 'npc_spawned' event
        // // Give all real heroes (not illusions) the meepo_earthbind_ts_example spell
        // if (unit.IsRealHero()) {
        //     if (!unit.HasAbility("meepo_earthbind_ts_example")) {
        //         // Add lua ability to the unit
        //         unit.AddAbility("meepo_earthbind_ts_example");
        //     }
        // }
    }
}
