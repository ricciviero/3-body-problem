// Set up the canvas context
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Ensure the canvas fills the entire width and height of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.9;

// Replace the constant G and mass declarations with let
let G = 5000;
let m1 = 3;
let m2 = 8;
let m3 = 5;

// Define fluorescent colors with glow effects
const bodyColors = [
    { main: '#FF0000', glow: 'rgba(255, 0, 0, 0.5)' },    // Verde fluorescente
    { main: '#FBFF00', glow: 'rgba(251, 255, 0, 0.5)' },  // Magenta fluorescente
    { main: '#2600FF', glow: 'rgba(38, 0, 255, 0.5)' }   // Ciano fluorescente
];

// Random initial positions of the bodies
let positions = [
    {
        x: canvas.width / 2 + randomInRange(-100, 100),
        y: canvas.height / 2 + randomInRange(-100, 100)
    },
    {
        x: canvas.width / 2 + randomInRange(-100, 100),
        y: canvas.height / 2 + randomInRange(-100, 100)
    },
    {
        x: canvas.width / 2 + randomInRange(-100, 100),
        y: canvas.height / 2 + randomInRange(-100, 100)
    }
];

// Random initial velocities of the bodies
let velocities = [
    { x: randomInRange(-0.5, 3.5), y: randomInRange(-0.5, 3.5) },
    { x: randomInRange(-0.5, 3.5), y: randomInRange(-0.5, 3.5) },
    { x: randomInRange(-0.5, 3.5), y: randomInRange(-0.5, 3.5) }
];

// Function to generate a random number within a range
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Array to store star positions
const stars = [];

// Function to initialize stars
function initializeStars() {
    const starCount = 1600;
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.7
        });
    }
}

// Function to draw stars (fixed background)
function drawStars() {
    for (let star of stars) {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Function to calculate the gravitational force
function gravitationalForce(p1, p2, mass1, mass2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    const minDistance = 50;
    if (distance < minDistance) {
        distance = minDistance;
    }

    const forceMagnitude = G * mass1 * mass2 / (distance * distance);
    return {
        x: forceMagnitude * dx / distance,
        y: forceMagnitude * dy / distance
    };
}

// Function to draw a single body with glow effect
function drawBody(x, y, color, index) {
    const bodySize = 8;  // Increased size for better visibility
    const glowSize = 20; // Size of the glow effect

    // Draw the glow effect
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
    gradient.addColorStop(0, color.glow);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, glowSize, 0, 2 * Math.PI);
    ctx.fill();

    // Draw the main body
    ctx.fillStyle = color.main;
    ctx.beginPath();
    ctx.arc(x, y, bodySize, 0, 2 * Math.PI);
    ctx.fill();

    // Add a white core for extra brightness
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, bodySize / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Optional: Draw trails
    drawTrail(index);
}

// Array to store previous positions for trails
const trails = [[], [], []];
const maxTrailLength = 20;

// Function to draw trails
function drawTrail(index) {
    const trail = trails[index];
    trail.push({ x: positions[index].x, y: positions[index].y });

    if (trail.length > maxTrailLength) {
        trail.shift();
    }

    ctx.beginPath();
    ctx.strokeStyle = bodyColors[index].glow;
    ctx.lineWidth = 2;

    for (let i = 0; i < trail.length - 1; i++) {
        const opacity = i / trail.length;
        ctx.strokeStyle = `${bodyColors[index].main}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.moveTo(trail[i].x, trail[i].y);
        ctx.lineTo(trail[i + 1].x, trail[i + 1].y);
        ctx.stroke();
    }
}

// Function to update positions and velocities
function updatePositionsAndVelocities(positions, velocities, dt) {
    let forces = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
    ];

    const masses = [m1, m2, m3];

    // Calculate gravitational forces between each pair of bodies
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (i !== j) {
                let force = gravitationalForce(positions[i], positions[j], masses[i], masses[j]);
                forces[i].x += force.x;
                forces[i].y += force.y;
            }
        }
    }

    // Update velocities and positions
    for (let i = 0; i < 3; i++) {
        velocities[i].x += forces[i].x * dt / masses[i];
        velocities[i].y += forces[i].y * dt / masses[i];
        positions[i].x += velocities[i].x * dt;
        positions[i].y += velocities[i].y * dt;

        // Centro dello schermo
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxDistance = Math.min(canvas.width, canvas.height) * 0.4; // 40% della dimensione minima

        // Calcola la distanza dal centro
        const dx = positions[i].x - centerX;
        const dy = positions[i].y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Se il corpo è troppo lontano dal centro, applicare una forza di richiamo
        if (distance > maxDistance) {
            const angle = Math.atan2(dy, dx);
            const correction = (distance - maxDistance) * 0.1; // Fattore di correzione graduale

            positions[i].x = centerX + Math.cos(angle) * maxDistance;
            positions[i].y = centerY + Math.sin(angle) * maxDistance;

            // Inverti parzialmente la velocità e riducila
            velocities[i].x *= -0.8;
            velocities[i].y *= -0.8;
        }
    }
}

// Simulation function
function simulate() {
    const dt = 0.1;

    // Clear the canvas with slight fade effect for trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars (only called once at initialization)
    drawStars();

    // Update positions
    updatePositionsAndVelocities(positions, velocities, dt);

    // Draw bodies with their respective colors
    for (let i = 0; i < 3; i++) {
        drawBody(positions[i].x, positions[i].y, bodyColors[i], i);
    }

    requestAnimationFrame(simulate);
}

// Handle window resize
window.addEventListener('resize', () => {
    // Salva le posizioni relative al centro
    const relativePositions = positions.map(pos => ({
        x: pos.x - canvas.width / 2,
        y: pos.y - canvas.height / 2
    }));

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.9;

    // Riposiziona i corpi relativamente al nuovo centro
    positions = relativePositions.map(pos => ({
        x: canvas.width / 2 + pos.x,
        y: canvas.height / 2 + pos.y
    }));

    drawStars();
});

// Add event listeners for controls
document.getElementById('gravity').addEventListener('input', (e) => {
    G = parseInt(e.target.value);
    document.getElementById('gravity-value').textContent = G;
});

document.getElementById('mass1').addEventListener('input', (e) => {
    m1 = parseInt(e.target.value);
    document.getElementById('mass1-value').textContent = m1;
});

document.getElementById('mass2').addEventListener('input', (e) => {
    m2 = parseInt(e.target.value);
    document.getElementById('mass2-value').textContent = m2;
});

document.getElementById('mass3').addEventListener('input', (e) => {
    m3 = parseInt(e.target.value);
    document.getElementById('mass3-value').textContent = m3;
});

// Initialize and start the simulation
initializeStars(); // Initialize star positions once
simulate(); // Start the simulation