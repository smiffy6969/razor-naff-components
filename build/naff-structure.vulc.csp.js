
	// build scope
	naff.registerElement({
		name: 'naff-menu',
		dataBind: true,
		attributes: {'menu-items': []},

		toggle: false,

		private: {
			route: null,
			defaultRoute: '',
			sideLogoText: null,
			topLogoText: null,
			sideLogo: null,
			topLogo: null
		},

		attached: function()
		{
			// Initial setup
			if (this.host.hasAttribute('side-logo')) this.private.sideLogo = this.host.getAttribute('side-logo');
			if (this.host.hasAttribute('top-logo')) this.private.topLogo = this.host.getAttribute('top-logo');
			if (this.host.hasAttribute('side-logo-text')) this.private.sideLogoText = this.host.getAttribute('side-logo-text');
			if (this.host.hasAttribute('top-logo-text')) this.private.topLogoText = this.host.getAttribute('top-logo-text');
			if (this.host.hasAttribute('menu-items')) this.setMenuItems(this.host.getAttribute('menu-items'));
			if (this.host.hasAttribute('default-route')) this.private.defaultRoute = this.host.getAttribute('default-route');

			var location = naff.getLocation();
			if (this.host.hasAttribute('default-route') && location.route.length < 1) {
				this.private.route = this.host.getAttribute('default-route');
				naff.setLocation({route: this.private.route});
			} else {
				this.private.route = location.route;
				this.host.setAttribute('route', this.private.route);
			}

			var scope = this;
			sightglass(this.attributes, 'menu-items', function() {
				scope.updateSelected();
			});
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			switch (name)
			{
				case 'menu-items': this.setMenuItems(newVal); break;
				case 'route': this.private.route = newVal; break;
				case 'side-logo': this.private.sideLogo = newVal; break;
				case 'top-logo': this.private.topLogo = newVal; break;
				case 'side-logo-text': this.private.sideLogoText = newVal; break;
				case 'top-logo-text': this.private.topLogoText = newVal; break;
				case 'default-route': this.private.defaultRoute = newVal; break;
			}
			this.updateSelected();
		},

		location: function(newLoc, oldLoc)
		{
			if (oldLoc) this.host.setAttribute('route', newLoc.route);
		},

		changeRoute: function(event)
		{
			var parent = event.target;

			if (parent.hasAttribute('route')) {
				naff.setLocation({route: parent.getAttribute('route')});
				this.toggle = false;
			} else {
				var list = parent.parentNode.querySelector('ul');
				if (list.hasAttribute('active')) list.removeAttribute('active');
				else list.setAttribute('active', '');
			}

			event.stopPropagation();
			event.preventDefault();
		},

		toggleMenu: function()
		{
			this.toggle = !this.toggle;
		},

		updateSelected: function()
		{
			var items = this.template.querySelectorAll('li');
			for (var i = 0; i < items.length; i++) {
				if (items[i].getAttribute('route') == this.private.route) items[i].setAttribute('selected', '');
				else items[i].removeAttribute('selected');
			}

			var list = this.template.querySelectorAll('ul');
			for (var i = 0; i < list.length; i++) {
				if (list[i].querySelectorAll('li[selected]').length > 0) list[i].setAttribute('active', '');
				else list[i].removeAttribute('active');
			}
		},

		setMenuItems: function(menuItems)
		{
			if (menuItems.indexOf('object not bound') == 0) return;
			try {
				if (typeof this.attribtues === 'undefined') this.attributes = {};
				this.attributes['menu-items'] = JSON.parse(menuItems.replace(/[\n\r]+/g, ''));
			} catch (e) {
				throw 'naff-menu build error: invalid json string [' + menuItems.replace(/[\n\r]+/g, '') + ']';
			}
		},

		addHash: function(a, b)
		{
			return '#' + this.item.route;
		}
	});
;
naff.registerElement({name: 'naff-page'})