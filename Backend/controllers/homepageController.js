//Used Copilot to construct basis for code
exports.getHomepageData = async (req, res) => {
    try {
        const nowPlaying = {
            title: "Song Title",
            artist: "Artist Name",
            currentTime: "2:34",
            duration: "4:12"
        };
        const recentSongs = [
            { title: "Song A", artist: "Artist 1" },
            { title: "Song B", artist: "Artist 2" },
            { title: "Song C", artist: "Artist 3" }
        ];
        const playlists = [
            { name: "Playlist 1", count: 12 },
            { name: "Playlist 2", count: 8 }
        ];
        return res.status(200).json({
            nowPlaying,
            recentSongs,
            playlists
        });
    } catch (err) {
        console.error("Homepage error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
