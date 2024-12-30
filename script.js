// particles.js configuration
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

// Emotion detection logic
const video = document.getElementById('webcam');

function sendFrameToBackend(imageData) {
    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(result => {
            const emotionDisplay = document.getElementById("emotionDisplay");
            if (emotionDisplay) {
                emotionDisplay.textContent = `Detected Emotion: ${result.emotion || "Unknown"}`;
            }
        })
        .catch(error => {
            console.error("Error sending frame to backend:", error);
            const emotionDisplay = document.getElementById("emotionDisplay");
            if (emotionDisplay) {
                emotionDisplay.textContent = `Error: Could not detect emotion.`;
            }
        });
}

function captureFrame() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg").split(",")[1];
}

function startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            setInterval(() => {
                const frame = captureFrame();
                sendFrameToBackend(frame);
            }, 1000);
        })
        .catch(error => {
            console.error("Error accessing webcam:", error);
            const emotionDisplay = document.getElementById("emotionDisplay");
            if (emotionDisplay) {
                emotionDisplay.textContent = `Error: Unable to access webcam.`;
            }
        });
}

startWebcam();
