// Gestion de fichiers dans le localStorage

/**
 * Enregistre une donnée dans le localStorage
 * @param {string} key - La clé sous laquelle enregistrer la donnée.
 * @param {any} value - La valeur à enregistrer.
 */
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log(`Donnée enregistrée avec succès sous la clé "${key}".`);
    } catch (error) {
        console.error("Erreur lors de l'enregistrement dans le localStorage:", error);
    }
}

/**
 * Récupère une donnée du localStorage
 * @param {string} key - La clé de la donnée à récupérer.
 * @returns {any|null} - La valeur récupérée ou null si elle n'existe pas.
 */
function getFromLocalStorage(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error("Erreur lors de la récupération du localStorage:", error);
        return null;
    }
}

/**
 * Modifie une donnée existante dans le localStorage
 * @param {string} key - La clé de la donnée à modifier.
 * @param {any} newValue - La nouvelle valeur à enregistrer.
 */
function updateLocalStorage(key, newValue) {
    if (localStorage.getItem(key)) {
        saveToLocalStorage(key, newValue);
        console.log(`Donnée mise à jour pour la clé "${key}".`);
    } else {
        console.warn(`Aucune donnée trouvée pour la clé "${key}".`);
    }
}

/**
 * Supprime une donnée du localStorage
 * @param {string} key - La clé de la donnée à supprimer.
 */
function deleteFromLocalStorage(key) {
    if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`Donnée supprimée pour la clé "${key}".`);
    } else {
        console.warn(`Aucune donnée trouvée pour la clé "${key}".`);
    }
}

/**
 * Liste toutes les clés et leurs données stockées dans le localStorage
 */
function listAllLocalStorage() {
    console.log("Contenu du localStorage:");
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = getFromLocalStorage(key);
        console.log(`- ${key}:`, value);
    }
}

