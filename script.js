(function () {
  var h = new Date().getHours();
  var period = 'night';
  if (h >= 5 && h < 8) period = 'dawn';
  else if (h >= 8 && h < 18) period = 'day';
  else if (h >= 18 && h < 20) period = 'dusk';
  document.documentElement.setAttribute('data-time', period);
})();

(function () {
  document.body.classList.add('gate-open');
  var gate = document.getElementById('gate');
  var yesBtn = document.getElementById('gate-yes');
  var noBtn = document.getElementById('gate-no');
  var hint = document.getElementById('gate-hint');
  var noClicks = 0;
  var MAX_CLICKS = 6;
  var HINTS = [
    'segura… ¿segura?',
    'el "no" se está achicando 👀',
    'ya casi no queda "no"',
    'un poquito más...',
    'al "no" ya casi no lo ves',
    'y así desaparece el "no" 🌼'
  ];

  noBtn.addEventListener('click', function () {
    noClicks = Math.min(noClicks + 1, MAX_CLICKS);
    var t = noClicks / MAX_CLICKS;
    var yesScale = 1 + t * 1.7;
    var noScale = Math.max(1 - t * 1.05, 0.001);
    var dx = (Math.random() * 50 - 25) * t;
    var dy = (Math.random() * 18 - 9) * t;
    yesBtn.style.transform = 'scale(' + yesScale.toFixed(2) + ')';
    noBtn.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + noScale.toFixed(2) + ')';
    noBtn.style.opacity = String(Math.max(1 - t * 1.15, 0));
    hint.hidden = false;
    hint.textContent = HINTS[noClicks - 1] || HINTS[HINTS.length - 1];
    if (noClicks >= MAX_CLICKS) {
      noBtn.disabled = true;
      noBtn.style.pointerEvents = 'none';
      setTimeout(function () { noBtn.hidden = true; }, 250);
    }
  });

  function openFlowers() {
    gate.classList.add('gate-leaving');
    document.body.classList.remove('gate-open');
    document.body.classList.add('revealed');
    setTimeout(function () { gate.hidden = true; }, 650);
  }
  yesBtn.addEventListener('click', openFlowers);

  // ---- ambient golden dust ----
  var canvas = document.getElementById('dust-canvas');
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motes = [];

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function makeMote() {
    return {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + Math.random() * 200,
      r: 0.8 + Math.random() * 1.8,
      speed: 0.15 + Math.random() * 0.35,
      drift: Math.random() * 0.5 - 0.25,
      phase: Math.random() * Math.PI * 2
    };
  }
  var count = reduceMotion ? 0 : (window.innerWidth < 600 ? 22 : 40);
  for (var m = 0; m < count; m++) motes.push(makeMote());

  function tick(t) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    motes.forEach(function (p) {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -20) { p.y = window.innerHeight + 20; p.x = Math.random() * window.innerWidth; }
      var tw = 0.4 + 0.6 * Math.abs(Math.sin(t / 900 + p.phase));
      ctx.beginPath();
      ctx.fillStyle = 'rgba(245, 225, 74, ' + (tw * 0.7).toFixed(2) + ')';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  if (!reduceMotion) requestAnimationFrame(tick);
})();
