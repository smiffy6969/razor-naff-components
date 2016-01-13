
	// build scope
	naff.registerElement({
		name: 'naff-loading',

		toggle: 0,

		private: {
			delay: 4,
			opacityTimer: null,
			displayTimer: null,
			loadingTimer: null
		},

		attached: function()
		{
			// Initial setup
			if (this.host.hasAttribute('toggle')) this.toggle = this.host.getAttribute('toggle') == 1 ? 1 : 0;
			else this.host.setAttribute('toggle', this.toggle);

			if (this.toggle) this.show();
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			if (name =='toggle')
			{
				this.toggle = newVal == 1 ? 1 : 0;
				if (this.toggle) this.show();
				else this.hide();
			}
		},

		show: function()
		{
			naff.fire(this.host, 'show');

			// re-center
			this.host.style.display = "block";
			if ("bottom" === this.host.getAttribute('position') || "top" === this.host.getAttribute('position')) this.host.style.marginLeft = "-" + this.host.offsetWidth/2 + "px";

			// fade in
			var scope = this;
			setTimeout(function(){ scope.host.style.opacity = 1 }, 1);
		},

		hide: function()
		{
			this.host.style.opacity = 0;

			var scope = this;
			setTimeout(function()
			{
				scope.host.style.display = "none";
				naff.fire(scope.host, 'hide');
			}, 300);
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
			naff.fire(scope.host, 'show');
			scope.host.setAttribute('toggle', 0);

			// re-center
			scope.host.style.display = "block";
			if ("bottom" === scope.host.getAttribute('position') || "top" === scope.host.getAttribute('position')) scope.host.style.marginLeft = "-" + scope.host.offsetWidth/2 + "px";

			// jiggle toast if re-thrown or show for first time
			if (!!scope.private.messageTimer)
			{
				clearTimeout(scope.private.messageTimer);
				clearTimeout(scope.private.displayTimer);

				setTimeout(function()
				{
					naff.fire(scope.host, 'jiggle');
					scope.host.className += " -jiggle";

					setTimeout(function() { scope.host.className = scope.host.className.replace(/ -jiggle/g, "") }, 750);
				}, 1);
			}
			else setTimeout(function() { scope.host.style.opacity = 1 }, 1);

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
					naff.fire(scope.host, 'hide');
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
				naff.fire(scope.host, 'show');
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
				naff.fire(scope.host, 'hide');
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
			years: [],
			months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			selected: null,
			selectedDate: null,
			mode: 'day',
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
						this.private.mode = 'day';
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

		clear: function()
		{
			this.host.setAttribute('value', '');
			this.host.setAttribute('toggle', 0);
			naff.fire(this.host, 'changed', '');
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
		next: function()
		{
			if (this.private.mode == 'day')
			{
			    var newDate = new Date(this.private.date);
				newDate.setMonth(newDate.getMonth() + 1);
				this.private.date = newDate;
			    this.createMonth();
				naff.fire(this.host, 'set', dateFormat(this.private.date, 'yyyy-mm-dd'));
			}
			else if (this.private.mode == 'year')
			{
				var start = parseInt(this.private.years[24]) + 1;
				this.private.years = [];
				for (var i = start; i < start + 25; i++) this.private.years.push(i);
			}
		},

		// Clears the calendar and shows the previous month
		previous: function()
		{
			if (this.private.mode == 'day')
			{
			    var newDate = new Date(this.private.date);
				newDate.setMonth(newDate.getMonth() - 1);
				this.private.date = newDate;
			    this.createMonth();
				naff.fire(this.host, 'set', dateFormat(this.private.date, 'yyyy-mm-dd'));
			}
			else if (this.private.mode == 'year')
			{
				var start = parseInt(this.private.years[0]) - 25;
				this.private.years = [];
				for (var i = start; i < start + 25; i++) this.private.years.push(i);
			}
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
			naff.fire(this.host, 'changed', dateFormat(this.private.selected, this.format));
		},

		selectYear: function(ev)
		{
			var el = ev.target;
			while (!el.hasAttribute('index')) el = el.parentNode;
			var index = el.getAttribute('index');

			var dateObject = new Date();
		    dateObject.setDate(this.private.date.getDate());
		    dateObject.setMonth(this.private.date.getMonth());
		    dateObject.setYear(this.private.years[index]);

			this.private.date = dateObject
			this.private.mode = 'month';
		},

		selectMonth: function(ev)
		{
			var el = ev.target;
			while (!el.hasAttribute('index')) el = el.parentNode;
			var index = el.getAttribute('index');

			var dateObject = new Date();
		    dateObject.setDate(this.private.date.getDate());
		    dateObject.setMonth(index);
		    dateObject.setYear(this.private.date.getFullYear());

			this.private.date = dateObject
			this.createMonth();
			this.private.mode = 'day';
		},

		changeMode: function()
		{
			if (this.private.mode != 'day') this.private.mode = 'day';
			else
			{
				this.private.years = [];
				var start = parseInt(this.private.selected.getFullYear()) - 12;
				for (var i = start; i < start + 25; i++) this.private.years.push(i);
				this.private.mode = 'year';
			}
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
			naff.fire(this.host, 'set', this.private.time);
		},

		setMin: function(ev, val)
		{
			this.private.date.setMinutes(this.private.date.getMinutes() + parseInt(val));
			this.private.time = dateFormat(this.private.date, this.format);
			naff.fire(this.host, 'set', this.private.time);
		},

		setSec: function(ev, val)
		{
			this.private.date.setSeconds(this.private.date.getSeconds() + parseInt(val));
			this.private.time = dateFormat(this.private.date, this.format);
			naff.fire(this.host, 'set', this.private.time);
		},

		selectTime: function(ev)
		{
			this.host.setAttribute('value', this.private.time);
			this.host.setAttribute('toggle', 0);
			naff.fire(this.host, 'changed', this.private.time);
		}
	});
