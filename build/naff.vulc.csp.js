naff.registerElement({name: 'naff-icon'});
naff.registerElement({name: 'naff-tag'});

	// build scope
	naff.registerElement({
		name: 'naff-input',

		// public properties
		value: null,
		error: null,

		// private properties
		private: {
			validate: null,
			validateMessage: null
		},

		created: function()
		{
			// Initial setup
			if (this.host.hasAttribute('name')) this.template.querySelector('input').setAttribute('name', this.host.getAttribute('name'));
			if (this.host.hasAttribute('type')) this.template.querySelector('input').setAttribute('type', this.host.getAttribute('type'));
			if (this.host.value || this.host.hasAttribute('value')) this.value = this.template.querySelector('input').value = this.host.value || this.host.getAttribute('value');
			if (this.host.hasAttribute('disabled')) this.template.querySelector('input').setAttribute('disabled', '');
			if (this.host.hasAttribute('placeholder')) this.template.querySelector('input').setAttribute('placeholder', this.host.getAttribute('placeholder'));
			if (this.host.hasAttribute('validate')) this.private.validate = this.host.getAttribute('validate');
			if (this.host.hasAttribute('validate-message'))
			{
				this.private.validateMessage = this.host.getAttribute('validate-message');
				this.template.querySelector('.-input-error-message').innerHTML = this.private.validateMessage;
			}
		},

		attached: function()
		{
			this.template.querySelector('input').addEventListener('input', this.onInputChanged);
			this.template.querySelector('input').addEventListener('keypress', this.onKeyPressed);
		},

		detached: function()
		{
			this.template.querySelector('input').removeEventListener('input', this.onInputChanged);
			this.template.querySelector('input').removeEventListener('keypress', this.onKeyPressed);
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			switch (name)
			{
				case 'name':
				case 'type':
				case 'placeholder':
					if (newVal) this.template.querySelector('input').setAttribute(name, newVal);
					else this.template.querySelector('input').removeAttribute(name);
				break;
				case 'value':
					this.host.value = this.value = newVal;
					this.template.querySelector('input').value = newVal;
				break;
				case 'disabled':
					if (newVal) this.template.querySelector('input').setAttribute('disabled', '');
					else this.template.querySelector('input').removeAttribute('disabled');
				break;
				case 'validate':
					this.private[name] = newVal;
				break;
				case 'validate-message':
					this.private.validateMessage = newVal;
					this.template.querySelector('.-input-error-message').innerText = newVal;
				break;
			}
		},

		onInputChanged: function()
		{
			var scope = naff.getScope(this);
			scope.checkError(this.value);
			scope.host.value = scope.value = this.value; // have to push changes to host value too for data binders
			scope.host.setAttribute('value', this.value);
			scope.fire('changed');
		},

		onKeyPressed: function(event)
		{
			naff.getScope(this).fire('keypress', event);
		},

		checkError: function(value)
		{
			if (!this.private.validate) return;

			// validate input
			var regexp = new RegExp(this.private.validate);
			this.error = regexp.test(value);

			if (this.error)
			{
				this.template.querySelector('.-input-error').style.visibility = 'hidden';
				this.host.removeAttribute('error');
			}
			else
			{
				this.template.querySelector('.-input-error').style.visibility = 'visible';
				this.host.setAttribute('error', '');
				this.fire('error', this.private.validateMessage);
			}
		}
	});
;

	// build scope
	naff.registerElement({
		name: 'naff-switch',

		// Public properties
		toggle: 0,
		disabled: false,

		created: function()
		{
			// Initial setup
			if (this.host.hasAttribute('disabled')) this.disabled = true;
			if (this.host.hasAttribute('toggle')) this.toggle = this.host.getAttribute('toggle');
			else this.host.setAttribute('toggle', this.toggle);
			this.setSwitch();
		},

		attached: function()
		{
			this.template.querySelector('naff-icon').addEventListener('click', this.click);
		},

		detached: function()
		{
			this.template.querySelector('naff-icon').removeEventListener('click', this.click);
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			if (name == 'disabled') this.disabled = !newValue ? false: true;
			if (name =='toggle')
			{
				this.toggle = newVal == 1 ? 1 : 0;
				this.setSwitch();
			}
		},

		click: function()
		{
			var scope = naff.getScope(this);
			if (scope.disabled) return;
			scope.host.setAttribute('toggle', scope.toggle == 1 ? 0 : 1);
		},

		setSwitch: function()
		{
			this.template.querySelector('naff-icon').setAttribute('name', 'toggle-' + (this.toggle == 1 ? 'on' : 'off'));
			this.fire('change');
		}
	});
