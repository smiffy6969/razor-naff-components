
	// build scope
	naff.registerElement({
		name: 'naff-partial',

		private: {
			basepath: null,
			partial: null
		},

		created: function()
		{
			// Initial setup
			if (this.host.hasAttribute('basepath')) this.private.basepath = this.host.getAttribute('basepath');
			if (this.host.hasAttribute('partial')) this.private.partial = this.host.getAttribute('partial');
			this.load();
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			if (name == 'basepath') this.private.basepath = newVal;
			if (name == 'partial') this.private.partial = newVal;
			this.load();
		},

		load: function()
		{
			if (this.private.partial === null) return;

			// retrict urls to html, htm files only
			var path = this.private.basepath === null ? '' : (this.private.basepath.substr(-1) !== '/' ? this.private.basepath : this.private.basepath.substring(0, this.private.basepath.length - 1));
			var partial = path + (path.length > 1 ? '/' : '') + this.private.partial.split('.')[0] + '.html';

			// do async request to grab content
			var XHR = XMLHttpRequest || ActiveXObject;
			var request = new XHR('MSXML2.XMLHTTP.3.0');
			var scope = this;
			request.open('GET', partial, true);
			request.onreadystatechange = function ()
			{
				if (request.readyState === 4)
				{
					if (request.status === 200)
					{
						scope.host.innerHTML = request.response;
						scope.fire('loaded');
					}
					else throw 'naff-partial: Error loading partial [' + partial + ']';
				}
			};
			request.send();
		}
	});