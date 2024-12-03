const Alertes = {
    alertesSection: document.querySelector("section.js-page.js-alertes"),
    alertesList: document.querySelector(".alerts_list"),
    onShow: () => {
        Alertes.clearList();
        const alertes = loadTableau();
        const rephrase = (item) => {
            const words = item ? item.split(' ') : [""]; // Découpe la chaîne en mots
            return words.length > 3 ? words.slice(0, 2).join(' ') : item;
        }
        alertes.map(alerte => {
            Alertes.addAlerte({
                score: alerte.score,
                label: rephrase(alerte.rappel.risques_encourus),
                titre:  rephrase(alerte.rappel.libelle),
                sous_titre: rephrase(alerte.rappel.identification_produits),
                image: alerte.rappel.liens_vers_les_images,
            })
        })
    },
    onHide: () => {
    },
    init: () => {
        Alertes.alertesSection.addEventListener("show", () => Alertes.onShow());
        Alertes.alertesSection.addEventListener("hidden", () => Alertes.onHide());
    },
    addAlerte: (elem) => {
        Alertes.alertesList.innerHTML = Alertes.alertesList.innerHTML + Twig.parse(Alertes.template(), elem);
    },
    clearList: () => {
        Alertes.alertesList.innerHTML = "";
    },
    template: () => {
        return `
            <div class="fr-card-alert">
                <div class="fr-card-alert_level">
                    {% if(score > 0) %}
                    <i class="icon-piment"></i>
                    {% if(score > 2) %}
                    <i class="icon-piment"></i>
                    {% if(score > 5) %}
                    <i class="icon-piment"></i>
                    {% if(score > 10) %}
                    <i class="icon-piment"></i>
                    {% endif %}
                    {% endif %}
                    {% endif %}
                    {% endif %}
                </div>
                <div class="fr-card-alert_label fr-badge fr-badge--error fr-badge--no-icon">
                    {{ label }}
                </div>
                <div class="fr-card-alert_image"><img src="{{image}}"/></div>
                <div class="fr-card-alert_text">
                    <h2>{{titre}}</h2>
                    <span>{{sous_titre}}</span>
                </div>
            </div>
        `;
    }
}

Alertes.init(); 