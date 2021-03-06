
	// build scope
	naff.registerElement({
		name: 'naff-choose',
		dataBind: true,

		// public properties
		options: [],
		optionValue: 'value',
		optionLabel: 'label',
		selectedObs: [],
		selected: [],
		placeholder: null,

		// private properties
		private: {
			selected: null,
			add: 0
		},

		attached: function()
		{
			// Initial setup
			if (this.host.hasAttribute('option-value')) this.optionValue = this.host.getAttribute('option-value');
			if (this.host.hasAttribute('option-label')) this.optionLabel = this.host.getAttribute('option-label');
			if (this.host.hasAttribute('placeholder')) this.placeholder = this.host.getAttribute('placeholder');
			if (this.host.hasAttribute('disabled')) this.host.querySelector('select').setAttribute('disabled', '');
			if (this.host.hasAttribute('add')) this.private.add = 1;

			// configure any options set on attribtues
			if (this.host.hasAttribute('options')) this.parseOptions();
		},

		detached: function()
		{
			// this.template.querySelector('input').removeEventListener('input', this.onInputChanged);
			// this.template.querySelector('input').removeEventListener('keypress', this.onKeyPressed);
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			switch (name)
			{
				case 'option-value':
					this.optionValue = newVal;
				break;
				case 'option-label':
					this.optionLabel = newVal;
				break;
				case 'options':
					this.parseOptions();
				break;
				case 'placeholder':
					this.placeholder = newVal;
				break;
				case 'disabled':
					if (this.host.hasAttribute('disabled')) this.host.querySelector('select').setAttribute('disabled', '');
					else this.host.querySelector('select').removeAttribute('disabled');
				break;
				case 'add':
					if (this.host.hasAttribute('add')) this.private.add = 1;
					else this.private.add = 0;
				break;
			}
		},

		parseOptions: function()
		{
			try
			{
			   this.options = JSON.parse(this.host.getAttribute('options'));
			}
			catch (e)
			{
				var options = [];
				var bits = this.host.getAttribute('options').split(',');
				for (var i = 0; i < bits.length; i++) {
					options[i] = {};
					options[i][this.optionValue] = bits[i].trim();
					options[i][this.optionLabel] = bits[i].trim();
				}
				this.options = options;
			}
		},

		selectedOption: function(ev, type)
		{
			if (type == 'auto' && this.host.hasAttribute('add'))
			{
				naff.fire(this.host, 'select', this.options[this.private.selected]);
				return;
			}

			if (this.host.hasAttribute('disabled') || !this.private.selected) return;

			var selectedObs = [];
			var selected = [];
			for (var i = 0; i < this.selectedObs.length; i++)
			{
				selectedObs.push(naff.cloneObject(this.selectedObs[i]));
				selected.push(this.selectedObs[i][this.optionValue]);
			}
			selectedObs.push(naff.cloneObject(this.options[this.private.selected]));
			selected.push(this.options[this.private.selected][this.optionValue]);

			this.selectedObs = selectedObs;
			this.selected = selected;
			this.host.setAttribute('value', JSON.stringify(this.selected));

			naff.fire(this.host, 'change');
		},

		removeItem: function(ev)
		{
			if (this.host.hasAttribute('disabled')) return;

			var ele = ev.target;
			while (!ele.hasAttribute('index')) ele = ele.parentNode;
			var index = parseInt(ele.getAttribute('index'));
			this.selectedObs.splice(index, 1);
			this.selected.splice(index, 1);
			this.host.setAttribute('value', JSON.stringify(this.selected));

			naff.fire(this.host, 'change');
		}
	});
;

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
			naff.fire(scope.host, 'changed');
		},

		onKeyPressed: function(event)
		{
			naff.fire(naff.getScope(this).host, 'keypress', event);
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
				naff.fire(this.host, 'error', this.private.validateMessage);
			}
			else if (this.private.match != null && this.private.match != value)
			{
				this.error = true;
				this.template.querySelector('.-input-error-message').innerHTML = this.private.matchMessage;
				this.template.querySelector('.-input-error').style.visibility = 'visible';
				this.host.setAttribute('error', 1);
				naff.fire(this.host, 'error', this.private.matchMessage);
			}
			else
			{
				this.template.querySelector('.-input-error').style.visibility = 'hidden';
				this.host.setAttribute('error', 0);
				naff.fire(this.host, 'ok');
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
			naff.fire(this.host, 'change');
		}
	});
