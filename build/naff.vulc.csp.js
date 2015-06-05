
(function()
{
	/* SETUP */

	var naffIconProto = Object.create(HTMLElement.prototype);

	/* ELEMENT */

	document.registerElement('naff-icon', { prototype: naffIconProto });
})()
;

(function()
{
	/* SETUP */

	var naffTagProto = Object.create(HTMLElement.prototype);

	/* ELEMENT */

	document.registerElement('naff-tag', { prototype: naffTagProto });
})()
;

(function()
{
	/* SETUP */

	var naffXButtonProto = Object.create(HTMLElement.prototype);

	/* ELEMENT */

	document.registerElement('naff-x-button', { prototype: naffXButtonProto, extends: 'button'});
})()
