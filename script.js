// Fondo de pétalos
const canvas = document.getElementById('petalCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const petalColors = [
  'rgba(255, 182, 193, 0.7)',
  'rgba(255, 192, 203, 0.7)',
  'rgba(255, 218, 185, 0.7)',
  'rgba(255, 239, 213, 0.7)',
  'rgba(255, 255, 240, 0.7)'
];

const particles = [];
const particleCount = Math.floor(window.innerWidth * window.innerHeight / 5000);

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 10 + 5,
    color: petalColors[Math.floor(Math.random() * petalColors.length)],
    speedX: Math.random() * 0.5 - 0.25,
    speedY: Math.random() * 0.5 + 0.5,
    angle: Math.random() * Math.PI * 2,
    spin: Math.random() * 0.02 - 0.01
  });
}

function drawPetal(x, y, size, color, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size/2, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -size/3);
  ctx.lineTo(0, size/3);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.angle += p.spin;
    p.speedX += Math.random() * 0.02 - 0.01;
    p.speedX = Math.max(-0.5, Math.min(0.5, p.speedX));
    if (p.x < -p.size) p.x = canvas.width + p.size;
    if (p.x > canvas.width + p.size) p.x = -p.size;
    if (p.y < -p.size) {
      p.y = canvas.height + p.size;
      p.x = Math.random() * canvas.width;
    }
    if (p.y > canvas.height + p.size) {
      p.y = -p.size;
      p.x = Math.random() * canvas.width;
    }
    drawPetal(p.x, p.y, p.size, p.color, p.angle);
  }
  requestAnimationFrame(animate);
}

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

animate();

// Interactividad de la carta
const card = document.getElementById('letterCard');
const cardContainer = document.getElementById('cardContainer');
const openedMessage = document.getElementById('openedMessage');
const closeButton = document.getElementById('closeMessage');
const flap = document.getElementById('flap');

let startX = 0;
let angle = 0;
let tapped = false;
let doubleTapTimer;

card.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    startX = e.touches[0].clientX;
  }
});

card.addEventListener('touchmove', (e) => {
  if (e.touches.length === 1) {
    const moveX = e.touches[0].clientX;
    const delta = moveX - startX;
    angle += delta * 0.8; // mayor sensibilidad
    card.style.transform = `rotateY(${angle}deg)`;
    startX = moveX;
  }
});

function openMessage() {
  flap.classList.add('open');
  card.classList.add('flipped');
  cardContainer.style.opacity = 0;
  setTimeout(() => {
    cardContainer.style.display = 'none';
    openedMessage.classList.add('show');
  }, 600);
}

function closeMessage() {
  openedMessage.classList.remove('show');
  cardContainer.style.display = 'flex';
  flap.classList.remove('open');
  setTimeout(() => {
    cardContainer.style.opacity = 1;
    card.classList.remove('flipped');
    angle = 0;
    card.style.transform = `rotateY(0deg)`;
  }, 100);
}

card.addEventListener('touchend', () => {
  if (!tapped) {
    tapped = true;
    doubleTapTimer = setTimeout(() => tapped = false, 300);
  } else {
    clearTimeout(doubleTapTimer);
    openMessage();
    tapped = false;
  }
});

card.addEventListener('click', () => {
  if (!tapped) {
    tapped = true;
    doubleTapTimer = setTimeout(() => tapped = false, 300);
  } else {
    clearTimeout(doubleTapTimer);
    openMessage();
    tapped = false;
  }
});

closeButton.addEventListener('click', closeMessage);