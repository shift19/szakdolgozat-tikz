'use strict';

let plot_form_wrapper = $('#plot_form_wrapper');
// $(document).ready...
$(function () {

    plot_form_wrapper.append(
        '<div id="plot_input_' + equ_input_counter + '" class="form-group" style="display: flex;">' +
        '<div class="mb-3">' +
        '<input type="text" id="plot_input_' + equ_input_counter + '" class="form-control" name="math_input[]" value="'+default_math_input+'">' +
        '</div>' +
        '<div class="mb-3">' +
        '<select id="plot_color_select_' + equ_input_counter + '" class="form-control" name="color_select[]"></select>' +
        '</div>' +
        '</div>'
    );

    for (let i = 0; i < colors.length; i++) {
        let option = $('<option></option>').text(colors[i].name).attr('value', colors[i].hex);
        $('select[id=plot_color_select_' + equ_input_counter + ']').append(option);
    }
});

plot_form_wrapper.on('click', '.delete_button', function (e) {

    e.preventDefault();

    let id = e.currentTarget.id;
    $('div[id=' + id + ']').remove();

}).on("keydown", function (e) {
    if (e.key === "Enter") e.preventDefault();
});


function appendEquInput() {

    plot_form_wrapper.append(
        '<div id="plot_input_' + equ_input_counter + '" class="form-group" style="display:flex;">' +
        '<div class="mb-3">' +
        '<input type="text" id="plot_input_' + equ_input_counter + '" class="form-control" name="math_input[]"> ' +
        '</div>' +
        '<div class="mb-3">' +
        '<select id="plot_color_select_' + equ_input_counter + '" class="form-control" name="color_select[]"></select>' +
        '</div>' +
        '<div class="mb-3">' +
        '<button id="plot_input_' + equ_input_counter + '" class="btn btn-danger delete_button">X</button>' +
        '</div>' +
        '<div>'
    );

    for (let i = 0; i < colors.length; i++) {
        let option = $('<option></option>').text(colors[i].name).attr('value', colors[i].hex);
        $('select[id=plot_color_select_' + equ_input_counter + ']').append(option);
    }
}

$("#add_equ_button").on('click',function (e) {

    e.preventDefault();
    equ_input_counter++;

    appendEquInput();

});

$('#plot_equ_button').on('click',function (e) {

    e.preventDefault();

    drawGraphCanvas();

});

