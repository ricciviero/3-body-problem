
# Simulazione Problema dei Tre Corpi

Questa guida descrive come realizzare una simulazione del problema dei tre corpi in un'applicazione React, utilizzando JavaScript per la logica della simulazione e Tailwind CSS per il design e la struttura responsive.

## Prerequisiti

- Node.js e npm installati.
- Conoscenza di base di React e Tailwind CSS.

## 1. Configurazione dell'Ambiente

1. **Crea una nuova applicazione React** con Vite:
   ```bash
   npm create vite@latest three-body-simulation --template react
   cd three-body-simulation
   ```

2. **Installa Tailwind CSS** seguendo la documentazione ufficiale:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Configura Tailwind CSS** aggiornando il file `tailwind.config.cjs`:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

4. **Aggiungi le direttive di Tailwind CSS** nel file `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## 2. Creazione dei Componenti

### `src/App.jsx`

Il file `App.jsx` fungerà da contenitore principale dell'applicazione, che include il canvas per la simulazione.

```jsx
// src/App.jsx
import SimulationCanvas from './components/SimulationCanvas';

function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <SimulationCanvas />
    </div>
  );
}

export default App;
```

### `src/components/SimulationCanvas.jsx`

Crea un componente `SimulationCanvas` per gestire il canvas dove viene visualizzata la simulazione.

```jsx
// src/components/SimulationCanvas.jsx
import React, { useEffect, useRef } from 'react';
import simulate from '../simulationLogic';

const SimulationCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    simulate(ctx, canvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border border-gray-700 rounded shadow-lg bg-white"
    />
  );
};

export default SimulationCanvas;
```

## 3. Implementazione della Logica della Simulazione

Crea il file `simulationLogic.js` per definire la logica della simulazione gravitazionale tra i tre corpi.

### `src/simulationLogic.js`

```javascript
// simulationLogic.js

// Imposta le proprietà iniziali per i tre corpi
const bodies = [
  { x: 400, y: 300, vx: 0, vy: 2, mass: 20, color: '#ff4500' },
  { x: 600, y: 300, vx: 0, vy: -2, mass: 20, color: '#1e90ff' },
  { x: 500, y: 500, vx: -2, vy: 0, mass: 20, color: '#32cd32' }
];

// Costante gravitazionale simulata per calcoli di forza
const G = 0.1;

// Funzione per calcolare la forza gravitazionale tra due corpi
function calculateForce(bodyA, bodyB) {
  const dx = bodyB.x - bodyA.x;
  const dy = bodyB.y - bodyA.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const force = (G * bodyA.mass * bodyB.mass) / (distance * distance + 0.001);
  
  return {
    fx: force * (dx / distance),
    fy: force * (dy / distance)
  };
}

// Funzione per aggiornare la posizione e la velocità di ciascun corpo
function updateBodies(bodies) {
  const forces = bodies.map(() => ({ fx: 0, fy: 0 }));

  // Calcola le forze per ogni coppia di corpi
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const force = calculateForce(bodies[i], bodies[j]);
      forces[i].fx += force.fx;
      forces[i].fy += force.fy;
      forces[j].fx -= force.fx;
      forces[j].fy -= force.fy;
    }
  }

  // Aggiorna velocità e posizione dei corpi
  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i];
    const force = forces[i];

    body.vx += force.fx / body.mass;
    body.vy += force.fy / body.mass;
    body.x += body.vx;
    body.y += body.vy;
  }
}

// Funzione principale di simulazione
export default function simulate(ctx, canvas) {
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Aggiorna la posizione dei corpi
    updateBodies(bodies);

    // Disegna ciascun corpo
    bodies.forEach(body => {
      ctx.beginPath();
      ctx.arc(body.x, body.y, body.mass, 0, 2 * Math.PI);
      ctx.fillStyle = body.color;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw(); // Avvia l'animazione
}
```

## 4. Esecuzione del Progetto

1. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```

2. **Visualizza la simulazione** aprendo il browser all'indirizzo [http://localhost:5173](http://localhost:5173).

## 5. Struttura della Cartella

La struttura finale delle cartelle del progetto sarà simile a questa:

```
three-body-simulation/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   └── SimulationCanvas.jsx
│   ├── simulationLogic.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── tailwind.config.cjs
├── postcss.config.cjs
├── package.json
└── README.md
```

## 6. Personalizzazioni Aggiuntive

- **Colore dei Corpi**: Modifica il colore di ciascun corpo nell'array `bodies` in `simulationLogic.js`.
- **Parametri di Simulazione**: Regola la massa, velocità, e posizione iniziale dei corpi per osservare diversi risultati della simulazione.

---

Questo progetto è ora configurato per essere facilmente estendibile con Tailwind CSS, mantenendo la struttura e la logica originale della simulazione.
