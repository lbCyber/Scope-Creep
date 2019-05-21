const colourPicker = function (colour) {
  if (!($('html').hasClass(colour))) {
    $('html').removeAttr('class');
    $('html').addClass(colour)
  }
}

$(function () {
  $('.style-picker').on('click', function () {
    if (this.hasAttribute('name')) {
      colourPicker($(this).attr('name'));
    } else {
      colourPicker('style-6');
    }
  });
});