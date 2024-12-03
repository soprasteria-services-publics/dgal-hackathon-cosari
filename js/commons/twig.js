var Twig = {};

/**
 * Plugin TWIG permettant d'évaluer un texte.
 * 
 * {{nom}} sera remplacé par object.nom
 * {% if(age > 18) %}Majeur{% else %}Mineur{% endif %}.
 * {% naissance | date('YY/MM/DD') %} sera remplacé par 2012/02/27
 * 
 * @author jason BOURLARD
 */
Twig = (function(Twig) {

	/**
	 * Instance de Twig.outils.parseur.
	 */
	var texte = null;
	
	/**
	 * Permet de savoir si l'analyse du texte a produit un erreur.
	 */
	var error = false;
	
	/**
	 * L'objet à utiliser. Ce sont les attributs de cet objet qui
	 * sont affichés.
	 */
	var objet;

	/**
	 * Un état représente l'état d'une branche. Une branche est construite
	 * avec if et détruite avec endif.
	 */
	var etats		= [];
	
	/**
	 * Index de l'état courant.
	 */
	var etat_courant = -1;

	/**
	 * Texte à retourner.
	 */
	var aRetourner = "";
	
	/**
	 * Contient une liste de fonction permettant d'intéragir avec la console.
	 */
	Twig.out = {};
	
	/**
	 * Affiche un message d'erreur.
	 * @param String c	 Le ou les caractères attendu.
	 * @param String texte Le texte en cours de traitement.
	 */
	Twig.out.error = function(c, texte) {
		console.error('Une erreur inattendue s\'est produite, "' + c + '" attendu (caractère ' + texte.i + ') : ' + texte.chaine);
	}

	/**
	 * Fonction spécifique à twig permettant de formater un texte.
	 * Pour interagir avec les fonctions, il suffit d'utiliser le caractère '|'.
	 * Exemple : {% mavariable | mafonction(args)}
	 */
	Twig.fonctions = {};

	/**
	 * Fonction permettant de formater une date en un format
	 * spécifique.
	 * <ul>
	 *	 <li>YYYY : Année en 4 chiffres.</li>
	 *	 <li>YY : Année en 2 chiffres.</li>
	 *	 <li>MM : Mois en 2 chiffres.</li>
	 *	 <li>HH : Heures en 2 chiffres.</li>
	 *	 <li>DD : Jours en 2 chiffres.</li>
	 *	 <li>mm : Minutes en 2 chiffres.</li>
	 *	 <li>ss : Secondes en 2 chiffres.</li>
	 * </ul>
	 * @param String args  Le format à utiliser.
	 * @param int	date   La date (timestamps) à formater.
	 * @return String le date formaté.
	 */
	Twig.fonctions.date = function(date, args) {
		if(date === undefined || date == "") {
			return "";
		}
		
		// Si le format est non défini ou que le format vaut 'langue'.
		if(args === null || args == '') {
			// Si un format existe pour la langue.
			args = 'DD/MM/YYYY'
		}
		
		var date = new Date(date);
		var m = date.getMonth() + 1;
		var y = date.getFullYear();
		var d = date.getDate();
		var h = date.getHours();
		var i = date.getMinutes();
		var s = date.getSeconds();

		if(m < 10) m = '0' + m;
		if(d < 10) d = '0' + d;
		if(h < 10) h = '0' + h;
		if(i < 10) i = '0' + i;
		if(s < 10) s = '0' + s;
		
		return args = args.replace(/YYYY/g, y),
			   args = args.replace(/YY/g, y % 100),
			   args = args.replace(/MM/g, m),
			   args = args.replace(/HH/g, h),
			   args = args.replace(/mm/g, i), 
			   args = args.replace(/ss/g, s), 
			   args.replace(/DD/g, d);
	}
	
	/**
	 * Permet de ne pas échapper un texte.
	 * @param String args non utilisé. 
	 * @param String string le texte à ne pas échapper.
	 * @return Le texte non échappé.
	 */
	Twig.fonctions.ne = function(texte, args) {
		return texte;
	};
	Twig.fonctions.noescape = Twig.fonctions.ne;

	/**
	 * Fonction permettant de formater un nombre en spécifiant
	 * le nombre de chiffres avant et après la virgule.
	 * @param String args   Le format à utiliser (Ex : 4,2).
	 * @param Float  nombre La nombre à formater.
	 * @return String le nombre formaté.
	 */
	Twig.fonctions.nombre = function(nombre, args) {
		args = args.split(',');
		p = Math.pow(10, parseInt(args[0]));
		if(args.length == 1) {
			nombre = parseInt(nombre) % p;
		} else {
			nombre = parseFloat(nombre) % p;
			p = Math.pow(10, parseInt(args[1]));
			nombre = Math.floor(nombre * p) / p;
		}
		return nombre;
	};
	
	Twig.outils = {};
	
	/**
	 * Classe permettant d'analyser une chaîne de caractères
	 * @param pChaine la chaîne à analyser. 
	 */
	Twig.outils.parseur = function(pChaine) {
		this.chaine	   = pChaine;
		this.r			= null; // Caractère précédent.
		this.s			= null; // Caractère courant.
		this.i			= -1;
		
		/**
		 * Permet de savoir s'il existe un caractère après celui courant
		 * @return bool True s'il existe un caractère, faux sinon.
		 */
		this.nextExist = function() {
			return this.i+1 < this.chaine.length;
		}

		/**
		 * Permet de positionner le programme sur le caractère suivant.
		 * @return bool True si un nouveau caractère à été trouvé, faux sinon.
		 */
		this.next = function() {
			if(this.nextExist()) {
				this.i++;
				this.r = this.s;
				this.s = this.chaine.charAt(this.i);
				return true;
			}
			return false;
		}

		/**
		 * Permet de savoir si le prochain caractère est alphanumérique.
		 * @return bool True si le prochain caractère est alphanumérique.
		 */
		this.nextIsAlphanumeric = function() {
			return this.nextExist() && /[-_A-Za-z0-9\.]/.test(this.chaine.charAt(this.i+1));
		}

		/**
		 * Permet de savoir si le prochain caractère est un caractère blanc (espace, tab, retour à la ligne).
		 * @return bool True si le prochain caractère est un caractère blanc.
		 */
		this.nextIsBlanc = function() {
			return this.nextExist() && /[\n\r\t\s]/.test(this.chaine.charAt(this.i+1));
		}

		/**
		 * Retourne le prochain mot
		 * @return String le prochain mot composé de caractère alphanumérique.
		 */
		this.nextWord = function() {
			var word  = "";
			while(this.nextIsBlanc()) { this.next() };
			while(this.nextIsAlphanumeric()) {
				this.next();
				word += this.s;
			}
			return word;
		}

		/**
		 * Retourne la chaine de caractères présent avant le caractère 'c'
		 * @param char c Le caractère.
		 * @return La chaine de caractères présent avant le caractère.
		 */
		this.nextChaineBefore = function(c) {
			var chaine = "";
			while(this.next() && this.s != c) chaine += this.s;
			return chaine;
		}

		/**
		 * Permet de retourner le prochain caractère.
		 * @return char Le prochain caractère.
		 */
		this.nextCaractere = function() {
			while(this.nextIsBlanc() && this.next());
			return this.next() ? this.s : false;
		}
	};

	/**
	 * Permet de savoir si le code, en cours de traitement, se situe dans une branche active.
	 * C'est l'état courant qui détermine si la branche de code que l'on analyse
	 * doit être traitée.
	 * @return bool True si le code doit être analysé, faux sinon.
	 */
	var brancheActive = function() {
		return etat_courant == -1 || etats[etat_courant].aAnalyser;
	};

	/**
	 * Permet de récupérer la valeur de l'attribut de l'objet.
	 * @return Object La valeur de l'attribut, un texte vide si non défini ou null.
	 */
	var getAttribut = function(attribut) {
		if(attribut == undefined) return "";
		
		var attributs = attribut.split('.');
		var valeur = objet;
		
		for(var i in attributs) {
			if(valeur[attributs[i]] !== undefined && valeur[attributs[i]] !== null) {
				valeur = valeur[attributs[i]];
			} else {
				return "";
			}
		}
		return valeur;
	};
	
	/**
	 * Permet d'évaluer l'argument afin de récupérer le bon objet à utiliser.
	 * @param  String arg Argument à analyser.
	 * @return String arg L'argument analysé.
	 * @TOBEIMPROVED
	 */
	var evalWord = function(arg) {
		// Si c'est un entier
		if(/^[0-9]+$/.test(arg)) {
			return parseInt(arg);
		}
		// Si c'est un flottant
		if(/^[0-9]+(\.[0-9]+)?$/.test(arg)) {
			return parseFloat(arg);
		}
		// Si c'est une chaine de caractère
		if(/^(['].+['])|(["].+["])$/.test(arg)) {
			return arg;
		}
		switch(arg) {
			// Si c'est un boolean valant false
			case "false":
				arg = false;
				break;
			// Si c'est un boolean valant true
			case "true":
				arg = true;
				break;
			// Si c'est un opérateur inférieur
			case '<':
			case 'lt':
			case '&lt;':
				arg = "<";
				break;
			// Si c'est un opérateur supérieur
			case '>':  
			case 'gt':   
			case '&gt;':   
				arg = ">";
				break;
			// Si c'est un opérateur différent
			case '!=':
			case '<>':
				arg = "!=";
				break;
			// Si c'est un opérateur égal
			case '==':
			case '=':
				arg = "==";
				break;
			// Si c'est un opérateur inférieur ou égal
			case '<=':  
			case 'lt=':  
			case '&lt;=':  
				arg = "<=";
				break;
			// Si c'est un opérateur supérieur ou égal
			case '>=': 
			case 'gt=':  
			case '&gt;=': 
				arg = ">=";
				break;
			// Si c'est un opérateur ET
			case 'and':
				arg = '&&';
				break;
			// Si c'est un opérateur OR
			case 'or':
				arg = '||';
				break;
			// Si c'est un opérateur NOT
			case 'not':
				arg = '!';
				break;
			// Sinon c'est un attribut
			default:
				arg = getAttribut(arg);
				if(arg === "") arg = null;
				else if(/\d+/.test(arg)) arg = parseInt(arg);
				else if(/\d+.d+/.test(arg)) arg = parseFloat(arg);
				else if(arg !== false && arg !== true) arg = "'" + arg + "'";
		}
		return arg;
	};
	
	/**
	 * Evalue l'expression et retourne le résultat.
	 * @param  String pExpression L'expression à évaluer.
	 * @return bool			   L'expression évalué.
	 * @TOBEIMPROVED
	 */
	var evalExpression = function(pExpression) {
		var word   = "";
		var words  = [];
		var i = 0;
		
		// Boucle permettant de découper la chaîne liste de mots.
		for(var i = 0; i < pExpression.length; i++) {
			var s = pExpression.charAt(i);
			// Si la lettre est un caractère blanc.
			if(/[\n\r\t\s]/.test(s)) {
				// Si le mot précédant possède au moins une lettre.
				if(word.length > 0) {
					// On ajoute le mot à la liste des mots.
					words.push(word);
					word = "";
				}
			// On ajoute la lettre au mot courant.
			} else {
				word += s;
			}
		}
		
		// Si le mot courant a au moins une lettre.
		if(word.length > 0) {
			// On ajoute le mot à la liste des mots.
			words.push(word);
			word = "";
		}
		
		// Si la liste des mots est nulle.
		if(words.length == 0) {
			Twig.out.error('expression', texte)
			return false;
		} else if(words.length == 1) {
			return evalWord(words[0]);
		}
		
		aEvaluer = "";
		for(var i in words) {
			aEvaluer = aEvaluer + evalWord(words[i]) + " ";
		}
		
		return eval(aEvaluer);
	};

	/**
	 * Retourne le résultat de la fonction Twig en fonction d'une variable
	 * et d'un arguments
	 * @return String Le résultat de la fonction
	 */
	var getFonctionResult = function(variable, fonction, arguments) {
		if(Twig.fonctions[fonction] !== undefined) {
			variable = getAttribut(variable);
			return Twig.fonctions[fonction](variable, arguments);
		} // else
		console.error('Une erreur inattendue s\'est produite, fonction ' + fonction + ' inconnue (caractère ' + texte.i + ') : ' + texte.chaine);
		error = true;
	};

	/**
	 * Retourne l'argument compris entre deux parenthèses.
	 * @return String l'argument compris entre les deux parenthèses.
	 */
	var getArguments = function() {
		var arguments = null;
		
		if(texte.s == '(' || texte.nextCaractere() == '(') {
			arguments = texte.nextChaineBefore(')');
			if(texte.s != ')') {
				Twig.out.error(')', texte);
				error = true;
			}
		}
		return arguments == "" ? null : arguments;
	};
	
	/**
	 * Permet la gestion des états logiques et des branches de code.
	 * @param String logic Le nouvelle opérateur logique à traiter.
	 */
	var parseLogique = function(operateur) {
		var parseArgument = false;
		var argument = null;
		
		// L'opérateur if ouvre un nouvel état
		if(operateur == 'if') {
			etat_courant++;
			etats[etat_courant] = { debut : texte.i, conditions : false, aAnalyser  : false };
			parseArgument = true;
		} else if (operateur == 'elseif') {
			parseArgument = true;
		} else if (operateur == 'else') {
			etats[etat_courant].aAnalyser = etats[etat_courant].conditions == false;
		} else if (operateur == 'endif') {
			etat_courant--;
		}
		
		/**
		 * Si un argument doit être présent, alors on l'analyse et on le parse.
		 */
		if(parseArgument) {
			argument = getArguments();
			if(etats[etat_courant].conditions == false) {
				etats[etat_courant].conditions = etats[etat_courant].aAnalyser = evalExpression(argument);
			} else {
				etats[etat_courant].aAnalyser = false;
			}
		}
	};
	
	/**
	 * Parse un texte compris entre {% et %} étant sous la forme
	 * {% variable | fonction(argument) %} ou {% variable | fonction %}.
	 * 
	 * Cette fonction est appelée après avoir récupéré la variable. Si elle
	 * ne trouve pas le caractère '|', alors une erreur doit être lancée.
	 * 
	 * @param variable La variable a utiliser.
	 */
	var parseFonction = function(variable) {
		var arguments = null;
		var fonction  = null;
		
		if(texte.nextCaractere() != '|') {
			Twig.out.error('|', texte);
			error = true;
			return;
		}
		
		fonction = texte.nextWord();
		arguments = getArguments();
		aRetourner += getFonctionResult(variable, fonction, arguments);
	};
	
	/**
	 * Parse un texte compris entre {% et %} étant sous la forme
	 * {% [A-Za-z0-9_-]+[.*] %}.
	 * 
	 * Si les caractères %} ne sont pas trouvées, alors une erreur doit
	 * être lancée.
	 */
	var parseOperations = function(word) {
		word = texte.nextWord();
		// Si le mot est un mot clef pour la condition
		if(word == 'if' || word == 'elseif' || word == 'else' || word == 'endif') {
			parseLogique(word);
		// Sinon, on doit utiliser une fonction
		} else if(brancheActive()) {
			parseFonction(word);
		} else {
			return;
		}
		
		// Si le reste de la chaine n'est pas %}
		if((texte.s != '%' && texte.nextCaractere() != '%') || texte.nextCaractere() != '}') {
			Twig.out.error('%}', texte);
			error = true;
		}
	};
	
	/**
	 * Remplace la variable par sa valeur.
	 * 
	 * {{ nom }} sera remplacé par la valeur de la variable nom.
	 */
	var parseVariable = function() {
		variable = texte.nextWord();
		if(texte.nextCaractere() == '}' && texte.nextCaractere() == '}') {
			aRetourner += getAttribut(variable);
			
		// Si le reste de la chaine n'est pas %}
		} else {
			Twig.out.error('}}', texte);
			error = true;
		}
	}
	
	/**
	 * Évalue la chaine de caractères et remplace 
	 * par les bonnes valeurs.
	 * 
	 * {{nom}} sera remplacé par object.nom
	 * {% if(age > 18) %}Majeur{% else %}Mineur{% endif %}.
	 * {% naissance | date('YY/MM/DD') %} sera remplacé par 2012/02/27
	 * 
	 * @param  String		texte  Le texte à évaluer
	 * @param  String|Object object L'objet à évaluer.
	 * @return String			   Texte évalué.
	 */
	var parse = function(pTexte, pObjet) {
		var variable, fonction, arguments;

		// Initialisation des variables
		texte		= new Twig.outils.parseur(pTexte);
		objet		= pObjet;
		
		if(objet == undefined) {
			objet = {};
		}

		etats		= {};
		etat_courant = -1;

		aRetourner   = "";

		while(texte.next() && !error) {
			// Si le caractère est { et qu'il reste encore au moins 4 caractères.
			if(texte.r == '{' && texte.s == '%') {
				parseOperations();
			} else if(brancheActive()) {
				if(texte.r == '{' && texte.s == '{') {
					parseVariable();
				} else if(texte.s != '{') {
					aRetourner += texte.s;
				}
			}
		}

		if(etat_courant != -1) {
			console.error('Un état n\'a pas été fermé correctement : ' + texte.chaine);
			error = true;
		}
		
		return aRetourner;
	}

	return {
		parse : parse
	}
})(Twig);