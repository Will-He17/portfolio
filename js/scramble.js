/* Cipher scramble: two fixed columns of Enigma-style ciphertext.
 * Groups of five uppercase letters. The DOM is built once. Two things
 * happen over it, both cheap:
 *   1. Shimmer: on a timer, a handful of letters and opacities change.
 *   2. Scroll: the column drifts downward forever. One transform per
 *      frame, and a row that leaves the bottom is recycled to the top
 *      with fresh letters, so the loop never has a seam. */
(function () {
  'use strict';

  var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var GROUPS_PER_ROW = 2;
  var ROW_HEIGHT = 21;        // px, must match .cipher-row height in style.css
  var TICK_MS = 80;           // shimmer interval
  var LETTER_MUTATIONS = 10;  // letters changed per tick
  var OPACITY_CHANGES = 6;    // groups re-faded per tick
  var MIN_OPACITY = 0.25;
  var MAX_OPACITY = 0.4;
  var SCROLL_SPEED = [30, 38]; // px per second, [left, right]

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var columns = [];  // { el, track, offset, speed }
  var groups = [];
  var timer = null;
  var raf = null;
  var lastFrame = 0;
  var resizeTimer = null;

  function randLetter() {
    return LETTERS.charAt(Math.floor(Math.random() * 26));
  }

  function randGroup() {
    var s = '';
    for (var i = 0; i < 5; i++) s += randLetter();
    return s;
  }

  function randOpacity() {
    return (MIN_OPACITY + Math.random() * (MAX_OPACITY - MIN_OPACITY)).toFixed(2);
  }

  function makeColumn(side, speed) {
    var el = document.createElement('div');
    el.className = 'cipher cipher--' + side;
    el.setAttribute('aria-hidden', 'true');
    var track = document.createElement('div');
    track.className = 'cipher-track';
    el.appendChild(track);
    document.body.appendChild(el);
    return { el: el, track: track, offset: 0, speed: speed };
  }

  // Fill both columns with enough rows for the current viewport height
  // (plus one spare row above the top so the scroll can recycle it)
  function build() {
    var rows = Math.ceil(window.innerHeight / ROW_HEIGHT) + 2;
    groups = [];

    columns.forEach(function (col) {
      var frag = document.createDocumentFragment();
      for (var r = 0; r < rows; r++) {
        var row = document.createElement('span');
        row.className = 'cipher-row';
        for (var g = 0; g < GROUPS_PER_ROW; g++) {
          var span = document.createElement('span');
          span.className = 'cipher-group';
          span.textContent = randGroup();
          span.style.opacity = randOpacity();
          row.appendChild(span);
          groups.push(span);
        }
        frag.appendChild(row);
      }
      col.track.textContent = '';
      col.track.appendChild(frag);
      col.offset = 0;
      applyOffset(col);
    });
  }

  // Track sits one row above the viewport, then slides down by `offset`
  function applyOffset(col) {
    col.track.style.transform = 'translate3d(0,' + (col.offset - ROW_HEIGHT) + 'px,0)';
  }

  // Move the bottom row to the top and give its groups new letters
  function recycleRow(col) {
    var last = col.track.lastElementChild;
    var spans = last.children;
    for (var i = 0; i < spans.length; i++) spans[i].textContent = randGroup();
    col.track.insertBefore(last, col.track.firstElementChild);
  }

  function frame(now) {
    var dt = Math.min((now - lastFrame) / 1000, 0.1); // clamp after tab switches
    lastFrame = now;

    columns.forEach(function (col) {
      col.offset += col.speed * dt;
      while (col.offset >= ROW_HEIGHT) {
        col.offset -= ROW_HEIGHT;
        recycleRow(col);
      }
      applyOffset(col);
    });

    raf = requestAnimationFrame(frame);
  }

  // One shimmer step: mutate a few letters, nudge a few opacities
  function tick() {
    if (!groups.length) return;
    var i, g, text, pos;

    for (i = 0; i < LETTER_MUTATIONS; i++) {
      g = groups[Math.floor(Math.random() * groups.length)];
      text = g.textContent;
      pos = Math.floor(Math.random() * 5);
      g.textContent = text.slice(0, pos) + randLetter() + text.slice(pos + 1);
    }

    for (i = 0; i < OPACITY_CHANGES; i++) {
      g = groups[Math.floor(Math.random() * groups.length)];
      g.style.opacity = randOpacity();
    }
  }

  function start() {
    if (timer || reduceMotion.matches) return;
    timer = setInterval(tick, TICK_MS);
    lastFrame = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    cancelAnimationFrame(raf);
    raf = null;
  }

  function init() {
    columns = [makeColumn('left', SCROLL_SPEED[0]), makeColumn('right', SCROLL_SPEED[1])];
    build();
    start();

    // Rebuild rows after resizing settles
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    });

    // Follow the reduced motion preference if it changes live
    var onChange = function () {
      if (reduceMotion.matches) {
        stop();
        columns.forEach(function (col) { col.offset = 0; applyOffset(col); });
      } else {
        start();
      }
    };
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onChange);

    // Save work while the tab is hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else start();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
