/**
 * Tato funkce je volána, když AJAX obdržel informace o nové části mapy, tato funkce tuto mapu nechá vykreslit.
 * @requires mapCreator.js
 */
var onMapReceived = function (data /* , command, sentData */) {
	// Projde jednotlivé státy
	for (var ID in data.states) {
		// Aktuální stát
			var s = data.states[ID];

		// Přidá státu několik HTML tříd (class)
			var classes = [];

			// Sousedi
			for (var k in s.neightbours) {
				classes.push('n' + s.neightbours[k]);
			}


		// Vytvoří stát na mapě
			mapCreator.addState({
				d: s.d, // Hrany (tvar)
				id: ID, // ID státu
				class: classes.join(' ')
			});
	}
}