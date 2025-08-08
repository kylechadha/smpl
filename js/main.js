// Themes.
var themes = ['biscay', 'sky-blue', 'tangerine', 'gin', 'slate', 'charcoal', 'frost'];
var pos = parseInt(localStorage.getItem('theme')) || 0;

// Visualizations.
var visualizations = [
  'classic',
  'rings', 
  'dots',
  'smooth'
];
var vizPos = parseInt(localStorage.getItem('visualization')) || 1;
document.body.classList.remove('hidden');
document.body.classList.add(themes[pos]);
// Restore page load animation for both clock and dateTime
var clock = document.getElementById('clock');
var dateTime = document.getElementById('dateTime');
clock.style.opacity = 0;
clock.style.transition = 'opacity 1s';
dateTime.style.transition = 'opacity 1s';
setTimeout(function() { 
  clock.style.opacity = 1;
  dateTime.style.opacity = 1;
}, 100);

// Initialize visualization (without showing name on startup)
var clockElement = document.getElementById('clock');
clockElement.className = '';
clockElement.classList.add('viz-' + visualizations[vizPos]);
updateClockStructure(visualizations[vizPos]);

document.onkeydown = function(event) {
  if (event.keyCode !== 37 && event.keyCode !== 39 && event.keyCode !== 38 && event.keyCode !== 40) {
    return;
  }

  var clock = document.getElementById('clock');
  
  // Theme switching (left/right arrows)
  if (event.keyCode === 37 || event.keyCode === 39) {
    var current = themes[pos];
    switch (event.keyCode) {
      case 39: // Right arrow
        pos = pos === themes.length-1 ? 0 : pos + 1;
        break;
      case 37: // Left arrow
        pos = pos === 0 ? themes.length-1 : pos - 1;
        break;
    }
    document.body.classList.add(themes[pos]);
    document.body.classList.remove(current);
    localStorage.setItem('theme', pos);
    
    // Update modal UI if open
    updateThemeSelectionInModal();
    
    // Show theme name
    showThemeName(themes[pos]);
  }
  
  // Visualization switching (up/down arrows)
  if (event.keyCode === 38 || event.keyCode === 40) {
    switch (event.keyCode) {
      case 38: // Up arrow
        vizPos = vizPos === visualizations.length-1 ? 0 : vizPos + 1;
        break;
      case 40: // Down arrow
        vizPos = vizPos === 0 ? visualizations.length-1 : vizPos - 1;
        break;
    }
    setVisualization(visualizations[vizPos]);
    localStorage.setItem('visualization', vizPos);
    
    // Update modal UI if open
    updateVisualizationSelectionInModal();
  }
};

// Clock.
var sweep = document.getElementById('sweep');
var clock = document.getElementById('clock');
var time = document.getElementById('time');
var date = document.getElementById('date');
var circumference = 280 * 2 * Math.PI; // Using CSS --radius: 280

// Visualization system
function setVisualization(vizType) {
  // Remove all visualization classes
  var clockElement = document.getElementById('clock');
  clockElement.className = '';
  
  // Add new visualization class
  clockElement.classList.add('viz-' + vizType);
  
  // Update clock structure if needed
  updateClockStructure(vizType);
  
  // Initialize entry animation - all visualizations start at 0 and sweep into place
  setTimeout(function() {
    var now = new Date();
    var seconds = now.getSeconds();
    var minutes = now.getMinutes();
    
    if (vizType === 'smooth') {
      setTimeout(function() {
        var sweepElement = document.getElementById('sweep');
        if (sweepElement) {
          // Start at position 0 (full offset = no visible sweep)
          sweepElement.style.strokeDashoffset = circumference;
          sweepElement.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0.0, 0.2, 1)';
          
          // Animate to current position after a small delay
          setTimeout(function() {
            var currentTime = new Date();
            var currentSeconds = currentTime.getSeconds();
            var currentMilliseconds = currentTime.getMilliseconds();
            var smoothSeconds = currentSeconds + (currentMilliseconds / 1000);
            sweepElement.style.strokeDashoffset = circumference * (1 - (smoothSeconds / 60));
            
            // Store minute for unwind detection
            sweepElement.dataset.prevMinute = Math.floor(currentTime.getTime() / 60000);
            
            // After animation completes, disable transitions for smooth mode
            setTimeout(function() {
              sweepElement.style.transition = 'none';
            }, 1000);
          }, 100);
        }
      }, 50);
    }
    
    if (vizType === 'dots') {
      // No entry animation or initial state setup needed
      // updateGranularDots will be called immediately by the main update loop
    }
  }, 10);
  
  // Show visualization name
  showVisualizationName(vizType);
}

