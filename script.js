// Массив треков (добавь свои)
const tracks = [
    {
        title: "NIRWANA",
        artist: "Lithium",
        src: "tracks/Lithium.mp3",
        cover: "images/Lithium.jpg"
    },
    {
        title: "NIRWANA",
        artist: "Come As You Are",
        src: "tracks/ComeAsYouAre.mp3",
        cover: "images/ComeAsYouAre.jpg"
    },
    {
        title: "NIRWANA",
        artist: "Smells Like Teen Spirit",
        src: "tracks/SmellsLikeTeenSpirit.mp3",
        cover: "images/SmellsLikeTeenSpirit.jpg"
    },
    {
        title: "NIRWANA",
        artist: "Something In The Way",
        src: "tracks/SomethingInTheWay.mp3",
        cover: "images/SomethingInTheWay.jpg"
    },
    {
        title: "NIRWANA",
        artist: "In Bloom",
        src: "tracks/InBloom.mp3",
        cover: "images/InBloom.jpg"
    },
    {
        title: "NIRWANA",
        artist: "I am so happy",
        src: "tracks/Iamsohappy.mp3",
        cover: "images/Iamsohappy.jpg"
    },
    {
        title: "NIRWANA",
        artist: "You Know Youre Right",
        src: "tracks/YouKnowYoureRight.mp3",
        cover: "images/YouKnowYoureRight.jpg"
    },
    {
        title: "NIRWANA",
        artist: "Breed",
        src: "tracks/Breed.mp3",
        cover: "images/Breed.jpg"
    },
];

const trackListBlock = document.getElementById("track-list-block");
const playerBlock = document.getElementById("player-block");
const trackList = document.getElementById("track-list");

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");

const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const volumeSlider = document.getElementById("volume");
const backBtn = document.getElementById("back");

const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");

let currentTrack = 0;
let isShuffle = false;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

tracks.forEach((track, index) => {
    const li = document.createElement("li");

    const infoSpan = document.createElement("span");
    infoSpan.className = "track-info";
    infoSpan.textContent = `${track.title} - ${track.artist}`;

    const durationSpan = document.createElement("span");
    durationSpan.className = "duration";
    durationSpan.textContent = "0:00";

    const tempAudio = new Audio();
    tempAudio.src = track.src;
    tempAudio.addEventListener("loadedmetadata", () => {
        durationSpan.textContent = formatTime(tempAudio.duration);
    });

    li.appendChild(infoSpan);
    li.appendChild(durationSpan);

    li.addEventListener("click", () => {
        currentTrack = index;
        loadTrack(currentTrack, true);
        trackListBlock.classList.add("hidden");
        playerBlock.classList.remove("hidden");
    });

    trackList.appendChild(li);
});

// Загрузка трека
function loadTrack(index, shouldPlay = false) {
    const track = tracks[index];
    audio.src = track.src;
    cover.src = track.cover;
    title.textContent = track.title;
    artist.textContent = track.artist;

    audio.onloadedmetadata = () => {
        if (audio.duration) {
            totalTimeEl.textContent = formatTime(audio.duration);
            progress.value = 0;
            currentTimeEl.textContent = "0:00";
        }
    };

    updatePlayPauseButton(false);

    if (shouldPlay) {
        audio.play().catch(() => updatePlayPauseButton(false));
    } else {
        audio.pause();
    }
}

function updatePlayPauseButton(isPlaying) {
    playPauseBtn.textContent = isPlaying ? "❚❚" : "▶";
    playPauseBtn.setAttribute("aria-label", isPlaying ? "Пауза" : "Воспроизведение");
}

playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

audio.addEventListener("play", () => updatePlayPauseButton(true));
audio.addEventListener("pause", () => updatePlayPauseButton(false));

audio.addEventListener("ended", () => {
    nextTrack(true);
});

function nextTrack(forcePlay = null) {
    const shouldPlay = forcePlay === null ? !audio.paused : forcePlay;

    if (isShuffle) {
        playRandomTrack(shouldPlay);
    } else {
        currentTrack = (currentTrack + 1) % tracks.length;
        loadTrack(currentTrack, shouldPlay);
    }
}

prevBtn.addEventListener("click", () => {
    const shouldPlay = !audio.paused;
    if (isShuffle) {
        playRandomTrack(shouldPlay);
    } else {
        currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrack, shouldPlay);
    }
});

nextBtn.addEventListener("click", () => {
    nextTrack(null);
});

shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
});

function playRandomTrack(shouldPlay) {
    let randomIndex;
    if (tracks.length <= 1) {
        randomIndex = 0;
    } else {
        do {
            randomIndex = Math.floor(Math.random() * tracks.length);
        } while (randomIndex === currentTrack);
    }
    currentTrack = randomIndex;
    loadTrack(currentTrack, shouldPlay);
}

volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
});

backBtn.addEventListener("click", () => {
    audio.pause();
    playerBlock.classList.add("hidden");
    trackListBlock.classList.remove("hidden");
});

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

progress.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

loadTrack(currentTrack, false);