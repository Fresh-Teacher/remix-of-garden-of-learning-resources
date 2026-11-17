(function () {
  // Static pages appear before React is ready. This inline script gives the first taps a
  // direct visual effect; on hydration each component adopts the resulting page state.
  // Nothing is queued or replayed, and real links are never intercepted.
  if (window.__ftEarlyTap) return;
  window.__ftEarlyTap = true;
  var root = document.documentElement;
  var ready = function (el) { for (var key in el) if (key.indexOf('__reactProps$') === 0) return true; return false; };
  var clearEarly = function () {
    var open = document.querySelectorAll('[data-early-open]');
    for (var i = 0; i < open.length; i++) {
      open[i].removeAttribute('data-early-open');
      var t = open[i].querySelector('[data-toggle="dropdown"]');
      if (t) t.setAttribute('aria-expanded', 'false');
    }
  };
  // The homepage door is fully vanilla: one attribute on <html>, CSS does the animation.
  var openDoor = function () {
    if (root.hasAttribute('data-door-open')) return;
    root.setAttribute('data-door-open', '');
    try { sessionStorage.setItem('library-door-open', '1'); } catch (e) { /* storage unavailable */ }
    // Sound must start inside the tap itself.
    var audio = document.getElementById('audiocracker');
    if (audio && typeof audio.play === 'function') {
      try { var p = audio.play(); if (p && p.catch) p.catch(function () {}); } catch (e) { /* blocked */ }
    }
  };
  try {
    if (sessionStorage.getItem('library-door-open') === '1') root.setAttribute('data-door-open', 'restored');
  } catch (e) { /* storage unavailable */ }
  var style = document.createElement('style');
  style.textContent = 'html body [data-early-open]>.class-resource-reveal{display:flow-root!important;overflow:clip}html body [data-early-open]>.dropdown-menu,html body [data-early-open]>.class-resource-reveal>.dropdown-menu{display:block!important;visibility:visible!important;opacity:1!important}';
  (document.head || root).appendChild(style);
  document.addEventListener('click', function (event) {
    var origin = event.target;
    if (!origin || !origin.closest) return;
    // Native chat opens without hydration; only explicit actions need JavaScript.
    var chat = origin.closest('details.whatsapp-chat');
    if (chat) {
      var summary = chat.querySelector('summary');
      var info = chat.querySelector('#chat-encryption-info');
      if (origin.closest('summary')) {
        var hour = new Date().getHours();
        var period = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 18 ? 'afternoon' : 'evening';
        chat.querySelector('[data-chat-greeting]').textContent = 'Hello, good ' + period + '!';
        chat.querySelector('.wa-greeting-icon').className = 'fa-solid fa-' + (period === 'morning' ? 'sun' : period === 'afternoon' ? 'cloud-sun' : 'moon') + ' wa-greeting-icon wa-' + period;
      } else if (origin.closest('[data-chat-close]')) {
        chat.open = false;
        summary.focus();
      } else if (origin.closest('[data-chat-info-open]')) {
        info.hidden = false;
        info.querySelector('[data-chat-info-close]').focus();
      } else if (origin.closest('[data-chat-info-close]')) {
        info.hidden = true;
        chat.querySelector('[data-chat-info-open]').focus();
      } else if (origin.closest('#send-it')) {
        var message = chat.querySelector('#chat-input').value;
        if (!message.trim()) event.preventDefault();
        else origin.closest('#send-it').href = 'https://web.whatsapp.com/send?phone=+256750687790&text=' + encodeURIComponent(message);
      }
      return;
    }
    // Outside taps close open class menus at once, even before React attaches.
    var natives = document.querySelectorAll('details[name="class-resources"][open]');
    for (var n = 0; n < natives.length; n++) if (!natives[n].contains(origin)) natives[n].open = false;
    var early = document.querySelector('[data-early-open]');
    if (early && !early.contains(origin)) clearEarly();
    if (origin.closest('[data-native-dropdown]')) return;
    var menuToggle = document.querySelector('[data-early-menu]');
    var shell = document.querySelector('.library-shell');
    if (menuToggle && shell && !ready(menuToggle)) {
      if (origin.closest('[data-early-menu]')) {
        event.preventDefault(); event.stopImmediatePropagation();
        menuToggle.setAttribute('aria-expanded', shell.classList.toggle('library-mobile-open') ? 'true' : 'false');
        return;
      }
      if (shell.classList.contains('library-mobile-open') && (origin.closest('[data-early-menu-close]') || !origin.closest('.library-sidenav'))) {
        shell.classList.remove('library-mobile-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        if (origin.closest('[data-early-menu-close]')) { event.preventDefault(); event.stopImmediatePropagation(); return; }
      }
    }
    if (origin.closest('.leftcurtain,.rightcurtain,.rope')) { event.preventDefault(); openDoor(); return; }
    var trigger = origin.closest('[data-toggle="dropdown"]');
    if (!trigger || ready(trigger) || !trigger.parentElement) return;
    event.preventDefault();
    var group = trigger.parentElement;
    var wasOpen = group.hasAttribute('data-early-open');
    clearEarly();
    if (wasOpen) return;
    group.setAttribute('data-early-open', '');
    trigger.setAttribute('aria-expanded', 'true');
  }, true);
  document.addEventListener('keydown', function (event) {
    var chat = document.querySelector('details.whatsapp-chat[open]');
    if (chat) {
      var info = chat.querySelector('#chat-encryption-info');
      if (event.key === 'Tab' && !info.hidden) {
        var first = info.querySelector('[data-chat-info-close]');
        var last = info.querySelector('.encryption-modal-link');
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
      if (event.key === 'Escape') {
        if (!info.hidden) { info.hidden = true; chat.querySelector('[data-chat-info-open]').focus(); }
        else { chat.open = false; chat.querySelector('summary').focus(); }
        return;
      }
    }
    if (event.key !== 'Escape') return;
    var early = document.querySelector('[data-early-open]');
    if (!early) return;
    clearEarly();
    var t = early.querySelector('[data-toggle="dropdown"]');
    if (t) t.focus();
  });
})();
