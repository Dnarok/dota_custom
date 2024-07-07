import { widget } from "./widget";

$.Msg("Hud panorama loaded");

function GetDotaHud()
{
    let panel : Panel | null = $.GetContextPanel();
    while (panel != null && panel.id != "Hud")
    {
        panel = panel.GetParent();
    }
    
    if (panel == null)
    {
        throw "ohfuck";
    }
    else
    {
        return panel;
    }
}

let root_widget = $.CreatePanel("Panel", $.GetContextPanel(), "root_panel");
root_widget.style.width = "75%";
root_widget.style.height = "75%";
root_widget.style.horizontalAlign = "center";
root_widget.style.verticalAlign = "center";
root_widget.style.flowChildren = "down";
root_widget.visible = false;

let custom_ui_button = $("#custom_ui_button");
custom_ui_button.SetPanelEvent("onactivate", () =>
{
    root_widget.visible = !root_widget.visible;
});

let button_mouse_callbacks : Array<(event : MouseEvent, value : MouseButton | MouseScrollDirection) => boolean> = [];

class default_label
{
    label : Panel;

    constructor(parent : Panel, id : string, text : string, size : number)
    {
        this.label = $.CreatePanel("Label", parent, parent.id + id, {
            text : text
        });

        this.label.style.marginTop = "2px";
        this.label.style.textTransform = "uppercase";
        this.label.style.letterSpacing = "2px";
        this.label.style.color = "#ffffff";
        this.label.style.textAlign = "center";
        this.label.style.horizontalAlign = "center";
        this.label.style.verticalAlign = "middle";
        this.label.style.textShadow = "2px 2px 0px 1.0 #000000";
        this.label.style.transitionProperty = "color";
        this.label.style.transitionDuration = "0.35s";
        this.label.style.transitionTimingFunction = "ease-in-out";
        this.label.style.fontSize = size + "px";
        this.label.style.fontFamily = "defaultFont";
    }
}

class default_button 
{
    panel : Panel;
    label : default_label;
    hovered : boolean = false;
    pressed : boolean = false;

    constructor(parent : Panel, id : string, text : string, callback : () => void)
    {
        this.panel = $.CreatePanel("Panel", parent, id, {});

        this.panel.SetPanelEvent("onmouseover", () =>
        {
            if (!this.pressed)
            {
                this.panel.style.backgroundColor = "gradient(linear, 0% 0%, 0% 100%, from(#4c5561), to(#6c7d88))";
                this.panel.style.borderTopColor = "#aaaaaa77";
                this.panel.style.borderLeftColor = "#aaaaaa33";
                this.panel.style.borderRightColor = "#333333";
                this.panel.style.borderBottomColor = "#404040";
            }
            this.hovered = true;
        });
        this.panel.SetPanelEvent("onmouseout", () =>
        {
            if (!this.pressed)
            {
                this.panel.style.backgroundColor = "gradient(linear, 0% 0%, 0% 100%, from(#373d45), to(#4d5860))";
                this.panel.style.borderTopColor = "#555555";
                this.panel.style.borderLeftColor = "#494949";
                this.panel.style.borderRightColor = "#333333";
                this.panel.style.borderBottomColor = "#404040";
            }
            this.hovered = false;
        });

        button_mouse_callbacks.push((event : MouseEvent, value : MouseButton | MouseScrollDirection) =>
        {
            if (this.hovered && event == "pressed" && value == 0)
            {
                this.pressed = true;
                this.panel.style.backgroundColor = "gradient(linear, 0% 0%, 0% 100%, from(#393939), to(#555555))";
                this.panel.style.borderTopColor = "#222222";
                this.panel.style.borderLeftColor = "#303030";
                this.panel.style.borderRightColor = "#666666";
                this.panel.style.borderBottomColor = "#444444";

                return true;
            }
            else if (event == "released" && value == 0)
            {
                if (this.pressed)
                {
                    if (this.hovered)
                    {
                        this.panel.style.backgroundColor = "gradient(linear, 0% 0%, 0% 100%, from(#4c5561), to(#6c7d88))";
                        this.panel.style.borderTopColor = "#aaaaaa77";
                        this.panel.style.borderLeftColor = "#aaaaaa33";
                        this.panel.style.borderRightColor = "#333333";
                        this.panel.style.borderBottomColor = "#404040";
                    }
                    else
                    {
                        this.panel.style.backgroundColor = "gradient(linear, 0% 0%, 0% 100%, from(#373d45), to(#4d5860))";
                        this.panel.style.borderTopColor = "#555555";
                        this.panel.style.borderLeftColor = "#4949   49";
                        this.panel.style.borderRightColor = "#333333";
                        this.panel.style.borderBottomColor = "#404040";
                    }

                    this.pressed = false;
                    callback();
                }
            }

            return false;
        });

        this.panel.style.width = parent.style.width;
        this.panel.style.minWidth = "36px";
        this.panel.style.minHeight = "36px";
        this.panel.style.backgroundColor = "gradient(linear, 0% 0%, 0% 100%, from(#373d45), to(#4d5860))";
        this.panel.style.borderStyle = "solid";
        this.panel.style.borderWidth = "1px";
        this.panel.style.padding = "4px 10px";
        this.panel.style.borderTopColor = "#555555";
        this.panel.style.borderLeftColor = "#494949";
        this.panel.style.borderBottomColor = "#333333";
        this.panel.style.borderRightColor = "#404040";
        this.panel.style.transitionProperty = "background-color";
        this.panel.style.transitionDuration = "0.05s";
        this.panel.style.transitionTimingFunction  = "linear";

        this.label = new default_label(this.panel, id + "Label", text, 18);
    }
};

