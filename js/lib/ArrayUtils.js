/**
 * Pomocná třída pro práci s poli
 */

var ArrayUtils = new function ()
{

	/**
	 * Funkce ověří, zda se pole, jakožto hledaný prvek, nachází prohledávaném
	 * poli. Při porovnávání se berou pouze hodnoty a jejich pořadí, nikoli totožná
	 * pole.
	 * @param  {array}  find  Hledané pole
	 * @param  {array of arrays}  array Prohledávané pole
	 * @return {Boolean}       Výsledek
	 */
	this.isArrayInArray = function (find, array) {
		for (var i = 0; i < array.length; i++) {
			if (this.arraysEqual(find, array[i])) {
				return true;
			}
		};
		return false;
	}

	/**
	 * Porovná dvě pole na základě vnitřních hodnot s ohledem na pořadí
	 * @param  {array} a
	 * @param  {array} b
	 * @return {bool} Jsou stejná
	 */
	this.arraysEqual = function(a, b) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length != b.length) return false;

		// If you don't care about the order of the elements inside
		// the array, you should sort both arrays here.

		for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
		}
		return true;
	}

}
