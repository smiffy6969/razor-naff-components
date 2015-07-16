# Razor NAFF Web Components


__Browser Support__ - IE9+, Chrome, FF, Safari, Opera


Razor NAFF Web Components are a set of web components aimed at simplifying the development of web sites/applications. They consist of sets of native custom web components that utilise the razor-naff helper library, they can be used as simply as adding the component import (.html), then using the new custom element wherever and whenever you like in your html.

The web components are not built on top of any framework, they are built natively using JS and only require webcomponentsjs [https://github.com/webcomponents/webcomponentsjs] for polyfilling support for web components and the naff helper library [TBD] for internal workings of the component (this can also be used to build your page application too!).

The web components can be used with vanilla JS, jQuery, or used with frameworks such as angularJS, Polymer or X-tags.

This set of web components is work in progress, so please expect bugs and a limited amount of components to begin with, as I find the need for more i will add them. This collection was created to stop the need to continually iterate over the same age old problems of extending HTML for application development.


## Installation  


It is best to install the components via [Bower](http://bower.io/) in order to satisfy all dependencies (razor-naff, webcomponentsjs), in such cases where you wish to install manually, I suggest you take a peek at the **bower.json** file to satisfy dependences listed under the dependencies section manually. Please ensure when installing manually, that correct directory structure is adhered to as per [github](https://github.com) (as the dependencies are structured on github), with all components being placed in a shared folder (called bower_components maybe?).

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
<naff-icon name="" size="" rotate="" flip="" border spin pulse inverse fixed-width></naff-icon>
```


All icons are supplied via embedded [font-awesome](http://fortawesome.github.io/Font-Awesome/) which does not require a dependancy, for a full list of icons available please see their site. NOTE: you can add the attribute 'spin' to make icons spin. Styling can be applied direct to the element via standard css means, or you can have control via attributes such as size="2".


* __name__ - The icon to use as per font-awesome list (without the need for 'fa-' we only need the icon name).
* __size__ - The size as per font-awesome docs lg, 2, 3, 4, 5.
* __rotate__ - The orientation of the icon reotated from the current position such as 90, 80, 270.
* __flip__ - The orientation of the icon flipped across an axis such as horizontal, vertical.
* __border__ - Apply a border to the icon.
* __spin__ - Make the icon spin.
* __pulse__ - Make the icon spin in steps.
* __inverse__ - Invert the icon color (white icon).
* __fixed-width__ - Set the icon to a fixed width (great for aligning icons).


### naff-tag (naff-base)


```html
<naff-tag shape="" size="" color=""></naff-tag>
```


Adds a tag with the contents being shown in a colored box in several shapes, use this for highlighting text.


* __size__ - The size as extra-small, small, medium, large, extra-large.
* __shape__ - The shape as round, rounded, oval or square.
* __color__ - The color as grey, blue, red, green, orange, black, pink, purple, yellow, aqua, white.


## Form Components


### is="naff-x-button" (naff-form)


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


### is="naff-x-icon-button" (naff-form)


```html
<button is="naff-x-icon-button" name="" size="" color="" shape="" spin pulse disabled></button>
```


A nice set of buttons that extend the default button element that allow us to control the look and feel like size, colour etc. Use with on-click attribute or click event listener.


* __name__ - The icon to use as per font-awesome list (without the need for 'fa-' we only need the icon name).
* __size__ - Sizes include extra-small, small, medium, large, extra-large buttons.
* __color__ - Colours include grey, blue, red, green, orange, black, pink, purple, yellow, aqua, white.
* __shape__ - Shapes include square, round, rounded and oval.
* __spin__ - Make the icon spin.
* __pulse__ - Make the icon spin in steps.
* __disabled__ - Disables the button.


__events__


* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


### naff-input (naff-form)


```html
<naff-input name="testName" type="text" value="hello" placeholder="Type Something" validate="^(\s*|[0-9-]+)$" validateMessage="Numbers only dude!" disabled error></naff-input>
```


A more advanced input with intgral error checking, validating values entered to regex supplied and outputting a message under the input on failure.


* __name__ - The name of the form input.
* __type__ - The type of form input just like a normal input element.
* __value__ - The value of of the live input just like a normal input element.
* __placeholder__ - Text to show in the input box when empty.
* __validate__ - A regex to validate to.
* __validateMessage__ - Message to show under input when error happens.
* __disabled__ - Disables the input.
* __error__ - Shows up when an error happens in real time.


__events__


* __changed__ - Fired when a change to the input value is complete.
* __keypress__ - Fired when a key is pressed, returning the event of the keypress.
* __error__ - Fired when an error in validation occurs, returning the validation error message.
* __[attribute_name]attributechanged__ - Fired when a change to the attribute happens, contains detail of changes.


__properties__

* __.scope.value__ - The value as it would be on a normal input element
* __.scope.error__ - Is there an error with the input


### naff-switch (naff-form)


```html
<naff-switch toggle="1" disabled></naff-switch>
```


A nice toggle switch giving an off or on status, can be disabled and toggled manually by changing the toggle attribute.


* __toggle__ - The status of the switch in real time as 0 or 1. Change this value to toggle the switch.
* __disabled__ - Disables the switch.


__events__


* __change__ - Fired when a switch has toggled.
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


__WIP... TO BE CONTINUED...__
