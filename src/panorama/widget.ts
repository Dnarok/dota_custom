export type pixel = `${number}px`;
export type percentage = `${number}%`;
export type size = pixel | percentage;
export type fill_parent_flow = `fill-parent-flow(${number})`;
export type height_percentage = `height-percentage(${percentage})`;
export type width_percentage = `width-percentage(${percentage})`;
export type width_values = size | fill_parent_flow | height_percentage | `fit-children`;
export type height_values = size | fill_parent_flow | width_percentage | `fit-children`;

export type margin_value = `${size}` | `none` | `auto`;
export type margin_values = `${margin_value}` | `${margin_value} ${margin_value}` | `${margin_value} ${margin_value} ${margin_value}` | `${margin_value} ${margin_value} ${margin_value} ${margin_value}`;

export type color_code = `#${string}`;
// width, style, color
export type border_value = `${size} ${"solid" | "dashed" | "none"} ${color_code | `transparent`}`;

export type linear_gradient = `gradient( linear, ${size} ${size}, ${size} ${size}, from( ${color_code} ), to( ${color_code} ) )`;
export type radial_gradient = `gradient( radial, ${size} ${size}, ${size} ${size}, ${size} ${size}, from( ${color_code} ), to( ${color_code} ) )`;
export type gradient = linear_gradient | radial_gradient;
export type color_value = color_code | gradient;

export type vertical_align_value = `top` | `center` | `bottom`;
export type horizontal_align_value = `left` | `center` | `right`;
export type align_value = `${horizontal_align_value} ${vertical_align_value}`;

export type position_value = `${pixel} ${pixel} ${pixel}`;

export abstract class widget
{
    abstract panel : Panel;
    parent : widget | null;
    children : widget[];

    constructor(parent : widget | null, id : string, properties : Record<string, any> | undefined)
    {
        this.parent = parent;
        this.children = new Array;
    }
    protected finalize()
    {
        if (this.parent)
        {
            this.parent.add_child(this);
        }
    }

    get width() : string 
    {
        return this.panel.style.width ?? "";
    }
    set width(value : width_values)
    {
        this.panel.style.width = value;
    }

    get height() : string
    {
        return this.panel.style.height ?? "";
    }
    set height(value : height_values)
    {
        this.panel.style.height = value;
    }

    get margin() : string
    {
        return this.panel.style.margin ?? "";
    }
    set margin(value : margin_values)
    {
        this.panel.style.margin = value;
    }

    get border() : string
    {
        return this.panel.style.border ?? "";
    }
    set border(value : border_value)
    {
        this.panel.style.border = value;
    }

    get color() : string
    {
        return this.panel.style.color ?? "";
    }
    set color(value : color_value)
    {
        this.panel.style.color = value;
    }

    get align() : string
    {
        return this.panel.style.align ?? "";
    }
    set align(value : align_value)
    {
        this.panel.style.align = value;
    }

    get position() : string
    {
        return this.panel.style.position ?? "";
    }
    set position(value : position_value)
    {
        this.panel.style.position = value;
    }

    add_child(child : widget)
    {
        child.parent = this;
        child.panel.SetParent(this.panel);
        this.children.push(child);
    }
    remove_child(child : widget)
    {
        const index = this.children.indexOf(child);
        if (index > -1)
        {
            child.parent = null;
            this.children.splice(index, 1);
        }
    }
}

export class button_widget extends widget
{
    panel : Button;

    constructor(parent : widget | null, id : string, properties : Record<string, any> | undefined)
    {
        super(parent, id, properties);

        if (!this.parent || !this.parent.panel)
        {
            this.panel = $.CreatePanel("Button", $.GetContextPanel(), id, properties);
        }
        else
        {
            this.panel = $.CreatePanel("Button", this.parent.panel, id, properties);
        }
        
        this.width = "100%";
        this.height = "100%";

        super.finalize();
    }
}