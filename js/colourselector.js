const colourPicker = function (colour) {
  if (!($('html').hasClass(colour))) {
    $('html').removeAttr('class');
    $('html').addClass(colour)
  }
}

$(function () {
  $('.style-picker').on('click', function () {
    colourPicker($(this).attr('name'));
  });
});