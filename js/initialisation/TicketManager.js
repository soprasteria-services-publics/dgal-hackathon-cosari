
function simpleHash(jsonObject) {
    const jsonString = JSON.stringify(jsonObject, Object.keys(jsonObject).sort());

    let hash = 0;
    for (let i = 0; i < jsonString.length; i++) {
        const char = jsonString.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convertir en entier 32 bits
    }

    return hash.toString(16);
}



function addTicket(ticket){
    try {
        data = JSON.parse(ticket);
        data.id = simpleHash(data);
        tickets = getFromLocalStorage("tickets")

        data.COURSES.forEach((item) =>{
            if(likeComparator( item.NAME, "LIP")){
                item.NAME = "LIPTON";
            }
        })

        if (!tickets.some(item => item.id === data.id)) {
            tickets.push(data);
            updateLocalStorage("tickets", tickets);
            Produits.actualiser();
        }
        Page.showPage("produits");
    } catch (err) {
        Camera.onShow();
        console.error(err, ticket);
        alert("Impossible de lire le ticket");
    }
}
window.addEventListener("ticket", (e) => addTicket(e.detail.data));