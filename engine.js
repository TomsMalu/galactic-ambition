// 1. Datos iniciales con carga de memoria (LocalStorage)
let player = JSON.parse(localStorage.getItem('db_save')) || {
    name: "Tomás",
    pc: 20252,
    rho: 1.0,
    beta: 0.001,
    u: 5000000,
    e: 2.0,
    zenis: 45000,
    kext: 1.0,
    pa: 4 // Puntos de Acción
};

// Guardado automático
function save() {
    localStorage.setItem('db_save', JSON.stringify(player));
}

function updateUI() {
    document.getElementById('pc-val').innerText = player.pc.toLocaleString();
    document.getElementById('zeni-val').innerText = player.zenis.toLocaleString();
    document.getElementById('pa-val').innerText = player.pa; // Necesitás agregar este ID en tu HTML
    
    const friction = Math.exp(player.pc / player.u);
    document.getElementById('fric-val').innerText = friction.toFixed(4) + "x";
    save(); 
}

// Acción: Entrenar (Consume 1 PA)
function handleTrain(intensity) {
    if (player.pa <= 0) {
        logMsg("No tenés PA suficientes. Debés descansar.", "#e74c3c");
        return;
    }
    
    const gain = calculateDeltaPC(intensity);
    player.pc += gain;
    player.pa -= 1;
    
    logMsg(`Entrenamiento (I=${intensity}): +${gain.toLocaleString()} PC. (-1 PA)`, "#2ecc71");
    updateUI();
}

// Acción: Explorar (Consume 1 PA)
function handleExplore() {
    if (player.pa <= 0) {
        logMsg("Estás exhausto. No podés explorar sin PA.", "#e74c3c");
        return;
    }

    player.pa -= 1;
    const dice = Math.floor(Math.random() * 100) + 1;
    
    if (dice <= 50) {
        const encontraste = Math.floor(Math.random() * 500) + 100;
        player.zenis += encontraste;
        logMsg(`Exploración: Encontraste ${encontraste} Zenis. (-1 PA)`, "#f1c40f");
    } else {
        logMsg("Exploración: No encontraste nada relevante este turno. (-1 PA)", "#95a5a6");
    }
    updateUI();
}

// Función para recuperar PA (Pasar de mes)
function nextMonth() {
    player.pa = 4;
    logMsg("Has descansado. Iniciando nuevo ciclo con 4 PA.", "#3498db");
    updateUI();
}

function logMsg(msg, color) {
    const log = document.getElementById('log');
    log.innerHTML += `<div style="color: ${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

// Los cálculos matemáticos se mantienen igual...
function calculateDeltaPC(intensity, dt = 0.25) {
    const friction = Math.exp(player.pc / player.u);
    const techComponent = Math.sqrt(player.pc);
    const massComponent = player.beta * player.pc;
    const delta = ((intensity * player.e * player.rho * (techComponent + massComponent)) / friction) * player.kext * dt;
    return Math.round(delta);
}

window.onload = updateUI;
