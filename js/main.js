// Themes.
var themes = ['biscay', 'periwinkle', 'atomic-tangerine', 'gin', 'interdimensional-blue', 'jazzberry-jam', 'tolopea-white', 'sky-blue', 'tolopea', 'minimal', 'minimal-night'];
var pos = parseInt(localStorage.getItem('theme')) || 0;
$('body').removeClass('hidden').addClass(themes[pos]);
$('#clock').fadeTo( 1000, 1 );

document.onkeyup = function(event) {
  if (event.keyCode !== 37 && event.keyCode !== 39) {
    return;
  }

  var current = themes[pos];
  switch (event.keyCode) {
    case 39:
      if (pos === themes.length-1) {
        pos = 0;
      } else {
        pos += 1;
      }
      break;
    case 37:
      if (pos === 0) {
        pos = themes.length-1;
      } else {
        pos -= 1;
      }
      break;
  }
  $('body').addClass(themes[pos]).removeClass(current);
  $('#clock').css('opacity', 0).fadeTo( 1000, 1 );
  localStorage.setItem('theme', pos);
};

// Clock.
var sweep = $('#sweep');
var clock = $('#clock');
var time = $('#time');
var date = $('#date');
var circumference = parseInt(sweep.css('r'), 10) * 2 * Math.PI;

function measureTextWidth(text, fontSize, fontFamily) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = fontSize + 'px ' + fontFamily;
  return context.measureText(text).width;
}

function balanceTextSizes() {
  var container = parseFloat($('#dateTime').css('width'));
  var timeText = time.text();
  var dateText = date.text();
  
  // Base font sizes relative to container
  var baseTimeSize = container * 0.25;
  var baseDateSize = container * 0.045;
  
  // Font family for measurements
  var fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont';
  
  // Measure text widths at base sizes
  var timeWidth = measureTextWidth(timeText, baseTimeSize, fontFamily);
  var dateWidth = measureTextWidth(dateText, baseDateSize, fontFamily);
  
  // Target: make date width slightly wider than time for better balance
  var targetRatio = 1.05;
  var targetDateWidth = timeWidth * targetRatio;
  
  // Calculate adjusted date size
  var dateMultiplier = targetDateWidth / dateWidth;
  var adjustedDateSize = baseDateSize * dateMultiplier;
  
  // Apply dynamic sizing
  time.css('font-size', baseTimeSize + 'px');
  date.css('font-size', adjustedDateSize + 'px');
}

function update() {
  var now = moment();
  time.html(now.format('h:mm'));
  date.html(now.format('dddd, MMMM DD'));

  // Balance the text sizes dynamically
  balanceTextSizes();

  sweep.css('stroke-dashoffset', circumference*(1-(now.seconds()/59)))
}
update();
setInterval(update, 1000);

// Stop the transition animation when the page loses focus.
// This is so it doesn't animate the re-draw when it regains focus.
var hidden, visibilityChange; 
if (typeof document.hidden !== 'undefined') {
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

function handleVisibilityChange() {
  if (document[hidden]) {
    sweep.addClass('notransition');
  } else {
    // Note: Without this wait the page sometimes re-draws after the transition has been added back.
    setTimeout(function() {
      sweep.removeClass('notransition');
    }, 10);
  }
}

if (!(typeof document.addEventListener === 'undefined' || hidden === undefined)) {
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}

console.log('Simple New Tab: Created with <3 by Kyle Chadha @kylechadha');