class default_dropdown
{
    panel : DropDown;

    constructor(parent : Panel, id : string, options : string[], callback : () => void)
    {
        this.panel = $.CreatePanel("DropDown", parent, id, {});
        for (const option of options)
        {
            let label = $.CreatePanel("Label", this.panel, option, { text : option });
            label.style.width = "100%";
            this.panel.AddOption(label);
        }
        if (options.length > 0)
        {
            this.panel.SetSelectedIndex(0);
        }
        this.panel.style.width = "100%";
        this.panel.SetPanelEvent("oninputsubmit", callback);
    }

    GetSelectedText()
    {
        return (this.panel.GetSelected() as LabelPanel).text;
    }
}

class default_radio_button
{
    panel : RadioButton;

    constructor(parent : Panel, id : string, group : string, text : string, checked : boolean)
    {
        this.panel = $.CreatePanel("RadioButton", parent, id, { group : group, text : text, checked : checked ? "checked" : undefined });
        this.panel.style.width = "100%";
        this.panel.checked = checked;
    }

    GetSelectedButtonText()
    {
        return this.panel.GetSelectedButton().id;
    }
}

class default_radio_button_group
{
    panel : Panel;
    radio_buttons : default_radio_button[];

    constructor(parent : Panel, id : string, group : string, texts : string[], callback : () => void)
    {
        this.panel = $.CreatePanel("Panel", parent, id);
        this.panel.style.width = "100%";
        this.panel.style.flowChildren = "down";

        this.radio_buttons = new Array;
        let first = true;
        for (const text of texts)
        {
            this.radio_buttons.push(new default_radio_button(this.panel, text, group, text, first));
            this.panel.SetPanelEvent("onvaluechanged", callback);
            first = false;
        }
    }

    GetSelectedButtonText()
    {
        if (this.radio_buttons.length == 0)
        {
            return "undefined";
        }
        else
        {
            return this.radio_buttons[0].GetSelectedButtonText();
        }
    }
}

class default_checkbox
{
    panel : ToggleButton;

    constructor(parent : Panel, id : string, text : string, selected : boolean, callback : () => void)
    {
        this.panel = $.CreatePanel("ToggleButton", parent, id, { text : text });
        this.panel.checked = selected;
        this.panel.style.width = "100%";
        this.panel.SetPanelEvent("onactivate", callback);
    }

