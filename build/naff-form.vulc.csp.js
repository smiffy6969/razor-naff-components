
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
			if (this.host.hasAttribute('required')) this.template.querySelector('input').setAttribute('required', '');
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
				case 'required':
					if (newVal) this.template.querySelector('input').setAttribute(name, '');
					else this.template.querySelector('input').removeAttribute(name);
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
		},

		focus: function()
		{
			return this.template.querySelector('input').focus();
		}
	});
;

	// build scope
	naff.registerElement({
		name: 'naff-select',
		dataBind: true,

		// public properties
		value: null,

		// private properties
		private: {
			attId: null,
			attLabel: null,
			placeholder: null,
			deselector: false,
			disabled: false
		},

		created: function()
		{
			if (this.host.hasAttribute('options'))
			{
				try {
					var options = JSON.parse(this.host.getAttribute('options'));
					if (!this.attributes) this.attributes = {};
					if (!this.attributes.options) this.attributes.options = options;
				} catch (e) {}
			}
		},

		attached: function()
		{
			if (this.host.hasAttribute('option-id')) this.private.attId = this.host.getAttribute('option-id');
			if (this.host.hasAttribute('option-label')) this.private.attLabel = this.host.getAttribute('option-label');
			if (this.host.hasAttribute('deselector')) this.private.deselector = true;
			if (this.host.hasAttribute('disabled')) this.private.disabled = true;
			if (this.host.hasAttribute('placeholder'))
			{
				this.private.placeholder = this.host.getAttribute('placeholder');
				this.host.querySelector('option[placeholder]').setAttribute("selected", "");
			}
			if (this.host.value) this.value = this.host.value;
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			switch (name)
			{
				case 'value':
					this.host.value = this.value = newVal;
				break;
				case 'options':
					try { this.attributes.options = JSON.parse(newVal); } catch (e) {}
				break;
				case 'option-id':
					this.private.attId = newVal;
				break;
				case 'option-label':
					this.private.attLabel = newVal;
				break;
				case 'placeholder':
					this.private.placeholder = newVal;
				break;
				case 'deselector':
					if (this.host.hasAttribute('deselector')) this.private.deselector = true;
					else this.private.deselector = false;
				break;
				case 'disabled':
					if (this.host.hasAttribute('disabled')) this.private.disabled = true;
					else this.private.disabled = false;
				break;
			}
		},

		changed: function()
		{
			this.host.value = this.value;
			this.host.setAttribute('value', this.value);
			this.fire('change');
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
