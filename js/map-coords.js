MAPAPKA = new function () {
	// Aktuální velikost mapy
	var scale = {
		now: 1,
		to: 1
	};

	// Minulá velikost scale pro potřeby funkce set
	var scaleLastSetValue = 1;

	const MAX_SCALE_TAG_SCALABLE = 1;
	const MAX_SCALE_ARROW_SCALABLE = 1;

	// Posun mapy x,y
	var translate = [0, 0];

	// Funkce, která se postará o veškeré přeškálovaní všech mapových vrstev
	// Prvním parametrem je translate, druhým scale
	var set = function (redraw) {
		// Nejnižší vrstva s mapou
			$("#ms").attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale.now + ')');

		// Třetí vrstva s obrázky
			var sc = (scale.now > MAX_SCALE_TAG_SCALABLE) ? MAX_SCALE_TAG_SCALABLE : scale.now;
			$("#mt").attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + sc + ')');

			// Proběhne transformace souřadnic všech popisků pouze tehdy, když:
			//    proběhne změna souřadnic AND (scale je větší než hranice, nebo
			//    předchozí scale byla větší (v takovém případě se musí hodnoty
			//    zpět upravit))
			if (scaleLastSetValue != scale.now && (scale.now > MAX_SCALE_TAG_SCALABLE || scaleLastSetValue > MAX_SCALE_TAG_SCALABLE) || redraw) {
				var sc = (scale.now > MAX_SCALE_TAG_SCALABLE) ? MAX_SCALE_TAG_SCALABLE : scale.now;
				$("#mt>g").each(function(index, el) {
					var x = scale.now/sc*$(this).data('cx');
					var y = scale.now/sc*$(this).data('cy');
					$(this).attr('transform', 'translate(' + x + ', ' + y + ')');
				});
			};

		// Aktualizuje vrstvu, kde jsou šipky
			var sc = (scale.now > MAX_SCALE_ARROW_SCALABLE) ? MAX_SCALE_ARROW_SCALABLE : scale.now;
			$("#ma").attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + sc + ')');

			if (scaleLastSetValue != scale.now && (scale.now > MAX_SCALE_ARROW_SCALABLE || scaleLastSetValue > MAX_SCALE_ARROW_SCALABLE) || redraw) {
				var sc = (scale.now > MAX_SCALE_ARROW_SCALABLE) ? MAX_SCALE_ARROW_SCALABLE : scale.now;
				$("#ma>g").each(function(index, el) {
					var x1 = scale.now/sc*$(this).data('x1');
					var x2 = scale.now/sc*$(this).data('x2');
					var y1 = scale.now/sc*$(this).data('y1');
					var y2 = scale.now/sc*$(this).data('y2');
					var r = $(this).data('r');

					// Směrový vektor
					var dx = x2 - x1;
					var dy = y2 - y1;

					// Dělám beziérovu křivku a potřebuji najít kontrólní bod (to je ten,
					// ke kterému jde oblouček). Najdu ho vytvořením normálového vektoru,
					// který podělím konstantou a přičtu jej ke středu úsečky té šipky.

					var Bx = ((x1 + x2) / 2)  +  (-dy)/4;
					var By = ((y1 + y2) / 2)  +  (+dx)/4;

					$('g', this).attr('transform', 'translate(' + x2 + ', ' + y2 + ')rotate(' + r + ')');
					$('path', this).attr('d', 'M' + x1 + ' ' + y1 + 'Q' + Bx + ' ' + By + ' ' + x2 + ' ' + y2);
				});
			};


		scaleLastSetValue = scale.now;
	}

	// Změna pozice myši v pixelech
	this.mouseMove = function (dx, dy) {
		translate[0] += dx;
		translate[1] += dy;
		set();
	}

	// Změna kolečka a pozice myši na souřadnicích x a y
	// Jeden skok je dw o jedno
	this.wheelMove = function (dw, x, y) {
		// Zastaví předchozí animaci
		$(scale).stop();

		// Nastaví novou škálu na...
		scale.to = scale.now*Math.pow(1.5, dw);

		// Kam ukazuje myška?
		var toX = (x - translate[0]) / scale.now;
		var toY = (y - translate[1]) / scale.now;

		// Objekt scale se bude měnit z aktuální hodnoty na hodnotu {now:scale.to}, tedy na konci bude now==to.
		$(scale).animate({now:scale.to},{
			duration: 200,
			step: function(now,fx){
				scale.now = now;

				translate[0] = x-toX*scale.now;
				translate[1] = y-toY*scale.now;

				set(true);
			}
		},'linear');
	}

	/**
	 * Updatne vykreslení celé mapy.
	 */
	this.redraw = function () {
		set(true);
	}

};