    GetChecked()
    {
        return this.panel.checked;
    }
}

class default_checkbox_group
{
    panel : Panel;
    surrounders : Panel[];
    boxes : default_checkbox[];

    constructor(parent : Panel, id : string, direction : string, texts : string[], active : boolean[], callback : () => void)
    {
        this.panel = $.CreatePanel("Panel", parent, id);
        this.panel.style.width = "100%";
        this.panel.style.flowChildren = direction;

        this.boxes = new Array;
        this.surrounders = new Array;
        for (let index = 0; index < (Math.min(texts.length, active.length)); ++index)
        {
            this.surrounders.push($.CreatePanel("Panel", this.panel, texts[index] + "surrounder"));
            if (this.panel.style.flowChildren != "down")
            {
                this.surrounders[index].style.width = 100 / (Math.min(texts.length, active.length)) + "%";
            }
            else
            {
                this.surrounders[index].style.width = "100%";
            }
            this.boxes.push(new default_checkbox(this.surrounders[index], texts[index], texts[index], active[index], callback));
        }
    }

    GetSelectedBoxesText()
    {
        if (this.boxes.length == 0)
        {
            return ["undefined"];
        }

        let out : string[] = new Array;
        for (const checkbox of this.boxes)
        {
            if (checkbox.GetChecked())
            {
                out.push(checkbox.panel.id);
            }
        }
        return out;
    }
}

class tab_bar
{
    panel : Panel;
    tabs : Array<default_button> = Array(0);
    active_tab : number = -1;

    constructor(parent : Panel)
    {
        this.panel = $.CreatePanel("Panel", parent, "modifiable_ability_tab_bar");
        this.panel.style.width = "100%";
        this.panel.style.height = "36px";
        this.panel.style.flowChildren = "right";
    }

    update_entity(entity : EntityIndex)
    {
        this.panel.RemoveAndDeleteChildren();
        this.tabs = [];

        let abilities = new Map<AbilityEntityIndex, boolean>();
        let hidden = 0;
        const ability_count = Entities.GetAbilityCount(entity);
        for (let index = 0; index < ability_count; index++)
        {
            const ability = Entities.GetAbility(entity, index);
            const name = Abilities.GetAbilityName(ability);
            if (name == "modifiable_ability")
            {
                if (Abilities.IsHidden(ability))
                {
                    hidden++;
                    abilities.set(ability, false);
                }
                else
                {
                    abilities.set(ability, true);
                }
            }
        }

        if (abilities.size == 0)
        {
            return;
        }

        let index = 1;
        for (const [ability, active] of abilities)
        {
            if (active)
            {
                this.tabs.push(new default_button(this.panel, "" + ability, "" + index++, () => {

                }));
                this.tabs[this.tabs.length - 1].panel.style.width = "36px";
            }
        }

        if (hidden != 0)
        {
            this.tabs.push(new default_button(this.panel, "tab_plus", "+", () => {
                
            }));
            this.tabs[this.tabs.length - 1].panel.style.width = "36px";
        }
    }
}

type ability_behavior_strings = keyof typeof DOTA_ABILITY_BEHAVIOR;

class tab_content
{
    panel : Panel;

    ability_name_entry : TextEntry;

    ability_image : AbilityImage;
    texture_dropdown : default_dropdown;
    ability_behavior_dropdown : default_dropdown;
    target_team_dropdown : default_dropdown;

    target_types_group : default_checkbox_group;
    target_flags_group : default_checkbox_group;

    manacost_entry : TextEntry;
    healthcost_entry  : TextEntry;
    goldcost_entry : TextEntry;
    cooldown_entry : TextEntry;

    damage_type_dropdown : default_dropdown;
    damage_entry : TextEntry;

    update_button : default_button;

