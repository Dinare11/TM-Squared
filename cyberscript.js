/* MATRIX BACKGROUND */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) drops[x] = 1;

function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

/* DASHBOARD WEBSOCKET */
let allThreats = [];
const container = document.getElementById("cyber-insights");

const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", () => console.log("Connected to WebSocket server"));

socket.addEventListener("message", event => {
    const data = JSON.parse(event.data);
    if (data.type === "update") {
        allThreats = data.threats;
        displayThreatData("all");
    }
});

socket.addEventListener("close", () => console.log("Disconnected from server"));

function displayThreatData(filter) {
    container.innerHTML = "";
    allThreats
        .filter(threat => filter === "all" || threat.severity === filter)
        .forEach(threat => {
            const card = document.createElement("div");
            card.classList.add("insight-card", threat.severity);
            card.innerHTML = `<span>${threat.title}</span><span>${threat.time}</span>`;
            container.appendChild(card);
        });
}

document.querySelectorAll(".filters button").forEach(btn => {
    btn.addEventListener("click", () => displayThreatData(btn.dataset.severity));
});

    //Canvas Animation
    const canvas = document.getElementById('networkCanvas');
    //const ctx = canvas.getContext('2d');

    // Full-page sizing
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const nodesCount = 100;
    const maxDistance = 150;

    const nodes = [];

    // Initialize nodes
    for (let i = 0; i < nodesCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 3 + 1.5
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce from edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffff';
        ctx.fill();
      });

      // Draw lines between nearby nodes
      for (let i = 0; i < nodesCount; i++) {
        for (let j = i + 1; j < nodesCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 255, ${1 - distance / maxDistance})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    // Update canvas on resize
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });