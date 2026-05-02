// 1. Perfil del Jugador: Tomás (Humano Mutante)
const player = {
    name: "Tomás",
    pc: 20252,
    rho: 1.0,    // Coeficiente Racial Humano
    beta: 0.001, // Componente Proporcional
    u: 5000000,  // Umbral Mutante
    e: 2.0,      // Eficiencia de Prodigio
    zenis: 45000,
    kext: 1.0    // Gravedad Tierra (G=1)
};

// 2. Función de Actualización de Interfaz (Sincroniza el HTML)
function updateUI() {
    const pcElem = document.getElementById('pc-val');
    const zeniElem = document.getElementById('zeni-val');
    const fricElem = document.getElementById('fric-val');

    if(pcElem) pcElem.innerText = player.pc.toLocaleString();
    if(zeniElem) zeniElem.innerText = player.zenis.toLocaleString();
    if(fricElem) {
        const friction = Math.exp(player.pc / player.u);
        fricElem.innerText = friction.toFixed(4);
    }
}

// 3. Motor de Progresión: Fórmula V8.1
function calculateDeltaPC(intensity, dt = 0.25) {
    const friction = Math.exp(player.pc / player.u);
    const techComponent = Math.sqrt(player.pc);
    const massComponent = player.beta * player.pc;
    
    // ΔPC = (I * E * ρ * (√PC + β * PC) / e^(PC/U)) * Kext * Δt
    const delta = ((intensity * player.e * player.rho * (techComponent + massComponent)) / friction) * player.kext * dt;
    
    return Math.round(delta);
}

// 4. Acción: Entrenar
function handleTrain(intensity) {
    const gain = calculateDeltaPC(intensity);
    player.pc += gain;
    
    const log = document.getElementById('log');
    if(log) {
        log.innerHTML += `<div style="color: #2ecc71">> Entrenamiento (I=${intensity}): +${gain.toLocaleString()} PC.</div>`;
        log.scrollTop = log.scrollHeight; // Auto-scroll al final
    }
    updateUI();
}

// 5. Acción: Explorar (Sistema de Eventos)
function handleExplore() {
    const dice = Math.floor(Math.random() * 100) + 1;
    let eventMsg = "";
    const log = document.getElementById('log');

    if (dice <= 50) {
        // Evento Económico
        const encontraste = Math.floor(Math.random() * 500) + 100;
        player.zenis += encontraste;
        eventMsg = `<span style="color: #f1c40f">> Exploración: Encontraste una cápsula con ${encontraste} Zenis.</span>`;
    } 
    else if (dice <= 85) {
        // Encuentro de Combate
        const enemigoPC = 150 + Math.floor(Math.random() * 100);
        const ratio = player.pc / enemigoPC;

        if (ratio > 2) {
            eventMsg = `<span style="color: #3498db">> Combate: Un dron de la Patrulla Roja (PC: ${enemigoPC}) intentó atacarte, pero lo destruiste de un golpe.</span>`;
        } else {
            eventMsg = `<span style="color: #e67e22">> Combate: Tuviste un altercado con maleantes. Ganaste, pero te tomó tiempo.</span>`;
        }
    } 
    else {
        // Evento Especial
        eventMsg = `<span style="color: #9b59b6">> Alerta: Detectás una firma de Ki artificial extraña en los Laboratorios de Capital del Oeste...</span>`;
    }

    if(log) {
        log.innerHTML += `<div>${eventMsg}</div>`;
        log.scrollTop = log.scrollHeight;
    }
    updateUI();
}

// Inicialización al cargar la página
window.onload = updateUI;