    constructor(parent : Panel, ability_data : ModifiableAbilityData)
    {
        this.panel = $.CreatePanel("Panel", parent, "tab_content", {});
        this.panel.style.width = "100%";
        this.panel.style.height = "100%";
        this.panel.style.border = "2px solid #008800";
        this.panel.style.flowChildren = "down";


        this.ability_name_entry = $.CreatePanel("TextEntry", this.panel, "ability_name_entry", {
            maxchars : "100",
            placeholder : "Type ability name here...",
        });
        this.ability_name_entry.style.width = "100%";
        this.ability_name_entry.text = ability_data.ability_name;
        this.ability_name_entry.style.marginBottom = "3px";
        this.ability_name_entry.enabled = false;


        let div1 = $.CreatePanel("Panel", this.panel, "div1", {});
        div1.style.width = "100%";
        div1.style.flowChildren = "right";


        this.ability_image = $.CreatePanel("DOTAAbilityImage", div1, "ability_image", {});
        this.ability_image.abilityname = "vengefulspirit_magic_missile";


        let div2 = $.CreatePanel("Panel", div1, "div2", {});
        div2.style.width = "100%";
        div2.style.flowChildren = "down";


        this.texture_dropdown = new default_dropdown(div2, "texture", [
            "vengefulspirit_magic_missile",
            "skywrath_mage_arcane_bolt",
            "skeleton_king_hellfire_blast",
        ], () => {
            this.ability_image.abilityname = this.texture_dropdown.GetSelectedText();
        });
        this.texture_dropdown.panel.style.marginLeft = "3px";
        this.texture_dropdown.panel.style.marginBottom = "3px";


        this.ability_behavior_dropdown = new default_dropdown(div2, "ability_behavior", [
            "UNIT_TARGET",
            "PASSIVE",
            "NO_TARGET",
            "POINT",
        ], () => {});
        this.ability_behavior_dropdown.panel.style.marginLeft = "3px";
        this.ability_behavior_dropdown.panel.style.marginBottom = "3px";


        this.target_team_dropdown = new default_dropdown(div2, "target_team", [
            "ENEMY",
            "FRIENDLY",
            "BOTH",
        ], () => {});
        this.target_team_dropdown.panel.style.marginLeft = "3px";


        let div3 = $.CreatePanel("Panel", this.panel, "div3", {});
        div3.style.width = "100%";
        div3.style.flowChildren = "right";


        this.target_types_group = new default_checkbox_group(div3, "target_types", "down", [
            "HERO",
            "CREEP",
            "BUILDING",
            "TREE",
        ], [
            true,
            true,
            false,
            false,
        ], () => {});
        this.target_types_group.panel.style.width = "25%";
        this.target_types_group.panel.style.marginTop = "3px";

        
        this.target_flags_group = new default_checkbox_group(div3, "target_flags", "down", [
            "MAGIC_IMMUNE",
            "INVULNERABLE",
            "CHECK_DISABLE_HELP",
        ], [
            false,
            false,
            false,
        ], () => {});
        this.target_flags_group.panel.style.marginTop = "3px";
        this.target_flags_group.surrounders[2].style.width = "100%";


        let div4 = $.CreatePanel("Panel", this.panel, "div4", {});
        div4.style.width = "100%";
        div4.style.flowChildren = "right";


        let manacost_surrounder = $.CreatePanel("Panel", div4, "manacost_surrounder", {});
        manacost_surrounder.style.width = "25%";
        manacost_surrounder.style.flowChildren = "right";
        let manacost_image = $.CreatePanel("Image", manacost_surrounder, "manacost_image", {});
        manacost_image.SetImage("s2r://panorama/images/status_icons/ability_manacost_icon_psd.vtex");
        manacost_image.style.width = "20px";
        manacost_image.style.height = "20px";
        manacost_image.style.margin = "10px";
        this.manacost_entry = $.CreatePanel("TextEntry", manacost_surrounder, "manacost", {
            maxchars : "100",
            placeholder : "Manacost...",
        });
        this.manacost_entry.text = "" + ability_data.manacost;
        this.manacost_entry.style.color = "#58B8FF";


        let healthcost_surrounder = $.CreatePanel("Panel", div4, "healthcost_surrounder", {});
        healthcost_surrounder.style.width = "25%";
        healthcost_surrounder.style.flowChildren = "right";
        let healthcost_image = $.CreatePanel("Image", healthcost_surrounder, "healthcost_image", {});
        healthcost_image.SetImage("s2r://panorama/images/status_icons/ability_healthcost_icon_psd.vtex");
        healthcost_image.style.width = "20px";
        healthcost_image.style.height = "20px";
        healthcost_image.style.margin = "10px";
        this.healthcost_entry = $.CreatePanel("TextEntry", healthcost_surrounder, "healthcost", {
            maxchars : "100",
            placeholder : "Healthcost...",
        });
        this.healthcost_entry.text = "" + ability_data.healthcost;
        this.healthcost_entry.style.color = "#FF586C";


        let goldcost_surrounder = $.CreatePanel("Panel", div4, "goldcost_surrounder", {});
        goldcost_surrounder.style.width = "25%";
        goldcost_surrounder.style.flowChildren = "right";
        let goldcost_image = $.CreatePanel("Image", goldcost_surrounder, "goldcost_image", {});
        goldcost_image.SetImage("s2r://panorama/images/custom_game/ability_goldcost_icon_png.vtex");
        goldcost_image.style.width = "20px";
        goldcost_image.style.height = "20px";
        goldcost_image.style.margin = "10px";
        this.goldcost_entry = $.CreatePanel("TextEntry", goldcost_surrounder, "goldcost", {
            maxchars : "100",
            placeholder : "Goldcost...",
        });
        this.goldcost_entry.style.width = "100%";
        this.goldcost_entry.text = "" + ability_data.goldcost;
        this.goldcost_entry.style.color = "#FFFF9A";


        let cooldown_surrounder = $.CreatePanel("Panel", div4, "cooldown_surrounder", {});
        cooldown_surrounder.style.width = "25%";
        cooldown_surrounder.style.flowChildren = "right";
        let cooldown_image = $.CreatePanel("Image", cooldown_surrounder, "cooldown_image", {});
        cooldown_image.SetImage("s2r://panorama/images/status_icons/ability_cooldown_icon_psd.vtex");
        cooldown_image.style.width = "20px";
        cooldown_image.style.height = "20px";
        cooldown_image.style.margin = "10px";
        this.cooldown_entry = $.CreatePanel("TextEntry", cooldown_surrounder, "cooldown", {
            maxchars : "100",
            placeholder : "Cooldown...",
        });
        this.cooldown_entry.style.width = "100%";
        this.cooldown_entry.text = "" + ability_data.cooldown;


        let div5 = $.CreatePanel("Panel", this.panel, "div5", {});
        div5.style.width = "100%";
        div5.style.flowChildren = "right";


        this.damage_type_dropdown = new default_dropdown(div5, "damage_type", [
            "MAGICAL",
            "PHYSICAL",
            "PURE",
        ], () => {});
        this.damage_type_dropdown.panel.style.width = "33%";


        this.damage_entry = $.CreatePanel("TextEntry", div5, "damage", {
            maxchars : "100",
            placeholder : "Damage...",
        });
        this.damage_entry.style.width = "68%";
        this.damage_entry.style.height = "100%";
        this.damage_entry.text = "" + ability_data.damage;


        this.update_button = new default_button(this.panel, "update_button", "Update", () => {
            ability_data.ability_name = this.ability_name_entry.text;
            
            ability_data.ability_texture = this.ability_image.abilityname;

            ability_data.ability_behavior = DOTA_ABILITY_BEHAVIOR["DOTA_ABILITY_BEHAVIOR_" + this.ability_behavior_dropdown.GetSelectedText() as keyof typeof DOTA_ABILITY_BEHAVIOR];

            ability_data.unit_target_teams = DOTA_UNIT_TARGET_TEAM["DOTA_UNIT_TARGET_TEAM_" + this.target_team_dropdown.GetSelectedText() as keyof typeof DOTA_UNIT_TARGET_TEAM];
            
            let types = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE;
            const selected_types = this.target_types_group.GetSelectedBoxesText();
            for (const item of selected_types)
            {
                types |= DOTA_UNIT_TARGET_TYPE["DOTA_UNIT_TARGET_" + item as keyof typeof DOTA_UNIT_TARGET_TYPE];
            }
            ability_data.unit_target_types = types;


            let flags = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
            const selected_flags = this.target_flags_group.GetSelectedBoxesText();
            for (const item of selected_flags)
            {
                flags |= DOTA_UNIT_TARGET_FLAGS["DOTA_UNIT_TARGET_FLAG_" + item as keyof typeof DOTA_UNIT_TARGET_FLAGS];
            }
            ability_data.unit_target_flags = flags;
            
            ability_data.manacost = parseInt(this.manacost_entry.text);
            ability_data.healthcost = parseInt(this.healthcost_entry.text);
            ability_data.goldcost = parseInt(this.goldcost_entry.text);
            ability_data.cooldown = parseInt(this.cooldown_entry.text);

            ability_data.damage_type = DAMAGE_TYPES["DAMAGE_TYPE_" + this.damage_type_dropdown.GetSelectedText() as keyof typeof DAMAGE_TYPES];
            ability_data.damage = parseInt(this.damage_entry.text);

            GameEvents.SendCustomGameEventToServer("ability_modified_event", ability_data);
        });
        this.update_button.panel.style.marginTop = "3px";
        this.update_button.panel.style.verticalAlign = "bottom";
    }
}

