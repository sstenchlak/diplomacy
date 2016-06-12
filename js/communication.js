/**
 * Jediná třída, která bude komunikovat se serverem prostřednictvím AJAXu.
 *
 * Data se posílají pomocí funkce send() s prvním paremetrem jako příkaz (nějaký
 * string), následují data, bool zda se mají data odeslat IHNED a callback na
 * přijatá data.
 *
 * Callback se volá při příjmu dat a má tři parametry. Prvním jsou vrácená data,
 * druhým je příkaz command a třetím odeslaná data.
 *
 * V případě potřeby odeslat neodeslaná data (např. při ukončování) zavolejte
 * ToServer()
 *
 * @author  Já
 * @version 1 (2016-05-20)
 */

var Communication = new function ()
{

	var URL = ''; // URL adresa, kam se data odesílají
	var MAX_WAIT_DURATION = 5000; // Maximální čekací doba, než se nedůležitá data odešlou.
	var ON_ERROR_WAIT_DURATION = 2000; // Pokud nastane error, data se hodí znova do fronty a bude se čekat uvedenou dobu

	/**
	 * Fronta dat na odeslání
	 * @type {Array}
	 */
	var query = [ /* array of [command, data, callback] */ ];

	/**
	 * ID časovače
	 * @type {int}
	 */
	var timer = null;


	/**
	 * Odešle příkaz na server
	 * @param  {string}   command  Název příkazu pro snažší zpracování na straně serveru
	 * @param  {array/object}    data     Odesílaná data ve formě libovolného dat. typu
	 * @param  {Boolean}  now      Zda se má odeslat ihned
	 * @param  {Function} callback
	 */
	this.send = function (command, data=[], now=false, callback=null)
	{
		// Přidání dat do fronty
			query.push([command, data, callback]);
		// Ostestování, zda se má ihned odeslat
			if (now)
				this.ToServer();

		// Aktualizace časovače
			updateTimer();
	}

	/**
	 * Skutečně odešle data na server
	 */
	this.ToServer = function () {
		// Inicializace
			if (!query)
				return true;

			var data = [];
			var QUERY = query;

		// Vyprázdnění řady
			query = [];

		// Zrušení časovače
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}

		// Odstranění callbacku z pole, které se bude odesílat
			for (var index = 0; index < QUERY.length; ++index) {
				data.push([ QUERY[index][0], QUERY[index][1] ])
			}

/************************************************************************/
		// Zpracování dat
var orig = data;
			data = JSON.stringify(data);
			data = b64EncodeUnicode(data);

/**
		$.ajax({
			type: "POST",
			url: URL,
			"data": data,
			success: FromServer.bind(null, QUERY),
			error: SendError.bind(null, QUERY)
		});
**/
console.info("Simuluji odesílání dat na server. (" + data.length + " B)", orig);
celkovaVelikost += data.length;
/************************************************************************/

	}

	/**
	 * Přijme data ze serveru
	 * @param {string} data
	 * @param {array} Query Stará řada pro info.
	 */
	var FromServer = function (QUERY, data) {
		// Převedení na čitelnou formu
			data = b64DecodeUnicode(data);
			data = JSON.parse(data);

		// Začne volat callbacky
		for (var index = 0; index < data.length; ++index) {
			if (QUERY[index][2]) {
				// Callback
					QUERY[index][2]( data[index], QUERY[index][0], QUERY[index][1] );
			}
		}
	}

	/**
	 * Aktualizuje časovač
	 */
	var updateTimer = function (duration) {
		if (query.length == 1 || duration) {
			timer = setTimeout(this.ToServer, (duration ? duration : MAX_WAIT_DURATION));
		}
	}.bind(this);

	/**
	 * V případě, že se odeslání nezdařilo
	 * @param QUERY Bývalá řada
	 */
	var SendError = function (QUERY, errMsg) {
		query = QUERY.concat(query);

		// Aktualizace časovače
			updateTimer(ON_ERROR_WAIT_DURATION);

		console.error("Odeslání dat se nezdařilo!", QUERY);
	}

	/**
	 * Pomocné funkce pro base64
	 */
	var b64EncodeUnicode = function (str) {
		return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
			return String.fromCharCode('0x' + p1);
		}));
	}
	var b64DecodeUnicode = function (str) {
		return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
			return '%' + c.charCodeAt(0).toString(16);
		}).join(''));
	}
}
