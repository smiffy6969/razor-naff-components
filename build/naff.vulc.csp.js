
    naff.registerElement({
        name: 'naff-icon',

		attached: function()
		{
			// Initial setup
            if (this.host.className.indexOf('fa') >= 0) return;
            this.addClasses();
		},

		attributeChanged: function(name, oldVal, newVal)
		{
            if (name == 'class') return; // altered class directly
            this.addClasses();
		},

        addClasses: function()
        {
            var className = ' fa';
            var classes = this.host.className.split(' ');
            for (var i = 0; i < classes.length; i++) className += classes[i] == 'fa' || classes[i].trim().indexOf('fa-') == 0 ? '' : ' ' + classes[i];

            if (this.host.hasAttribute('name')) className += ' fa-' + this.host.getAttribute('name');
            if (this.host.hasAttribute('size')) className += ' fa-' + this.host.getAttribute('size') + 'x';
            if (this.host.hasAttribute('rotate')) className += ' fa-rotate-' + this.host.getAttribute('rotate');
            if (this.host.hasAttribute('stack')) className += ' fa-stack-' + this.host.getAttribute('stack') + 'x';
            if (this.host.hasAttribute('fw')) className += ' fa-fw';
            if (this.host.hasAttribute('spin')) className += ' fa-spin';
            if (this.host.hasAttribute('pulse')) className += ' fa-pulse';
            if (this.host.hasAttribute('inverse')) className += ' fa-inverse';
            if (this.host.hasAttribute('border')) className += ' fa-border';
            this.host.className = className.trim();
        }
    })
