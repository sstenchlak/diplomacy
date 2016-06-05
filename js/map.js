var mapControl = function () {
	// Indikátor pohybu mapy
	var mapmove = false;

	// Poslední pozice myši pro výpočet delty
	var mouse = [0, 0];

	// Získá mapu
	var map = $('#map');

	// Načte další třídu
	var kkt = MapMove;

	// Po kliknutí na mapu
	map.on('mousedown touchstart', function (e) {
		if (e.type == 'mousedown')
			mouse = [e.clientX, e.clientY];
		else
			mouse = [e.pageX, e.pageY];

		mapmove = true; // Myší se hýbe
	});

	// Při pohybu myši po mapě
	$(window).on('mousemove touchmove', function (e) {
		// Musí se hýbat myší.
			if (!mapmove) return;

		// Tlačítko myši musí být stále stisknuto (řeší problém s puštěním myši za obrazovkou)
			if (e.which!=1) {
				mapmove = false;
				return;
			}

		if (e.type == 'mousemove')
			kkt.mouseMove(e.clientX - mouse[0], e.clientY - mouse[1]);
		else
			kkt.mouseMove(e.pageX - mouse[0], e.pageY - mouse[1]);

		if (e.type == 'mousemove')
			mouse = [e.clientX, e.clientY];
		else
			mouse = [e.pageX, e.pageY];
	});

	// Při scrollování
	map.on('mousewheel', function (e){
		kkt.wheelMove(e.deltaY, e.clientX, e.clientY);
	});

	map.on('touchmove', function (e){
		if (e.targetTouches.length == 2) {
			var touch = event.targetTouches[0];
			// Place element where the finger is
			obj.style.left = touch.pageX + 'px';
			obj.style.top = touch.pageY + 'px';
		}
	});

	$('#zoomP, #zoomM').click(function(e){
		kkt.wheelMove((e.target.id == 'zoomP') ? 1 : -1, window.innerWidth/2, window.innerHeight/2);
	});
};