// Imposta il contesto del canvas
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Assicurati che il canvas riempia l'intera larghezza e altezza della finestra
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.9; // Occupa il 90% della finestra, il restante è per il titolo

// Aumenta la costante gravitazionale per maggiore forza
const G = 2000;  // Forza gravitazionale molto più forte

// Funzione per generare un numero casuale in un intervallo
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Masse dei corpi
const m1 = 1, m2 = 1, m3 = 1;

// Posizioni iniziali casuali dei corpi
let positions = [
    { x: randomInRange(200, 600), y: randomInRange(200, 600) }, // Corpo 1
    { x: randomInRange(200, 600), y: randomInRange(200, 600) }, // Corpo 2
    { x: randomInRange(200, 600), y: randomInRange(200, 600) }  // Corpo 3
];

// Velocità iniziali casuali dei corpi
let velocities = [
    { x: randomInRange(-0.5, 3.5), y: randomInRange(-0.5, 3.5) }, // Corpo 1
    { x: randomInRange(-0.5, 3.5), y: randomInRange(-0.5, 3.5) }, // Corpo 2
    { x: randomInRange(-0.5, 3.5), y: randomInRange(-0.5, 3.5) }  // Corpo 3
];

// Funzione per generare stelle (puntini bianchi) sullo sfondo
function drawStars() {
    const starCount = 200;  // Numero di stelle
    for (let i = 0; i < starCount; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let size = Math.random() * 2; // Dimensione casuale tra 0 e 2
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Funzione per calcolare la forza gravitazionale
function gravitationalForce(p1, p2, m1, m2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const forceMagnitude = G * m1 * m2 / (distance * distance);
    return {
        x: forceMagnitude * dx / distance,
        y: forceMagnitude * dy / distance
    };
}

// Funzione per aggiornare le posizioni e velocità
function updatePositionsAndVelocities(positions, velocities, dt) {
    let forces = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
    ];

    // Calcolo delle forze gravitazionali tra ogni coppia di corpi
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (i !== j) {
                let force = gravitationalForce(positions[i], positions[j], m1, m2);
                forces[i].x += force.x;
                forces[i].y += force.y;
            }
        }
    }

    // Aggiornamento delle velocità e delle posizioni
    for (let i = 0; i < 3; i++) {
        velocities[i].x += forces[i].x * dt / m1;
        velocities[i].y += forces[i].y * dt / m1;
        positions[i].x += velocities[i].x * dt;
        positions[i].y += velocities[i].y * dt;
    }
}

// Funzione per disegnare i corpi con dimensioni maggiori
function drawBodies() {
    ctx.fillStyle = 'white';
    const bodySize = 6;
    for (let i = 0; i < positions.length; i++) {
        ctx.beginPath();
        ctx.arc(positions[i].x, positions[i].y, bodySize, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Simulazione
function simulate() {
    const dt = 0.1;

    // Disegna lo sfondo (stelle)
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Pulisci il canvas
    drawStars();

    // Aggiorna posizioni e disegna i corpi
    updatePositionsAndVelocities(positions, velocities, dt);
    drawBodies();

    requestAnimationFrame(simulate);  // Chiamata ricorsiva per aggiornare la simulazione
}

// Avvio della simulazione
simulate();