/* ═══════════════════════════════════════════════════════════════
   Valentine's Day — script.js
   BUGS CORREGIDOS:
   ✅ NO flotante se oculta en pantallas 2 y 3
   ✅ NO estático no reaparece junto al flotante (doble NO)
   ✅ Al volver de pantalla 3 el estado resetea limpio
   ✅ visibility:hidden → display:none para evitar espacio fantasma
═══════════════════════════════════════════════════════════════ */

// ─── Estado global ────────────────────────────────────────────
let isNoMoved   = false;
let returnTimer = null;
let currentScreen = 1;   // 1 | 2 | 3

// ─── DOM refs ─────────────────────────────────────────────────
const screenPregunta  = document.getElementById('screen-pregunta');
const screenPopup     = document.getElementById('screen-popup');
const screenCarta     = document.getElementById('screen-carta');
const btnNoStatic     = document.getElementById('btn-no');
const btnNoFloating   = document.getElementById('btn-no-floating');
const heartsContainer = document.getElementById('hearts-container');

// ═══════════════════════════════════════════════════════════════
//  HELPERS — pantallas
// ═══════════════════════════════════════════════════════════════
function showScreen(el) {
  el.classList.remove('hidden');
}

function hideScreen(el) {
  el.classList.add('hidden');
}

// ═══════════════════════════════════════════════════════════════
//  RESET completo del botón NO
//  Siempre llamar esto al salir de pantalla 1
// ═══════════════════════════════════════════════════════════════
function resetNoBtn() {
  if (returnTimer) clearTimeout(returnTimer);
  returnTimer = null;

  // ✅ Mismo orden seguro: flotante fuera primero, luego estático
  btnNoFloating.classList.add('hidden');
  btnNoFloating.style.left = '-999px';
  btnNoFloating.style.top  = '-999px';

  requestAnimationFrame(() => {
    isNoMoved = false;
    btnNoStatic.style.display = '';
  });
}

// ═══════════════════════════════════════════════════════════════
//  BOTÓN NO — huye del cursor
// ═══════════════════════════════════════════════════════════════
function moveNo() {
  // Solo actúa si estamos en pantalla 1
  if (currentScreen !== 1) return;

  const btnW  = 120;
  const btnH  = 52;
  const newX  = btnW / 2 + Math.random() * (window.innerWidth  - btnW);
  const newY  = btnH / 2 + Math.random() * (window.innerHeight - btnH);

  // Primera huida: oculta el estático con display:none (sin hueco)
  if (!isNoMoved) {
    isNoMoved = true;
    btnNoStatic.style.display = 'none';
    btnNoFloating.classList.remove('hidden');
  }

  // Mueve el flotante
  btnNoFloating.style.left = newX + 'px';
  btnNoFloating.style.top  = newY + 'px';

  // Programa retorno automático en 5s
  if (returnTimer) clearTimeout(returnTimer);
  returnTimer = setTimeout(() => {
    // ✅ ORDEN CORRECTO: ocultar flotante PRIMERO, luego mostrar estático
    // Esto evita que aparezcan dos NO al mismo tiempo
    btnNoFloating.classList.add('hidden');
    btnNoFloating.style.left = '-999px';   // saca el flotante fuera de pantalla
    btnNoFloating.style.top  = '-999px';   // por si el hidden tiene delay de CSS

    // Pequeño frame de espera para que el browser procese el ocultamiento
    requestAnimationFrame(() => {
      isNoMoved = false;
      btnNoStatic.style.display = '';      // ahora sí reaparece el estático
    });
  }, 5000);
}

// ═══════════════════════════════════════════════════════════════
//  BOTÓN SÍ
// ═══════════════════════════════════════════════════════════════
function handleSi() {
  fireConfetti();

  // Limpia el NO antes de cambiar pantalla
  resetNoBtn();
  currentScreen = 2;

  setTimeout(() => {
    hideScreen(screenPregunta);
    showScreen(screenPopup);
  }, 150);
}

function fireConfetti() {
  if (typeof confetti === 'undefined') return;
  const colors  = ['#ff4d6d', '#FFC5D3', '#c9184a', '#ffffff', '#ffd6da'];
  const opts    = { colors, shapes: ['square'] };

  confetti({ ...opts, particleCount: 100, spread: 80,  origin: { y: 0.55 } });
  setTimeout(() => {
    confetti({ ...opts, particleCount: 60, spread: 110, origin: { x: 0.08, y: 0.6 } });
    confetti({ ...opts, particleCount: 60, spread: 110, origin: { x: 0.92, y: 0.6 } });
  }, 400);
}

// ═══════════════════════════════════════════════════════════════
//  BOTÓN ABRIR REGALO
// ═══════════════════════════════════════════════════════════════
function handleAbrirRegalo() {
  currentScreen = 3;
  hideScreen(screenPopup);
  showScreen(screenCarta);
  launchFloatingHearts(18);
}

// ═══════════════════════════════════════════════════════════════
//  BOTÓN CERRAR REGALO — vuelve a pantalla 1
// ═══════════════════════════════════════════════════════════════
function handleClose() {
  screenCarta.style.opacity    = '0';
  screenCarta.style.transition = 'opacity 0.45s ease';

  setTimeout(() => {
    // Limpia hearts flotantes
    heartsContainer.innerHTML = '';

    // Resetea estilos de carta
    screenCarta.style.opacity    = '';
    screenCarta.style.transition = '';

    // Vuelve a pantalla 1 con estado limpio
    currentScreen = 1;
    resetNoBtn();

    hideScreen(screenCarta);
    showScreen(screenPregunta);
  }, 450);
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
      el.style.left           = 5 + Math.random() * 90 + '%';
      el.style.bottom         = '-2rem';
      el.style.fontSize       = 1 + Math.random() * 1.5 + 'rem';
      el.style.color          = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = 2.5 + Math.random() * 2 + 's';
      heartsContainer.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 130);
  }
}

// ═══════════════════════════════════════════════════════════════
//  TECLADO — NO flotante responde a Enter/Space
// ═══════════════════════════════════════════════════════════════
btnNoFloating.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') moveNo();
});