function showVisualizationName(vizType) {
  var indicator = document.getElementById('viz-indicator');
  var displayNames = {
    'classic': 'Classic',
    'rings': 'Rings',
    'dots': 'Dots',
    'smooth': 'Smooth'
  };
  
  if (indicator) {
    indicator.textContent = displayNames[vizType] || vizType;
    indicator.classList.add('show');
    
    // Clear any existing timeout
    if (indicator.hideTimeout) {
      clearTimeout(indicator.hideTimeout);
    }
    
    // Hide after 2 seconds from the last switch
    indicator.hideTimeout = setTimeout(function() {
      indicator.classList.remove('show');
    }, 2000);
  }
}

function showThemeName(themeName) {
  var indicator = document.getElementById('viz-indicator');
  var themeNames = {
    'sky-blue': 'Sky',
    'biscay': 'Biscay',
    'tangerine': 'Tangerine',
    'gin': 'Gin',
    'slate': 'Slate',
    'charcoal': 'Charcoal',
    'frost': 'Frost'
  };
  
  if (indicator) {
    indicator.textContent = themeNames[themeName] || themeName;
    indicator.classList.add('show');
    
    // Clear any existing timeout
    if (indicator.hideTimeout) {
      clearTimeout(indicator.hideTimeout);
    }
    
    // Hide after 2 seconds from the last switch
    indicator.hideTimeout = setTimeout(function() {
      indicator.classList.remove('show');
    }, 2000);
  }
}

function updateClockStructure(vizType) {
  var clockDiv = document.getElementById('clock');
  
  switch(vizType) {
    case 'rings':
      clockDiv.innerHTML = `
        <svg viewBox="0 0 600 600" transform='rotate(-90)' role="img" aria-label="Dual ring clock with minutes and seconds">
          <circle id="minute-ring" class="dial minute-dial" />
          <circle id="second-ring" class="dial second-dial" />
          <circle id="minute-sweep" class="dial minute-sweep" />
          <circle id="second-sweep" class="dial second-sweep" />
        </svg>`;
      break;
    case 'dots':
      clockDiv.innerHTML = `
        <svg viewBox="0 0 600 600" transform='rotate(-90)' role="img" aria-label="Dot clock">
          <g id="hour-dots"></g>
          <g id="minute-dots"></g>
        </svg>`;
      createGranularDots();
      break;
    case 'smooth':
      clockDiv.innerHTML = `
        <svg viewBox="0 0 600 600" transform='rotate(-90)' role="img" aria-label="Smooth sweep clock">
          <g id="smooth-trail"></g>
          <circle id="sweep" class="dial" />
        </svg>`;
      createSmoothTrail();
      break;
    case 'classic':
      clockDiv.innerHTML = `
        <svg viewBox="0 0 600 600" transform='rotate(-90)' role="img" aria-label="Classic clock with seconds sweep animation">
          <g id="second-markers"></g>
          <circle id="sweep" class="dial" />
        </svg>`;
      createSecondMarkers();
      break;
    default:
      // Classic sweep
      clockDiv.innerHTML = `
        <svg viewBox="0 0 600 600" transform='rotate(-90)' role="img" aria-label="Clock with seconds sweep animation">
          <circle id="seconds" class="dial" />
          <circle id="sweep" class="dial" />
        </svg>`;
      break;
  }
  
  // Re-reference elements after DOM change
  sweep = document.getElementById('sweep');
}

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
  var seconds = now.getSeconds();
  hours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  time.textContent = hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
  
  // Format date (dddd, MMMM DD)
  var options = { weekday: 'long', month: 'long', day: '2-digit' };
  date.textContent = now.toLocaleDateString('en-US', options);

  // Balance the text sizes dynamically
  balanceTextSizes();

  // Update visualization based on current type
  updateVisualization(minutes, seconds);
}

