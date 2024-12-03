// === Application principale ===
(function main() {
    const captureButton = document.getElementById('captureButton');
    const ticketResult = document.querySelector("#ticketData");
    const cameraSection = document.querySelector("section.js-page.js-photos")

    // Démarrer la caméra
    cameraSection.addEventListener("show", () => Camera.onShow());
    cameraSection.addEventListener("hidden", () => Camera.onHide());

    // Gérer l'événement de capture
    captureButton.addEventListener('click', async () => {
        //output.textContent = "Chargement en cours...";
        try {
            captureButton.disabled = true;
            const image = Camera.captureImage();
            image.onload = async () => {
                try {
                    const text = await Intelligence.runOCR(image);
                    const jsonResponse = await Intelligence.callChatGPT(text);
                    
                    const ticketEvent = new CustomEvent("ticket", { detail: { data: jsonResponse }});
                    ticketResult.value = jsonResponse;
                    window.dispatchEvent(ticketEvent);
                } catch (err) {
                    console.error("Erreur lors de la capture de l'image:", err);
                    ticketResult.value = err;
                    const ticketEvent = new CustomEvent("ticket", { detail: { err: true, data: err.message }});
                    window.dispatchEvent(ticketEvent);
                } finally {
                    captureButton.disabled = false;
                }
            };
        } catch (err) {
            console.error(err);
            ticketResult.value = "Une erreur est survenue lors de la capture de l'image.";
            const ticketEvent = new CustomEvent("ticket", { detail: { err: true, data: "Une erreur est survenue lors de la capture de l'image."}});
            window.dispatchEvent(ticketEvent);
        }
        
    });
})();

/**
 * Pour récupérer les évènements :
 * window.addEventListener("ticket", (e) => console.log(e.detail.data));
 */