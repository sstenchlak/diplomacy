/**
 * Posun a přibližování mapy.
 *
 * Mapa je rozdělena na tři vrstvy, které jsou označeny ID:
 *  #mm (map > map) Vrstva s mapovými podklady.
 *  #ma (map > arrows) Vrstva s šipkami, pro které platí jiná pravidla škálování
 *  #mt (map > tags) Nejvyšší vrstva s popisky, která se škáluje do určitého maxima.
 */

MapMove = new function () {
	/**
	 * Konstanty určující do jakého maximálního přiblížení se můžou škálovat objekty na mapě.
	 * @type {Number}
	 */
	var MAX_SCALE_TAG_SCALABLE = 1;
	var MAX_SCALE_ARROW_SCALABLE = 1;

	var SCALE_LIMITS = [0.1, 10];

	/**
	 * Aktuální stav mapy
	 * @type {Object}
	 */
	var properties = {
		scale: 1,
		x: 0,
		y: 0
	}

	/**
	 * Poslední nastavená hodnota přiblížení
	 * Pro potřeby vykreslování
	 * @type {Number}
	 */
	var scaleLastSetValue = 1;

	/**
	 * Nastaví mapě a značkám na ni zvolené přiblížení a pozun z objektu properties
	 * @param {bool} redraw Pro účely testování, překreslí celou mapu, hlavně popisky
	 */
	var set = function (redraw) {
		// Nejnižší vrstva s mapou
			// Obyčejné přeškálování a posunutí mapy
				$("#mm").attr('transform', 'translate(' + properties.x + ', ' + properties.y + ') scale(' + properties.scale + ')');


		// Druhá vrstva s šipkami
			// Vrstvu posune a zvětší ji jen do určité maximální velikosti
				var sc = (properties.scale > MAX_SCALE_ARROW_SCALABLE) ? MAX_SCALE_ARROW_SCALABLE : properties.scale;
				$("#ma").attr('transform', 'translate(' + properties.x + ', ' + properties.y + ') scale(' + sc + ')');

			// V případě, že je potřeba posunout jednotlivé elementy. Když:
			//    proběhne změna souřadnic AND (scale je větší než hranice, nebo
			//    předchozí scale byla větší (v takovém případě se musí hodnoty
			//    zpět upravit))
				if (scaleLastSetValue != properties.scale && (properties.scale > MAX_SCALE_ARROW_SCALABLE || scaleLastSetValue > MAX_SCALE_ARROW_SCALABLE) || redraw) {

					$("#ma>g").each(function(index, el) {
						this.redrawArrowElement(el);
					}.bind(this));

				};


		// Třetí vrstva s obrázky
			// Vrstvu posune a zvětší ji jen do určité maximální velikosti
				var sc = (properties.scale > MAX_SCALE_TAG_SCALABLE) ? MAX_SCALE_TAG_SCALABLE : properties.scale;
				$("#mt").attr('transform', 'translate(' + properties.x + ', ' + properties.y + ') scale(' + sc + ')');

			// V případě, že je potřeba posunout jednotlivé elementy. Když:
			//    proběhne změna souřadnic AND (scale je větší než hranice, nebo
			//    předchozí scale byla větší (v takovém případě se musí hodnoty
			//    zpět upravit))
				if (scaleLastSetValue != properties.scale && (properties.scale > MAX_SCALE_TAG_SCALABLE || scaleLastSetValue > MAX_SCALE_TAG_SCALABLE) || redraw) {

					$("#mt>g").each(function(index, el) {
						this.redrawTagElement(el);
					}.bind(this));

				};

		// Nastaví poslední hodnotu přiblížení na aktuální
		scaleLastSetValue = properties.scale;

	}.bind(this);

	/**
	 * Překreslí velikost elementu typu Tag
	 * @param  {HTML} element
	 */
	this.redrawTagElement = function (element)
	{
		// Velikost naškálování vrstvyv s popisky
			var sc = (properties.scale > MAX_SCALE_TAG_SCALABLE) ? MAX_SCALE_TAG_SCALABLE : properties.scale;

		// Nově spočtené souřadnice
			var x = properties.scale/sc*$(element).data('cx');
			var y = properties.scale/sc*$(element).data('cy');

		$(element).attr('transform', 'translate(' + x + ', ' + y + ')');
	}

	/**
	 * Překreslí velikosti šipek Arrow
	 * @param  {HTML} element
	 */
	this.redrawArrowElement = function (element)
	{
		// Velikost naškálování vrstvyv se šipkama
			var sc = (properties.scale > MAX_SCALE_ARROW_SCALABLE) ? MAX_SCALE_ARROW_SCALABLE : properties.scale;

		// Nově spočtené souřadnice
			var x1 = properties.scale/sc*$(element).data('x1');
			var x2 = properties.scale/sc*$(element).data('x2');
			var y1 = properties.scale/sc*$(element).data('y1');
			var y2 = properties.scale/sc*$(element).data('y2');
			var r = $(element).data('r');

		// Směrový vektor
		var dx = x2 - x1;
		var dy = y2 - y1;

		// Dělám beziérovu křivku a potřebuji najít kontrólní bod (to je ten,
		// ke kterému jde oblouček). Najdu ho vytvořením normálového vektoru,
		// který podělím konstantou a přičtu jej ke středu úsečky té šipky.

		var Bx = ((x1 + x2) / 2)  +  (-dy)/4;
		var By = ((y1 + y2) / 2)  +  (+dx)/4;

		$('g', element).attr('transform', 'translate(' + x2 + ', ' + y2 + ')rotate(' + r + ')');
		$('path', element).attr('d', 'M' + x1 + ' ' + y1 + 'Q' + Bx + ' ' + By + ' ' + x2 + ' ' + y2);
	}

	/**
	 * Ponune mapu o určitou vzdálenost v pixelech
	 * @param  {int} dx Posun o x
	 * @param  {int} dy Posun o y
	 */
	this.mouseMove = function (dx, dy) {
		properties.x += dx;
		properties.y += dy;
		set();
	}

	// Změna kolečka a pozice myši na souřadnicích x a y
	// Jeden skok je dw o jedno
	this.wheelMove = function (dw, x, y) {
		// Zastaví předchozí animaci
		$(properties).stop();

		// Nastaví novou škálu na...
		var scaleTo = properties.scale*Math.pow(1.5, dw);

		// Ověření limit
		if (scaleTo > SCALE_LIMITS[1]) scaleTo = SCALE_LIMITS[1];
		if (scaleTo < SCALE_LIMITS[0]) scaleTo = SCALE_LIMITS[0];

		// Kam ukazuje myška?
		var toX = (x - properties.x) / properties.scale;
		var toY = (y - properties.y) / properties.scale;

		// Objekt scale se bude měnit z aktuální hodnoty na hodnotu {now:scaleTo}, tedy na konci bude now==to.
		$(properties).animate({scale:scaleTo},{
			duration: 200,
			step: function(now,fx){
				properties.scale = now;

				properties.x = x-toX*properties.scale;
				properties.y = y-toY*properties.scale;

				set(true);
			}
		},'linear');
	}

	/**
	 * Updatne vykreslení celé mapy.
	 * Pro účely develop
	 */
	this.redraw = function () {
		set(true);
	}

};
