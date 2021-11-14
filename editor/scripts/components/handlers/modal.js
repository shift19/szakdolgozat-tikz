'use strict';

import {
    REDOS,
    setDrawControl,
    setEditControl,
    setMoveControl,
    setToolbar,
    setZoomControl,
    SHAPES_DATABASE,
    TOOLBAR,
    UNDOS
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
        UNDOS.length = 0;
        REDOS.length = 0;

        // reset toolbar
        setToolbar(TOOLBAR_MODEL);

        // reset controls
        setMoveControl(MOVE_MODEL);
        setEditControl(EDIT_MODEL);
        setDrawControl(DRAW_MODEL);
        setZoomControl(ZOOM_MODEL);

        // delete cookie
        Cookie.delete('referral')

        // set mode to the first element
        let select_mode = $(`#${TOOLBAR_MENU_ID} input[type='radio']`)[0];
        select_mode.checked = true;
        TOOLBAR.SELECTED_MODE = select_mode.id

        // hide unnecessary menus and properties
        $("#edit_menu").hide("slow");
        $("#defaultProperties").hide("slow");
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
        Cookie.set('referral', getReferenceCode());
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
