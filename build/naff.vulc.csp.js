naff.registerElement({name: 'naff-icon'});
naff.registerElement({name: 'naff-tag'});

	// build scope
	naff.registerElement({
		name: 'naff-input',

		properties: { 
			validate: null,
			validateMessage: null 
		},

		created: function()
		{				
			var scope = this;
			Object.observe(this.host, function(changes)
			{
				for (var i = 0; i < changes.length; i++) scope.attributeChanged(changes[i].name, changes[i].oldValue, changes[i].object.value);
			});	

			// Initial setup
			if (this.host.hasAttribute('name')) this.template.querySelector('input').setAttribute('name', this.host.getAttribute('name'));
			if (this.host.hasAttribute('type')) this.template.querySelector('input').setAttribute('type', this.host.getAttribute('type'));
			console.log(this.host.value);
			if (this.host.value || this.host.hasAttribute('value')) this.template.querySelector('input').setAttribute('value', this.host.value || this.host.getAttribute('value'));
			if (this.host.hasAttribute('disabled')) this.template.querySelector('input').setAttribute('disabled', '');
			if (this.host.hasAttribute('placeholder')) this.template.querySelector('input').setAttribute('placeholder', this.host.getAttribute('placeholder'));
			if (this.host.hasAttribute('validate')) this.properties.validate = this.host.getAttribute('validate');
			if (this.host.hasAttribute('validate-message')) 
			{
				this.properties.validateMessage = this.host.getAttribute('validate-message');
				this.template.querySelector('.-input-error-message').innerHTML = this.properties.validateMessage;
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
				case 'validate-message':
					this.properties.validateMessage = newVal;
					this.template.querySelector('.-input-error-message').innerText = newVal;
				break;
			}
		},

		onInputChanged: function()
		{
			var scope = naff.getScope(this);
			scope.fire('change');
			scope.host.value = this.value;
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
			this.host.error = regexp.test(value);

			if (this.host.error) 
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
			disabled: false 
		},

		created: function()
		{			
			// Initial setup
			if (this.host.hasAttribute('disabled')) this.properties.disabled = true;
			if (this.host.hasAttribute('value')) this.host.value = this.host.getAttribute('value');
			this.setSwitch();
			
			var scope = this;
			Object.observe(this.host, function(changes)
			{
				for (var i = 0; i < changes.length; i++) 
				{
					if (changes[i].name != 'value') continue; 
					scope.setSwitch();
				}
			});	
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
			if (name == 'disabled') this.properties.disabled = !newValue ? false: true;
			if (name =='value' && newVal != this.host.value) this.host.value = newVal == 1 ? 1 : 0;
		},

		click: function()
		{
			var scope = naff.getScope(this);
			if (scope.properties.disabled) return;
			scope.host.value = scope.host.value == 1 ? 0 : 1;
			scope.host.setAttribute('value', scope.host.value);
		},

		setSwitch: function()
		{
			this.template.querySelector('naff-icon').setAttribute('name', 'toggle-' + (this.host.value == 1 ? 'on' : 'off'));
			this.host.setAttribute('value', this.host.value);
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
