'use strict';

import {
    setDrawControl,
    setEditControl,
    setMoveControl,
    setToolbar,
    setZoomControl,
    SHAPES_DATABASE,
    TOOLBAR
} from "../global.js";
import {DRAW_MODEL, EDIT_MODEL, MOVE_MODEL, TOOLBAR_MODEL, ZOOM_MODEL} from "../interfaces/models.js";
import {getReferenceCode, getTikzCode, processReferralCode} from "../load.js";
import {download, makeFileContent} from "../downloader.js";
import {Cookie} from "../cookie/cookie.js";

// =====================================================================================================================

const TOOLBAR_MENU_ID = 'toolbar_menu';

const newCanvasHandler = () => {
    $("#newCanvas").on('click', () => {
        // if new confirmed set length of shapes to 0
        SHAPES_DATABASE.length = 0;

        setToolbar(TOOLBAR_MODEL);

        setMoveControl(MOVE_MODEL);
        setEditControl(EDIT_MODEL);
        setDrawControl(DRAW_MODEL);

        setZoomControl(ZOOM_MODEL);

        Cookie.delete('referral')

        let select_mode = $(`#${TOOLBAR_MENU_ID} input[type='radio']`)[0];
        select_mode.checked = true;
        TOOLBAR.SELECTED_MODE = select_mode.value
        $("#defaultProperties").hide("slow");
        $("#edit_menu").hide("slow");
        $("#aProperties").hide("slow");
    });
}

// =====================================================================================================================

const loadHandler = () => {
    $("#load").on('click', () => {

        $("#loadModalReference").val("");

    });
}

const loadCanvasHandler = () => {
    $("#loadCanvas").on('click', () => {

        try {
            processReferralCode($("#loadModalReference").val());
        } catch (e) {
            console.log('exception')
        }

    });
}

// =====================================================================================================================

const saveHandler = () => {
    $("#save").on('click', () => {
        $("#saveModalReference").val(getReferenceCode());
        $("#saveModalLatex").val(getTikzCode());
    });
}

const downloadHandler = () => {
    $("button[name='download_button']").on('click', (e) => {
        download(makeFileContent());
    });
}

// =====================================================================================================================

const copyHandler = () => {
    $("button[name='copy_button']").on('click', (e) => {
        $(`#${e.target.id}`).closest('.form-floating').find('textarea').select();
        document.execCommand("copy");
        document.getSelection().removeAllRanges();
    });
}

//-=====================================================================================================================

export {
    newCanvasHandler,
    loadCanvasHandler,
    loadHandler,
    saveHandler,
    downloadHandler,
    copyHandler
}
