



const critères = [
    {libelleSource : "gtin", libelleSearch: "codebarre" ,comparator : exactMatchComparator, ponderance : 5},
    {libelleSource : "zone_geographique_de_vente", libelleSearch : "geographie",comparator : geographiqueComparator, ponderance : 1},
    {libelleSource : "libelle", libelleSearch : "libelle", comparator : likeComparator, ponderance : 1},
    {libelleSource : "libelle", libelleSearch : "libelle", comparator : exactMatchComparator, ponderance : 3},
    {libelleSource : "date_debut_commercialisation", libelleSearch:"date", comparator : afterDateComparator, ponderance : 1  },
    {libelleSource : "date_date_fin_commercialisation", libelleSearch:"date", comparator : beforeDateComparator, ponderance : 1  }
]

function mapLieuIntoSearchLieu(lieu){
    return ["31", "toulouse", "occitanie", "france"]
}

function mapTicketIntoSearchItem(tickets){
    return tickets.flatMap(ticket =>
        ticket.COURSES.map(item => ({
            libelle: item.NAME,
            geographie: mapLieuIntoSearchLieu(ticket.GEO),
            codebarre: item.CODE,
            date: ticket.DATE
        })));
}


function loadTableau() {

    let tickets = getFromLocalStorage("tickets");
    let ticketsSearchFormat = mapTicketIntoSearchItem(getFromLocalStorage("tickets"));
    console.log("tickets :", ticketsSearchFormat)

    let rappels = getFromLocalStorage("rappels");

    let matches = compareDataSourceWithCriteria(rappels, ticketsSearchFormat, critères);
    matches.sort((a, b) => b.score - a.score);




    console.log(matches);
    return matches;
}