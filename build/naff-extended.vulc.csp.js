
(function()
{
	/* SETUP */

	var naffXButtonProto = Object.create(HTMLElement.prototype);

	/* ELEMENT */

	document.registerElement('naff-x-button', { prototype: naffXButtonProto, extends: 'button'});
})()
