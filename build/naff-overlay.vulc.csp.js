
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
			this.private.resize = this.resize.bind(this);

			// Initial setup
			if (this.host.hasAttribute('toggle')) this.toggle = this.host.getAttribute('toggle');
			else this.host.setAttribute('toggle', this.toggle);
			if (this.toggle == 1) this.show(true);
			else this.hide();
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
		date: null,
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
			if (this.host.hasAttribute('format')) this.format = this.host.getAttribute('format');
			if (this.host.hasAttribute('date')) this.date = this.host.getAttribute('date');
			this.private.selected = this.date ? new Date(Date.parse(this.date)) : new Date(Date.now());
			this.private.selectedDate = dateFormat(this.private.selected, 'yyyy-mm-dd');
		},

		attached: function()
		{
			this.load();
		},

		attributeChanged: function(name, oldVal, newVal)
		{
			switch (name)
			{
				case 'date':
					this.date = newVal;
					this.private.selected = this.date ? new Date(Date.parse(this.date)) : new Date(Date.now());
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
			this.fire('change', dateFormat(this.private.date, 'yyyy-mm-dd'));
		},

		// Clears the calendar and shows the previous month
		previousMonth: function()
		{
		    var newDate = new Date(this.private.date);
			newDate.setMonth(newDate.getMonth() - 1);
			this.private.date = newDate;
		    this.createMonth();
			this.fire('change', dateFormat(this.private.date, 'yyyy-mm-dd'));
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
			this.host.setAttribute('date', dateFormat(this.private.selected, this.format));
			this.host.setAttribute('toggle', 0);
			this.fire('select', dateFormat(this.private.selected, this.format));
		}
	});
