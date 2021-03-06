/**
 * razorNAFF Web Components application, bootstrapping to <naff-app></naff-app> elements
 * @param name The name of the element to bootstrap too
 * @param properties The object holding all properties for app (stops issues with binding loss on repeats in rivets), change this name if you wish
 * @function ready When the app is ready to rock, this is your main place for doing cool stuff
 * @function buttonTestClick Updates the buttonClicks property by 1
 */
naff.registerApplication({
	name: 'naff-app',

	private: {
		// button click counters
		buttonClicks: 0, iconButtonClicks: 0,

		// input text binds
		inputText1: '', inputText2: '', inputText3: '',

		// select binds
		selected: 1, selectOptions: [{'id': 1, 'label': 'One (id = 1)'},{'id': 2, 'label': 'Two (id = 2)'},{'id': 3, 'label': 'Three (id = 3)'}],

		// choose binds
		choosen: null,

		// switch controls
		switchStatus1: 0, switchStatus2: 1,

		// star controls
		starsLevel1: 3, starsLevel2: 3, starsLevel3: 6,

		// message controls
		message1: 0, message2: 0, message3: 0, message4: 0, message5: 0, loading: 0,

		// modal controls
		modal1: 0, modal2: 0, modal3: 0,

		// pickers
		datePickerToggle: null, datePickerValue: null, timePickerToggle: null, timePickerValue: null,

		// pagination
		pagination: {page: 1, pages: 2, total: 20}
	},

	ready: function()
	{

	},

	/**
	 * Increment button clicks
	 */
	buttonTestClick: function() { this.private.buttonClicks++; },

	/**
	 * Increment icon button clicks
	 */
	iconButtonTestClick: function() { this.private.iconButtonClicks++; },

	/**
	 * Show something
	 * @param string ref The property to toggle.
	 */
	show: function(ev, ref) { this.private[ref] = 1; },

	/**
	 * Hide something
	 * @param string ref The property to toggle.
	 */
	hide: function(ev, ref) { this.private[ref] = 0; },

	/**
	 * Pagination Change
	 */
	changePage: function()
	{
		console.log('change data');
	}
});
