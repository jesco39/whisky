(function () {
  'use strict';

  var data = JSON.parse(document.getElementById('server-data').textContent);
  var remaining = data.secondsUntil;

  var label = document.getElementById('status-label');
  var countdown = document.getElementById('countdown');

  if (data.active) {
    label.textContent = 'W, Big Time!';
    countdown.hidden = true;
  } else {
    label.textContent = 'Whisky Wednesday in';
    tick();
    setInterval(tick, 1000);
  }

  function tick() {
    if (remaining <= 0) {
      location.reload();
      return;
    }

    var d = Math.floor(remaining / 86400);
    var h = Math.floor((remaining % 86400) / 3600);
    var m = Math.floor((remaining % 3600) / 60);
    var s = remaining % 60;

    setUnit('days',    d, d === 1 ? 'day' : 'days');
    setUnit('hours',   h, h === 1 ? 'hour' : 'hours');
    setUnit('minutes', m, m === 1 ? 'minute' : 'minutes');
    setUnit('seconds', s, s === 1 ? 'second' : 'seconds');

    remaining--;
  }

  function setUnit(id, value, labelText) {
    var el = document.getElementById(id);
    var digits = pad(value);
    var spans = el.querySelectorAll('.digit');
    for (var i = 0; i < spans.length; i++) {
      var next = digits[i];
      if (spans[i].textContent !== next) {
        spans[i].textContent = next;
        spans[i].classList.remove('flip');
        void spans[i].offsetWidth; // reflow to restart animation
        spans[i].classList.add('flip');
      }
    }
    el.querySelector('.unit-label').textContent = labelText;
  }

  function pad(n) {
    return n < 10 ? ['0', String(n)] : [String(Math.floor(n / 10)), String(n % 10)];
  }
}());
