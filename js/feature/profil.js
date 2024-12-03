


Profil = {
    data: {
        nombre_adultes: null,
        regimes_alimentaire: null,
        communes: null,
        alentour: null,
    },
    inputs: {
        nombre_adultes: document.getElementById("select-nombre-adultes"),
        regimes_alimentaire: document.getElementById("select-regimes-alimentaire"),
        communes: document.getElementById("select-communes"),
        alentour: document.getElementById("radio-alentour"),
    },
    save: () => localStorage.setItem("profil", JSON.stringify(Profil.data)),
    load: () => { 
        const data = JSON.parse(localStorage.getItem("profil"))
        if (data) {
            Profil.data.nombre_adultes = data.nombre_adultes;
            Profil.data.regimes_alimentaire = data.regimes_alimentaire;
            Profil.data.communes = data.communes;
            Profil.data.alentour = data.alentour;
        }
    },
    init: function() {
        Profil.load();

        Profil.inputs.nombre_adultes.addEventListener("change", function() {
            Profil.data.nombre_adultes = this.value;
            Profil.save();
        });
        Profil.inputs.regimes_alimentaire.addEventListener("change", function() {
            Profil.data.regimes_alimentaire = this.value;
            Profil.save();
        });
        Profil.inputs.communes.addEventListener("change", function() {
            Profil.data.communes = this.value;
            Profil.save();
        });
        Profil.inputs.alentour.addEventListener("change", function() {
            Profil.data.alentour = this.value;
            Profil.save();
        });

        if (Profil.data.nombre_adultes) {
            // Selectionner dans la liste déroulante la bonne valeur
            Profil.inputs.nombre_adultes.value = Profil.data.nombre_adultes;
        }

        if (Profil.data.regimes_alimentaire) {
            // Selectionner dans la liste déroulante la bonne valeur
            Profil.inputs.regimes_alimentaire.value = Profil.data.regimes_alimentaire;
        }

        if (Profil.data.communes) {
            // Selectionner dans la liste déroulante la bonne valeur
            Profil.inputs.communes.value = Profil.data.communes;
        }

        if (Profil.data.alentour) {
            // Selectionner dans la liste déroulante la bonne valeur
            Profil.inputs.alentour.value = Profil.data.alentour;
        }
    },
}


Profil.init();