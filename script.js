// Song Data
const songs = [
    {
        title: "To The End Of The World",
        artist: "National Sweetheart",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778311948/To_The_End_Of_The_World_-_National_Sweetheart_v1fc33.mp3"
    },
    {
        title: "Turn In The Sun",
        artist: "Simon Herody",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778311942/Turn_In_The_Sun_-_Simon_Herody_al0npr.mp3"
    },
    {
        title: "Working",
        artist: "Cory Barker feat. Jordan King",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778311940/Working_-_Cory_Barker_feat._Jordan_King_aiif5i.mp3"
    },
    {
        title: "Taught Her How To Leave",
        artist: "Bill Douglas",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778311938/Taught_Her_How_To_Leave_-_Bill_Douglas_kxxice.mp3"
    },
    {
        title: "Be The One",
        artist: "Lore Vain",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778311938/Be_The_One_-_Lore_Vain_mjr8qj.mp3"
    },
    {
        title: "The Fog",
        artist: "Trey Xavier & Rod Kim",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778311937/The_Fog_-_Trey_Xavier_Rod_Kim_fttqvw.mp3"
    },
    {
        title: "Delirium",
        artist: "Anno Domini Beats",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778311937/Delirium_-_Anno_Domini_Beats_qqlxhe.mp3"
    },
    {
        title: "Tonight Again",
        artist: "Rod Kim feat. Mostly Moss",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778311935/Tonight_Again_-_Rod_Kim_feat._Mostly_Moss_inwjnc.mp3"
    },
    {
        title: "Back To The Start",
        artist: "Patrick Jordan Patrikios",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778311934/Back_To_The_Start_-_Patrick_Jordan_Patrikios_hipknj.mp3"
    },
    {
        title: "I Hate Your Face",
        artist: "The Soundlings",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778320176/I_Hate_Your_Face_-_The_Soundlings_pjauqv.mp3"
    },
    {
        title: "Foolish Notions",
        artist: "Blue Deer",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778320174/Foolish_Notions_-_Blue_Deer_gws5xn.mp3"
    },
    {
        title: "Stake Out",
        artist: "Alex Jones & Xander Jones",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778320173/Stake_Out_-_Alex_Jones___Xander_Jones_ykkxw0.mp3"
    },
    {
        title: "Me In My Own Skin",
        artist: "The Soundlings",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778320172/Me_In_My_Own_Skin_-_The_Soundlings_d5vni7.mp3"
    },
    {
        title: "Highway Whispers",
        artist: "Patrick Jordan Patrikios",
        url: "https://res.cloudinary.com/dlsorxutu/video/upload/v1778320171/Highway_whispers_-_Patrick_Jordan_Patrikios_qjbuca.mp3"
    }
];

// Provide the diverse cover images
const covers = ["cover.png", "cover1.png", "cover2.png", "cover3.png", "cover4.png"];
songs.forEach((song, i) => {
    song.cover = covers[i % covers.length];
    song.originalIndex = i; // Keep track of original index for playing
});

// Audio Elements and State
const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;

// DOM Elements
const songGrid = document.getElementById("songGrid");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressSlider = document.getElementById("progressSlider");
const volumeSlider = document.getElementById("volumeSlider");
const volumeIcon = document.getElementById("volumeIcon");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");

const npCover = document.getElementById("npCover");
const npTitle = document.getElementById("npTitle");
const npArtist = document.getElementById("npArtist");

// Search and Nav DOM Elements
const navHome = document.getElementById("navHome");
const navSearch = document.getElementById("navSearch");
const navLibrary = document.getElementById("navLibrary");
const mobileNavHome = document.getElementById("mobileNavHome");
const mobileNavSearch = document.getElementById("mobileNavSearch");
const mobileNavLibrary = document.getElementById("mobileNavLibrary");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const greeting = document.getElementById("greeting");
const sectionTitle = document.getElementById("sectionTitle");
const playlistList = document.getElementById("playlistList");

let displayedSongs = [...songs];

// Initialize Application
function initApp() {
    renderSongs(displayedSongs);
    loadSong(currentSongIndex);
    
    // Set initial volume
    audio.volume = volumeSlider.value / 100;
    updateSliderBackground(volumeSlider);
}

// Render song cards in the main view
function renderSongs(songsToRender) {
    songGrid.innerHTML = '';
    
    if (songsToRender.length === 0) {
        songGrid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1 / -1;">No results found for your search.</p>';
        return;
    }

    songsToRender.forEach((song) => {
        const index = song.originalIndex;
        const card = document.createElement('div');
        card.className = `song-card ${index === currentSongIndex ? 'playing' : ''}`;
        card.onclick = () => {
            if (index === currentSongIndex) {
                togglePlay();
            } else {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
                updateActiveCard();
            }
        };

        card.innerHTML = `
            <div class="card-img-container">
                <img src="${song.cover}" alt="${song.title}" class="card-img">
                <div class="card-play-btn" data-index="${index}">
                    <i class="fas fa-${index === currentSongIndex && isPlaying ? 'pause' : 'play'}"></i>
                </div>
            </div>
            <div class="card-title" title="${song.title}">${song.title}</div>
            <div class="card-artist" title="${song.artist}">${song.artist}</div>
        `;
        // Store original index for updateActiveCard logic
        card.dataset.index = index;
        songGrid.appendChild(card);
    });
}

