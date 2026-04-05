// Minimal jQuery shim covering exactly the API surface FlipClock.js uses.
// Does not implement AJAX, events, animation, or Deferred.
(function (global) {
  'use strict';

  function $(sel) {
    if (!(this instanceof $)) return new $(sel);

    // $(fn) — DOMContentLoaded shorthand
    if (typeof sel === 'function') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sel);
      } else {
        sel();
      }
      return this;
    }

    // $('<html>') — parse HTML fragment
    if (typeof sel === 'string' && sel.trim()[0] === '<') {
      var div = document.createElement('div');
      div.innerHTML = sel;
      this.els = Array.from(div.childNodes);
      return this;
    }

    // $(selector string)
    if (typeof sel === 'string') {
      this.els = Array.from(document.querySelectorAll(sel));
      return this;
    }

    // $(domNode)
    if (sel && sel.nodeType) {
      this.els = [sel];
      return this;
    }

    // $($wrapper)
    if (sel && sel.els) {
      this.els = sel.els;
      return this;
    }

    this.els = [];
  }

  $.fn = $.prototype;

  $.fn.each = function (fn) {
    this.els.forEach(function (el, i) { fn.call(el, i, el); });
    return this;
  };

  $.fn.find = function (sel) {
    var found = [];
    this.els.forEach(function (el) {
      Array.from(el.querySelectorAll(sel)).forEach(function (n) { found.push(n); });
    });
    var w = new $();
    w.els = found;
    return w;
  };

  $.fn.html = function (str) {
    if (str === undefined) return this.els[0] ? this.els[0].innerHTML : '';
    this.els.forEach(function (el) { el.innerHTML = str; });
    return this;
  };

  $.fn.append = function (child) {
    if (!child && child !== 0) return this; // ignore false/null/undefined
    var self = this;
    if (typeof child === 'string') {
      self.els.forEach(function (el) { el.insertAdjacentHTML('beforeend', child); });
      return this;
    }
    var nodes = child instanceof $ ? child.els : [child];
    this.els.forEach(function (el) {
      nodes.forEach(function (n) { if (n && n.nodeType) el.appendChild(n); });
    });
    return this;
  };

  $.fn.prepend = function (child) {
    if (typeof child === 'string') {
      this.els.forEach(function (el) { el.insertAdjacentHTML('afterbegin', child); });
      return this;
    }
    var nodes = child instanceof $ ? child.els : [child];
    this.els.forEach(function (el) {
      nodes.forEach(function (n) { el.insertBefore(n, el.firstChild); });
    });
    return this;
  };

  $.fn.remove = function () {
    this.els.forEach(function (el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    return this;
  };

  $.fn.next = function () {
    var found = [];
    this.els.forEach(function (el) {
      var sib = el.nextElementSibling;
      if (sib) found.push(sib);
    });
    var w = new $();
    w.els = found;
    return w;
  };

  $.fn.insertBefore = function (target) {
    var ref = target instanceof $ ? target.els[0] : target;
    if (ref && ref.parentNode) {
      this.els.forEach(function (n) { ref.parentNode.insertBefore(n, ref); });
    }
    return this;
  };

  $.fn.insertAfter = function (target) {
    var ref = target instanceof $ ? target.els[0] : target;
    if (ref && ref.parentNode) {
      var next = ref.nextSibling;
      this.els.forEach(function (n) {
        ref.parentNode.insertBefore(n, next);
      });
    }
    return this;
  };

  $.fn.addClass = function (cls) {
    cls.split(/\s+/).forEach(function (c) {
      if (!c) return;
      this.els.forEach(function (el) { el.classList.add(c); });
    }, this);
    return this;
  };

  $.fn.removeClass = function (cls) {
    cls.split(/\s+/).forEach(function (c) {
      if (!c) return;
      this.els.forEach(function (el) { el.classList.remove(c); });
    }, this);
    return this;
  };

  $.fn.css = function (prop, val) {
    this.els.forEach(function (el) { el.style[prop] = val; });
    return this;
  };

  $.fn.attr = function (name, val) {
    if (val === undefined) return this.els[0] ? this.els[0].getAttribute(name) : null;
    this.els.forEach(function (el) { el.setAttribute(name, val); });
    return this;
  };

  // $.each — handles both arrays and plain objects
  $.each = function (collection, fn) {
    if (Array.isArray(collection)) {
      collection.forEach(function (v, i) { fn.call(v, i, v); });
    } else if (collection && typeof collection === 'object') {
      Object.keys(collection).forEach(function (k) { fn.call(collection[k], k, collection[k]); });
    }
  };

  // $.extend — deep or shallow merge
  $.extend = function (deep) {
    var args = Array.from(arguments);
    var target, sources;
    if (typeof deep === 'boolean') {
      target = args[1];
      sources = args.slice(2);
    } else {
      target = deep;
      sources = args.slice(1);
      deep = false;
    }
    sources.forEach(function (src) {
      if (!src) return;
      Object.keys(src).forEach(function (k) {
        if (deep && src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) {
          if (!target[k] || typeof target[k] !== 'object') target[k] = {};
          $.extend(true, target[k], src[k]);
        } else {
          target[k] = src[k];
        }
      });
    });
    return target;
  };

  // $.isEmptyObject
  $.isEmptyObject = function (obj) {
    return obj && Object.keys(obj).length === 0;
  };

  global.jQuery = global.$ = $;
}(window));
