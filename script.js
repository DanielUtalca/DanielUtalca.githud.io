/* ═══════════════════════════════════════════════════════════════
   Valentine's Day — script.js (FIX: El botón NO desaparece)
═══════════════════════════════════════════════════════════════ */

let isNoMoved = false;
const btnNoStatic = document.getElementById('btn-no');
const btnNoFloating = document.getElementById('btn-no-floating');
const heartsContainer = document.getElementById('hearts-container');
const screenPregunta = document.getElementById('screen-pregunta');
const screenPopup = document.getElementById('screen-popup');
const screenCarta = document.getElementById('screen-carta');

// 1. Función para mover el botón y que huya
function moveNo() {
    if (!isNoMoved) {
        isNoMoved = true;
        btnNoStatic.style.opacity = '0'; 
        btnNoStatic.style.pointerEvents = 'none'; 
        btnNoFloating.classList.remove('hidden');
        btnNoFloating.style.display = 'block';
    }

    const padding = 20;
    const maxX = window.innerWidth - btnNoFloating.offsetWidth - padding;
    const maxY = window.innerHeight - btnNoFloating.offsetHeight - padding;

    const newX = Math.max(padding, Math.random() * maxX);
    const newY = Math.max(padding, Math.random() * maxY);

    btnNoFloating.style.position = 'fixed';
    btnNoFloating.style.left = newX + 'px';
    btnNoFloating.style.top = newY + 'px';
    btnNoFloating.style.zIndex = '9999';
    btnNoFloating.style.pointerEvents = 'auto';
}

// 2. Función para ELIMINAR el botón NO de la vista
function killNoButton() {
    btnNoStatic.style.display = 'none';
    btnNoFloating.style.display = 'none';
    btnNoFloating.classList.add('hidden');
    isNoMoved = false;
}

// 3. BOTÓN SÍ
function handleSi() {
    if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
    
    killNoButton(); // <--- AQUÍ LO MATAMOS PARA QUE NO SE VEA MÁS

    setTimeout(() => {
        screenPregunta.classList.add('hidden');
        screenPopup.classList.remove('hidden');
    }, 300);
}

// 4. ABRIR REGALO
function handleAbrirRegalo() {
    killNoButton(); // Refuerzo por si acaso
    screenPopup.classList.add('hidden');
    screenCarta.classList.remove('hidden');
    launchFloatingHearts(20);
}

// 5. CERRAR REGALO (Reset total)
function handleClose() {
    location.reload(); 
}

// Corazones flotantes
function launchFloatingHearts(count) {
    const emojis = ['♥', '💕', '💗'];
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const heart = document.createElement('span');
            heart.classList.add('floating-heart');
            heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            heartsContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }, i * 150);
    }
}

function handleSi() {
    // 1. Reproducir música
    const audio = document.getElementById('miMusica');
    audio.play().catch(error => console.log("El navegador bloqueó el audio inicial:", error));

    // 2. Efecto de confeti
    if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
    
    killNoButton(); 

    setTimeout(() => {
        screenPregunta.classList.add('hidden');
        screenPopup.classList.remove('hidden');
    }, 300);
}