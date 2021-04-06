'use strict';
/*
        MATH FUNCTIONS
 */

// trigonometric functions
// sine
function sin(x) {
    return Math.sin(x);
}

// cosine
function cos(x) {
    return Math.cos(x);
}

// tangent
function tg(x) {
    if (Math.abs(x % (Math.PI / 2)) < 0.025) {
        return Number.NaN;
    }
    return Math.tan(x);
}

//cotangent
function ctg(x) {
    if (Math.abs(x % (Math.PI)) < 0.025) {
        return Number.NaN;
    }
    return 1 / Math.tan(x);
}

// inverse trigonometric functions
// arcus sine
function arcsin(x) {
    return Math.asin(x);
}

// arcus cosine
function arccos(x) {
    return Math.acos(x);
}

// arcus tangent
function arctg(x) {
    return Math.atan(x);
}

// arcus cotangent
function arcctg(x) {
    return Math.PI / 2 - Math.atan(x);
}

// hyperbolic functions
// hyperbolic sine
function sh(x) {
    return Math.sinh(x);
}

// hyperbolic cosine
function ch(x) {
    return Math.cosh(x);
}

// hyperbolic tangent
function th(x) {
    return Math.tanh(x);
}

// hyperbolic cotangent
function cth(x) {
    if (Math.abs(0 - x) < 0.025) {
        return Number.NaN;
    }
    return 1 / Math.tanh(x);
}

// inverse hiperbolic funtions
// area hyperbolic sine
function arsh(x) {
    return Math.asinh(x);
}

// area hyperbolic cosine
function arch(x) {
    return Math.acosh(x);
}

// area hyperbolic tangent
function arth(x) {
    return Math.atanh(x);
}

// area hyperbolic cotangent
function arcth(x) {
    return Math.atanh(1 / x);
}