function updateVisualization(minutes, seconds) {
  var currentViz = visualizations[vizPos];
  
  switch(currentViz) {
    case 'classic':
      updateClassicSweep(seconds);
      break;
    case 'rings':
      updateDualRings(seconds, minutes);
      break;
    case 'dots':
      updateGranularDots(seconds, minutes);
      break;
    case 'smooth':
      updateSmoothSweep(seconds);
      break;
    default:
      updateClassicSweep(seconds);
      break;
  }
}
update();
setInterval(update, 1000);

// Smooth sweep needs higher frequency updates
setInterval(function() {
  if (visualizations[vizPos] === 'smooth') {
    var now = new Date();
    var seconds = now.getSeconds();
    updateSmoothSweep(seconds);
  }
}, 16); // Update ~60 times per second for ultra smoothness

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
  if (sweep) {
    if (document[hidden]) {
      sweep.classList.add('notransition');
    } else {
      // Note: Without this wait the page sometimes re-draws after the transition has been added back.
      setTimeout(function() {
        sweep.classList.remove('notransition');
      }, 10);
    }
  }
}

// High-quality visualization functions
function updateClassicSweep(seconds) {
  if (sweep) {
    // Each second marker is 1/60th of the circle apart
    // At second 0: cover marker 0, at second 1: cover markers 0-1, etc.
    // Add extra coverage to ensure we fully cover each marker
    var markerAdvancement = (circumference / 60) * (seconds + 1.3); // +0.5 to extend past current marker
    sweep.style.strokeDashoffset = circumference - markerAdvancement;
  }
}

function updateDualRings(seconds, minutes) {
  var minuteSweep = document.getElementById('minute-sweep');
  var secondSweep = document.getElementById('second-sweep');
  
  if (minuteSweep && secondSweep) {
    // Outer ring: minutes (0-60)
    var minuteProgress = minutes / 60;
    minuteSweep.style.strokeDashoffset = (circumference * 1.02) * (1 - minuteProgress);
    
    // Inner ring: seconds (0-60) 
    var secondProgress = seconds / 60;
    secondSweep.style.strokeDashoffset = (circumference * 0.95) * (1 - secondProgress);
  }
}

function createGranularDots() {
  var hourDots = document.getElementById('hour-dots');
  var minuteDots = document.getElementById('minute-dots');
  
  if (hourDots && minuteDots) {
    // Create 60 second dots (outer circle)
    for (var i = 0; i < 60; i++) {
      var angle = (i * 6) * Math.PI / 180;
      var x = 300 + 280 * Math.cos(angle);
      var y = 300 + 280 * Math.sin(angle);
      
      var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', '2.5');
      dot.setAttribute('fill', 'var(--foreground)');
      dot.setAttribute('opacity', '0.2');
      dot.setAttribute('id', 'second-dot-' + i);
      hourDots.appendChild(dot);
    }
    
    // Create 12 five-minute marker dots (inner circle)
    for (var i = 0; i < 12; i++) {
      var angle = (i * 30) * Math.PI / 180;
      var x = 300 + 250 * Math.cos(angle);
      var y = 300 + 250 * Math.sin(angle);
      
      var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', '6');
      dot.setAttribute('fill', 'var(--foreground)');
      dot.setAttribute('opacity', '0.3');
      dot.setAttribute('id', 'minute-marker-' + (i * 5));
      minuteDots.appendChild(dot);
    }
  }
}