;
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
					this.template.querySelector('input').value = newVal;
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
naff.registerElement({name: 'naff-x-select'});;

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

		attached: function()
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
				if ("bottom" === scope.host.getAttribute('position') || "top" === scope.host.getAttribute('position')) scope.host.style.marginLeft = "-" + scope.host.offsetWidth/2 + "px";

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

				setTimeout(function()
				{
					if ("bottom" === scope.host.getAttribute('position') || "top" === scope.host.getAttribute('position')) scope.host.style.marginLeft = "-" + scope.host.offsetWidth/2 + "px";
					scope.host.style.opacity = 1;
				}, 1);
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
		},

		attached: function()
		{
			this.private.resize = this.resize.bind(this);

			// Initial setup
			if (this.host.hasAttribute('toggle')) this.toggle = this.host.getAttribute('toggle');
			else this.host.setAttribute('toggle', this.toggle);
			if (this.toggle == 1) this.show(true);
			else this.hide();
			
			if (!this.template.querySelector('heading'))
			{
				var heading = this.template.querySelector('.-heading');
				if (heading) heading.parentNode.removeChild(heading);
			}
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			if (name =='toggle')
			{
				this.toggle = newVal == 1 ? 1 : 0;
				if (this.toggle == 1) this.show(true);
				else this.hide();
			}
		},

		show: function(internal)
		{
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
			}, 200);
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
		name: 'naff-date-picker',
		dataBind: true,
		toggle: 0,
		value: null,
		format: 'yyyy-mm-dd',

		// private properties
		private: {
			today: null,
			date: null,
			days: [],
			selected: null,
			selectedDate: null,
			events: []
		},

		created: function()
		{
		},

		attached: function()
		{
			if (this.host.hasAttribute('format')) this.format = this.host.getAttribute('format');
			if (this.host.hasAttribute('value')) this.value = this.host.getAttribute('value');
			this.private.selected = this.value ? new Date(Date.parse(this.value)) : new Date(Date.now());
			this.private.selectedDate = dateFormat(this.private.selected, 'yyyy-mm-dd');
			
			this.load();
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			switch (name)
			{
				case 'value':
					this.host.value = this.value = newVal;
					this.private.selected = this.value ? new Date(Date.parse(this.value)) : new Date(Date.now());
					this.private.selectedDate = dateFormat(this.private.selected, 'yyyy-mm-dd');
				break;
				case 'format':
					this.format = newVal || 'yyyy-mm-dd';
				break;
				case 'toggle':
					if (newVal == 0) this.toggle = 0;
					else
					{
						this.toggle = 1;
						this.load();
					}
				break;
			}
		},

		show: function()
		{
			this.host.setAttribute('toggle', 1);
			this.load();
		},

		hide: function()
		{
			this.host.setAttribute('toggle', 0);
		},

		load: function()
		{
			this.private.today = new Date();

			// work out start point for calendar
			var newDate = new Date();
			newDate.setDate(1);
			newDate.setMonth(this.private.selected.getMonth());
			newDate.setFullYear(this.private.selected.getFullYear());

			this.private.date = newDate;
			this.createMonth();

			if (this.host.hasAttribute('toggle')) this.template.querySelector('naff-modal');
		},

		// Clears the calendar and shows the next month
		nextMonth: function()
		{
		    var newDate = new Date(this.private.date);
			newDate.setMonth(newDate.getMonth() + 1);
			this.private.date = newDate;
		    this.createMonth();
			this.fire('set', dateFormat(this.private.date, 'yyyy-mm-dd'));
		},

		// Clears the calendar and shows the previous month
		previousMonth: function()
		{
		    var newDate = new Date(this.private.date);
			newDate.setMonth(newDate.getMonth() - 1);
			this.private.date = newDate;
		    this.createMonth();
			this.fire('set', dateFormat(this.private.date, 'yyyy-mm-dd'));
		},

		// Creates and populates all of the days to make up the month
		createMonth: function()
		{
			this.private.days = [];

		    var dateObject = new Date();
		    dateObject.setDate(this.private.date.getDate());
		    dateObject.setMonth(this.private.date.getMonth());
		    dateObject.setYear(this.private.date.getFullYear());

			// rewind to a monday
			while (dateObject.getDay() != 1) dateObject.setDate(dateObject.getDate() - 1);

			// do the first monday to get past loop
			this.private.days.push({
				'id': this.private.days.length,
				'date': dateFormat(dateObject, 'yyyy-mm-dd'),
				'dom': dateFormat(dateObject, 'dd'),
				'day': dateFormat(dateObject, 'ddd'),
				'today': dateFormat(dateObject, 'yyyy-mm-dd') == dateFormat(this.private.today, 'yyyy-mm-dd'),
				'disabled': dateObject.getMonth() != this.private.date.getMonth()
			});
			dateObject.setDate(dateObject.getDate() + 1);

			// now loop until we hit the next monday that is not in the month we selected
			while (!(dateObject.getDay() == 1 && dateObject.getMonth() != this.private.date.getMonth()))
			{
				this.private.days.push({
					'id': this.private.days.length,
					'date': dateFormat(dateObject, 'yyyy-mm-dd'),
					'dom': dateFormat(dateObject, 'dd'),
					'day': dateFormat(dateObject, 'ddd'),
					'today': dateFormat(dateObject, 'yyyy-mm-dd') == dateFormat(this.private.today, 'yyyy-mm-dd'),
					'disabled': dateObject.getMonth() != this.private.date.getMonth()
				});
				dateObject.setDate(dateObject.getDate() + 1);
			}
		},

		selectDay: function(ev)
		{
			var el = ev.target;
			while (el.className != '-picker-day') el = el.parentNode;
			if (el.hasAttribute('disabled')) return;
			this.private.selected = new Date(this.private.days[el.getAttribute('day-id')].date);
			this.private.selectedDate = dateFormat(this.private.selected, 'yyyy-mm-dd');
			this.host.setAttribute('value', dateFormat(this.private.selected, this.format));
			this.host.setAttribute('toggle', 0);
			this.fire('changed', dateFormat(this.private.selected, this.format));
		}
	});
