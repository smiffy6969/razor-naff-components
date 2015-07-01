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
		buttonClicks: 0,
		iconButtonClicks: 0,
		inputText1: '',
		inputText2: '',
		inputText3: '',
		switchStatus1: 0,
		switchStatus2: 1
	},

	ready: function()
	{

	},

	buttonTestClick: function()
	{
		this.properties.buttonClicks++;
	},

	iconButtonTestClick: function()
	{
		this.properties.iconButtonClicks++;
	}
});
