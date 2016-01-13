# Razor NAFF Web Components


__Browser Support__ - IE9+, Chrome, FF, Safari, Opera


Razor NAFF Web Components are a set of web components aimed at simplifying the development of web sites/applications. They consist of sets of native custom web components that utilise the razor-naff helper library, they can be used as simply as adding the component import (.html), then using the new custom element wherever and whenever you like in your html.

The web components are not built on top of any framework, they are built natively using JS and only require webcomponentsjs [https://github.com/webcomponents/webcomponentsjs] for polyfilling support for web components and the naff helper library [TBD] for internal workings of the component (this can also be used to build your page application too!).

The web components can be used with vanilla JS, jQuery, or used with frameworks such as angularJS, Polymer or X-tags.

This set of web components is work in progress, so please expect bugs and a limited amount of components to begin with, as I find the need for more i will add them. This collection was created to stop the need to continually iterate over the same age old problems of extending HTML for application development.


## Installation  


It is best to install the components via [Bower](http://bower.io/) in order to satisfy all dependencies (razor-naff, webcomponentsjs, promise, font-awesome), in such cases where you wish to install manually, I suggest you take a peek at the **bower.json** file to satisfy dependences listed under the dependencies section manually. Please ensure when installing manually, that correct directory structure is adhered to as per [github](https://github.com) (as the dependencies are structured on github), with all components being placed in a shared folder (called bower_components maybe?).

You may use the --save flag to store installation info in a central project bower.json file, if you do not have one already, you can do this first.


```
bower init
```


Installing is simple via bower in the command line, from your project root folder...


```
bower install razor-naff-components --save
```


following the instructions to build your bower.json, alternatively you can just copy one from another project and change it manually.


## Setup


In order to use the web components, it is first best practice to include the polyfills for unsupported API's in browsers, and the razor-naff helper library. This is done through the webcomponentsjs suite of polyfills (or you can find your own maybe like x-tags) and promise polyfill, as you installed razor-naff-components via bower, you will already have these pulled into the project, so all the hard work is done, just include it in your head section of your HTML along with polymer (this too was pulled in). You will need to include the bundled version of naff to include support for data binding


```html
<script src="bower_components/webcomponentsjs/webcomponents.min.js"></script>
<script src="bower_components/promise-polyfill/Promise.min.js"></script>
<script src="bower_components/razor-naff/naff.bundled.min.js"></script>
<link rel="stylesheet" type="text/css" href="bower_components/font-awesome/css/font-awesome.min.css">
```


Now we have the polyfills and helper library in place, it is your choice as to how you import the web components you need. We are going to do this using the spiffy new HTML import, which imports HTML files and get this, it only does it once regardless of how many times you add the import. This is great as we can specify dependencies in each component to ensure we have what we need for it, without impacting on performance or double loading of dependencies.

The web components are split into groups, so we can either import the whole lot in one fell swoop without the need to worry about if you have imported something (great for dev work), or we import a group as we need it on a per app/page basis...


```html
<link rel="import" href="components/razor-naff-components/build/naff.vulc.html">
```


Now you can just use any component you like, each dependency will only be loaded once, where components use other components. If you only want one component or group of compoents, you can import the group.


```html
<link rel="import" href="components/razor-naff-components/build/naff-base.vulc.html">
```


# Usage


Using the web components is as simple as writing HTML, all the components come with there own logic and style, with all access and usage being through the attributes or the 'scope' property on the element. razor-naff-components not designed to be used with other web component frameworks, however they will function just fine in any environment that does not apply any shadow dom to its host element (as styling logic will not bleed in). This is due to limitations with polyfills for shadow dom and the lack of native shadow dom support at present.

For details on how to use the web components, please see the applicable index file in demo folder. All web components can be manipulated via html attribute or JS by altering raw html element scope `document.querySelector('naff-test').scope`.

The components are split into groups, with a distinction between extended components that simply extend an exisiting element using the is="" attribute, and custom components.


## Base Components


### naff-icon (naff-base)


```html
<naff-icon name="" size="" rotate="" flip="" border spin pulse inverse fw></naff-icon>
```


All icons are supplied via [font-awesome](http://fortawesome.github.io/Font-Awesome/) all we do is abstract out the different class names allowing you to add them as attirbutes (better for binding tools), thes are then written to the class as a name (or you can alter the class directly). Basically this component allows you to use a dedicate icon tag instead of the 'i' tag which is not meant for icons really. For a full list of icons available please see their site. NOTE: you can add the attribute 'spin' to make icons spin. Styling can be applied direct to the element via standard css means, or you can have control via attributes such as size="2".


Please ensure you have added your style tag in your head for fontawesome before using!


* __name__ - The icon to use as per font-awesome list (without the need for 'fa-' we only need the icon name).
* __size__ - The size as per font-awesome docs lg, 2, 3, 4, 5.
* __rotate__ - The orientation of the icon reotated from the current position such as 90, 80, 270.
* __flip__ - The orientation of the icon flipped across an axis such as horizontal, vertical.
* __border__ - Apply a border to the icon.
* __spin__ - Make the icon spin.
* __pulse__ - Make the icon spin in steps.
* __inverse__ - Invert the icon color (white icon).
* __fw__ - Set the icon to a fixed width (great for aligning icons).


### naff-tag (naff-base)


```html
<naff-tag shape="" size="" color=""></naff-tag>
```


Adds a tag with the contents being shown in a colored box in several shapes, use this for highlighting text.


* __size__ - The size as extra-small, small, medium, large, extra-large.
* __shape__ - The shape as round, rounded, oval or square.
* __color__ - The color as grey, blue, red, green, orange, black, pink, purple, yellow, aqua, white.


## Form Components


### is="naff-x-button" (naff-control)


```html
<button is="naff-x-button" size="" color="" shape="" disabled></button>
```


A nice set of buttons that extend the default button element that allow us to control the look and feel like size, colour etc. Use with on-click attribute or click event listener.


* __size__ - Sizes include extra-small, small, medium, large, extra-large buttons.
* __color__ - Colours include grey, blue, red, green, orange, black, pink, purple, yellow, aqua, white.
* __shape__ - Shapes include square, round, rounded and oval.
* __disabled__ - Disables the button.


__events__


* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


### naff-form (naff-control)


```html
<naff-form refresh="anything" error></naff-form>
```


Any naff-control element used inside naff-form that has validation regex set will be checked by this form when any value changes.
The form will set the error attribute when any naff-control element errors or is required and empty (skipping disabled ones) to allow you to easily error check your form contents in one go. Please note only naff-control custom elements will be checked.


* __error__ - Set to 1 for an error and 0 for ok.
* __refresh__ - Change the value in this attribute to refresh the error matches to error check, great when loading form with dynamic data.


__events__


* __error__ - Fired when an error in naff-control element validation occurs.
* __ok__ - Fired when no error is found in naff-control element validation.
* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


__properties__


* __.scope.error__ - Is there an error with the form


### naff-input (naff-control)


```html
<naff-input name="testName" type="text" value="hello" placeholder="Type Something" match="Text to match" match-message="does not match" validate="^(\s*|[0-9-]+)$" validateMessage="Numbers only dude!" disabled error></naff-input>
```


A more advanced input with intgral error checking, validating values entered to regex supplied and outputting a message under the input on failure. In addition to validation, you may also send in an additional match attribute, meaning you can have validation, and if pass, will then move on to ensure matches the match value. This is great for email and password confirmation by using naff-match="" to send in the password to confirm against for the confirmation input. Sets error on validation or match fail.


* __name__ - The name of the form input.
* __type__ - The type of form input just like a normal input element.
* __value__ - The value of of the live input just like a normal input element.
* __placeholder__ - Text to show in the input box when empty.
* __match__ - A tet string to match, can be used to send in password to confirm using naff-match="path.to.password".
* __matchMessage__ - Message to show if match is set and validation passes, good for confirming things like emails or passwords.
* __validate__ - A regex to validate to.
* __validateMessage__ - Message to show under input when error happens.
* __disabled__ - Disables the input.
* __error__ - Set to 1 for an error and 0 for ok, add this attribute manually to force check on load.


__events__


* __changed__ - Fired when a change to the input value is complete.
* __keypress__ - Fired when a key is pressed, returning the event of the keypress.
* __error__ - Fired when an error in validation occurs, returning the validation error message.
* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


__properties__


* __.scope.value__ - The value as it would be on a normal input element
* __.scope.error__ - Is there an error with the input


__methods__


* __.scope.focus__ - Sets focus on the element


### naff-choose (naff-control)


```html
<naff-choose placeholder="Main Category" options='[{"id": 1, "name": "boo"}]' option-value="id" option-label="name" add disabled></naff-choose>
```


A nice simple multiple select tool that lets you choose values from a drop down list and add multiple/remove items from the selection.


* __placeholder__ - Text to show with no selection.
* __options__ - The options to load the chooser with, as comma separated list or JSON data (or you can set property directly).
* __option-value__ - The object value to use as the values selected (array of values).
* __option-label__ - The label to show when selecting.
* __add__ - Stops auto add on select and provides an add button to select values.
* __disabled__ - Disables the input.


__events__


* __change__ - Fired when a change to the selection happens.
* __select__ - Fired when a selection happens without adding it (when using add button).
* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


__properties__


* __.scope.options__ - The options to populate the chooser with.
* __.scope.selected__ - The selected values as per option-value or 'value' for default.
* __.scope.selectedObs__ - The actual selected objects, should you want the whole object.



### naff-x-select (naff-control)


```html
<select is="naff-x-select">
    <option></option>
</select>
```


A simple wrapper for select boxes to style them like the naff-input box. You can use naff-repeat on options to output options for the select box.


__events__


* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


### naff-switch (naff-control)


```html
<naff-switch toggle="1" on-color="red" disabled></naff-switch>
```


A nice toggle switch giving an off or on status showing as a gray off and green filled on switch, can be disabled and toggled manually by changing the toggle attribute.


* __toggle__ - The status of the switch in real time as 0 or 1. Change this value to toggle the switch.
* __on-color__ - Change the default green on color of the filled switch to red, blue or orange.
* __disabled__ - Disables the switch.


__events__


* __change__ - Fired when a switch has toggled.
* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


### naff-level (naff-control)


```html
<naff-level level="3" maximum="5" icon-filled="" icon-empty="" disabled></naff-level>
```


A nice way to show a level using icons (default to stars). Will show filled in icons 'level' amount of times continuing with empty icons until 'maximum' reached. Click the icon to set the level at that point.


* __level__ - The level currently set.
* __maximum__ - The maximum amount of level to be had.
* __icon-filled__ - [optional] The icon to use as filled icon as per naff-icon name (default is 'star').
* __icon-empty__ - [optional] The icon to use as empty icon as per naff-icon name (default is 'star-o').
* __disabled__ - Disables the level clicking.


__events__


* __change__ - Fired when a level is changed along with the level.
* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


### naff-message (naff-overlay)


```html
<naff-message position="bottom-right" color="blue" toggle="1">Something happened</naff-message>
```


A notification message that can be displayed in various positions around the screen and in various colours, auto hides after 'delay' amount of seconds. If fired whilst already in view, promotes the message to jiggle, resetting the delay timer to prolong the visibility. To trigger a message to be shown, set toggle attribute to 1 or hit show function on scope.


* __toggle__ - The visibility of the message in real time as 0 or 1. Change this value to show or hide the message.
* __position__ - Set to bottom, bottom-left, bottom-right, top, top-left or top-right to position the message when shown.
* __color__ - The colour of the message to help set message types, red, blue, green, orange, white or black [default].
* __delay__ - The delay amount in seconds.


__events__


* __show__ - Fired when message is shown.
* __jiggle__ - Fired when message is shown whilst still visible.
* __hide__ - Fired when message auto hides.
* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


__methods__


* __scope.show()__ - Show the message, which then auto hides after 'delay' seconds.


### naff-loading (naff-overlay)


```html
<naff-loading position="bottom-right" color="blue" shape="round" toggle="1">
	<naff-icon name="refresh" spin></naff-icon>
</naff-loading>
```


A type of notification message but has persistant state.


* __toggle__ - The visibility of the message in real time as 0 or 1. Change this value to show or hide the message.
* __position__ - Set to bottom, bottom-left, bottom-right, top, top-left or top-right to position the message when shown.
* __color__ - The colour of the message to help set message types, red, blue, green, orange, white or black [default].
* __shape__ - The shape of the message like round square or oval


__events__


* __show__ - Fired when message is shown.
* __hide__ - Fired when message auto hides.
* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


__methods__


* __scope.show()__ - Show the message.
* __scope.hide()__ - Hide the message.


### naff-modal (naff-overlay)


```html
<naff-modal toggle="1">
    <heading>
        Heading with close icon
    </heading>
    <main>
        Main Content
    </main>
    <footer>
        Footer content
    </footer>
</naff-modal>
```


A modal box positioned centrally on the screen that auto adjusts height, setting width to 50% of the window (and 90% when mobile view). When visible, the modal will show at 50% width by default (or you can change in css) with height auto set to wrap contents or add scroll bar when reaching the limit of the browser window, adapting this to mobiles with a force full on devices less than 500px wide. You can place optional heading content to apply a heading to the modal with a close icon, or footer content. Main content is required and will auto size based on contents.


* __toggle__ - The visibility of the modal in real time as 0 or 1. Change this value to show or hide the modal.


__content__


* __heading__ - Any content you want to show as a heading, also shows close icon.
* __main__ - Any content you want to show in the main area of the modal with scroll on large content.
* __footer__ - Any content you want to show in the footer area of the modal.


__events__


* __show__ - Fired when modal is shown.
* __hide__ - Fired when modal is hidden.
* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


__methods__


* __scope.show()__ - Show the modal.
* __scope.hide()__ - Hide the modal.


### naff-date-picker (naff-overlay)


```html
<naff-date-picker toggle="1" format="ddd dd mmm yyyy" value="Tue 01 Jan 2015"></naff-date-picker>
```


A modal box with a date picker inside, allowing you to select a date. Date is set on the date attribute and selected date is set back on the date attribute. Change the format of the date as set and read back using the format supplied to dateFormat() function which is included in the naff bundle. Toggle the picker using toggle attribute, with selection toggling the modal off.


* __toggle__ - The visibility of the modal in real time as 0 or 1. Change this value to show or hide the modal.
* __format__ - The format of the formatted result as per dateFormat()
* __value__ - The actual value picked, can also set this to get the picker to start at this point.


__events__


* __change__ - Fired when date picker month is changed, also sends detail of month in mm format.
* __select__ - Fired when date picker date is selected, also sends detail of date selected in format set by format attribute.
* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


__methods__


* __scope.show()__ - Show the modal.
* __scope.hide()__ - Hide the modal.


### naff-time-picker (naff-overlay)


```html
<naff-time-picker toggle="1" format="HH:MM" value="16:30"></naff-time-picker>
```


A modal box with a time picker inside, allowing you to select a time. Time is set by using the buttons above and below to alter the hours minutes and seconds. Change the format of the time as set and read back using the format supplied to dateFormat() function which is included in the naff bundle. Toggle the picker using toggle attribute, with selection toggling the modal off.


* __toggle__ - The visibility of the modal in real time as 0 or 1. Change this value to show or hide the modal.
* __format__ - The format of the formatted result as per dateFormat()
* __value__ - The actual value picked, can also set this to get the picker to start at this point.


__events__


* __change__ - Fired when time picker time is changed, also sends detail of time in set format.
* __select__ - Fired when time picker time is selected, also sends detail of time selected in format set by format attribute.
* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


__methods__


* __scope.show()__ - Show the modal.
* __scope.hide()__ - Hide the modal.


### naff-partial (naff-resource)


```html
<naff-partial basepath="application/my-partials" partial="partial-one"></naff-partial>
```


A partial loader to load content from a html file (html extension only) and render the contents in the element. On change of attributes, reload of partial happens meaning this can be used in conjunction with routing to create single page apps with multiple traversable app pages (without reload, see naff getLocation/setLocation for app routing). Only works for same domain loading and requires javascript embedded tags to be swapped for html import with embedded script tags to promote loading of script from partial.

example of partial dependancy resolution, inside your partial html file (load js as html import with js embedded inside html script tags)

```html
<!-- partial dependancies -->
<link rel="stylesheet" type="text/css" href="....../style.css">
<link rel="import" href="...../logic.js.html">

<div>
    <!-- stuff here in partial -->
</div>
```


* __basepath__ - The base path for all your partials.
* __partial__ - The partial to load (without the .html part) this must resolve to a .html file and can include sub folders


__events__


* __loaded__ - Fired when partial hase finished being rendered onto screen.
* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


__methods__


* __scope.load()__ - Loads the modal based on internal reference of basepath and partial, use attributes to change these values and prmote auto load.


### naff-menu (naff-structure)


```html
<naff-menu logo-text="hello" children="expandable" position="left" default-route="one" menu-items='[{"route":"one","label":"One long menu item","icon":"trash","menuItems":[]},...'></naff-menu>
```


Displays a mobile friendly left/right hand menu that takes up full length of the screen. When screen shrinks to mobile layout, menu changes to top menu with toggle menu icon. Menus can be nested up to 5 children and can also have navigable or benign parents (by omiting the route completely). To finsh off, you can add logo text that will automatically direct the user to default-route. Style the menu directly to have alter color, font etc. Data can either be set on menu-items attribute as a valid JSON string (by using single quotes as the menu-items attribute quotes, e.g. menu-items='[{...}]') or can be set by altering the elements scope.menuItems to a valid array containing objects for each menu item. Use this in conjunction with naff-page to create a basic page structure of menu and page area.


* __side-logo__ - Path to a logo image to use in menu when showing side menu.
* __side-logo-text__ - Any logo text to display under logo and above menu when showing side menu.
* __top-logo__ - Path to a logo image to use in top menu when showing top menu.
* __top-logo-text__ - Any logo text to display after logo when showing top menu.
* __children__ - Set to expandable to have child menu items hidden until parent is clicked.
* __position__ - Place menu on left or right side of the screen.
* __default-route__ - The default route to go to when none is set i.e. your home page.
* __menu-items__ - The menu items to display as a JSON string, use single quotes for menu-items='' to ensure you get a valid JSON string.


__events__


* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


__properties__


* __scope.toggle__ - The status of the menu icon toggle when in mobile view.
* __scope.menuItems__ - The menu items to display as an array of objects containing label, route [optional], icon [optional], menuItems [optional] (use same structure for child menus).


### naff-page (naff-structure)


```html
<naff-page position="right"></naff-page>
```


Works along side naff-menu to provide an area for page/application content to be placed. Places content in a scrollable area that adapts to mobile views along with naff-menu. Set to left or right side of page when menu is always visible.


* __position__ - Place page on left or right side of the screen.


__WIP... TO BE CONTINUED...__
