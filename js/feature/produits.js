const Produits = {
    produitsSection: document.querySelector("section.js-page.js-produits"),
    produitsList: document.querySelector(".js-produits"),
    actualiser: () => {
        Produits.clearList();
        Produits.showProduits()
    },
    onShow: () => {
        console.log("alzalealaelazlzaelelzaleazlelzaleztoto")
        Produits.actualiser();
    },
    onHide: () => {
    },
    init: () => {
        Produits.produitsSection.addEventListener("show", () => Produits.onShow());
        Produits.produitsSection.addEventListener("hidden", () => Produits.onHide());
    },
    showProduits: () => {
        let tickets = getFromLocalStorage("tickets");
        ticketsList = ""
        tickets.forEach((ticket)=>{
            ticketsList += Produits.produitsList.innerHTML + Produits.templateTicket(ticket);
        })
        console.log(ticketsList);
        Produits.produitsList.innerHTML = ticketsList;
     },
    clearList: () => {
        Produits.produitsList.innerHTML = "";
    },
    templateTicket: (ticket) => {
        console.log(ticket.COURSES);
        return `
            <section class="fr-accordion">
            <h3 class="fr-accordion__title">
                <button class="fr-accordion__btn" aria-expanded="false" aria-controls="accordion-${ticket.id}">${ticket.DATE}-${ticket.GEO}</button>
            </h3>
            <div class="fr-collapse" id="accordion-${ticket.id}">
                ${ticket.COURSES.map(item => `<li>${item.NAME}</li>`).join('')}
            </div>
        </section>
        `;
    }
}

Produits.init();