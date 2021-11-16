'use strict';

import {COLOR, COLORPICKERS, SHAPES_DATABASE} from "../global.js";
import {capitalize, getKey, toHex} from "../misc.js";
import {addUndo} from "../undo.js";

class ColorPicker {

    constructor(ci) {
        this.id = ci;

        this.colorInput = $("#" + this.id);
        this.colorPalette = $("<div>").attr('id', `${this.id}palette`).addClass("palette");
        this.colorInput.parent().append(this.colorPalette);

        this.colorInput.on('click', () => this.showColorPalette());
        this.colorInput.on('focusout', () => this.hideColorPalette());

        this.colorPalette.on("mouseover", () => this.mouseOver());
        this.colorPalette.on('mouseout', () => this.mouseOut());
        this.colorPalette.mouseIsOver = false;
        this.colorPalette.isShown = false;

        // fill color palette in constructor
        for (const [key, value] of Object.entries(COLOR)) {
            this.colorPalette.append(`<div id="${this.id}_${key.toLowerCase()}" class="color-option" style="background-color:${value}">${key === "NONE" ? '<span style="color: red">x</span>' : ''}</div>`);
        }

        this.colorInput.css("border-right-color", `${COLOR[this.colorInput.val().toUpperCase()]}`);
    }

    mouseOver() {
        this.colorPalette.mouseIsOver = true;
    }

    mouseOut() {
        this.colorPalette.mouseIsOver = false;
    }

    hideColorPalette() {
        if (!this.colorPalette.mouseIsOver) {
            this.colorPalette.css("display", 'none');
            this.colorPalette.isShown = false;
        }
    }

    showColorPalette() {
        if (!this.colorPalette.isShown) {
            this.colorPalette.css("display", 'block');
            this.colorPalette.isShown = true;
        } else {
            this.colorPalette.css("display", 'none');
            this.colorPalette.isShown = false;
        }
    }
}

// =====================================================================================================================

// color pick handler
const refreshColorPickerHandlers = () => {
    $(".color-option").off('click').on('click', (e) => {
        COLORPICKERS.forEach(cp => {
            if (e.target.id.includes(cp.id)) {
                let color = toHex(e.target.style.backgroundColor)
                cp.colorInput.css("border-right-color", color)
                cp.colorInput.val(capitalize(getKey(COLOR, color)))
                cp.colorPalette.css("display", "none")
                cp.colorPalette.isShown = false

                if (cp.colorInput.hasClass("property-element")) {
                    let split_id = e.target.id.split("_")
                    let {target, id} = {target: split_id[0], id: split_id[1]}
                    addUndo();
                    SHAPES_DATABASE[id][target] = color;
                }
            }
        });
    });
}

// =====================================================================================================================

// initialize color pickers
for (let colorpicker of $(".color-input")) {
    COLORPICKERS.push(new ColorPicker(colorpicker.id))
    refreshColorPickerHandlers();
}

// =====================================================================================================================

export {
    ColorPicker,
    refreshColorPickerHandlers
}
