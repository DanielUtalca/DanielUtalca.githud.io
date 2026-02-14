/* ═══════════════════════════════════════════════════════════════
   Valentine's Day — script.js
   ✅ fondo.png en móvil / fondopc.png en desktop
   ✅ Música al presionar SÍ
   ✅ Botón NO que huye y se elimina correctamente
═══════════════════════════════════════════════════════════════ */

// ─── DOM refs ─────────────────────────────────────────────────
const btnNoStatic     = document.getElementById('btn-no');
const btnNoFloating   = document.getElementById('btn-no-floating');
const heartsContainer = document.getElementById('hearts-container');
const screenPregunta  = document.getElementById('screen-pregunta');
const screenPopup     = document.getElementById('screen-popup');
const screenCarta     = document.getElementById('screen-carta');
const bgLayer         = document.querySelector('.bg-layer');

// ─── Estado ───────────────────────────────────────────────────
let isNoMoved = false;

// ═══════════════════════════════════════════════════════════════
//  FONDO RESPONSIVO — cambia si el usuario rota la pantalla
//  (CSS ya maneja el caso inicial, JS cubre rotaciones)
// ═══════════════════════════════════════════════════════════════
function updateBackground() {
  if (!bgLayer) return;
  if (window.innerWidth >= 768) {
    bgLayer.style.backgroundImage = "url('fondopc.png')";
    bgLayer.style.backgroundSize  = '380px';
  } else {
    bgLayer.style.backgroundImage = "url('fondo.png')";
    bgLayer.style.backgroundSize  = '260px';
  }
}

// Aplica al cargar y en cada cambio de tamaño / rotación
updateBackground();
window.addEventListener('resize', updateBackground);

// ═══════════════════════════════════════════════════════════════
//  BOTÓN NO — huye del cursor
// ═══════════════════════════════════════════════════════════════
function moveNo() {
  if (!isNoMoved) {
    isNoMoved = true;
    // Oculta el estático sin dejar hueco
    btnNoStatic.style.opacity      = '0';
    btnNoStatic.style.pointerEvents = 'none';
    btnNoStatic.style.display      = 'none';
    // Muestra el flotante
    btnNoFloating.classList.remove('hidden');
    btnNoFloating.style.display = 'block';
  }

  const padding = 20;
  const maxX = window.innerWidth  - (btnNoFloating.offsetWidth  || 120) - padding;
  const maxY = window.innerHeight - (btnNoFloating.offsetHeight || 52)  - padding;

  btnNoFloating.style.left = Math.max(padding, Math.random() * maxX) + 'px';
  btnNoFloating.style.top  = Math.max(padding, Math.random() * maxY) + 'px';
}

// Elimina AMBAS versiones del botón NO de la vista
function killNoButton() {
  btnNoStatic.style.display       = 'none';
  btnNoStatic.style.opacity       = '0';
  btnNoStatic.style.pointerEvents = 'none';
  btnNoFloating.style.display     = 'none';
  btnNoFloating.style.left        = '-9999px';
  btnNoFloating.style.top         = '-9999px';
  btnNoFloating.classList.add('hidden');
  isNoMoved = false;
}

// ═══════════════════════════════════════════════════════════════
//  BOTÓN SÍ — confeti + música + pantalla 2
// ═══════════════════════════════════════════════════════════════
function handleSi() {
  // Inicia la música
  const audio = document.getElementById('miMusica');
  if (audio) {
    audio.play().catch(e => console.log('Audio bloqueado por el navegador:', e));
  }

  // Confeti pixelado
  if (typeof confetti !== 'undefined') {
    const colors = ['#ff4d6d', '#FFC5D3', '#c9184a', '#ffffff', '#ffd6da'];
    const opts   = { colors, shapes: ['square'] };
    confetti({ ...opts, particleCount: 100, spread: 80,  origin: { y: 0.55 } });
    setTimeout(() => {
      confetti({ ...opts, particleCount: 60, spread: 110, origin: { x: 0.08, y: 0.6 } });
      confetti({ ...opts, particleCount: 60, spread: 110, origin: { x: 0.92, y: 0.6 } });
    }, 400);
  }

  // Mata el botón NO y va a pantalla 2
  killNoButton();
  setTimeout(() => {
    screenPregunta.classList.add('hidden');
    screenPopup.classList.remove('hidden');
  }, 300);
}

// ═══════════════════════════════════════════════════════════════
//  BOTÓN ABRIR CARTA
// ═══════════════════════════════════════════════════════════════
function handleAbrirRegalo() {
  killNoButton();
  screenPopup.classList.add('hidden');
  screenCarta.classList.remove('hidden');
  launchFloatingHearts(20);
}

// ═══════════════════════════════════════════════════════════════
//  BOTÓN CERRAR — recarga la página (reset total limpio)
// ═══════════════════════════════════════════════════════════════
function handleClose() {
  location.reload();
}

// ═══════════════════════════════════════════════════════════════
//  CORAZONES FLOTANTES
// ═══════════════════════════════════════════════════════════════
function launchFloatingHearts(count) {
  const emojis = ['♥', '💕', '💗', '🌸', '✨'];
  const colors = ['#fff', '#FFC5D3', '#ff758f', '#ffb3c6'];

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.classList.add('floating-heart');
      el.textContent          = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left           = 5 + Math.random() * 90 + 'vw';
      el.style.fontSize       = 20 + Math.random() * 20 + 'px';
      el.style.color          = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = 2.5 + Math.random() * 2 + 's';
      heartsContainer.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 150);
  }
}