;
naff.registerElement({name: 'naff-x-button', extends: 'button'});

	// build scope
	naff.registerElement({
		name: 'naff-x-icon-button',
		extends: 'button',

		created: function()
		{
			// set initial value of icon from parent attributes
			this.template.querySelector('naff-icon').setAttribute('name', this.host.getAttribute('name'));
			if (this.host.hasAttribute('spin')) this.template.querySelector('naff-icon').setAttribute('spin', 'spin');
			if (this.host.hasAttribute('pulse')) this.template.querySelector('naff-icon').setAttribute('pulse', 'pulse');
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			// iterate over changes
			switch (name)
			{
				case 'name': this.template.querySelector('naff-icon').setAttribute('name', newVal); break;
				case 'spin':
				case 'pulse':
					if (this.host.hasAttribute(name)) this.template.querySelector('naff-icon').setAttribute(name, name);
					else this.template.querySelector('naff-icon').removeAttribute(name);
				break;
			}
		}
	});
;

	// build scope
	naff.registerElement({
		name: 'naff-message',

		toggle: 0,

		private: {
			delay: 4,
			opacityTimer: null,
			displayTimer: null,
			messageTimer: null
		},

		created: function()
		{
			// Initial setup
			if (this.host.hasAttribute('delay')) this.private.delay = parseInt(this.host.getAttribute('delay'));
			if (this.host.hasAttribute('toggle')) this.toggle = this.host.getAttribute('toggle');
			else this.host.setAttribute('toggle', this.toggle);
			this.show(true);
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			if (name == 'delay') this.private.delay = parseInt(newVal);
			if (name =='toggle')
			{
				this.toggle = newVal == 1 ? 1 : 0;
				this.show(true);
			}
		},

		show: function(internal)
		{
			var scope = this;
			if (internal && scope.toggle != 1) return;
			scope.fire('show');
			scope.host.setAttribute('toggle', 0);

			// jiggle toast if re-thrown or show for first time
			if (!!scope.private.messageTimer)
			{
				clearTimeout(scope.private.messageTimer);
				clearTimeout(scope.private.displayTimer);

				setTimeout(function()
				{
					scope.fire('jiggle');
					scope.host.className += " -jiggle";

					setTimeout(function() { scope.host.className = scope.host.className.replace(/ -jiggle/g, "") }, 750);
				}, 1);
			}
			else
			{
				scope.host.style.display = "block";
				if ("bottom" === scope.host.getAttribute('position') || "top" === scope.host.getAttribute('position')) scope.host.style.marginLeft = "-" + scope.host.offsetWidth/2 + "px";
				scope.host.style.opacity = 1;
			}

			// set timing of show/hide
			scope.private.messageTimer = setTimeout(function()
			{
				scope.host.style.opacity = 0;
				scope.private.displayTimer = setTimeout(function()
				{
					scope.host.style.display = "none";
					scope.private.messageTimer = null;
					scope.private.displayTimer = null;
					scope.host.setAttribute('toggle', 0);
					scope.fire('hide');
				}, 300);
			}, scope.private.delay * 1000);
		}
	});
;

	// build scope
	naff.registerElement({
		name: 'naff-modal',
		dataBind: true,

		toggle: 0,

		private: {
			resize: null
		},

		created: function()
		{
			this.private.resize = this.resize.bind(this);

			// Initial setup
			if (this.host.hasAttribute('toggle')) this.toggle = this.host.getAttribute('toggle');
			else this.host.setAttribute('toggle', this.toggle);
			this.show(true);
		},

		attached: function()
		{
			if (!this.template.querySelector('heading'))
			{
				var heading = this.template.querySelector('.-heading');
				heading.parentNode.removeChild(heading);
			}
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			if (name =='toggle')
			{
				this.toggle = newVal == 1 ? 1 : 0;
				this.show(true);
			}
		},

		show: function(internal)
		{
			if (internal && this.toggle != 1) return;
			var scope = this;

			window.addEventListener('resize', scope.private.resize);

			scope.host.style.display = "block";

			setTimeout(function(){
				scope.host.style.opacity = 1;
				document.body.style.overflow = 'hidden';
				scope.resize();
				scope.fire('show');
			}, 0);
		},

		hide: function()
		{
			var scope = this;

			window.removeEventListener('resize', scope.private.resize);

			scope.host.style.opacity = 0;

			setTimeout(function(){
				scope.host.style.display = "none";
				document.body.style.overflow = 'auto';
				scope.host.setAttribute('toggle', 0);
				scope.fire('hide');
			}, 300);
		},

		resize: function()
		{
			var main = this.template.querySelector('main');
			if (main) main.style.maxHeight = ((window.innerHeight + main.offsetHeight - this.host.offsetHeight) / 100) * 90 + 'px';

			var marginTop = (this.host.offsetHeight - (this.host.offsetHeight * 2)) / 2;
			var marginLeft = (this.host.offsetWidth - (this.host.offsetWidth * 2)) / 2;
			this.host.style.margin = marginTop + 'px 0 0 ' + marginLeft + 'px';
		}
	});
;

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
