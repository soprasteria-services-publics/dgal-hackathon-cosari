
function loadData() {
    const outputElement = document.getElementById("output");

    // Chemin relatif vers le fichier JSON
    const jsonFilePath = "resources/DataTest_Hackathon_V2.json";

    // Lecture du fichier JSON via Fetch
    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Données chargées :", data);
            saveToLocalStorage("rappels", data)

        })
        .catch(error => {
            console.error("Erreur lors du chargement du fichier JSON :", error);
        });
}

function initBouchon(){


    let tickets = [

        {
            id: "13486185153",
            DATE: "10/12/2024",
            GEO: "Toulouse",
            COURSES: [
                {
                    NAME: "cafe",
                    CODE: "1565165"
                }
            ]
        },
        {
            id: "166889724145",
            DATE: "10/11/2024",
            GEO: "Toulouse",
            COURSES: [
                {
                    NAME: "crème glacée",
                    CODE: "3328858102903"
                }
            ]
        },  {
            id: "163588645",
            DATE: "10/10/2024",
            GEO: "Toulouse",
            COURSES: [
                {
                    NAME: "pizza",
                    CODE: "34586468903"
                },  {
                    NAME: "lardons",
                    CODE: "3322903"
                }
            ]
        }, {
            id: "1641351535",
            DATE: "09/09/2024",
            GEO: "Toulouse",
            COURSES: [
                {
                    NAME: "Cookies",
                    CODE: "3560071231095"
                }
            ]
        }
    ]
    saveToLocalStorage("tickets", tickets)
}



document.addEventListener("DOMContentLoaded", loadData);
document.addEventListener("DOMContentLoaded", initBouchon);