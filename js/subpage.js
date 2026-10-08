/* Subpage behavior: media carousel and case study sidebar.
 * Plain scroll-snap does the sliding, so touch and trackpad work without JS.
 * This file adds the buttons, counter, captions, keyboard, and sidebar highlight. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function scrollBehavior() {
    return reduceMotion.matches ? 'auto' : 'smooth';
  }

  /* ---------- Carousel ---------- */

  function initCarousel(root) {
    var track = root.querySelector('.carousel-track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    var counter = root.querySelector('.carousel-counter');
    var caption = root.querySelector('.carousel-caption');
    var total = slides.length;
    var index = -1;
    var queued = false;

    if (!track || !total) return;

    var multiple = total > 1;
    if (prev) prev.hidden = !multiple;
    if (next) next.hidden = !multiple;
    if (counter) counter.hidden = !multiple;

    slides.forEach(function (slide, i) {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (i + 1) + ' of ' + total);
    });

    function clamp(i) {
      return Math.max(0, Math.min(total - 1, i));
    }

    function currentIndex() {
      var w = track.clientWidth;
      return w ? clamp(Math.round(track.scrollLeft / w)) : 0;
    }

    function goTo(i, behavior) {
      track.scrollTo({ left: clamp(i) * track.clientWidth, behavior: behavior || scrollBehavior() });
    }

    function setDisabled(btn, off) {
      if (!btn) return;
      // aria-disabled keeps keyboard focus on the button at either end
      btn.setAttribute('aria-disabled', off ? 'true' : 'false');
    }

    function render() {
      var i = currentIndex();
      if (i === index) return;
      index = i;

      if (counter) counter.textContent = (i + 1) + ' / ' + total;
      if (caption) {
        var fc = slides[i].querySelector('figcaption');
        caption.textContent = fc ? fc.textContent : '';
      }
      setDisabled(prev, i === 0);
      setDisabled(next, i === total - 1);

      // Pause any video that has been scrolled out of view
      slides.forEach(function (slide, n) {
        var v = slide.querySelector('video');
        if (v && n !== i && !v.paused) v.pause();
      });
    }

    track.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        render();
      });
    }, { passive: true });

    if (prev) prev.addEventListener('click', function () {
      if (prev.getAttribute('aria-disabled') !== 'true') goTo(index - 1);
    });
    if (next) next.addEventListener('click', function () {
      if (next.getAttribute('aria-disabled') !== 'true') goTo(index + 1);
    });

    root.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.target.closest && e.target.closest('video')) return; // arrows seek video
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(index + 1);
      }
    });

    // Keep the current slide aligned if the frame changes size
    window.addEventListener('resize', function () {
      goTo(index < 0 ? 0 : index, 'auto');
    });

    render();
  }

  /* ---------- Case study sidebar ---------- */

  function initCaseNav() {
    var nav = document.querySelector('.case-nav');
    if (!nav) return;

    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var sections = [];
    var byId = {};

    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (sec) {
        sections.push(sec);
        byId[id] = a;
      }
    });
    if (!sections.length) return;

    var activeId = null;
    var lockTimer = null;

    function setActive(id) {
      if (id === activeId) return;
      activeId = id;
      links.forEach(function (a) {
        if (a === byId[id]) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    }

    // The active section is the last one whose top has crossed 15% of the viewport
    function update() {
      if (lockTimer) return; // a sidebar click is still scrolling
      var line = window.innerHeight * 0.15;
      var active = sections[0];
      sections.forEach(function (sec) {
        if (sec.getBoundingClientRect().top <= line) active = sec;
      });
      var atBottom = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 2;
      if (atBottom) active = sections[sections.length - 1];
      setActive(active.id);
    }

    links.forEach(function (a) {
      a.addEventListener('click', function () {
        var id = a.getAttribute('href').slice(1);
        if (!byId[id]) return;
        setActive(id);
        // Hold the clicked link while the smooth scroll passes other sections
        clearTimeout(lockTimer);
        lockTimer = setTimeout(unlock, 1200);
      });
    });

    function unlock() {
      clearTimeout(lockTimer);
      lockTimer = null;
      update();
    }
    window.addEventListener('scrollend', function () {
      if (lockTimer) unlock();
    });

    if ('IntersectionObserver' in window) {
      // Watch the top 15% of the viewport; fires as each section crosses it
      var io = new IntersectionObserver(update, { rootMargin: '0px 0px -85% 0px', threshold: [0, 1] });
      sections.forEach(function (sec) { io.observe(sec); });

      // Fires near the end of the page so a short last section still lights up
      var footer = document.querySelector('.sub-footer');
      if (footer) {
        new IntersectionObserver(update, { threshold: [0, 0.25, 0.5, 0.75, 1] }).observe(footer);
      }
    } else {
      window.addEventListener('scroll', update, { passive: true });
    }

    window.addEventListener('resize', update);
    update();
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), initCarousel);
    initCaseNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