;

	// build scope
	naff.registerElement({
		name: 'naff-time-picker',
		dataBind: true,
		toggle: 0,
		value: null,
		format: 'HH:MM',

		// private properties
		private: {
			time: null,
			date: null,
			showHour: true,
			showMin: true,
			showSec: true
		},

		attached: function()
		{
			if (this.host.hasAttribute('format')) this.format = this.host.getAttribute('format');
			if (this.host.hasAttribute('value')) this.value = this.host.getAttribute('value');
			this.private.showHour = this.format.indexOf('h') >= 0 || this.format.indexOf('H') >= 0 ? true : false;
			this.private.showMin = this.format.indexOf('M') >= 0 ? true : false;
			this.private.showSec = this.format.indexOf('s') >= 0 ? true : false;
			this.setDateTime();
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			switch (name)
			{
				case 'value':
					this.host.value = this.value = newVal;
					this.setDateTime();
				break;
				case 'format':
					this.format = newVal || 'HH:MM';
					this.private.showHour = this.format.indexOf('h') >= 0 || this.format.indexOf('H') >= 0 ? true : false;
					this.private.showMin = this.format.indexOf('M') >= 0 ? true : false;
					this.private.showSec = this.format.indexOf('s') >= 0 ? true : false;
					this.setDateTime();
				break;
				case 'toggle':
					if (newVal == 0) this.toggle = 0;
					else
					{
						this.toggle = 1;
					}
				break;
			}
		},

		show: function()
		{
			this.host.setAttribute('toggle', 1);
		},

		hide: function()
		{
			this.host.setAttribute('toggle', 0);
		},

		setDateTime: function()
		{
			// correct any bad formatting before parsing time
			this.private.date = this.value ? new Date(Date.parse('2015-01-01 ' + (this.format.indexOf('H') >= 0 && (this.format.indexOf('t') >= 0 || this.format.indexOf('T') >= 0) ? this.value.replace(/am|pm/i, '').trim() : this.value))) : new Date(Date.now());
			this.private.time = dateFormat(this.private.date, this.format);
		},

		setHour: function(ev, val)
		{
			this.private.date.setHours(this.private.date.getHours() + parseInt(val));
			this.private.time = dateFormat(this.private.date, this.format);
			this.fire('set', this.private.time);
		},

		setMin: function(ev, val)
		{
			this.private.date.setMinutes(this.private.date.getMinutes() + parseInt(val));
			this.private.time = dateFormat(this.private.date, this.format);
			this.fire('set', this.private.time);
		},

		setSec: function(ev, val)
		{
			this.private.date.setSeconds(this.private.date.getSeconds() + parseInt(val));
			this.private.time = dateFormat(this.private.date, this.format);
			this.fire('set', this.private.time);
		},

		selectTime: function(ev)
		{
			this.host.setAttribute('value', this.private.time);
			this.host.setAttribute('toggle', 0);
			this.fire('changed', this.private.time);
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
		},

		attached: function()
		{
			this.load();
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			if (oldVal == newVal) return;
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
						var frag = document.createElement('FRAG');
						frag.innerHTML = request.response;

						var depends = frag.querySelector('dependencies');
						if (depends)
						{
							depends.setAttribute('path', partial);
							depends.remove();
							if (!document.querySelector("dependencies[path='"+ partial +"']")) document.querySelector('head').appendChild(depends);
						}

						setTimeout(function(){
							scope.host.innerHTML = frag.innerHTML;
							scope.fire('loaded');
						},1);
					}
					else throw 'naff-partial: Error loading partial [' + partial + ']';
				}
			};
			request.send();
		}
	});
;

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
			if (menuItems.indexOf('object not bound') == 0) return;
			try {
				if (typeof this.attribtues === 'undefined') this.attributes = {};
				this.attributes['menu-items'] = JSON.parse(menuItems.replace(/[\n\r]+/g, ''));
			} catch (e) {
				throw 'naff-menu build error: invalid json string [' + menuItems.replace(/[\n\r]+/g, '') + ']';
			}
		}
	});
;
naff.registerElement({name: 'naff-page'})