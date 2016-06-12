/**
 * NAČÍTÁ NOVÉ ČÁSTI MAPY
 *
 * Je volána třídou MapMove.js v případě, že se nějakým způsobem posune mapa
 * (function viewChanged). Tato třída vyhodnotí, jaké mapové zóny jsou
 * zobrazeny a v případě, že nebyly načteny (var knownZones), načtou se
 * (@see function onMapReceived).
 */

var MapLoader = new function () {

	/**
	 * Šířka a výška jedné zóny
	 * @type {Number}
	 */
	var ZONE_SIZE = 500;

	/**
	 * Zahrnutí okrajů (aby tam byla rezerva)
	 * @type {Number}
	 */
	var INCLUDE_BORDER_SIZE = 100;

	/**
	 * Seznam již načtených zón
	 * @type {Array}
	 */
	var knownZones = [];

	/**
	 * V případě, že se posune mapa se zavolá tato metoda, která načte nové potřebné mapové oblasti.
	 * @param  {number} x1 coord
	 * @param  {number} y1 coord
	 * @param  {number} x2 coord
	 * @param  {number} y2 coord
	 */
	this.viewChanged = function(x1, y1, x2, y2)
	{
		// Zjištění okrajů zón
			var zx1 = Math.floor( (x1-INCLUDE_BORDER_SIZE) / ZONE_SIZE );
			var zy1 = Math.floor( (y1-INCLUDE_BORDER_SIZE) / ZONE_SIZE );
			var zx2 = Math.floor( (x2+INCLUDE_BORDER_SIZE) / ZONE_SIZE );
			var zy2 = Math.floor( (y2+INCLUDE_BORDER_SIZE) / ZONE_SIZE );

		// Projde všechny možné kombinace polem a vyzkouší, zda již jsou načtené, pokud ne, uloží je do pole
			var toLoad = [];

			for (var x = zx1; x <= zx2; x++) {
				for (var y = zy1; y <= zy2; y++) {
					if (!ArrayUtils.isArrayInArray([x, y], knownZones)) { // viz. lib/arrays.js
						toLoad.push([x, y]);
						knownZones.push([x, y]);
					}
				}
			}
		// Sestaví a odešle dotaz v případě potřeby
			if (toLoad.length) {
				Communication.send('mapload', toLoad, true, onMapReceived);
			}
	}

	/**
	 * Když přijde mapa
	 * @param  {object} data
	 */
	var onMapReceived = function(data)
	{
		// Mělo by to být ve formě pole
		for (var i = 0; i < data.length; i++) {

		}
	}.bind(this);

}
