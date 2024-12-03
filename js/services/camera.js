// === Partie Caméra ===
const Camera = {
    video: document.getElementById('video-camera'),
    videoScreen: document.querySelector("#video-screen"),
    stream: null,

    onShow() {
        Camera.start()
        Camera.video.classList.remove("hidden");
        Camera.videoScreen.classList.add("hidden");
    },

    onHide() {
        Camera.stop()
    },

    async start() {
        try {
            Camera.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            Camera.video.srcObject = Camera.stream;
        } catch (err) {
            console.error("Erreur d'accès à la caméra", err);
            alert("Impossible d'accéder à la caméra arrière.");
        }
    },

    async stop() {
        if (Camera.stream) {
            Camera.stream.getTracks().forEach(function(track) {
                track.stop();
            });
            Camera.video.srcObject = null;
        }
    },

    captureImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match video dimensions
        canvas.width = Camera.video.videoWidth;
        canvas.height = Camera.video.videoHeight;
        
        // Draw the current frame from the video onto the canvas
        ctx.drawImage(Camera.video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a data URL (base64 encoded image)
        const image = new Image();
        image.src = canvas.toDataURL('image/png');
        Camera.video.srcObject = null;
        Camera.video.classList.toggle("hidden");
        Camera.videoScreen.classList.toggle("hidden");
        Camera.videoScreen.src = image.src;

        return image;
    }
};