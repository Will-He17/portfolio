/* Cipher scramble: two fixed columns of Enigma-style ciphertext.
 * Groups of five uppercase letters. The DOM is built once, and each
 * tick only touches a handful of nodes so it stays cheap. */
(function () {
  'use strict';

  var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var GROUPS_PER_ROW = 2;
  var ROW_HEIGHT = 21;       // px, matches 11px font * 1.9 line-height
  var TICK_MS = 220;         // within the 150 to 300ms range
  var LETTER_MUTATIONS = 3;  // letters changed per tick
  var OPACITY_CHANGES = 2;   // groups re-faded per tick
  var MIN_OPACITY = 0.25;
  var MAX_OPACITY = 0.4;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var columns = [];
  var groups = [];
  var timer = null;
  var resizeTimer = null;

  function randLetter() {
    return LETTERS.charAt(Math.floor(Math.random() * 26));
  }

  function randGroup() {
    var s = '';
    for (var i = 0; i < 5; i++) s += randLetter();
    return s;
  }

  function makeColumn(side) {
    var el = document.createElement('div');
    el.className = 'cipher cipher--' + side;
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
  }

  // Fill both columns with enough rows for the current viewport height
  function build() {
    var rows = Math.ceil(window.innerHeight / ROW_HEIGHT) + 1;
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
          span.style.opacity = (MIN_OPACITY + Math.random() * (MAX_OPACITY - MIN_OPACITY)).toFixed(2);
          row.appendChild(span);
          groups.push(span);
        }
        frag.appendChild(row);
      }
      col.textContent = '';
      col.appendChild(frag);
    });
  }

  // One slow flicker step: mutate a few letters, nudge a few opacities
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
      g.style.opacity = (MIN_OPACITY + Math.random() * (MAX_OPACITY - MIN_OPACITY)).toFixed(2);
    }
  }

  function start() {
    if (timer || reduceMotion.matches) return;
    timer = setInterval(tick, TICK_MS);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function init() {
    columns = [makeColumn('left'), makeColumn('right')];
    build();
    start();

    // Rebuild rows after resizing settles
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    });

    // Follow the reduced motion preference if it changes live
    var onChange = function () {
      if (reduceMotion.matches) stop();
      else start();
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
