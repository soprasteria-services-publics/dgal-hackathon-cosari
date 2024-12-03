// === Partie Intelligence (OCR et ChatGPT) ===
const Intelligence = {
    async runOCR(image) {
        try {
            const { data: { text } } = await Tesseract.recognize(image, 'fra', {
                logger: (m) => console.log(m),
            });
            return text;
        } catch (err) {
            console.error("Erreur lors de l'extraction du texte:", err);
            throw new Error("Erreur lors de l'extraction du texte.");
        }
    },

    async callChatGPT(text) {
        const apiKey = ""; // Remplacez par votre clé API
        const apiUrl = "https://api.openai.com/v1/chat/completions";
        const prompt = `
            voici une liste de course extraite par OCR :
            ${text}
            Transformez-la en JSON avec les champs : 
            DATE, GEO, COURSES (liste d'objets {NAME, CODE})`;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error("Erreur lors de l'appel à ChatGPT:", error);
            throw new Error("Erreur lors de l'appel à ChatGPT.");
        }
    }
};