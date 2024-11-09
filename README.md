# Three-Body Problem Simulation

This project is a simulation of the three-body problem, a classic problem in physics that describes the motion of three celestial bodies under mutual gravitational attraction. This implementation uses JavaScript and HTML5 Canvas to visualize the gravitational interactions between three bodies in a 2D space.

## Test this app on Netlify

[Three-Body Problem Simulation](https://3-body-problem.netlify.app)

## Features

- **Real-time Simulation**: The positions and velocities of the bodies are updated in real time based on gravitational forces.
- **Dynamic Visualization**: The simulation includes a background with randomly generated stars for a more realistic appearance.
- **Configurable Parameters**: You can adjust the gravitational constant and initial conditions to explore different scenarios.

## Project Structure

- `index.html`: The main HTML file that sets up the canvas and links to the JavaScript and CSS files.
- `script.js`: The JavaScript file containing the logic for the simulation, including:
  - Gravitational force calculations
  - Position and velocity updates
  - Drawing of bodies and stars on the canvas
- `style.css`: The CSS file for styling the page and the canvas.

## Installation and Usage

1. **Clone the Repository**: Start by cloning the repository to your local machine.
   ```bash
   git clone https://github.com/ricciviero/3-body-problem.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd 3-body-problem
   ```

3. **Open `index.html` in a Browser**: Open the `index.html` file in a web browser to view and interact with the simulation.

## How It Works

- **Canvas Setup**: The canvas is initialized to fill 90% of the viewport height, with a background color of black.
- **Gravitational Force Calculation**: The gravitational force between each pair of bodies is calculated using Newton's law of gravitation. The force magnitude is adjusted by a large constant (`G = 2000`) to ensure noticeable effects.
- **Position and Velocity Updates**: Positions and velocities of the bodies are updated based on the gravitational forces acting on them. This is done using basic physics equations and Euler integration.
- **Drawing**: Bodies are represented as white circles on the canvas, and stars are randomly generated to create a starry background. The `requestAnimationFrame` method is used to continuously update the simulation.

## Example Code

Here's a snippet of the JavaScript code used for updating positions and velocities:

```javascript
function updatePositionsAndVelocities(positions, velocities, dt) {
    let forces = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (i !== j) {
                let force = gravitationalForce(positions[i], positions[j], m1, m2);
                forces[i].x += force.x;
                forces[i].y += force.y;
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        velocities[i].x += forces[i].x * dt / m1;
        velocities[i].y += forces[i].y * dt / m1;
        positions[i].x += velocities[i].x * dt;
        positions[i].y += velocities[i].y * dt;
    }
}
```

## Customization

- **Adjusting Gravitational Constant**: Modify the `G` constant in `script.js` to explore different levels of gravitational strength.
- **Initial Conditions**: Change the initial positions and velocities in the `positions` and `velocities` arrays to see how different configurations affect the simulation.

## Contributing

Feel free to fork the repository, make improvements, and submit pull requests. For major changes, please open an issue to discuss your ideas before making changes.

## Acknowledgements

- The problem of three bodies is a classical problem in physics and astronomy.
- The visualization relies on HTML5 Canvas and JavaScript for rendering and animation.

---

Feel free to customize the placeholders with your actual repository URL and contact details.
