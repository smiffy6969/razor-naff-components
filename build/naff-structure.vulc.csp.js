
	// build scope
	naff.registerElement({
		name: 'naff-menu',
		dataBind: true,

		menuItems: [],
		toggle: false,

		private: {
			route: null,
			defaultRoute: '',
			logoText: null
		},

		created: function()
		{
			// Initial setup
			if (this.host.hasAttribute('logo-text')) this.private.logoText = this.host.getAttribute('logo-text');
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
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			switch (name)
			{
				case 'menu-items': this.setMenuItems(newVal); break;
				case 'route': this.private.route = newVal; break;
				case 'logo-text': this.private.logoText = newVal; break;
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
			while (parent.tagName != 'LI' && !parent.hasAttribute('default')) parent = parent.parentNode;
			if (parent.hasAttribute('route')) {
				naff.setLocation({route: parent.getAttribute('route')});
				this.toggle = false;
			} else {
				var list = parent.querySelector('ul');
				if (list.hasAttribute('active')) list.removeAttribute('active');
				else list.setAttribute('active', '');
			}

			event.stopPropagation();
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
			try {
				this.menuItems = typeof menuItems == 'object' ? menuItems : JSON.parse(menuItems.replace(/[\n\r]+/g, ''));
			} catch (e) {
				throw 'naff-menu build error: invalid json string [' + menuItems.replace(/[\n\r]+/g, '') + ']';
			}
		}
	});
;
naff.registerElement({name: 'naff-page'})