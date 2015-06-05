# Razor NAFF Web Components 


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


In order to use the web components, it is first best practice to include the polyfills for unsupported API's by browsers, and the razor-naff helper library. This is done through the webcomponentsjs suite of polyfills (or you can find your own maybe like x-tags), as you installed razor-naff-components via bower, you will already have this pulled into the project, so all the hard work is done, just include it in your head section of your HTML along with polymer (this too was pulled in).


```html
<script src="bower_components/webcomponentsjs/webcomponents.min.js"></script>
<script src="bower_components/razor-naff/naff.min.js"></script>
```


Now we have the polyfills and helper library in place, it is your choice as to how you import the web components you need. We are going to do this using the spiffy new HTML import, which imports HTML files and get this, it only does it once regardless of how many times you add the import. This is great as we can specify dependencies in each component to ensure we have what we need for it, without impacting on performance or double loading of dependencies.

The web components are split into groups, so we can either import the whole lot in one fell swoop without the need to worry about if you have imported something (great for dev work), or we import a group as we need it...


```html
<link rel="import" href="components/razor-naff-components/build/naff.vulc.html">
```


Now you can just use any component you like, each dependency will only be loaded once (if you use the vulc file as i did above, this is all components pulled into a single file for less http requests, i.e. for production). If you want to be a little more selective to save on bandwidth and boost performance, you can import by group or by component on a per import basis...


```html
<link rel="import" href="components/razor-naff-components/build/naff-base.vulc.html">
```


or if you only want one component, you can import direct from source


```html
<link rel="import" href="components/razor-naff-components/src/naff-base/naff-icon/naff-icon.html">
```


Whilst importing from source is perfectly fine, it is recommended to import at least the group vulcanized import, this will keep http requests down (as some components have a dependancy on another). It is as simple as that, load what you need and you are ready to get using your web components


# Usage


Using the web components is as simple as writing HTML, all the components come with there own encapsulated logic and style, with all access and usage being through the attributes and innerHTML of the web component. razor-web-components are supported as far as polymer is supported through the webcomponentsjs suite of polyfills, IE10+, Chrome, Firefox, Safari 8+, Chrome (android), Safari (IOS) as per [polyer support](https://www.polymer-project.org/0.5/resources/compatibility.html). Whilst IE9 is not supported, some things do work, in a fashion. 

For details on how to use the web components, please see the applicable index file in demo folder. All web components can be manipulated via html attribute or JS by altering raw html element (use [0] on jquery selector, $("#something")[0]).

The components are split into groups, with a distinction between extended components that simply extend an exisiting element using the is="" attribute, and custom components. All extended components use the -x- naming convention to help distinguish between these two types when using.


## naff-icon [naff-base]


```html
<naff-icon name="" size="" rotate="" flip="" border spin pulse inverse fixed-width></naff-icon>
```


All icons are supplied via embedded [font-awesome](http://fortawesome.github.io/Font-Awesome/) which does not require a dependancy, for a full list of icons available please see their site. NOTE: you can add the attribute 'spin' to make icons spin. Styling can be applied direct to the element via standard css means, or you can have control via attributes such as size="2".


* __name__ - The icon to use as per font-awesome list (without the need for 'fa-' we only need the icon name)
* __size__ - The size as per font-awesome docs lg, 2, 3, 4, 5
* __rotate__ - The orientation of the icon reotated from the current position such as 90, 80, 270
* __flip__ - The orientation of the icon flipped across an axis such as horizontal, vertical
* __border__ - Apply a border to the icon
* __spin__ - Make the icon spin
* __pulse__ - Make the icon spin in steps
* __inverse__ - Invert the icon color (white icon)
* __fixed-width__ - Set the icon to a fixed width (great for aligning icons)



_WIP... TO BE CONTINUED..._