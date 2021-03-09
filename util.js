/** 
 * Returns a random integer between 0 and n-1. 
 */
function randomInt(n) {
    return Math.floor(Math.random() * n);
}

/** 
 * Returns a string that can be used as a rgb web color. 
 */
function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}

/** 
 * Returns a string that can be used as a hsl web color. 
 */
function hsl(h, s, l) {
    return "hsl(" + h + "," + s + "%," + l + "%)";
}

/** 
 * Creates an alias for requestAnimationFrame for backwards compatibility. 
 */
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * Add custom color codes here.
 */
var COLORS = {
    MANA_PURPLE: "#9933FF",
    LIGHT_LAPIS: "#66FFFF",
    LAPIS: "#345E83",
    FRAME_BROWN: "#795548",
    FRAME_TAN: "#D7CCC8",
    LIGHT_HEALTH_GREEN: "#99CC66",
    HEALTH_GREEN: "#006600",
    LIGHT_HEALTH_RED: "#FF0000",
    HEALTH_RED: "#660000"
}

/** 
 * Add global parameters here 
 */
var PARAMS = {
    VELOCITY_ACC: -75,
    VELOCITY_MIN: -700,
    TILE_WIDTH: 64,
    CANVAS_WIDTH: 1024,
    CANVAS_HEIGHT: 768,
    BB_LINE_WIDTH: 5,
    DEBUG: false,
    MUTE: false
};