// class ModifierPanel
// {
//     button : DefaultButton;
// 
//     constructor(parent : Panel, entity : EntityIndex, buff : BuffID)
//     {
//         this.button = new DefaultButton(parent, "" + buff, Buffs.GetName(entity, buff), () => {
//             
//         });
//         this.button.panel.style.horizontalAlign = "center";
//         this.button.panel.style.marginBottom = "5px";
//     }
// }
// 
// class ModifierList
// {
//     panel : Panel;
//     modifiers : Array<ModifierPanel>;
//     schedule : ScheduleID;
// 
//     constructor(parent : Panel)
//     {
//         this.panel = $.CreatePanel("Panel", parent, "ModifierList", {});
//         this.panel.style.width = "100%";
//         this.panel.style.height = "100%";
//         this.panel.style.border = "2px solid #00ff00";
//         this.panel.style.flowChildren = "down";
// 
//         this.modifiers = new Array(0);
// 
//         this.schedule = 0 as ScheduleID;
//     }
// 
//     update_entity(entity : EntityIndex)
//     {
//         this.panel.RemoveAndDeleteChildren();
//         this.modifiers = [];
// 
//         const count = Entities.GetNumBuffs(entity);
//         for (let index = 0; index < count; index++)
//         {
//             this.modifiers.push(new ModifierPanel(this.panel, entity, Entities.GetBuff(entity, index)));
//         }
//     }
// }
// 
// let modifierList = new ModifierList(content_panel);

