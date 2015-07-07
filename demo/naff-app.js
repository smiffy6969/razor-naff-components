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

		// switch controls
		switchStatus1: 0, switchStatus2: 1,

		// message controls
		message1: 0, message2: 0, message3: 0, message4: 0, message5: 0,

		// modal controls
		modal1: 0, modal2: 0, modal3: 0
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
	hide: function(ev, ref) { this.private[ref] = 0; }
});
