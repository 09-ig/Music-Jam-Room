const socket = new WebSocket("ws://localhost:4000");

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "queue") {
        updateQueue(data.data);
    }
};

const updateQueue = (queue) => {
    const queueList = document.getElementById("queue");
    queueList.innerHTML = "";

    queue.forEach((song, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
      ${index === 0 ? "<strong>🎵 Now Playing:</strong>" : ""} ${song.title} (${song.upvotes - song.downvotes})
      <button onclick="voteSong('${song.id}', 'up')">👍</button>
      <button onclick="voteSong('${song.id}', 'down')">👎</button>
    `;
        queueList.appendChild(li);
    });

    if (queue.length > 0) {
        document.getElementById("youtubePlayer").src = `https://www.youtube.com/embed/${queue[0].id}`;
    }
};

const addSong = (song) => {
    socket.send(JSON.stringify({ type: "add_song", song }));
};

const voteSong = (songId, voteType) => {
    socket.send(JSON.stringify({ type: "vote", songId, voteType }));
};

const searchSongs = async () => {
    const query = document.getElementById("searchQuery").value;
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${YOUR_YOUTUBE_API_KEY}`);
    const data = await res.json();

    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    data.items.forEach((video) => {
        const li = document.createElement("li");
        li.innerHTML = `
      ${video.snippet.title}
      <button onclick="addSong({ id: '${video.id.videoId}', title: '${video.snippet.title}' })">Add to Queue</button>
    `;
        searchResults.appendChild(li);
    });
};
