/**
 * Třída metod, které vytvářejí objekty na mapě, jako jsou státy,
 * popisky, nebo šipky. Všechny informace se předávají v objektu
 * jako první parametr.
 *
 * @author Já
 * @version 1.0 (2016-03-12)
 */
var mapCreator = new function() {
	var DESTROY_ELEMENT_FADE_TIME = 700;
	var CREATE_ELEMENT_FADE_TIME =  300;

	/**
	 * Pomocná funkce, která vytvoří svg element
	 */
	var makeSVG = function(tag, attrs) {
		var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
		for (var k in attrs)
			el.setAttribute(k, attrs[k]);
		return el;
	}

	/**
	 * Vytvoří na mapě nový stát
	 * @param {[object]} options
	 */
	this.addState = function(options) {
		var state = makeSVG('path', {
			d: options.d,
			class: options.class,
			id: 'st' + options.ID
		});

		$('#ms').append(state);

		fadeIn(state);
		return state;
	}

	/**
	 * Vytvoří značku na mapě (tag)
	 * options
	 * 	.x - Souřadnice středu textu
	 * 	.y
	 * 	.class - CSS class
	 * 	.text
	 * 	.headerImage - odkaz na SVG obrázek, který bude u názvu
	 * 	.additionalImage - odkaz na SVG obrázek, který bude pod názvem
	 */
	this.addTag = function (options) {
		// Vytvoření skupiny g
			var g = makeSVG('g', {
				'data-cx': options.x,
				'data-cy': options.y,
				class: options.class
			});
			$('#mt').append(g);

		// Vytvoření stínícího obdélníku
			var rect = makeSVG('rect');
			$(g).append(rect);

		// Vytvoření textu
			var text = makeSVG('text');
			text.textContent = options.text;
			$(g).append(text);

		// Centrování a změna velikosti obdelníku
			$(rect).attr('width', text.getBBox().width + 15 + (options.headerImage ? 13 : 0)) // Těch 13 je optimální vzdálenost
				.attr('x', -(  (text.getBBox().width + 15)/2 + (options.headerImage ? 13 : 0)  ));

		// Centrování textu
			$(text).attr('x', -text.getBBox().width/2)
				.attr('y', 8);

		// Vytvoření a umístění obrázku popisujícího typ území (ZC, base, port)
			if (options.headerImage) {
				var headerImage = makeSVG('image', {
					x: -(  (text.getBBox().width + 15)/2 + 13 + 20  ),
					//y: 0,
					class: 'hi'
				});
				$(g).append(headerImage);
				headerImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', options.headerImage);
			}

		// Dodatečný obrázek (armády, flotily)
			if (options.additionalImage) {
				var additionalImage = makeSVG('image', {
					class: 'ai'
				});
				$(g).append(additionalImage);
				additionalImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', options.additionalImage);
			}

		fadeIn(g);
		return g;
	}

	/**
	 * Vytvoří šipku
	 * options
	 * 	.class - CSS class
	 * 	.from - počáteční bod
	 * 		.x
	 * 		.y
	 * 	.to - Koncový bod, pozice hlavy šipky
	 * 		.x
	 * 		.y
	 */
	this.addArrow = function (options) {
		// Třeba najít směr, kde ukazuje šipka. Ta ve skutečnosti bude tvořit Beziérovu křivku
		// Viz jiný skript, kde ji tvořím.
		// Třeba najít kontrólní bod

			// Směrový vektor
				var dx = options.to.x - options.from.x;
				var dy = options.to.y - options.from.y;

			// Dělám beziérovu křivku a potřebuji najít kontrólní bod (to je ten,
			// ke kterému jde oblouček). Najdu ho vytvořením normálového vektoru,
			// který podělím konstantou a přičtu jej ke středu úsečky té šipky.

				var Bx = ((options.from.x + options.to.x) / 2)  +  (-dy)/4;
				var By = ((options.from.y + options.to.y) / 2)  +  (+dx)/4;

		// Vytvoření skupiny g
			var g = makeSVG('g', {
				'class': options.class,
				'data-x1': options.from.x,
				'data-x2': options.from.x + (options.to.x-options.from.x),
				'data-y1': options.from.y,
				'data-y2': options.from.y + (options.to.y-options.from.y),
				'data-r' : Math.atan2(options.to.x-Bx, -options.to.y+By) * (180/Math.PI)
			});

		// Uložení do dokumentu
			$('#ma').append(g);

		// Vložení hlavy šipky obalené do g
			var gg = makeSVG('g');
			$(g).append(gg);
			$(gg).append(makeSVG('polygon', {
				points: "0,-10 -10,10 0,6 10,10"
			}));

		// Vložení čáry
			$(g).append(makeSVG('path'));

		fadeIn(g);
		return g;
	}

	/**
	 * Odstraní element
	 * @param  {HTML} element Ten, který se odstraní
	 */
	this.remove = function(element) {
		$(element).fadeOut(DESTROY_ELEMENT_FADE_TIME, function(){
			$(this).remove();
		});
	}

	var fadeIn = function(element) {
		$(element).fadeOut(0).fadeIn(CREATE_ELEMENT_FADE_TIME);
	}

}