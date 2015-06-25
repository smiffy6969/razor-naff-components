
	// build scope
	naff.registerElement({
		name: 'naff-input',

		properties: { 
			error: null,
			value: null,
			validate: null,
			validateMessage: null 
		},

		created: function()
		{		
			// Initial setup
			if (this.host.hasAttribute('name')) this.template.querySelector('input').setAttribute('name', this.host.getAttribute('name'));
			if (this.host.hasAttribute('type')) this.template.querySelector('input').setAttribute('type', this.host.getAttribute('type'));
			if (this.host.hasAttribute('value')) this.template.querySelector('input').setAttribute('value', this.host.getAttribute('value'));
			if (this.host.hasAttribute('disabled')) this.template.querySelector('input').setAttribute('disabled', '');
			if (this.host.hasAttribute('placeholder')) this.template.querySelector('input').setAttribute('placeholder', this.host.getAttribute('placeholder'));
			if (this.host.hasAttribute('validate')) this.properties.validate = this.host.getAttribute('validate');
			if (this.host.hasAttribute('validateMessage')) 
			{
				this.properties.validateMessage = this.host.getAttribute('validateMessage');
				this.template.querySelector('.-input-error-message').innerText = this.properties.validateMessage;
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
				case 'value': 
				case 'placeholder': 
					if (newVal) this.template.querySelector('input').setAttribute(name, newVal);
					else this.template.querySelector('input').removeAttribute(name);
				break;
				case 'disabled':
					if (newVal) this.template.querySelector('input').setAttribute('disabled', '');
					else this.template.querySelector('input').removeAttribute('disabled');
				break;
				case 'validate':
					this.properties[name] = newVal;
				break;
				case 'validateMessage':
					this.properties.validateMessage = newVal;
					this.template.querySelector('.-input-error-message').innerText = newVal;
				break;
			}
		},

		onInputChanged: function()
		{
			var scope = naff.getScope(this);
			scope.fire('change');
			scope.properties.value = this.value;
			scope.host.setAttribute('value', this.value);
			scope.checkError(this.value);
			scope.fire('changed');
		},

		onKeyPressed: function(event)
		{
			naff.getScope(this).fire('keypress', event);
		},

		checkError: function(value)
		{
			if (!this.properties.validate) return;

			// validate input
			var regexp = new RegExp(this.properties.validate);
			this.properties.error = regexp.test(value);

			if (this.properties.error) 
			{
				this.template.querySelector('.-input-error').style.visibility = 'hidden';
				this.host.removeAttribute('error');
			}
			else 
			{
				this.fire('error', this.properties.validateMessage);
				this.template.querySelector('.-input-error').style.visibility = 'visible';
				this.host.setAttribute('error', '');
			}
		}
	});
;

	// build scope
	naff.registerElement({
		name: 'naff-switch',

		properties: { 
			status: 'off',
			disabled: false 
		},

		created: function()
		{		
			// Initial setup
			if (this.host.hasAttribute('disabled')) this.properties.disabled = true;
			if (this.host.hasAttribute('status')) this.toggleSwitch(this.host.getAttribute('status'));
			else this.toggleSwitch('off');
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
			if (name == 'status') this.toggleSwitch(newVal);
			if (name == 'disabled' && newVal) this.properties.disabled = true;
			else this.properties.disabled = false;
		},

		click: function()
		{
			var scope = naff.getScope(this);
			if (scope.properties.disabled) return;
			scope.host.setAttribute('status', scope.properties.status != 'on' ? 'on' : 'off');
		},

		toggleSwitch: function(status)
		{
			this.fire('toggle');
			this.properties.status = typeof status == 'string' ? (status == 'on' ? 'on' : 'off') : (this.properties.status != 'on' ? 'on' : 'off');
			this.template.querySelector('naff-icon').setAttribute('name', 'toggle-' + this.properties.status);
			this.fire('toggled');
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
