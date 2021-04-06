'use strict';

// config for development purposes
// fill some inputs with predefined values
let DEV = true;


/*
    config
 */
// x, y divider
let xv = 20;
let yv = 20;
// canvas size
let width = 600;
let height = 600;



// input value for plot_input_0
let default_math_input = (DEV ? "3*sin(2*(x-2))-3" : "");

// counters for unique ids
let equ_input_counter = 0;
let shape_input_counter = 0;

// 18 predefined by latex
let colors = [
    {
        "name": "black",
        "hex": "#000000"
    },
    {
        "name": "blue",
        "hex": "#0000FF"
    },
    {
        "name": "brown",
        "hex": "#88540B"
    },
    {
        "name": "cyan",
        "hex":"#00FFFF"
    },
    {
        "name": "darkgray",
        "hex":"#A9A9A9"
    },
    {
        "name":"gray",
        "hex":"#808080"
    },
    {
        "name":"green",
        "hex":"#00FF00"
    },
    {
        "name":"lightgray",
        "hex":"#D3D3D3"
    },
    {
        "name":"lime",
        "hex":"#32CD32"
    },
    {
        "name":"magenta",
        "hex":"#FF00FF"
    },
    {
        "name":"olive",
        "hex":"#808000"
    },
    {
        "name":"orange",
        "hex":"#FF7F00"
    },
    {
        "name":"pink",
        "hex":"#FFC0CB"
    },
    {
        "name":"purple",
        "hex":"#800080"
    },
    {
        "name": "red",
        "hex": "#FF0000"
    },
    {
        "name":"teal",
        "hex":"#008080"
    },
    {
        "name":"violet",
        "hex":"#8F00FF"
    },
    {
        "name":"yellow",
        "hex":"#FFFF00"
    }
]
