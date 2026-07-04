/* Arrow-key slide navigation between landing page variants.
   ArrowRight: / -> /ab-wording -> /ab-robotics -> / (ArrowLeft reverses). */
(function () {
  var ORDER = ['/', '/ab-wording/', '/ab-robotics/'];
  var DUR = 320;

  function normalize(path) {
    path = path.replace(/index\.html$/, '');
    if (path.length > 1 && path.charAt(path.length - 1) !== '/') path += '/';
    return path;
  }

  var here = ORDER.indexOf(normalize(location.pathname));
  if (here === -1) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var navigating = false;

  function go(dir) {
    if (navigating) return;
    navigating = true;
    var next = ORDER[(here + dir + ORDER.length) % ORDER.length];
    try { sessionStorage.setItem('slide-dir', String(dir)); } catch (e) {}
    if (reduced || !document.body) { location.href = next; return; }
    var b = document.body;
    b.style.transition = 'transform ' + DUR + 'ms cubic-bezier(.4,0,.2,1), opacity ' + DUR + 'ms ease';
    b.style.transform = 'translateX(' + (dir * -64) + 'px)';
    b.style.opacity = '0';
    setTimeout(function () { location.href = next; }, DUR - 80);
  }

  window.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
    var t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || '')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  function enter() {
    var dir = 0;
    try {
      dir = parseInt(sessionStorage.getItem('slide-dir') || '0', 10) || 0;
      sessionStorage.removeItem('slide-dir');
    } catch (e) {}
    if (!dir || reduced || !document.body) return;
    var b = document.body;
    b.style.transition = 'none';
    b.style.transform = 'translateX(' + (dir * 64) + 'px)';
    b.style.opacity = '0';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        b.style.transition = 'transform ' + DUR + 'ms cubic-bezier(.4,0,.2,1), opacity ' + DUR + 'ms ease';
        b.style.transform = '';
        b.style.opacity = '';
      });
    });
  }

  function addHint() {
    if (document.getElementById('slide-hint')) return;
    var d = document.createElement('div');
    d.id = 'slide-hint';
    d.textContent = '← ' + (here + 1) + ' / ' + ORDER.length + ' →';
    d.style.cssText = 'position:fixed;bottom:14px;left:50%;transform:translateX(-50%);' +
      'font:11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;' +
      'color:#fff;mix-blend-mode:difference;opacity:.5;z-index:9000;pointer-events:none;';
    document.body.appendChild(d);
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // The homepage is a self-unpacking bundle that replaces documentElement
    // after load; wait for the swap before touching the (new) body.
    if (document.getElementById('__bundler_thumbnail')) {
      var oldRoot = document.documentElement;
      var mo = new MutationObserver(function () {
        if (document.documentElement !== oldRoot) {
          mo.disconnect();
          enter();
          addHint();
        }
      });
      mo.observe(document, { childList: true });
    } else {
      enter();
      addHint();
    }
  });
})();