// Update UI to reflect active card state
function updateActiveCard() {
    const cards = document.querySelectorAll('.song-card');
    cards.forEach((card) => {
        const index = parseInt(card.dataset.index);
        card.classList.toggle('playing', index === currentSongIndex);
        const playIcon = card.querySelector('.card-play-btn i');
        if (index === currentSongIndex && isPlaying) {
            playIcon.className = 'fas fa-pause';
        } else {
            playIcon.className = 'fas fa-play';
        }
    });
}

// Load song data into player
function loadSong(index) {
    const song = songs[index];
    audio.src = song.url;
    npTitle.textContent = song.title;
    npArtist.textContent = song.artist;
    npCover.src = song.cover;
    
    // Reset progress
    progressSlider.value = 0;
    currentTimeEl.textContent = "0:00";
    
    // Total time is updated on 'loadedmetadata' event
}

// Playback Controls
function playSong() {
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    updateActiveCard();
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    updateActiveCard();
}

function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
    updateActiveCard();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
    updateActiveCard();
}

// Event Listeners
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Audio Event Listeners
audio.addEventListener("loadedmetadata", () => {
    progressSlider.max = audio.duration;
    totalTimeEl.textContent = formatTime(audio.duration);
    
    // Setup background gradient update based on slider position
    updateSliderBackground(progressSlider);
});

audio.addEventListener("timeupdate", () => {
    progressSlider.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    updateSliderBackground(progressSlider);
});

audio.addEventListener("ended", nextSong);

// Slider Input Listeners
progressSlider.addEventListener("input", (e) => {
    audio.currentTime = e.target.value;
    updateSliderBackground(e.target);
});

volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
    updateSliderBackground(e.target);
    
    // Update volume icon
    if (audio.volume === 0) {
        volumeIcon.className = "fas fa-volume-mute";
    } else if (audio.volume < 0.5) {
        volumeIcon.className = "fas fa-volume-down";
    } else {
        volumeIcon.className = "fas fa-volume-up";
    }
});

volumeIcon.addEventListener("click", () => {
    if (audio.volume > 0) {
        audio.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.className = "fas fa-volume-mute";
    } else {
        audio.volume = 1;
        volumeSlider.value = 100;
        volumeIcon.className = "fas fa-volume-up";
    }
    updateSliderBackground(volumeSlider);
});

// Helper Functions
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Dynamic slider background color (fill effect before thumb)
function updateSliderBackground(slider) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    // We update the CSS custom property or inline style
    slider.style.background = `linear-gradient(to right, #1db954 0%, #1db954 ${value}%, #535353 ${value}%, #535353 100%)`;
}

// Initialize on load
initApp();

// Search and Navigation Logic
function clearNavActive() {
    navHome.classList.remove('active');
    navSearch.classList.remove('active');
    navLibrary.classList.remove('active');
    if (mobileNavHome) {
        mobileNavHome.classList.remove('active');
        mobileNavSearch.classList.remove('active');
        mobileNavLibrary.classList.remove('active');
    }
}

function goHome() {
    clearNavActive();
    navHome.classList.add('active');
    if(mobileNavHome) mobileNavHome.classList.add('active');
    searchBox.style.display = 'none';
    greeting.style.display = 'block';
    sectionTitle.textContent = 'Jump back in';
    searchInput.value = '';
    displayedSongs = [...songs];
    renderSongs(displayedSongs);
}

function goSearch() {
    clearNavActive();
    navSearch.classList.add('active');
    if(mobileNavSearch) mobileNavSearch.classList.add('active');
    searchBox.style.display = 'flex';
    greeting.style.display = 'none';
    sectionTitle.textContent = 'Browse all';
    searchInput.focus();
}

function goLibrary() {
    clearNavActive();
    navLibrary.classList.add('active');
    if(mobileNavLibrary) mobileNavLibrary.classList.add('active');
    searchBox.style.display = 'none';
    greeting.style.display = 'none';
    sectionTitle.textContent = 'Your Library';
    
    // Simulate library by showing reversed list
    displayedSongs = [...songs].reverse();
    renderSongs(displayedSongs);
}

navHome.addEventListener('click', goHome);
if(mobileNavHome) mobileNavHome.addEventListener('click', goHome);

navSearch.addEventListener('click', goSearch);
if(mobileNavSearch) mobileNavSearch.addEventListener('click', goSearch);

navLibrary.addEventListener('click', goLibrary);
if(mobileNavLibrary) mobileNavLibrary.addEventListener('click', goLibrary);

// Playlist Interactivity
if (playlistList) {
    const playlistItems = playlistList.querySelectorAll('li');
    playlistItems.forEach(item => {
        item.addEventListener('click', (e) => {
            clearNavActive();
            searchBox.style.display = 'none';
            greeting.style.display = 'none';
            sectionTitle.textContent = e.target.textContent;
            
            // Simulate unique playlist by shuffling songs (based on playlist text length to be deterministic)
            const seed = e.target.textContent.length;
            displayedSongs = [...songs].sort((a, b) => (a.title.length * seed) % 3 - (b.title.length * seed) % 3);
            
            // Ensure we don't show all songs for some playlists to make them feel different
            if (seed % 2 === 0) {
                displayedSongs = displayedSongs.slice(0, 5);
            }
            
            renderSongs(displayedSongs);
        });
    });
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    displayedSongs = songs.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
    );
    renderSongs(displayedSongs);
});
