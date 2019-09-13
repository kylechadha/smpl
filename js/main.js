// To Do's
// - Add ability to change font sizes and colors (perhaps controlled by cursor?), could have icons bottom left
// -- Scroll through different color themes
// - Save preferences in local storage
// - Read up on em's, so you can ensure text always fits inside svg circle
// - Make everything responsive
// >> going to have to force an update of the circumference value as well

// ** how did we do functions / JS architecture in the previous extension?

// Update the clock.
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

// Stop the transition animation when the page loses focus.
// This is so it doesn't animate the re-draw when it regains focus.
var hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") {
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
  if (document[hidden]) {
    sweep.addClass('notransition');
  } else {
    // Note: Without this wait the page sometimes re-draws after the transition has been added back.
    setTimeout(function() {
      sweep.removeClass('notransition')
    }, 5);
  }
}

if (!(typeof document.addEventListener === "undefined" || hidden === undefined)) {
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}

console.log("Simple New Tab: Created with <3 by Kyle Chadha");
