// Constantes Raciales (Ejemplo: Humano Mutante)
const player = {
    name: "Tomás",
    pc: 20252,
    rho: 1.0,
    beta: 0.001,
    u: 5000000,
    e: 2.0,
    zenis: 45000,
    kext: 1.0
};

function calculateDeltaPC(intensity, dt = 0.25) {
    const friction = Math.exp(player.pc / player.u);
    const techComponent = Math.sqrt(player.pc);
    const massComponent = player.beta * player.pc;
    
    // Fórmula V8.1
    const delta = ((intensity * player.e * player.rho * (techComponent + massComponent)) / friction) * player.kext * dt;
    
    return Math.round(delta);
}

function train(intensity) {
    const gain = calculateDeltaPC(intensity);
    player.pc += gain;
    return `¡Entrenamiento completado! Ganaste ${gain} PC. Nuevo total: ${player.pc}`;
}