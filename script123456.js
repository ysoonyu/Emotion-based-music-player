// particles.js configuration remains unchanged
particlesJS("particles-js", {
    particles: {
        number: { value: 180, density: { enable: true, value_area: 800 } },
        color: { value: "#ff6600" },
        shape: {
            type: "circle",
            stroke: { width: 5, color: "#FFFF" },
            polygon: { nb_sides: 5 },
        },
        opacity: { value: 0.5, anim: { enable: false } },
        size: { value: 3, random: true, anim: { enable: false } },
        line_linked: { enable: true, distance: 150, color: "#ff6600", opacity: 0.4, width: 2 },
        move: { enable: true, speed: 6, out_mode: "out" },
    },
    interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" } },
        modes: { repulse: { distance: 200, duration: 0.4 } },
    },
    retina_detect: true,
});

// DOM Elements
const video = document.getElementById("webcam");
const emotionDisplay = document.getElementById("emotionDisplay");
const songTitle = document.getElementById("songTitle");
const musicPlayer = document.getElementById("musicPlayer");
const musicSource = document.getElementById("musicSource");
const musicPlayerSection = document.getElementById("music-player-section");

// Start Webcam
function startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            setInterval(() => captureAndSendFrame(), 1000); // Capture frame every second
        })
        .catch((error) => {
            console.error("Webcam Error:", error);
            emotionDisplay.textContent = "Error: Unable to access webcam.";
        });
}

// Capture Frame
function captureAndSendFrame() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL("image/jpeg").split(",")[1];
    fetchEmotion(base64Image);
}

// Fetch Emotion and Play Music
function fetchEmotion(imageData) {
    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const detectedEmotion = data.emotion || "None";
            emotionDisplay.textContent = `Detected Emotion: ${detectedEmotion}`;

            if (data.song) {
                songTitle.textContent = `Song: ${data.song}`;
                musicSource.src = `http://127.0.0.1:5000/music/${detectedEmotion}/${data.song}`;
                musicPlayer.load();
                musicPlayer.play();
                musicPlayerSection.style.display = "block";
            } else {
                songTitle.textContent = "Song: None";
                musicPlayerSection.style.display = "none";
            }
        })
        .catch((error) => {
            console.error("API Error:", error);
            emotionDisplay.textContent = "Error: Could not detect emotion.";
        });
}

// Initialize Webcam and Emotion Detection
startWebcam();
