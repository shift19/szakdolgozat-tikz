'use strict';

// =====================================================================================================================

import {
    DRAW_CONTROLS,
    DRAWABLE_SHAPES,
    EDIT_CONTROLS,
    MODES,
    MOVE_CONTROLS,
    setNormalize,
    setPreview,
    TOOLBAR
} from "../global.js";
import {editSetup} from "../edit.js";
import {moveSetup} from "../move.js";

// =====================================================================================================================

const PROPERTIES = {
    default: $("#defaultProperties"),
    edit: $("#edit_menu"),
    accordion: $("#aProperties"),
    arrow: $("#arrowProperties"),
    arc: $("#arcProperties"),
    text: $("#textProperties"),
    latex: $("#latexProperties"),
}

const DEFAULT = {
    fill: $("#defaultFill"),
    linewidth: $("#defaultLinewidth"),
    linedash: $("#defaultLinedash"),
}

// =====================================================================================================================

const functionButtonHandler = () => {
    $('input[name="function_button"]').on('click', (e) => {
        e.preventDefault();
    });
}

// =====================================================================================================================

const toolbarButtonHandler = () => {
    $('input[name="toolbar_button"]').on('click', (e) => {
        TOOLBAR.SELECTED_MODE = e.target.id;

        DRAW_CONTROLS.CURRENTLY_DRAWN = undefined;
        DRAW_CONTROLS.CURRENTLY_DRAWING = false;
        DRAW_CONTROLS.PREVIEW = undefined;

        MOVE_CONTROLS.ENABLED = false;
        MOVE_CONTROLS.POINT_MAPPING = [];
        MOVE_CONTROLS.SELECTED_POINTS = [];
        MOVE_CONTROLS.DRAGGED_POINT = undefined;

        EDIT_CONTROLS.ENABLED = false;
        EDIT_CONTROLS.POINT_MAPPING = [];
        EDIT_CONTROLS.SELECTED_ELEMENTS = [];
        EDIT_CONTROLS.SELECTED_AREA = {
            STARTING_POINT: undefined,
            ENDING_POINT: undefined
        }

        for (let property in PROPERTIES) {
            PROPERTIES[property].hide("slow");
        }

        if (TOOLBAR.SELECTED_MODE === MODES.DRAW) {
            PROPERTIES.edit.show("slow");
            PROPERTIES.default.show("slow");
            DEFAULT.fill.show();
            DEFAULT.linedash.show();
            DEFAULT.linewidth.show();
            $("#point").prop('checked', true);
            TOOLBAR.SELECTED_SHAPE = DRAWABLE_SHAPES.POINT
        }

        if (TOOLBAR.SELECTED_MODE === MODES.MOVE) {
            if (!MOVE_CONTROLS.ENABLED)
                moveSetup();
        }

        if (TOOLBAR.SELECTED_MODE === MODES.EDIT) {
            if (!EDIT_CONTROLS.ENABLED)
                editSetup();
        }

    });
}

// =====================================================================================================================

const editButtonHandler = () => {

    $('input[name="edit_button"]').on('click', (e) => {
        TOOLBAR.SELECTED_SHAPE = e.target.id

        if (e.target.id === DRAWABLE_SHAPES.LINE || e.target.id === DRAWABLE_SHAPES.BEZIER) {
            PROPERTIES.arrow.show("slow");
        } else {
            PROPERTIES.arrow.hide("slow");
        }

        if (e.target.id === DRAWABLE_SHAPES.ARC) {
            PROPERTIES.arc.show("slow");
        } else {
            PROPERTIES.arc.hide("slow");
        }

        if (e.target.id === DRAWABLE_SHAPES.TEXT || e.target.id === DRAWABLE_SHAPES.MATH) {
            if (e.target.id === DRAWABLE_SHAPES.TEXT) {
                PROPERTIES.text.show("slow");
                PROPERTIES.latex.hide("slow");
            } else {
                PROPERTIES.latex.show("slow");
                PROPERTIES.text.hide("slow");
            }
            DEFAULT.fill.hide("slow");
            DEFAULT.linedash.hide("slow");
            DEFAULT.linewidth.hide("slow");
        } else {
            if (e.target.id === DRAWABLE_SHAPES.GRID) {
                DEFAULT.fill.hide("slow");
            } else {
                DEFAULT.fill.show("slow");
            }
            PROPERTIES.text.hide("slow");
            PROPERTIES.latex.hide("slow");
            DEFAULT.linedash.show("slow");
            DEFAULT.linewidth.show("slow");
        }
    });
}

// =====================================================================================================================

const optionHandler = () => {

    $('#options').on('click', (e) => {
        $("#options_menu").toggle("slow");
    });

    $('#options_snap').on('click', (e) => {
        let checked = $("#options_snap").prop("checked");
        setNormalize(checked);
    });

    $('#options_preview').on('click', (e) => {
        let checked = $("#options_preview").prop("checked");
        setPreview(checked);
    });

}

// =====================================================================================================================

export {
    functionButtonHandler,
    toolbarButtonHandler,
    editButtonHandler,
    optionHandler
}
