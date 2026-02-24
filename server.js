const WebSocket = require("ws");
const fetch = require("node-fetch");

const PORT = 8080;
const OTX_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your AlienVault OTX API key

const wss = new WebSocket.Server({ port: PORT }, () =>
    console.log(`WebSocket server running on ws://localhost:${PORT}`)
);

async function fetchThreats() {
    try {
        const response = await fetch(
            "https://otx.alienvault.com/api/v1/indicators/events/subscribed",
            { headers: { "X-OTX-API-KEY": OTX_API_KEY } }
        );
        const data = await response.json();
        return data.events.map(event => ({
            title: event.name,
            severity: event.threat_level || "medium",
            time: new Date(event.modified).toLocaleString()
        }));
    } catch (err) {
        console.error("Error fetching threats:", err);
        return [];
    }
}

async function broadcastThreats() {
    const threats = await fetchThreats();
    const message = JSON.stringify({ type: "update", threats });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) client.send(message);
    });
}

wss.on("connection", ws => {
    console.log("Client connected");
    fetchThreats().then(threats => ws.send(JSON.stringify({ type: "update", threats })));
    ws.on("close", () => console.log("Client disconnected"));
});

setInterval(broadcastThreats, 60000);