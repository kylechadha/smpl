// To Do's
// - Add ability to change font sizes and colors (perhaps controlled by cursor?), could have icons bottom left
// -- Scroll through different color themes
// - Save preferences in local storage
// - Read up on em's, so you can ensure text always fits inside svg circle
// - Make everything responsive
// >> going to have to force an update of the circumference value as well
// - Clean up animation
// -- stop the animation from "catching up" when focus is restored  ... could remove transition on page visiibility off, and re-add it when restored

// ** how did we do functions / JS architecture in the previous extension?

var sweep = $('#sweep');
var circumference = parseInt(sweep.css('r'), 10) * 2 * Math.PI;

function update() {
  var now = moment();
  $('#time').html(now.format('h:mm'));
  $('#date').html(now.format('dddd, MMMM DD'));

  sweep.css('stroke-dashoffset', circumference*(1-(now.seconds()/59)))
}
update();
setInterval(update, 1000);

console.log("Smpl: Created with <3 by Kyle Chadha");
