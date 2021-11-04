'use strict';

import {draw, keyPressed, keyReleased, setup, windowResized} from "./canvas/canvas.js";

// =====================================================================================================================

const sketch = s => {

    s.setup = () => {
        setup();
    }

    s.draw = () => {
        draw();
    }

    s.windowResized = () => {
        windowResized();
    }

    s.keyPressed = () => {
        keyPressed();
    }

    s.keyReleased = () => {
        keyReleased();
    }

}

const P5 = new p5(sketch);

//======================================================================================================================

export {
    P5
}