;

	// build scope
	naff.registerElement({
		name: 'naff-level',
		dataBind: true,

		// Public properties
		level: 0,
		maximum: 0,
		iconFilled: 'star',
		iconEmpty: 'star-o',
		disabled: false,

		private: {
			stars: []
		},

		attached: function()
		{
			// Initial setup
			if (this.host.hasAttribute('disabled')) this.disabled = true;
			if (this.host.hasAttribute('level')) this.level = parseInt(this.host.getAttribute('level'));
			if (this.host.hasAttribute('icon-filled')) this.iconFilled = this.host.getAttribute('icon-filled');
			if (this.host.hasAttribute('icon-empty')) this.iconEmpty = this.host.getAttribute('icon-empty');
			if (this.host.hasAttribute('maximum'))
			{
				this.maximum = parseInt(this.host.getAttribute('maximum'));
				this.createStars();
			}
		},

		detached: function()
		{

		},

		attributeChanged: function(name, oldVal, newVal)
		{
			if (name == 'disabled') this.disabled = !newValue ? false: true;
			if (name == 'icon-filled') this.iconFilled = newValue;
			if (name == 'icon-empty') this.iconEmpty = newValue;

			if (name =='level')
			{
				this.level = newVal;
				this.createStars();
			}

			if (name =='maximum')
			{
				this.maximum = newVal;
				this.createStars();
			}
		},

		createStars: function()
		{
			this.private.stars = [];
			for (var i = 0; i < this.maximum; i++) this.private.stars.push(i < this.level ? this.iconFilled : this.iconEmpty);
		},

		updateStars: function(ev)
		{
			if (this.disabled) return;
			var index = parseInt(ev.target.getAttribute('index'));
			this.host.setAttribute('level', index + 1);
			naff.fire(this.host, 'change', index + 1);
		}
	});
;

	// build scope
	naff.registerElement({
		name: 'naff-form',
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
			var scope = scope || naff.getParentScope(this, 'naff-form');
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
				naff.fire(scope.host, 'error');
			}
			else
			{
				scope.host.setAttribute('error', 0);
				naff.fire(scope.host, 'ok');
			}
		}
	});
;

	// build scope
	naff.registerElement({
		name: 'naff-paginate',
		dataBind: true,
		page: null,
		pages: null,

		created: function()
		{

		},

		attached: function()
		{
			// Initial setup
			if (this.host.hasAttribute('pages')) this.pages = !isNaN(this.host.getAttribute('pages')) ? parseInt(this.host.getAttribute('pages')) : 1;
			if (this.host.hasAttribute('page')) this.page = !isNaN(this.host.getAttribute('page')) ? parseInt(this.host.getAttribute('page')) : 1;

			this.resolveValues();
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			if (name =='page') this.page = !isNaN(newVal) ? parseInt(newVal) : 1;
			if (name =='pages') this.pages = !isNaN(newVal) ? parseInt(newVal) : 1;

			this.resolveValues();
		},

		resolveValues: function()
		{
			if (this.pages < 1) this.pages = 1;
			if (this.page < 1) this.page = 1;
			if (this.page > this.pages) this.page = this.pages
		},

		pageLeft: function()
		{
			if (this.page > 1) this.host.setAttribute('page', this.page - 1);
			naff.fire(this.host, 'change');
		},

		pageRight: function()
		{
			if (this.page < this.pages) this.host.setAttribute('page', this.page + 1);
			naff.fire(this.host, 'change');
		},

		beginning: function()
		{
			this.host.setAttribute('page', 1);
			naff.fire(this.host, 'change');
		},

		end: function()
		{
			this.host.setAttribute('page', this.pages);
			naff.fire(this.host, 'change');
		},

		goTo: function()
		{
			if (isNaN(this.page)) this.page = 1;
			else if (this.page < 1) this.page = 1;
			else if (this.page > this.pages) this.page = this.pages;
			this.host.setAttribute('page', this.page);
			naff.fire(this.host, 'change');
		}
	});
;
naff.registerElement({name: 'naff-x-button', extends: 'button'})