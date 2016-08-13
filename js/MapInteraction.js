/**
 * Zachytává veškeré interakce s mapou a se státy na mapě a volá další třídy.
 * @author  Štěpán Stenchlák <s.stenchlak@gmail.com>
 * @version 1.0
 * @date    2016-08-13
 */
MapInteraction = new function () {

	/**
	 * Zda probíhá pohyb po mapě. Resp. zda je myš stisknuta.
	 * @type {Boolean}
	 */
	var mapmove = false;

	/**
	 * Last mouse position
	 * @type {Array}
	 */
	var mouse = [0, 0];

	var mapmobilescaling = false;
	var fingersdistance = 0;

	/**
	 * Po spuštění myši se zde uloží země, na kterou se kliklo, a pokud
	 * neproběhne pohyb s mapou, tak po odkliknutí označí zvolený stát.
	 * @type {HTML object}
	 */
	var mouseDownCountry = null;

	/**
	 * Inicializuje se.
	 */
	this.initialize = function ()
	{

		/**
		 * Stisknutí myši - inicializace posouvání mapy.
		 */
		document.getElementById('map').addEventListener('mousedown', function (e) {
			mouse = [e.pageX, e.pageY];
			mapmove = true; // Mapou se hýbe
		});

		/**
		 * Pohyb myši
		 */
		window.addEventListener('mousemove', function (e) {
			// Musí se hýbat myší, resp, musí být kliknuto myškou
				if (!mapmove) return;

			// Posunutí mapy
				MapMove.mouseMove(e.pageX - mouse[0], e.pageY - mouse[1]);

			// Aktualizace stavu myši
				mouse = [e.pageX, e.pageY];
		});

		/**
		 * Zvednutí myši a ukončení pohybu
		 */
		window.addEventListener('mouseup', function() {
			// Kdekoliv byla zvednuta myš, pohyb mapy přestane
			mapmove = false;
		});

		/**
		 * Odchyt mobilních zařízení
		 */
		var documentEventTouchstart = function (e) {
			switch (e.touches.length) {
				// Kliknutí jedním dotykem
				case 1:
					mouse = [e.touches[0].pageX, e.touches[0].pageY];
					mapmove = true; // Myší se hýbe
					mapmobilescaling = false;
				break;

				// Škláování a posouvání mapy
				case 2:
					mapmove = false;
					mapmobilescaling = true;

					mouse = [(e.touches[0].pageX + e.touches[1].pageX)/2, (e.touches[0].pageY + e.touches[1].pageY)/2];
					fingersdistance = Math.sqrt( Math.pow(e.touches[0].pageX - e.touches[1].pageX, 2) + Math.pow(e.touches[0].pageY - e.touches[1].pageY, 2) );
				break;

				default:
					mapmove = false;
					mapmobilescaling = false;
				break;
			}
		}

		document.getElementById('map').addEventListener('touchstart', documentEventTouchstart);

		window.addEventListener('touchmove', function (e) {
			if (mapmove) {
				// Posunutí mapy
					MapMove.mouseMove(e.touches[0].pageX - mouse[0], e.touches[0].pageY - mouse[1]);

				// Aktualizace stavu myši
					mouse = [e.touches[0].pageX, e.touches[0].pageY];
			}

			if (mapmobilescaling) {
				var newfingersdistance = Math.sqrt( Math.pow(e.touches[0].pageX - e.touches[1].pageX, 2) + Math.pow(e.touches[0].pageY - e.touches[1].pageY, 2) );

				// Posunutí a škálování
					MapMove.moveAndScale(
						(e.touches[0].pageX + e.touches[1].pageX)/2 - mouse[0],
						(e.touches[0].pageY + e.touches[1].pageY)/2 - mouse[1],
						(e.touches[0].pageX + e.touches[1].pageX)/2,
						(e.touches[0].pageY + e.touches[1].pageY)/2,
						newfingersdistance/fingersdistance);

				// Aktualizace stavu myši
					mouse = [(e.touches[0].pageX + e.touches[1].pageX)/2, (e.touches[0].pageY + e.touches[1].pageY)/2];

				// Aktualizace vzdálenosti prstů
					fingersdistance = newfingersdistance;
			}
		});

		window.addEventListener('touchend', function (e) {
			documentEventTouchstart(e);
		});


		// Při scrollování
		$('#map').on('mousewheel', function (e){
			MapMove.wheelMove(e.deltaY, e.clientX, e.clientY);
		});

		$('#zoomP, #zoomM').click(function(e){
			MapMove.wheelMove((e.target.id == 'zoomP') ? 1 : -1, window.innerWidth/2, window.innerHeight/2);
		});

	}

	this.registerCountry = function (element)
	{
		$(element).mouseenter(function(){
			//console.info("Vstup do státu");
		});
		$(element).mouseleave(function(){
			//console.info("Výstup ze státu");
		});
		$(element).on('mousedown', function(){
			mouseDownCountry = this;
		});
	}

};