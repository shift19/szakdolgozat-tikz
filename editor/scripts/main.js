'use strict';

import {P5} from "./components/sketch.js";
import {Controls} from "./components/utility/Controls.js";
import {ARROW, ARROW_TIPS, LINE_DASH, LINE_WIDTH, TOOLBAR} from "./components/global.js";
import {loadOptions} from "./components/misc.js";
import {
    editButtonHandler,
    functionButtonHandler,
    optionHandler,
    toolbarButtonHandler
} from "./components/handlers/input.js";
import {
    copyHandler,
    downloadHandler,
    loadCanvasHandler,
    loadHandler,
    newCanvasHandler,
    saveHandler
} from "./components/handlers/modal.js";
import {loadReferralCode, setReferralHandler} from "./components/cookie/handler.js";

// hide all conditional html elements
$("#edit_menu").hide();
$("#options_menu").hide();
$("#aProperties").hide();
$("#defaultProperties").hide();
$("#arrowProperties").hide();
$("#arcProperties").hide();
$("#textProperties").hide();
$("#latexProperties").hide();

// $(document).ready...
$(() => {

    /*////////////////////////////////////////////////////////////////
                                  SETUP
    ////////////////////////////////////////////////////////////////*/

    // load handlers
    functionButtonHandler();
    toolbarButtonHandler();
    editButtonHandler();
    optionHandler()

    newCanvasHandler()
    loadCanvasHandler()
    loadHandler()
    saveHandler()
    downloadHandler()
    copyHandler()

    setReferralHandler();
    loadReferralCode();

    P5.mousePressed = e => Controls.mousePressed(e)
    P5.mouseDragged = e => Controls.mouseDragged(e);
    P5.mouseReleased = e => Controls.mouseReleased(e);
    P5.mouseWheel = e => Controls.zoomCanvas(e);

    // load default properties selections
    loadOptions($("#defaultLinewidth"), LINE_WIDTH, "THIN");
    loadOptions($("#defaultLinedash"), LINE_DASH, "SOLID");
    loadOptions($("#defaultArrow"), ARROW, "NONE");
    loadOptions($("#defaultArrowTipHead"), ARROW_TIPS, "LATEX");
    loadOptions($("#defaultArrowTipTail"), ARROW_TIPS, "LATEX");

    // initialize selected mode
    TOOLBAR.SELECTED_MODE = $('input[name="toolbar_button"]:checked')[0].id

});
