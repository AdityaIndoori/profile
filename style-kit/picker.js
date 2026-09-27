// aindoori style kit picker. Load synchronously as the FIRST element of <body> (no flash of the
// wrong style), then put <select data-style-picker></select> anywhere on the page.
// Options on the script tag: data-follow-system (use the OS light/dark preference until the
// visitor picks), data-original-dark / data-original-light (labels for the site's own looks).
(function () {
  'use strict';
  var me = document.currentScript || {};
  var ds = me.dataset || {};
  var KEY = 'aindoori-style';
  var STYLES = [{"id":"modern-dark","name":"Modern Dark","mode":"dark","google":"family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"},{"id":"minimal-dark","name":"Minimal Dark","mode":"dark","google":"family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"},{"id":"professional","name":"Professional","mode":"light","google":"family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Source+Sans+3:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap"},{"id":"enterprise","name":"Enterprise","mode":"light","google":"family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"},{"id":"swiss-minimalist","name":"Swiss Minimalist","mode":"light","google":"family=Inter:wght@400;500;700;900&display=swap"},{"id":"newsprint","name":"Newsprint","mode":"light","google":"family=Playfair+Display:wght@400;700;900&family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap"}];
  var ORIGINALS = [
    { id: 'original-dark', name: ds.originalDark || 'Original (dark)', mode: 'dark', original: true },
    { id: 'original-light', name: ds.originalLight || 'Original (light)', mode: 'light', original: true }
  ];
  var ALL = ORIGINALS.concat(STYLES);

  function find(id) { for (var i = 0; i < ALL.length; i++) if (ALL[i].id === id) return ALL[i]; return null; }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var sysLight = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  function initial() {
    var saved = read(KEY);
    if (saved && find(saved)) return saved;
    var legacy = read('theme'); // the old dark/light toggle stored 'light' or 'dark' here
    if (legacy === 'light') return 'original-light';
    if (legacy === 'dark') return 'original-dark';
    if (ds.followSystem !== undefined && sysLight && sysLight.matches) return 'original-light';
    return 'original-dark';
  }

  function fonts(t) {
    var link = document.getElementById('style-kit-fonts');
    if (!t.google) { if (link) link.removeAttribute('href'); return; }
    if (!link) {
      link = document.createElement('link');
      link.id = 'style-kit-fonts'; link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    var href = 'https://fonts.googleapis.com/css2?' + t.google;
    if (link.getAttribute('href') !== href) link.setAttribute('href', href);
  }

  function apply(id, persist) {
    var t = find(id) || ALL[0];
    var b = document.body;
    if (t.original) b.removeAttribute('data-style'); else b.setAttribute('data-style', t.id);
    b.classList.toggle('light-mode', t.id === 'original-light');
    b.setAttribute('data-style-mode', t.mode);
    document.documentElement.style.colorScheme = t.mode;
    fonts(t);
    if (persist) { write(KEY, t.id); if (t.original) write('theme', t.mode); }
    var sels = document.querySelectorAll('select[data-style-picker]');
    for (var i = 0; i < sels.length; i++) sels[i].value = t.id;
    return t;
  }

  function group(label, items) {
    var g = document.createElement('optgroup');
    g.label = label;
    items.forEach(function (t) {
      var o = document.createElement('option');
      o.value = t.id; o.textContent = t.name;
      g.appendChild(o);
    });
    return g;
  }

  function build() {
    var sels = document.querySelectorAll('select[data-style-picker]');
    for (var i = 0; i < sels.length; i++) {
      var s = sels[i];
      if (s.options.length) continue;
      s.appendChild(group('Original', ORIGINALS));
      var dark = STYLES.filter(function (t) { return t.mode === 'dark'; });
      var light = STYLES.filter(function (t) { return t.mode !== 'dark'; });
      if (dark.length) s.appendChild(group('Dark styles', dark));
      if (light.length) s.appendChild(group('Light styles', light));
      s.value = current.id;
      s.addEventListener('change', function (e) { current = apply(e.target.value, true); });
    }
  }

  var current = apply(initial(), false);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
  if (sysLight && ds.followSystem !== undefined) {
    var onSys = function (e) { if (!read(KEY) && !read('theme')) current = apply(e.matches ? 'original-light' : 'original-dark', false); };
    if (sysLight.addEventListener) sysLight.addEventListener('change', onSys); else if (sysLight.addListener) sysLight.addListener(onSys);
  }
  window.aindooriStyle = { apply: function (id) { current = apply(id, true); return current.id; }, list: function () { return ALL.map(function (t) { return t.id; }); } };
})();
