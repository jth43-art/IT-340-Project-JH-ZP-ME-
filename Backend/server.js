//Used Copilot to construct basis for code
const express = require('express');
const cors = require('cors');
const app = express();

const mongoose = require("mongoose");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const homepageRoute = require("./routes/homepage");

app.use(express.json());

mongoose.connect("mongodb://100.84.183.114:27017/tunevault", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const port = 3000;
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());

app.listen(3000, '0.0.0.0', () => {
  console.log("Server running on Tailscale IP at port 3000");
});

app.use(cors());
app.use(express.json());
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/homepage", homepageRoute);

// ROUTES
app.get('/now-playing', (req, res) => {
    res.json({
        title: "Song Title",
        artist: "Artist Name",
        currentTime: "2:34",
        duration: "4:12"
    });
});

app.get('/songs/recent', (req, res) => {
    res.json([
        { title: "Song A", artist: "Artist 1" },
        { title: "Song B", artist: "Artist 2" },
        { title: "Song C", artist: "Artist 3" }
    ]);
});

app.get('/playlists', (req, res) => {
    res.json([
        { name: "Playlist 1", count: 12 },
        { name: "Playlist 2", count: 8 }
    ]);
});

app.get('/search', (req, res) => {
    const query = req.query.q;
    res.json({
        results: [
            { title: "Matching Song", artist: "Artist X" }
        ]
    });
});

app.listen(port, () => {
    console.log(`TuneVault backend running on port ${port}`);
});
