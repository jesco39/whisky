(function () {
  'use strict';

  var data = JSON.parse(document.getElementById('server-data').textContent);
  var clock;

  if (data.active) {
    clock = $('.clock').FlipClock(0, { clockFace: 'DailyCounter' });
    clock.stop();
    document.getElementById('status-label').textContent = 'W, Big Time!';
  } else {
    clock = $('.clock').FlipClock(data.secondsUntil, {
      clockFace: 'DailyCounter',
      countdown: true,
    });
    document.getElementById('status-label').textContent = 'Whisky Wednesday in';
  }

  // Poll every 60 seconds; reload the page when the active state changes
  // (transitions happen at most once per week so a reload is fine).
  setInterval(function () {
    fetch('/api/status')
      .then(function (res) { return res.json(); })
      .then(function (status) {
        if (status.active !== data.active) {
          location.reload();
        }
      });
  }, 60000);
}());
