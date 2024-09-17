// Set up the canvas context
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Ensure the canvas fills the entire width and height of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.9; // Occupies 90% of the window, the rest is for the title

// Increase the gravitational constant for greater force
const G = 2000;  // Much stronger gravitational force

// Function to generate a random number within a range
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Masses of the bodies
const m1 = 1, m2 = 1, m3 = 1;

// Random initial positions of the bodies
let positions = [
    { x: randomInRange(200, 600), y: randomInRange(200, 600) }, // Body 1
    { x: randomInRange(200, 600), y: randomInRange(200, 600) }, // Body 2
    { x: randomInRange(200, 600), y: randomInRange(200, 600) }  // Body 3
];

// Random initial velocities of the bodies
let velocities = [
    { x: randomInRange(-0.5, 3.5), y: randomInRange(-0.5, 3.5) }, // Body 1
    { x: randomInRange(-0.5, 3.5), y: randomInRange(-0.5, 3.5) }, // Body 2
    { x: randomInRange(-0.5, 3.5), y: randomInRange(-0.5, 3.5) }  // Body 3
];

// Function to generate stars (white dots) in the background
function drawStars() {
    const starCount = 200;  // Number of stars
    for (let i = 0; i < starCount; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let size = Math.random() * 2; // Random size between 0 and 2
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Function to calculate the gravitational force
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
    }
}

// Function to draw bodies with larger sizes
function drawBodies() {
    ctx.fillStyle = 'white';
    const bodySize = 6;
    for (let i = 0; i < positions.length; i++) {
        ctx.beginPath();
        ctx.arc(positions[i].x, positions[i].y, bodySize, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Simulation
function simulate() {
    const dt = 0.1;

    // Draw the background (stars)
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    drawStars();

    // Update positions and draw the bodies
    updatePositionsAndVelocities(positions, velocities, dt);
    drawBodies();

    requestAnimationFrame(simulate);  // Recursive call to update the simulation
}

// Start the simulation
simulate();