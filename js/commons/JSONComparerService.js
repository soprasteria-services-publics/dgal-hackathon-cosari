// Recherche avancée dans un JSON avec des comparateurs spécifiques par champ


/**
 * Exemple de fonctions de comparaison.
 */

// Recherche "LIKE" insensible à la casse
function likeComparator(fieldValue, searchTerm) {
    if (typeof fieldValue !== "string" && typeof searchTerm !== "string") return false;
    return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
}

// Correspondance exacte
function exactMatchComparator(fieldValue, searchTerm) {
    return fieldValue == searchTerm;
}

// Recherche par début de chaîne
function startsWithComparator(fieldValue, searchTerm) {
    if (typeof fieldValue !== "string" && typeof searchTerm !== "string") return false;
    return fieldValue.toLowerCase().startsWith(searchTerm.toLowerCase());
}

// Recherche par fin de chaîne
function endsWithComparator(fieldValue, searchTerm) {
    if (typeof fieldValue !== "string" && typeof searchTerm !== "string") return false;
    return fieldValue.toLowerCase().endsWith(searchTerm.toLowerCase());
}

function isValidDate(dateString) {
    // Vérifier si c'est un format ISO
    if (!isNaN(Date.parse(dateString))) return true;

    // Vérifier les autres formats manuellement
    const datePatterns = [
        /^(\d{2})\/(\d{2})\/(\d{4})$/, // 13/01/2022
        /^(\d{4})-(\d{2})-(\d{2})$/,  // 2022-01-13
        /^(\d{2})\/(\d{2})\/(\d{2})$/ // 22/01/13
    ];

    return datePatterns.some(pattern => pattern.test(dateString));
}

function parseDate(dateString) {
    if (!isValidDate(dateString)) return null;

    // ISO string parsing
    if (!isNaN(Date.parse(dateString))) {
        return new Date(dateString);
    }

    // Parsing manuel pour d'autres formats
    const datePatterns = [
        { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, order: ["dd", "MM", "yyyy"] },
        { regex: /^(\d{4})-(\d{2})-(\d{2})$/, order: ["yyyy", "MM", "dd"] },
        { regex: /^(\d{2})\/(\d{2})\/(\d{2})$/, order: ["dd", "MM", "yy"] }
    ];

    for (const { regex, order } of datePatterns) {
        const match = dateString.match(regex);
        if (match) {
            const [_, part1, part2, part3] = match;
            const year = order.includes("yyyy") ? part3 : `20${part3}`;
            const month = order.indexOf("MM") === 0 ? part1 : part2;
            const day = order.indexOf("dd") === 0 ? part1 : part3;
            return new Date(`${year}-${month}-${day}`);
        }
    }

    return null; // Si aucun format ne correspond
}

function compareDates(date1, date2) {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);

    if (!d1 || !d2) return null; // Si une des dates n'est pas valide, ignorer la comparaison

    const time1 = d1.getTime();
    const time2 = d2.getTime();

    return time1 === time2 ? 0 : time1 > time2 ? 1 : -1;
}

function afterDateComparator(dateSource, dateSearch){
    const comparisonResult = compareDates(dateSource, dateSearch);

    // Si la comparaison est possible (pas null) et que date2 > date1
    if (comparisonResult === 1) {
        return true;
    }else{
        return false;
    }
}

function beforeDateComparator(dateSource, dateSearch){
    const comparisonResult = compareDates(dateSearch, dateSource);

    // Si la comparaison est possible (pas null) et que date2 > date1
    if (comparisonResult === 1) {
        return true;
    }else{
        return false;
    }
}


function geographiqueComparator(fieldValue, searchTerm){

    if (!Array.isArray(searchTerm)) return false;
    searchTerm.some(value => {
        return likeComparator(fieldValue, value);
    })
}








// Fonction de comparaison
function compareDataSourceWithCriteria(datasource, datasearch, criteres) {
    const results = [];
    console.log("calcul tableau")
    // Pour chaque objet de datasearch
    datasearch.forEach(searchItem => {
        const isLipton = searchItem.libelle === "LIPTON"
        datasource.forEach(dataItem => {
            let validCriteria = [];
            let score = 0
            // Vérifier chaque critère
            criteres.forEach(critere => {
                if (critere.comparator(dataItem[critere.libelleSource], searchItem[critere.libelleSearch])) {
                    validCriteria.push(critere.libelle);
                    score = score + critere.ponderance
                }
            });


            // Si au moins un critère est valide, sauvegarder l'ID et les critères valides
            if (score > 2 || (isLipton && dataItem.libelle.toLowerCase().includes("lipton"))) {

                const rappel = results.find(item => item.id === dataItem.id);
                console.log("rappel", rappel);
                if(rappel){
                    rappel.listeTickets.push(searchItem);
                    if(rappel.score < score) rappel.score = score;

                }else{
                    results.push({
                        rappel : dataItem,
                        listeTickets: [searchItem],
                        score : score
                    });
                }

            }
        });
    });

    return results;
}