function updateGranularDots(seconds, minutes) {
  // Update second dots (outer circle) with dimming trail effect
  for (var i = 0; i < 60; i++) {
    var secondDot = document.getElementById('second-dot-' + i);
    if (secondDot) {
      // Calculate distance from current second, handling wrap-around
      var distanceFromCurrent;
      if (i <= seconds) {
        // Normal case: dot is behind current second
        distanceFromCurrent = seconds - i;
      } else {
        // Wrap-around case: dot is from previous minute
        // For example: if seconds=5 and i=58, distance = 5 + (60-58) = 7
        distanceFromCurrent = seconds + (60 - i);
      }
      
      // Only light up dots that are within the trail (45 seconds back = 3/4 circle)
      if (distanceFromCurrent <= 45) {
        // Create dimming effect: full opacity at current second, 
        // gradually dimming to 0.2 (unselected opacity) as we go back
        var opacity;
        if (distanceFromCurrent === 0) {
          opacity = '1'; // Current second is full brightness
        } else {
          // Linear fade from 1.0 to 0.2 over 45 seconds
          var fadeRatio = distanceFromCurrent / 45;
          opacity = Math.max(0.2, 1 - (fadeRatio * 0.8)).toString();
        }
        
        secondDot.setAttribute('opacity', opacity);
        secondDot.setAttribute('fill', 'var(--foreground)');
      } else {
        secondDot.setAttribute('opacity', '0.2');
      }
    }
  }
  
  // Update five-minute markers (inner circle) - always stay in correct state
  for (var i = 0; i < 12; i++) {
    var markerMinute = i * 5;
    var marker = document.getElementById('minute-marker-' + markerMinute);
    if (marker) {
      if (minutes >= markerMinute) {
        marker.setAttribute('opacity', '1');
        marker.setAttribute('fill', 'var(--foreground)');
      } else {
        marker.setAttribute('opacity', '0.3');
      }
    }
  }
}

function createSecondMarkers() {
  var markers = document.getElementById('second-markers');
  
  if (markers) {
    // Create all 60 second markers (0-59) including one at 12 o'clock
    for (var i = 0; i < 60; i++) {
      var angle = (i * 6) * Math.PI / 180;
      var x = 300 + 280 * Math.cos(angle);
      var y = 300 + 280 * Math.sin(angle);
      
      var marker = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      marker.setAttribute('x', -5); // Position relative to center  
      marker.setAttribute('y', 0); // Position so marker extends toward center
      marker.setAttribute('width', '10'); // Same width as sweep line
      marker.setAttribute('height', '10'); // Square marker
      marker.setAttribute('fill', 'var(--foreground)');
      marker.setAttribute('opacity', '0.3');
      marker.setAttribute('transform', 'translate(' + x + ',' + y + ') rotate(' + (i * 6) + ')');
      markers.appendChild(marker);
    }
  }
}

function createSmoothTrail() {
  // Simple approach - keep it basic like other visualizations
  // No comet trail for now, just clean smooth sweep
}

function updateSmoothSweep(seconds) {
  if (sweep) {
    var now = new Date();
    var milliseconds = now.getMilliseconds();
    var smoothSeconds = seconds + (milliseconds / 1000);
    
    // Handle minute transition (similar to classic sweep)
    var currentMinute = Math.floor(now.getTime() / 60000);
    var prevMinute = parseFloat(sweep.dataset.prevMinute) || currentMinute;
    
    if (currentMinute !== prevMinute) {
      // New minute - trigger unwind animation like classic
      sweep.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0.0, 0.2, 1)';
      sweep.style.strokeDashoffset = '0';
      setTimeout(function() {
        sweep.style.transition = 'none';
        sweep.style.strokeDashoffset = circumference;
      }, 50);
      sweep.dataset.prevMinute = currentMinute;
    } else {
      // Normal smooth update - keep it simple
      sweep.style.strokeDashoffset = circumference * (1 - (smoothSeconds / 60));
      sweep.style.transition = 'none';
    }
  }
}



// Global functions for updating modal selections
function updateThemeSelectionInModal() {
  var themeOptions = document.getElementById('theme-options');
  if (themeOptions) {
    var themeButtons = themeOptions.querySelectorAll('.option-button');
    themeButtons.forEach(function(button, index) {
      if (index === pos) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });
  }
}

