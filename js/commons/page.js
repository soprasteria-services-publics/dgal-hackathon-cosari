/*
 * Gestion des pages.
 */
Page = {
    navLinks:  document.querySelectorAll(".js-page-onclick"),
    sections: document.querySelectorAll("section.js-page"),
    nav: document.querySelectorAll("footer li button"),
    default: "alertes",
    showPage: function(page) {
        console.log("Afficher la page " + page);
        flag = "js-" + page;
        Page.sections.forEach(section => {
            if (section.classList.contains(flag)) {
                if (section.classList.contains("hidden")) {
                    section.classList.remove("hidden");
                    section.dispatchEvent(new Event("show"));
                }
            } else {
                if (!section.classList.contains("hidden")) {
                    section.classList.add("hidden");
                    section.dispatchEvent(new Event("hidden"));
                }
            }
        });
        flagNav = "footer_" + page;
        Page.nav.forEach(nav => {
            if (nav.classList.contains(flagNav)) {
                if (!nav.classList.contains("active")) {
                    nav.classList.add("active");
                }
            } else {
                if (nav.classList.contains("active")) {
                    nav.classList.remove("active");
                }
            }
        })
    },
    /**
     * Cache les pages sauf la page par défaut et initialise les évènements sur les boutons de navigation.
     */
    init: function() {
        this.sections.forEach(section => {
            if (!section.classList.contains("js-" + Page.default)) {
                section.classList.add("hidden");
            }
        });
        this.navLinks.forEach(link => {
            link.addEventListener("click", function () {
                Page.showPage(link.getAttribute("data-section"))
            });
        });
    }
}
