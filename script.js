const introScreen = document.getElementById('introScreen');
const enterBtn = document.getElementById('enterBtn');
enterBtn?.addEventListener('click', () => introScreen.classList.add('hidden'));

const reveals = [...document.querySelectorAll('.reveal')];
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
reveals.forEach(el => revealObserver.observe(el));

const counters = [...document.querySelectorAll('[data-target]')];
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target);
    const start = performance.now();
    const duration = 1400;
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));

const cursor = document.getElementById('cursor');
window.addEventListener('pointermove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
window.addEventListener('pointerdown', () => cursor.classList.add('active'));
window.addEventListener('pointerup', () => cursor.classList.remove('active'));

const starCanvas = document.getElementById('starfield');
const ctx = starCanvas.getContext('2d');
let stars = [];
function resizeCanvas() {
  starCanvas.width = window.innerWidth * devicePixelRatio;
  starCanvas.height = window.innerHeight * devicePixelRatio;
  starCanvas.style.width = window.innerWidth + 'px';
  starCanvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  stars = Array.from({ length: Math.min(180, Math.floor(window.innerWidth / 8)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.6 + .2,
    s: Math.random() * .25 + .08,
    a: Math.random() * .6 + .2
  }));
}
function drawStars() {
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
  for (const star of stars) {
    star.y += star.s;
    if (star.y > window.innerHeight) { star.y = -2; star.x = Math.random() * window.innerWidth; }
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${star.a})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
requestAnimationFrame(drawStars);

const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 12;
    const ry = (px - 0.5) * 12;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

const gameArena = document.getElementById('gameArena');
const scoreEl = document.getElementById('score');
const resetBtn = document.getElementById('resetGame');
let score = 0;
function spawnCore() {
  if (!gameArena) return;
  const core = document.createElement('div');
  core.className = 'core';
  const rect = gameArena.getBoundingClientRect();
  const size = 58;
  core.style.left = Math.max(6, Math.random() * (rect.width - size - 12)) + 'px';
  core.style.top = Math.max(6, Math.random() * (rect.height - size - 12)) + 'px';
  core.addEventListener('mouseenter', collect);
  core.addEventListener('touchstart', collect, { passive: true });
  function collect() {
    score += 1;
    scoreEl.textContent = score;
    core.remove();
  }
  gameArena.appendChild(core);
  setTimeout(() => core.remove(), 3800);
}
let coreInterval = setInterval(spawnCore, 900);
function resetGame() {
  score = 0;
  scoreEl.textContent = '0';
  gameArena.innerHTML = '';
}
resetBtn?.addEventListener('click', resetGame);

const soundToggle = document.getElementById('soundToggle');
let pulseOn = false;
soundToggle?.addEventListener('click', () => {
  pulseOn = !pulseOn;
  document.body.classList.toggle('audio-on', pulseOn);
  soundToggle.textContent = `Pulse mode: ${pulseOn ? 'on' : 'off'}`;
});
