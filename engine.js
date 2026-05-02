// 1. Configuración de Razas (Coeficientes V8.1)
const razas = {
    "1": { nombre: "Humano Mutante", rho: 1.0, beta: 0.001, u: 5000000, e: 2.0 },
    "2": { nombre: "Saiyajin", rho: 3.5, beta: 0.002, u: 70000000, e: 1.6 },
    "3": { nombre: "Namekiano", rho: 2.0, beta: 0.0015, u: 3000000, e: 1.3 }
};

// 2. Carga o Creación de Personaje
let player = JSON.parse(localStorage.getItem('db_save'));

if (!player) {
    const nombre = prompt("Bienvenido al Omni-Engine. ¿Cuál es tu nombre?", "Tomás");
    const eleccion = prompt("Elegí tu Raza:\n1. Humano Mutante (Equilibrado)\n2. Saiyajin (Crecimiento agresivo)\n3. Namekiano (Técnico)", "1");
    
    const razaSeleccionada = razas[eleccion] || razas["1"];
    
    player = {
        name: nombre,
        raza: razaSeleccionada.nombre,
        pc: 100, // Empezás desde abajo, como marca el canon
        rho: razaSeleccionada.rho,
        beta: razaSeleccionada.beta,
        u: razaSeleccionada.u,
        e: razaSeleccionada.e,
        zenis: 500,
        kext: 1.0,
        pa: 4
    };
    localStorage.setItem('db_save', JSON.stringify(player));
}

// 3. Motor Matemático
function calculateDeltaPC(intensity, dt = 0.25) {
    const friction = Math.exp(player.pc / player.u);
    const techComponent = Math.sqrt(player.pc);
    const massComponent = player.beta * player.pc;
    const delta = ((intensity * player.e * player.rho * (techComponent + massComponent)) / friction) * player.kext * dt;
    return Math.round(delta);
}

// 4. Funciones de Interfaz
function updateUI() {
    document.getElementById('pc-val').innerText = player.pc.toLocaleString();
    document.getElementById('zeni-val').innerText = player.zenis.toLocaleString();
    document.getElementById('pa-val').innerText = player.pa;
    document.getElementById('char-name').innerText = player.name + " (" + player.raza + ")";
    
    const friction = Math.exp(player.pc / player.u);
    document.getElementById('fric-val').innerText = friction.toFixed(4) + "x";
    localStorage.setItem('db_save', JSON.stringify(player));
}

function handleTrain(intensity) {
    if (player.pa <= 0) {
        logMsg("No tenés PA. Descansá para el siguiente mes.", "#e74c3c");
        return;
    }
    const gain = calculateDeltaPC(intensity);
    player.pc += gain;
    player.pa -= 1;
    logMsg(`Entrenaste con I=${intensity}. Ganaste +${gain.toLocaleString()} PC.`, "#2ecc71");
    updateUI();
}

function handleExplore() {
    if (player.pa <= 0) {
        logMsg("Estás agotado. Descansá.", "#e74c3c");
        return;
    }
    player.pa -= 1;
    const dice = Math.floor(Math.random() * 100) + 1;
    if (dice <= 60) {
        const plata = Math.floor(Math.random() * 200) + 50;
        player.zenis += plata;
        logMsg(`Encontraste un tesoro: +${plata} Z.`, "#f1c40f");
    } else {
        logMsg("No encontraste nada esta vez.", "#95a5a6");
    }
    updateUI();
}

function nextMonth() {
    player.pa = 4;
    logMsg("Nuevo mes. Puntos de Acción recuperados.", "#3498db");
    updateUI();
}

function resetGame() {
    if(confirm("¿Seguro que querés borrar tu progreso y empezar de cero?")) {
        localStorage.removeItem('db_save');
        location.reload();
    }
}

function logMsg(msg, color) {
    const log = document.getElementById('log');
    log.innerHTML += `<div style="color: ${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

window.onload = updateUI;