function updateVisualizationSelectionInModal() {
  var visualizationOptions = document.getElementById('visualization-options');
  if (visualizationOptions) {
    var vizButtons = visualizationOptions.querySelectorAll('.option-button');
    vizButtons.forEach(function(button, index) {
      if (index === vizPos) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });
  }
}

// Settings Modal functionality
function initializeSettings() {
  var settingsGear = document.getElementById('settings-gear');
  var settingsModal = document.getElementById('settings-modal');
  var settingsClose = document.getElementById('settings-close');
  var themeOptions = document.getElementById('theme-options');
  var visualizationOptions = document.getElementById('visualization-options');
  
  // Theme display names
  var themeNames = {
    'sky-blue': 'Sky',
    'biscay': 'Biscay',
    'tangerine': 'Tangerine',
    'gin': 'Gin',
    'slate': 'Slate',
    'charcoal': 'Charcoal',
    'frost': 'Frost'
  };
  
  // Populate theme options
  themes.forEach(function(theme, index) {
    var button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = themeNames[theme] || theme;
    button.setAttribute('data-theme', theme);
    button.setAttribute('data-index', index);
    if (index === pos) {
      button.classList.add('selected');
    }
    
    button.addEventListener('click', function() {
      // Update theme selection
      pos = index;
      setTheme(theme);
      localStorage.setItem('theme', pos);
      
      // Update UI
      updateThemeSelection();
      // Don't close modal - let user continue exploring
    });
    
    themeOptions.appendChild(button);
  });
  
  // Populate visualization options
  visualizations.forEach(function(viz, index) {
    var button = document.createElement('button');
    button.className = 'option-button';
    var displayNames = {
      'classic': 'Classic',
      'rings': 'Rings',
      'dots': 'Dots',
      'smooth': 'Smooth'
    };
    button.textContent = displayNames[viz] || viz;
    button.setAttribute('data-viz', viz);
    button.setAttribute('data-index', index);
    if (index === vizPos) {
      button.classList.add('selected');
    }
    
    button.addEventListener('click', function() {
      // Update visualization selection
      vizPos = index;
      setVisualization(viz);
      localStorage.setItem('visualization', vizPos);
      
      // Update UI
      updateVisualizationSelection();
      // Don't close modal - let user continue exploring
    });
    
    visualizationOptions.appendChild(button);
  });
  
  // Open modal
  function openSettings() {
    settingsModal.classList.add('open');
    settingsClose.focus();
  }
  
  // Close modal
  function closeSettings() {
    settingsModal.classList.remove('open');
    settingsGear.focus();
  }
  
  // Update theme selection UI
  function updateThemeSelection() {
    var themeButtons = themeOptions.querySelectorAll('.option-button');
    themeButtons.forEach(function(button, index) {
      if (index === pos) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });
  }
  
  // Update visualization selection UI
  function updateVisualizationSelection() {
    var vizButtons = visualizationOptions.querySelectorAll('.option-button');
    vizButtons.forEach(function(button, index) {
      if (index === vizPos) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });
  }
  
  // Set theme function
  function setTheme(themeName) {
    // Remove all theme classes
    themes.forEach(function(theme) {
      document.body.classList.remove(theme);
    });
    document.body.classList.add(themeName);
  }
  
  // Event listeners
  settingsGear.addEventListener('click', openSettings);
  settingsClose.addEventListener('click', closeSettings);
  
  // Close modal when clicking outside
  settingsModal.addEventListener('click', function(e) {
    if (e.target === settingsModal) {
      closeSettings();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && settingsModal.classList.contains('open')) {
      closeSettings();
    }
  });
}

// Initialize settings when page loads
initializeSettings();

// Add visibility change listener after everything is initialized
if (!(typeof document.addEventListener === 'undefined' || hidden === undefined)) {
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}

console.log('Smpl New Tab: Created with <3 by Kyle Chadha @kylechadha');