// GameEvents.Subscribe("dota_player_update_selected_unit", (data : object) => {
//     Players.GetLocalPlayerPortraitUnit();
//     for (const iterator of Players.GetSelectedEntities(data["splitscreenplayer" as keyof typeof data])) {
//         modifierList.update_entity(Players.GetLocalPlayerPortraitUnit());
//     }
//     const unit = Players.GetLocalPlayerPortraitUnit();
//     modifierList.update_entity(unit);
//     const name = GameUI.GetUnitNameLocalized(Entities.GetUnitName(unit));
//     pokemonName.text = "Modifiers List: " + name + "(" + unit + ")";
// });

enum CastBehavior
{

}

let tab_bar_instance = new tab_bar(root_widget);
let current_ability_data : ModifiableAbilityData = {
    player_id : Players.GetLocalPlayer(),
    ability_behavior : DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET,
    cast_behavior : CastBehavior.PROJECTILE,
    unit_target_types : DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP,
    unit_target_teams : DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
    unit_target_flags : DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
    cast_animation : GameActivity_t.ACT_DOTA_CAST_ABILITY_1,
    cast_range : 600,
    cast_point : 1.0,
    backswing : 1.0,
    ability_texture : "vengefulspirit_magic_missile",
    hidden : false,
    ability_name : "modifiable_ability",

    damage : 100,
    damage_type : DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
    manacost : 25,
    healthcost : 0,
    goldcost : 0,
    cooldown : 12,

    // modifiers : [],
};
let tab_content_instance = new tab_content(root_widget, current_ability_data);
tab_content_instance.panel.style.backgroundColor = "#1a1a1a";
let gold1 : Panel | null = null;
let gold2 : Panel | null = null;

