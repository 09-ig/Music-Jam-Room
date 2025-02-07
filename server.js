import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws"; // ✅ Fixed import
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

let songQueue = [];

// WebSocket Handling
wss.on("connection", (ws) => {
    console.log("User connected");

    // Send the current queue to the new client
    ws.send(JSON.stringify({ type: "queue", data: songQueue }));

    ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.type === "add_song") {
            songQueue.push({ ...data.song, upvotes: 0, downvotes: 0 });
            broadcast({ type: "queue", data: songQueue });
        }

        if (data.type === "vote") {
            const song = songQueue.find((s) => s.id === data.songId);
            if (song) {
                data.voteType === "up" ? song.upvotes++ : song.downvotes++;
                songQueue.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes)); // Sort queue
                broadcast({ type: "queue", data: songQueue });
            }
        }
    });

    ws.on("close", () => console.log("User disconnected"));
});

// Broadcast function
const broadcast = (message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

// Serve the EJS frontend
app.get("/", (req, res) => {
    res.render("index");
});

server.listen(4000, () => console.log("Server running on port 4000"));