/* calanquesnationalpark.org — interactions
   mobile nav · FAQ accordion · sortable tables · type filter (both tables)
   topic banner · soft-nav interceptor (E.5) · plan pill */

(function () {
  'use strict';

  /* ---------- mobile nav ---------- */
  var burger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.parentElement.classList.toggle('open');
    });
  });

  /* ---------- plan pill ---------- */
  var planPill = document.querySelector('.plan-pill');
  if (planPill) {
    window.addEventListener('scroll', function () {
      planPill.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
  }

  /* ---------- sortable tables ---------- */
  function makeSortable(table) {
    var ths = table.querySelectorAll('thead th[data-sort]');
    ths.forEach(function (th, idx) {
      th.addEventListener('click', function () {
        var kind = th.dataset.sort;
        var tbody = table.querySelector('tbody');
        var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
        var dir = th.dataset.dir === 'asc' ? 'desc' : 'asc';
        ths.forEach(function (h) { delete h.dataset.dir; });
        th.dataset.dir = dir;
        rows.sort(function (a, b) {
          var av = a.children[idx].textContent.trim();
          var bv = b.children[idx].textContent.trim();
          if (kind === 'num') {
            var an = parseFloat(av.replace(/[^0-9.\-]/g, '')) || 0;
            var bn = parseFloat(bv.replace(/[^0-9.\-]/g, '')) || 0;
            return dir === 'asc' ? an - bn : bn - an;
          }
          return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        rows.forEach(function (r) { tbody.appendChild(r); });
      });
    });
  }
  document.querySelectorAll('table.sortable').forEach(makeSortable);

  /* ---------- catalogue filter (type axis, both tables) ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.filter-chip'));
  var banner = document.getElementById('topicBanner');
  var countEl = document.getElementById('tourCount');
  var activeType = 'all';

  var topicMessages = {
    climbing: "No climbing or via-cordata trips carry enough reviews for our catalogue yet — the Calanques climbing scene books through small local operators. Our Morgiou and Sormiou guides cover the honest state of guided climbing (spoiler: everything sold as “via ferrata” here is actually via cordata). Showing all tours instead.",
    cosquer: "Cosquer Méditerranée entry tickets are sold with timed slots — see our Cosquer Cave guide for how the replica works and the one boat-plus-cave combo that exists. Showing all tours instead.",
    riou: "The Riou archipelago is a no-landing nature reserve — no tour may put you ashore, so nothing is bookable. Cruises pass it; our Frioul guide covers the islands you can actually visit. Showing all tours instead.",
    "boat-rental": "Renting your own boat isn't a catalogue product — it's a licensing maze we explain in our boat-tours guide (short version: from Cassis, with the green park vignette). Showing all tours instead."
  };

  function setActiveType(type) {
    activeType = type || 'all';
    chips.forEach(function (c) {
      c.classList.toggle('active', c.dataset.filter === activeType);
    });
    applyFilters();
  }

  function showTopicBanner(topic) {
    if (!banner || !topicMessages[topic]) return;
    banner.textContent = topicMessages[topic];
    banner.classList.add('visible');
  }
  function hideTopicBanner() {
    if (banner) banner.classList.remove('visible');
  }

  function applyFilters() {
    var visible = 0;
    ['#toursTable', '#nicheTable'].forEach(function (id) {
      var t = document.querySelector(id);
      if (!t) return;
      t.querySelectorAll('tbody tr').forEach(function (row) {
        var tags = (row.dataset.tags || row.dataset.type || '').split(/\s+/).filter(Boolean);
        var match = activeType === 'all' || tags.indexOf(activeType) !== -1;
        if (match) {
          row.classList.remove('tour-row-hidden');
          visible++;
        } else {
          row.classList.add('tour-row-hidden');
        }
      });
    });
    if (countEl) countEl.textContent = visible;
  }

  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        setActiveType(chip.dataset.filter);
      });
    });

    /* URL params on load */
    var params = new URLSearchParams(window.location.search);
    var qType = params.get('type');
    var qTopic = params.get('topic');
    if (qType && chips.some(function (c) { return c.dataset.filter === qType; })) {
      setActiveType(qType);
    } else {
      applyFilters();
    }
    if (qTopic && topicMessages[qTopic]) showTopicBanner(qTopic);
  }

  /* ---------- soft-navigation interceptor (blueprint E.5) ---------- */
  var isToursPage = /^\/tours(\.html)?\/?$/.test(window.location.pathname);
  if (isToursPage && chips.length) {
    document.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href.indexOf('/tours?') !== 0) return;
      var target = new URL(href, window.location.origin);
      var newType = target.searchParams.get('type');
      var newTopic = target.searchParams.get('topic');
      if (!newType && !newTopic) return;
      if (newType && !chips.some(function (c) { return c.dataset.filter === newType; })) return;
      if (newTopic && !topicMessages[newTopic]) return;

      e.preventDefault();
      setActiveType(newType || 'all');
      if (newTopic) showTopicBanner(newTopic); else hideTopicBanner();

      var url = new URL(window.location.href);
      if (newType) url.searchParams.set('type', newType); else url.searchParams.delete('type');
      if (newTopic) url.searchParams.set('topic', newTopic); else url.searchParams.delete('topic');
      history.replaceState({}, '', url.toString());

      var scrollTarget = newTopic
        ? (banner || document.querySelector('.filter-bar'))
        : document.querySelector('.filter-bar');
      if (scrollTarget) scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();
