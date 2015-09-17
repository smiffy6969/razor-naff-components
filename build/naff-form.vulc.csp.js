
	// build scope
	naff.registerElement({
		name: 'naff-input',

		// public properties
		value: null,
		error: null,

		// private properties
		private: {
			validate: null,
			validateMessage: 'Fails validation',
			match: null,
			matchMessage: 'Does not match'
		},

		attached: function()
		{
			// Initial setup
			if (this.host.hasAttribute('name')) this.template.querySelector('input').setAttribute('name', this.host.getAttribute('name'));
			if (this.host.hasAttribute('type')) this.template.querySelector('input').setAttribute('type', this.host.getAttribute('type'));
			if (this.host.value || this.host.hasAttribute('value')) this.value = this.template.querySelector('input').value = this.host.value || this.host.getAttribute('value');
			if (this.host.hasAttribute('disabled')) this.template.querySelector('input').setAttribute('disabled', '');
			if (this.host.hasAttribute('placeholder')) this.template.querySelector('input').setAttribute('placeholder', this.host.getAttribute('placeholder'));
			if (this.host.hasAttribute('required')) this.template.querySelector('input').setAttribute('required', '');
			if (this.host.hasAttribute('validate')) this.private.validate = this.host.getAttribute('validate');
			if (this.host.hasAttribute('validate-message')) this.private.validateMessage = this.host.getAttribute('validate-message');
			if (this.host.hasAttribute('match')) this.private.match = this.host.getAttribute('match');
			if (this.host.hasAttribute('match-message')) this.private.matchMessage = this.host.getAttribute('match-message');

			// force check on start if error set
			if (this.host.hasAttribute('error')) this.checkError(this.value);

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
			if (!this.template) return;

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
					if (this.template.querySelector('input').value != newVal) this.template.querySelector('input').value = newVal;
				break;
				case 'disabled':
					if (this.host.hasAttribute(name)) this.template.querySelector('input').setAttribute(name, '');
					else this.template.querySelector('input').removeAttribute(name);
				break;
				case 'validate':
				case 'match':
				case 'match-message':
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
			this.error = !regexp.test(value);

			if (this.error)
			{
				this.template.querySelector('.-input-error-message').innerHTML = this.private.validateMessage;
				this.template.querySelector('.-input-error').style.visibility = 'visible';
				this.host.setAttribute('error', 1);
				this.fire('error', this.private.validateMessage);
			}
			else if (this.private.match != null && this.private.match != value)
			{
				this.error = true;
				this.template.querySelector('.-input-error-message').innerHTML = this.private.matchMessage;
				this.template.querySelector('.-input-error').style.visibility = 'visible';
				this.host.setAttribute('error', 1);
				this.fire('error', this.private.matchMessage);
			}
			else
			{
				this.template.querySelector('.-input-error').style.visibility = 'hidden';
				this.host.setAttribute('error', 0);
				this.fire('ok');
			}
		},

		focus: function()
		{
			return this.template.querySelector('input').focus();
		}
	});
;

	// build scope
	naff.registerElement({
		name: 'naff-switch',

		// Public properties
		toggle: 0,
		disabled: false,

		attached: function()
		{
			// Initial setup
			if (this.host.hasAttribute('disabled')) this.disabled = true;
			if (this.host.hasAttribute('toggle')) this.toggle = this.host.getAttribute('toggle');
			else this.host.setAttribute('toggle', this.toggle);
			this.setSwitch();

			this.template.querySelector('naff-icon').addEventListener('click', this.click);
		},

		detached: function()
		{
			this.template.querySelector('naff-icon').removeEventListener('click', this.click);
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			if (!this.template) return;

			if (name == 'disabled') this.disabled = !newValue ? false: true;
			if (name =='toggle')
			{
				this.toggle = newVal == 1 ? 1 : 0;
				this.setSwitch();
			}
		},

		click: function()
		{
			var scope = this.parentNode.scope;
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
		name: 'naff-x-form',
		extends: 'form',
		error: false,

		private: {
			matches: []
		},

		attached: function()
		{
			this.addMatches();
		},

		detached: function()
		{
			this.removeMatches();
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			if (name == 'refresh' && newVal != oldVal)
			{
				this.removeMatches();
				this.addMatches();
			}
		},

		addMatches: function()
		{
			this.private.matches = this.host.querySelectorAll('naff-input, select[is=naff-x-select], textarea[is=naff-x-textarea], naff-date-picker, naff-time-picker');
			for (var i = 0; i < this.private.matches.length; i++) this.private.matches[i].addEventListener('changed', this.checkError);
		},

		removeMatches: function()
		{
			for (var i = 0; i < this.private.matches.length; i++) this.private.matches[i].removeEventListener('changed', this.checkError);
		},

		checkError: function(event, scope)
		{
			var scope = scope || naff.getParentScope(this, 'naff-x-form');
			var error = false;
			for (var i = 0; i < scope.private.matches.length; i++)
			{
				if (scope.private.matches[i].hasAttribute('disabled')) continue;

				var val = scope.private.matches[i].scope ? scope.private.matches[i].scope.value : scope.private.matches[i].value;
				var err = scope.private.matches[i].scope ? scope.private.matches[i].scope.error : false;
				if ((scope.private.matches[i].hasAttribute('required') && !val) || err) error = true;
			}
			scope.error = error;

			if (!!error)
			{
				scope.host.setAttribute('error', 1);
				scope.fire('error');
			}
			else
			{
				scope.host.setAttribute('error', 0);
				scope.fire('ok');
			}
		}
	});
;

	// build scope
	naff.registerElement({
		name: 'naff-x-icon-button',
		extends: 'button',

		attached: function()
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
naff.registerElement({name: 'naff-x-select'});