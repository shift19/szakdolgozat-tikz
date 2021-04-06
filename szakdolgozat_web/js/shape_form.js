'use strict';


let shape_form_wrapper = $('#shape_form_wrapper');
// $(document).ready...
$(function () {

    shape_form_wrapper.append(
        '<div id="shape_input_' + shape_input_counter + '" class="form-group" style="display: flex;">' +
        '<div class="mb-3">' +
        '<input type="text" id="shape_input_' + shape_input_counter + '" class="form-control" name="shape_input[]" value="rectangle">' +
        '</div>' +
        '<div class="mb-3">' +
        '<select id="shape_color_select_' + shape_input_counter + '" class="form-control" name="color_select[]"></select>' +
        '</div>' +
        '</div>'
    );

    for (let i = 0; i < colors.length; i++) {
        let option = $('<option></option>').text(colors[i].name).attr('value', colors[i].hex);
        $('select[id=shape_color_select_' + shape_input_counter + ']').append(option);
    }
});








$("#add_shape_button").on('click',function (e) {

    e.preventDefault();
    shape_input_counter++;

    console.log("add shape button pressed")

});

$('#plot_shape_button').on('click',function (e) {

    e.preventDefault();

    console.log("plot shape button pressed")

});
