/* ═══════════════════════════════════════════════════════════════
   Valentine's Day — script.js
   Lógica completa: botón NO que huye, confeti, transiciones,
   corazones flotantes.
═══════════════════════════════════════════════════════════════ */

// ─── State ────────────────────────────────────────────────────────────────────
let isNoMoved    = false;   // false = NO está en el flujo normal
let returnTimer  = null;    // timer para que el NO vuelva a su lugar

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const screenPregunta  = document.getElementById('screen-pregunta');
const screenPopup     = document.getElementById('screen-popup');
const screenCarta     = document.getElementById('screen-carta');
const btnNoStatic     = document.getElementById('btn-no');
const btnNoFloating   = document.getElementById('btn-no-floating');
const heartsContainer = document.getElementById('hearts-container');

// ═══════════════════════════════════════════════════════════════
//  BOTÓN NO — escapa del cursor
// ═══════════════════════════════════════════════════════════════

/**
 * Mueve el botón NO a una posición aleatoria de la pantalla.
 * Si aún no había escapado, lo convierte en un botón fixed overlay;
 * si ya estaba floating, simplemente salta a otro punto.
 * Después de 5 segundos sin interacción, vuelve a su lugar original.
 */
function moveNo() {
  const margin = 80;  // px de margen para no salir de los bordes
  const maxX   = window.innerWidth  - margin;
  const maxY   = window.innerHeight - margin;

  const newX = margin / 2 + Math.random() * maxX;
  const newY = margin / 2 + Math.random() * maxY;

  // Muestra el botón flotante con las coordenadas nuevas
  btnNoFloating.style.left = newX + 'px';
  btnNoFloating.style.top  = newY + 'px';

  if (!isNoMoved) {
    // Primera huida: oculta el estático, muestra el flotante
    isNoMoved = true;
    btnNoStatic.style.visibility = 'hidden'; // mantiene espacio en el flex
    btnNoFloating.classList.remove('hidden');
  }

  scheduleNoReturn();
}

/**
 * Programa el retorno automático del botón NO a su posición
 * original (dentro del flex row) después de 5 segundos.
 */
function scheduleNoReturn() {
  if (returnTimer) clearTimeout(returnTimer);
  returnTimer = setTimeout(() => {
    isNoMoved = false;
    btnNoStatic.style.visibility = '';    // vuelve al flujo
    btnNoFloating.classList.add('hidden');
  }, 5000);
}

// ═══════════════════════════════════════════════════════════════
//  BOTÓN SÍ — lanza confeti y va al popup
// ═══════════════════════════════════════════════════════════════
function handleSi() {
  // Lanza el confeti
  fireConfetti();

  // Transición a pantalla 2
  setTimeout(() => {
    showScreen(screenPopup);
    hideScreen(screenPregunta);

    // Oculta el NO flotante si estaba visible
    btnNoFloating.classList.add('hidden');
    if (returnTimer) clearTimeout(returnTimer);
  }, 200);
}

function fireConfetti() {
  const colors  = ['#ff4d6d', '#FFC5D3', '#c9184a', '#ffffff', '#ffd6da'];
  const options = { colors, shapes: ['square'] };

  confetti({ ...options, particleCount: 100, spread: 80,  origin: { y: 0.55 } });
  setTimeout(() => {
    confetti({ ...options, particleCount: 60, spread: 110, origin: { x: 0.08, y: 0.6 } });
    confetti({ ...options, particleCount: 60, spread: 110, origin: { x: 0.92, y: 0.6 } });
  }, 400);
}

// ═══════════════════════════════════════════════════════════════
//  BOTÓN ABRIR REGALO — va a la carta final
// ═══════════════════════════════════════════════════════════════
function handleAbrirRegalo() {
  hideScreen(screenPopup);
  showScreen(screenCarta);

  // Lanza corazones flotantes
  launchFloatingHearts(18);
}

// ═══════════════════════════════════════════════════════════════
//  BOTÓN CERRAR — vuelve al principio con fade
// ═══════════════════════════════════════════════════════════════
function handleClose() {
  // Fade out
  screenCarta.style.opacity = '0';
  screenCarta.style.transition = 'opacity 0.5s ease';

  setTimeout(() => {
    // Limpia corazones flotantes
    heartsContainer.innerHTML = '';

    // Resetea carta
    screenCarta.style.opacity    = '';
    screenCarta.style.transition = '';

    // Resetea botón NO
    isNoMoved = false;
    btnNoStatic.style.visibility = '';
    btnNoFloating.classList.add('hidden');
    if (returnTimer) clearTimeout(returnTimer);

    // Vuelve a pantalla 1
    hideScreen(screenCarta);
    showScreen(screenPregunta);
  }, 500);
}

// ═══════════════════════════════════════════════════════════════
//  CORAZONES FLOTANTES
// ═══════════════════════════════════════════════════════════════
function launchFloatingHearts(count) {
  const emojis = ['♥', '💕', '💗', '🌸', '✨'];

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.classList.add('floating-heart');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      // Posición horizontal aleatoria
      el.style.left     = 10 + Math.random() * 80 + '%';
      el.style.bottom   = '-2rem';
      el.style.fontSize = 1 + Math.random() * 1.5 + 'rem';
      el.style.animationDuration = 2.5 + Math.random() * 2 + 's';
      el.style.animationDelay   = '0s';

      // Color aleatorio
      const colors = ['#fff', '#FFC5D3', '#ff758f', '#ffb3c6', '#e0aaff'];
      el.style.color = colors[Math.floor(Math.random() * colors.length)];

      heartsContainer.appendChild(el);

      // Elimina el elemento después de que termine la animación
      el.addEventListener('animationend', () => el.remove());
    }, i * 120);
  }
}

// ═══════════════════════════════════════════════════════════════
//  HELPERS — mostrar / ocultar pantallas
// ═══════════════════════════════════════════════════════════════
function showScreen(el) {
  el.classList.remove('hidden');
  el.classList.add('active');
}

function hideScreen(el) {
  el.classList.remove('active');
  el.classList.add('hidden');
}

// ═══════════════════════════════════════════════════════════════
//  ACCESIBILIDAD — Enter / Space en botones nativos ya funciona,
//  pero aseguramos que el NO flotante también responda al teclado.
// ═══════════════════════════════════════════════════════════════
btnNoFloating.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') moveNo();
});