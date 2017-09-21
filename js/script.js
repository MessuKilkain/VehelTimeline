var timeline = {
	constants:{
		// hours*minutes*seconds*milliseconds
		OneDayLengthInMilliseconds:24*60*60*1000.0,
		MonthFrenchNameArray:[
			"Janvier",
			"Février",
			"Mars",
			"Avril",
			"Mai",
			"Juin",
			"Juillet",
			"Août",
			"Septembre",
			"Octobre",
			"Novembre",
			"Décembre"
		],
		DayOfWeekArray:[
			"D",
			"L",
			"M",
			"M",
			"J",
			"V",
			"S",
		]
	},
	config:{
		fromDate: null,
		toDate: null,
		xStepPerBloc: 0
	},
	numberOfDaysBetweenDates: function(date1,date2) {
		var numberOfDays = 0;
		if( null != date1 && null != date2 )
		{
			numberOfDays = ( date2.getTime() - date1.getTime() )/this.constants.OneDayLengthInMilliseconds;
		}
		return numberOfDays;
	},
	offsetBetweenDates: function(date1,date2) {
		var offset = 0;
		if( null != date1 && null != date2 )
		{
			offset = this.numberOfDaysBetweenDates(date1,date2) * this.config.xStepPerBloc;
		}
		return offset;
	},
	offsetForDate: function(dateForExpectingOffset) {
		return this.offsetBetweenDates(this.config.fromDate,dateForExpectingOffset);
	},
	dateWithoutTime: function(dateWithTime=new Date()) {
		var monthValue = dateWithTime.getMonth() + 1;
		var dateValue = dateWithTime.getDate();
		return new Date(dateWithTime.getFullYear()+'-'+(monthValue<10?('0'+monthValue):monthValue)+'-'+(dateValue<10?('0'+dateValue):dateValue));

	},
	buildElementsForPeriod: function(fromDate=this.config.fromDate, toDate=this.config.toDate) {
		var timeline = this;
		if(!fromDate)
		{
			fromDate = timeline.dateWithoutTime(new Date());
			// Set to first day of the month
			fromDate.setDate(1);
			fromDate.setMonth(fromDate.getMonth()-2);
			fromDate.setDate(1);
		}
		if(!toDate)
		{
			toDate = timeline.dateWithoutTime(new Date());
			// Set to first day of the month
			toDate.setDate(1);
			toDate.setMonth(toDate.getMonth()+4+1);
			// Set to last day of the month
			toDate.setDate(0);
		}
		// console.log("fromDate : "+fromDate.toISOString());
		// console.log("toDate : "+toDate.toISOString());
		if(fromDate>toDate)
		{
			// WARNING : unexpected case
			var temp = fromDate;
			fromDate = toDate;
			toDate = fromDate;
		}
		timeline.config.fromDate = fromDate;
		timeline.config.toDate = toDate;
		{
			var periodElement = $("#period");
			periodElement.empty();
			var calendarElement = $("#calendar");
			calendarElement.empty();
			var lastYear = null;
			var lastMonthString = null;
			var lastMonthDaysElement = null;
			var lastMonthDateElement = null;
			for (var d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1))
			{
				var currentYear = d.getFullYear();
				var monthValue = d.getMonth() + 1;
				var currentMonthString = currentYear+'-'+(monthValue<10?('0'+monthValue):monthValue);
				// console.log("currentMonthString : "+currentMonthString);
				if( currentYear != lastYear )
				{
					calendarElement.append($('<div/>').addClass("year").text(currentYear));
					lastYear = currentYear;
				}
				if( currentMonthString != lastMonthString )
				{
					calendarElement.append($('<div/>').addClass("month").text(timeline.constants.MonthFrenchNameArray[d.getMonth()]).attr('date',d.toISOString()));
					lastMonthDaysElement = null;
					lastMonthDateElement = null;

					var newMonthElement = $('<div/>');
					periodElement.append(newMonthElement);
					newMonthElement.addClass('month').append("<div class='title'>"+timeline.constants.MonthFrenchNameArray[d.getMonth()]+" "+d.getFullYear()+"</div>");
					{
						var newDaysElement = $('<div/>');
						newMonthElement.append(newDaysElement);
						newDaysElement.addClass('days');
						lastMonthDaysElement = newDaysElement;
					}
					{
						var newDateElement = $('<div/>');
						newMonthElement.append(newDateElement);
						newDateElement.addClass('date');
						lastMonthDateElement = newDateElement;
					}
					lastMonthString = currentMonthString;
				}

				if(null != lastMonthDaysElement)
				{
					var parentElement = lastMonthDaysElement;
					var newDayElement = $('<div/>');
					parentElement.append(newDayElement);
					newDayElement.addClass('bloc').text(timeline.constants.DayOfWeekArray[d.getDay()]);
					if(
						// S
						d.getDay() == 6
						// D
						|| d.getDay() == 0
						)
					{
						newDayElement.addClass('we');
					}
					newDayElement.attr('date',d.toISOString());
					newDayElement.click(function(){
						timeline.displayTimelineAtDate(new Date($(this).attr('date')));
					});
				}
				if(null != lastMonthDateElement)
				{
					var parentElement = lastMonthDateElement;
					var newDateElement = $('<div/>');
					parentElement.append(newDateElement);
					newDateElement.addClass('bloc').text(d.getDate());
					if(
						// S
						d.getDay() == 6
						// D
						|| d.getDay() == 0
						)
					{
						newDateElement.addClass('we');
					}
					newDateElement.attr('date',d.toISOString());
					newDateElement.click(function(){
						timeline.displayTimelineAtDate(new Date($(this).attr('date')));
					});
				}

				// if(null != lastMonthDaysElement)
				// {
					// var parentElement = lastMonthDaysElement;
					// var newDayElement = $('<div/>');
					// parentElement.append(newDayElement);
					// newDayElement.addClass('bloc').html(DayOfWeekArray[d.getDay()]+"<br/>"+d.getDate());
					// if(
						// // S
						// d.getDay() == 6
						// // D
						// || d.getDay() == 0
						// )
					// {
						// newDayElement.addClass('we');
					// }
				// }
			}
		}
		{
			var blocs = $("#period .bloc");
			if( blocs ) {
				var elt0 = blocs[0];
				var elt1 = blocs[1];
				if( elt0 && elt1 ) {
					timeline.config.xStepPerBloc = $(elt1).position().left - $(elt0).position().left;
					// console.log("timelineConfig.xStepPerBloc : "+timelineConfig.xStepPerBloc);
					$('#period').css({
						minWidth: timeline.offsetForDate(timeline.config.toDate) + timeline.config.xStepPerBloc
					});
				}
			}
		}
		var firstDispayedDate = timeline.dateWithoutTime();
		firstDispayedDate.setDate(1);
		timeline.displayTimelineAtDate(firstDispayedDate,false);
		// Calendar bookmark click
		$('#calendar .month').click(function() {
			// We get a string, we need a Date object.
			var dateToScrollTo = $(this).attr('date');
			// console.log("dateToScrollTo : "+dateToScrollTo);
			timeline.displayTimelineAtDate(new Date(dateToScrollTo));
		});
	},
	displayTimelineAtDate: function(dateToDisplayTimelineAt,animated=true) {
		var timeline = this;
		var offset = timeline.offsetForDate(dateToDisplayTimelineAt) + 1;
		var timelineElementsToMove = $('#today, #period, .blocs, .work');
		timelineElementsToMove.stop();
		if(animated)
		{
			timelineElementsToMove.animate({ marginLeft: -offset },{complete:function(){
				if( $(this).hasClass("work") )
				{
					timeline.displayWorkElement(this);
				}
			}});
		} else {
			timelineElementsToMove.css({ marginLeft: -offset });
			timeline.displayWork();
		}
	},
	buildBlocs: function() {
		// CREATE BLOC
		$('.blocs').empty();
		$('#period .days .bloc').each(function(){
			$('.blocs').append('<div class="date"></div>');
		});
	},
	displayWorkElement: function(workElement) {
		var timeline = this;
		var el = $(workElement);
		var startDate = el.attr('start-date');
		var duration = el.attr('expected-duration')?el.attr('expected-duration'):null;
		var endDate = el.attr('end-date')?el.attr('end-date'):null;
		if( null != endDate )
		{
			duration = Math.ceil( timeline.numberOfDaysBetweenDates(new Date(startDate),new Date(endDate)) );
		}
		else if ( null == duration ) {
			duration = Math.ceil( timeline.numberOfDaysBetweenDates(new Date(startDate),timeline.config.toDate) );
		}
		el.css({ width: duration * timeline.config.xStepPerBloc, left: timeline.offsetForDate(new Date(startDate)) });
		{
			el.css({ paddingLeft: 0, paddingRight: 0 });
			var width = el.width();
			var minWidth = 0;
			var contents = el.contents();
			var contentsIndex = 0;
			for(contentsIndex = 0; contentsIndex < contents.length; contentsIndex++) {
				minWidth += timeline.sizeOfTextNode(contents[0]).width;
			}
			var offset = el.offset();
			offset.right = offset.left + width;
			var paddingLeft = Math.max($('#period').position().left,offset.left)-offset.left;
			var paddingRight = offset.right - Math.min($(window).width(),offset.right);
			var iterationIndex = 0;
			for( iterationIndex = 0 ; width < paddingLeft + minWidth + paddingRight && iterationIndex < 5 ; iterationIndex++ ) {
				if( paddingLeft < paddingRight ) {
					var minPaddingLeft = Math.min(paddingLeft,minWidth);
					paddingLeft -= minPaddingLeft;
				} else {
					var minPaddingRight = Math.min(paddingRight,minWidth);
					paddingRight -= minPaddingRight;
				}
			}
			paddingLeft = Math.max(0,paddingLeft);
			paddingRight = Math.max(0,paddingRight);
			if( width < paddingLeft + minWidth + paddingRight ) {
				paddingLeft = 0;
				paddingRight = 0;
			}
			console.log("paddingLeft : "+paddingLeft);
			console.log("paddingRight : "+paddingRight);
			el.css({ paddingLeft: paddingLeft, paddingRight: paddingRight });
		}
	},
	displayWork: function() {
		console.log("displayWork called");
		var timeline = this;
		$('.work').each(function(){
			timeline.displayWorkElement( this );
		});
	},
	displayToday: function() {
		var timeline = this;
		var todayDate = timeline.dateWithoutTime(new Date());
		$('#today').css({ left: timeline.offsetForDate(todayDate)+$('#period').position().left });
	},
	setupEvents: function() {
		// CLICK FILTER PROJECT
		$('#legend .filter_project').click(function() {
			var ThisProject = $(this).attr('rel');
			$('.project').css({ display: 'none' });
			$('.project.'+ThisProject).css({ display: 'block' });
			$('.filter_project, .filter_project_all').removeClass('active');
			$(this).addClass('active');
		});
		$('#legend .filter_project_all').click(function() {
			$('.project').css({ display: 'block' }).addClass('active');
			$('.filter_project').removeClass('active');
			$(this).addClass('active');
		});
		// CLICK FILTER PEOPLE
		$('#legend .filter_people').click(function() {
			var ThisProject = $(this).attr('rel');
			$('.user').css({ display: 'none' }); $('.user').parent().css({ display: 'none' });
			$('.user.'+ThisProject).css({ display: 'block' }); $('.user.'+ThisProject).parent().css({ display: 'block' });
			$('.filter_people, .filter_people_all').removeClass('active');
			$(this).addClass('active');
		});
		$('#legend .filter_people_all').click(function() {
			$('.user').css({ display: 'block' });
			$('.filter_people').removeClass('active'); $('.user').parent().css({ display: 'block' });
			$(this).addClass('active');
		});
		// CLICK FILTER METIER
		$('#legend .filter_metier').click(function() {
			var ThisProject = $(this).attr('rel');
			$('.project .work').css({ display: 'none' });
			$('.project .work.'+ThisProject).css({ display: 'block' });
			$('.filter_metier, .filter_metier_all').removeClass('active');
			$(this).addClass('active');
		});
		$('#legend .filter_metier_all').click(function() {
			$('.project .work').css({ display: 'block' }).addClass('active');
			$('.filter_metier').removeClass('active');
			$(this).addClass('active');
		});

		// HOVER ON WORK
		$('.work').mousemove(function( event ) {
			var thisRel = $(this).attr('rel');
			var scroller = $(document).scrollTop();
			var size = $('.blocs div.date').width();
			$(this).parent().find('.description.'+thisRel).css({ marginLeft: event.pageX+50, marginTop: event.pageY-size-30-scroller });
		});
		$('.work').hover(function(event){
			var ThisRel = $(this).attr('rel');
			var ThisDuration = $(this).attr('expected-duration');
			if( !ThisDuration )
			{
				ThisDuration = $(this).attr('duration');
			}
			$(this).parent().find('.description.'+ThisRel).css({ display: 'block' });
			var NoLimit = $(this).attr('nolimit');
			var ThisTeamate = $(this).parent().parent().find('.name').text();
			if (NoLimit == 'NoLimit') {
				$(this).parent().find('.description.'+ThisRel).find('.title span').html(' [ '+ThisTeamate+', sans date de fin ]');
			} else {
				$(this).parent().find('.description.'+ThisRel).find('.title span').html(' [ '+ThisTeamate+', '+ThisDuration+' jour(s) ]');
			}
		}, function() {
			var ThisRel = $(this).attr('rel');
			$(this).parent().find('.description.'+ThisRel).css({ display: 'none' });
		});

		// CURSOR
		$(window).mousemove(function( event ) {
			$('#cursor').css({ left: event.pageX });
		});
	},
	sizeOfTextNode: function(textNode=null) {
		var size = {
			height:0,
			width:0
		};
		if( textNode ) {
			if (document.createRange) {
					var range = document.createRange();
					range.selectNodeContents(textNode);
					if (range.getBoundingClientRect) {
							var rect = range.getBoundingClientRect();
							if (rect) {
									size.height = rect.bottom - rect.top;
									size.width = rect.right - rect.left;
							}
					}
			}
		}
		return size;
	},
	initialSetup: function() {
		var timeline = this;
		timeline.buildElementsForPeriod();
		timeline.buildBlocs();
		timeline.displayWork();
		timeline.displayToday();
		timeline.setupEvents();
	}
};