$.RegisterForUnhandledEvent("DOTAShowAbilityTooltipForEntityIndex", AddGoldCost);
function AddGoldCost(panel : Panel, ability : string, entity : EntityIndex)
{
    const hud = GetDotaHud();
    const tooltip_manager = hud.FindChildTraverse("Tooltips");
    const tooltip_ability = tooltip_manager?.FindChildTraverse("DOTAAbilityTooltip");
    if (!tooltip_ability)
    {
        return;
    }

    if (!gold1)
    {
        const costs = tooltip_ability.FindChildTraverse("AbilityCosts");
        if (!costs)
        {
            return;
        }
    
        gold1 = costs.FindChildTraverse("AbilityGoldCost");
        if (!gold1)
        {
            gold1 = $.CreatePanel("Label", costs as Panel, "AbilityGoldCost", {});
        }
        gold1.AddClass("GoldCost");
        gold1.style.backgroundImage = "url(\"s2r://panorama/images/custom_game/ability_goldcost_icon_png.vtex\")";
        gold1.style.backgroundSize = "20px";
        gold1.style.color = "#ffffff";
        gold1.style.fontWeight = "bold";
        gold1.style.marginLeft = "5px";
    
        const cast_range = costs.FindChildTraverse("AbilityCastRange");
        if (cast_range)
        {
            costs.MoveChildBefore(gold1, cast_range);
        }
    }

    if (!gold2)
    {
        const costs = tooltip_ability.FindChildTraverse("CurrentAbilityCosts");
        if (!costs)
        {
            return;
        }

        gold2 = costs.FindChildTraverse("CurrentAbilityGoldCost");
        if (!gold2)
        {
            gold2 = $.CreatePanel("Label", costs as Panel, "CurrentAbilityGoldCost", {});
        }
        gold2.AddClass("GoldCost");
        gold2.style.backgroundImage = "url(\"s2r://panorama/images/custom_game/ability_goldcost_icon_png.vtex\")";
        gold2.style.backgroundSize = "20px";
        gold2.style.color = "#7d7d7d";
        gold2.style.marginLeft = "10px";
    
        const cooldown = costs.FindChildTraverse("CurrentAbilityCooldown");
        if (cooldown)
        {
            costs.MoveChildBefore(gold2, cooldown);
        }
    }

    if (gold1 && gold2)
    {
        const parent = panel.GetParent();
        if (parent)
        {
            const costs = parent.FindChildTraverse("GoldCost");
            if (costs)
            {
                if ((costs as LabelPanel).text == "0")
                {
                    gold1.visible = false;
                    gold2.visible = false;
                }
                else
                {
                    gold1.visible = true;
                    gold2.visible = true;
                    (gold1 as LabelPanel).text = (costs as LabelPanel).text;
                    (gold2 as LabelPanel).text = (costs as LabelPanel).text;
                }
            }
        }
    }
}

GameUI.SetMouseCallback((event : MouseEvent, value : MouseButton | MouseScrollDirection) =>
{
    let out : boolean = false;

    button_mouse_callbacks.forEach(element => {
        out ||= element(event, value);
    });

    return out;
})

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