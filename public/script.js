// Set up the canvas context
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Ensure the canvas fills the entire width and height of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.9;

// Increase the gravitational constant for greater force
const G = 2700;

// Define fluorescent colors with glow effects
const bodyColors = [
    { main: '#00ff00', glow: 'rgba(0, 255, 0, 0.5)' },    // Verde fluorescente
    { main: '#ff00ff', glow: 'rgba(255, 0, 255, 0.5)' },  // Magenta fluorescente
    { main: '#00ffff', glow: 'rgba(0, 255, 255, 0.5)' }   // Ciano fluorescente
];

// Masses of the bodies
const m1 = 1, m2 = 1, m3 = 1;

// Random initial positions of the bodies
let positions = [
    { x: randomInRange(200, 600), y: randomInRange(200, 600) },
    { x: randomInRange(200, 600), y: randomInRange(200, 600) },
    { x: randomInRange(200, 600), y: randomInRange(200, 600) }
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
function gravitationalForce(p1, p2, m1, m2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Evita che la distanza diventi troppo piccola (valore minimo di sicurezza)
    const minDistance = 50; // Valore minimo per evitare collisioni, puoi regolarlo
    if (distance < minDistance) {
        distance = minDistance;
    }

    const forceMagnitude = G * m1 * m2 / (distance * distance);
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

    // Calculate gravitational forces between each pair of bodies
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (i !== j) {
                let force = gravitationalForce(positions[i], positions[j], m1, m2);
                forces[i].x += force.x;
                forces[i].y += force.y;
            }
        }
    }

    // Update velocities and positions
    for (let i = 0; i < 3; i++) {
        velocities[i].x += forces[i].x * dt / m1;
        velocities[i].y += forces[i].y * dt / m1;
        positions[i].x += velocities[i].x * dt;
        positions[i].y += velocities[i].y * dt;

        // Add boundary checks to keep bodies within canvas
        if (positions[i].x < 0 || positions[i].x > canvas.width) {
            velocities[i].x *= -0.8; // Bounce with some energy loss
            positions[i].x = Math.max(0, Math.min(canvas.width, positions[i].x));
        }
        if (positions[i].y < 0 || positions[i].y > canvas.height) {
            velocities[i].y *= -0.8; // Bounce with some energy loss
            positions[i].y = Math.max(0, Math.min(canvas.height, positions[i].y));
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.9;
    drawStars(); // Redraw stars on resize
});

// Initialize and start the simulation
initializeStars(); // Initialize star positions once
simulate(); // Start the simulation