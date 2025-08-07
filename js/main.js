// Themes.
var themes = ['biscay', 'periwinkle', 'atomic-tangerine', 'gin', 'interdimensional-blue', 'jazzberry-jam', 'tolopea-white', 'sky-blue', 'tolopea', 'minimal', 'minimal-night'];
var pos = parseInt(localStorage.getItem('theme')) || 0;
document.body.classList.remove('hidden');
document.body.classList.add(themes[pos]);
document.getElementById('clock').style.opacity = 1;

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
  document.body.classList.add(themes[pos]);
  document.body.classList.remove(current);
  var clock = document.getElementById('clock');
  clock.style.opacity = 0;
  clock.style.transition = 'opacity 1s';
  setTimeout(function() { clock.style.opacity = 1; }, 10);
  localStorage.setItem('theme', pos);
};

// Clock.
var sweep = document.getElementById('sweep');
var clock = document.getElementById('clock');
var time = document.getElementById('time');
var date = document.getElementById('date');
var circumference = 280 * 2 * Math.PI; // Using CSS --radius: 280

function measureTextWidth(text, fontSize, fontFamily) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = fontSize + 'px ' + fontFamily;
  return context.measureText(text).width;
}

function balanceTextSizes() {
  var container = parseFloat(getComputedStyle(document.getElementById('dateTime')).width);
  var timeText = time.textContent;
  var dateText = date.textContent;
  
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
  time.style.fontSize = baseTimeSize + 'px';
  date.style.fontSize = adjustedDateSize + 'px';
}

function update() {
  var now = new Date();
  
  // Format time (h:mm)
  var hours = now.getHours();
  var minutes = now.getMinutes();
  hours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  time.textContent = hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
  
  // Format date (dddd, MMMM DD)
  var options = { weekday: 'long', month: 'long', day: '2-digit' };
  date.textContent = now.toLocaleDateString('en-US', options);

  // Balance the text sizes dynamically
  balanceTextSizes();

  sweep.style.strokeDashoffset = circumference*(1-(now.getSeconds()/59));
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
    sweep.classList.add('notransition');
  } else {
    // Note: Without this wait the page sometimes re-draws after the transition has been added back.
    setTimeout(function() {
      sweep.classList.remove('notransition');
    }, 10);
  }
}

if (!(typeof document.addEventListener === 'undefined' || hidden === undefined)) {
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}

console.log('Simple New Tab: Created with <3 by Kyle Chadha @kylechadha');
