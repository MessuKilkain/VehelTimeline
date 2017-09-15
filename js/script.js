// Constants
// hours*minutes*seconds*milliseconds
var OneDayLengthInMilliseconds = 24*60*60*1000.0;
var MonthFrenchNameArray = [
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
];
var DayOfWeekArray = [
	"D",
	"L",
	"M",
	"M",
	"J",
	"V",
	"S",
];
// Variables
var timelineConfig = {
	fromDate: null,
	toDate: null,
	xStepPerBloc: 0,
	numberOfDaysBetweenDates: function(date1,date2) {
		var numberOfDays = 0;
		if( null != date1 && null != date2 )
		{
			numberOfDays = ( date2.getTime() - date1.getTime() )/OneDayLengthInMilliseconds;
		}
		return numberOfDays;
	},
	offsetBetweenDates: function(date1,date2) {
		var offset = 0;
		if( null != date1 && null != date2 )
		{
			offset = this.numberOfDaysBetweenDates(date1,date2) * this.xStepPerBloc;
		}
		return offset;
	},
	offsetForDate: function(dateForExpectingOffset) {
		return this.offsetBetweenDates(this.fromDate,dateForExpectingOffset);
	}
};
var ThisRel = null;
var Size = 40;
function getDateWithoutTime(dateWithTime=new Date())
{
	return new Date(dateWithTime.getFullYear()+'-'+(dateWithTime.getMonth()+1)+'-'+dateWithTime.getDate());;
}
function fillElementsForPeriod(fromDate, toDate)
{
	if(!fromDate)
	{
		fromDate = getDateWithoutTime(new Date());
		// Set to first day of the month
		fromDate.setDate(1);
		fromDate.setMonth(fromDate.getMonth()-2);
		fromDate.setDate(1);
	}
	if(!toDate)
	{
		toDate = getDateWithoutTime(new Date());
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
	timelineConfig.fromDate = fromDate;
	timelineConfig.toDate = toDate;
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
			var currentMonthString = currentYear+'-'+(d.getMonth()+1);
			// console.log("currentMonthString : "+currentMonthString);
			if( currentYear != lastYear )
			{
				calendarElement.append($('<div/>').addClass("year").text(currentYear));
				lastYear = currentYear;
			}
			if( currentMonthString != lastMonthString )
			{
				calendarElement.append($('<div/>').addClass("month").text(MonthFrenchNameArray[d.getMonth()]).attr('date',d.toISOString()));
				lastMonthDaysElement = null;
				lastMonthDateElement = null;

				var newMonthElement = $('<div/>');
				periodElement.append(newMonthElement);
				newMonthElement.addClass('month').append("<div class='title'>"+MonthFrenchNameArray[d.getMonth()]+" "+d.getFullYear()+"</div>");
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
				newDayElement.addClass('bloc').text(DayOfWeekArray[d.getDay()]);
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
					displayTimelineAtDate(new Date($(this).attr('date')));
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
					displayTimelineAtDate(new Date($(this).attr('date')));
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
		var elt0 = blocs[0];
		var elt1 = blocs[1];
		timelineConfig.xStepPerBloc = $(elt1).position().left - $(elt0).position().left;
		// console.log("timelineConfig.xStepPerBloc : "+timelineConfig.xStepPerBloc);
		$('#period').css({
			minWidth: timelineConfig.offsetForDate(timelineConfig.toDate) + timelineConfig.xStepPerBloc
		});
	}
	displayTimelineAtDate(getDateWithoutTime(),false);
	// Calendar bookmark click
	$('#calendar .month').click(function() {
		// We get a string, we need a Date object.
		var dateToScrollTo = $(this).attr('date');
		// console.log("dateToScrollTo : "+dateToScrollTo);
		displayTimelineAtDate(new Date(dateToScrollTo));
	});
}
function displayTimelineAtDate(dateToDisplayTimelineAt,animated=true)
{
	var offset = timelineConfig.offsetForDate(dateToDisplayTimelineAt);
	var timelineElementsToMove = $('#today, #period, .blocs, .work');
	timelineElementsToMove.stop();
	if(animated)
	{
		timelineElementsToMove.animate({ marginLeft: -offset });
	} else {
		timelineElementsToMove.css({ marginLeft: -offset });
	}
}
function Blocs() {
	// CREATE BLOC
	$('.blocs').empty();
	$('#period .days .bloc').each(function(){
		$('.blocs').append('<div class="date"></div>');
	});
}
function oldWorkFunction(size=40) {
	$('.work').each(function(){
		// CREATE WORK
		var This = $(this);
		var TheMonth = This.attr('month');
		var Duration = This.attr('duration');
		var Start = This.attr('start');
		This.css({ width: size*Duration+(2*Duration), left: size*(Start-1)+(2*(Start-1))+(TheMonth*size+TheMonth*2) });
	});
}
function setupWorkDisplay() {
	$('.work').each(function(){
		// CREATE WORK
		var el = $(this);
		var startDate = el.attr('start-date');
		var duration = el.attr('expected-duration');
		el.css({ width: duration * timelineConfig.xStepPerBloc, left: timelineConfig.offsetForDate(new Date(startDate)) });
	});
}
function Today() {
	var todayDate = getDateWithoutTime(new Date());
	$('#today').css({ left: timelineConfig.offsetForDate(todayDate)+$('#period').position().left });
}
function convertOldFormatFromStartDate(startDate=null)
{
	$('.work').each(function(index,element){
		var el = $(element);
		var newStartDate = new Date('2017-09-01');
		if( null != startDate )
		{
			newStartDate = new Date(startDate);
		}
		newStartDate.setMonth(newStartDate.getMonth()+parseInt(el.attr('month')));
		newStartDate.setDate(parseInt(el.attr('start')));
		el.attr('start-date',newStartDate.toISOString());
		el.attr('expected-duration',el.attr('duration'));
	});
	setupWorkDisplay();
}

$(document).ready(function() {
	fillElementsForPeriod();
	Blocs();
	setupWorkDisplay();
	Today();

	// DEBUG
	{
		var currentMonthDate = new Date();
		currentMonthDate = new Date(currentMonthDate.getFullYear()+'-'+currentMonthDate.getMonth()+'-01');
		convertOldFormatFromStartDate(currentMonthDate);
	}

/*
	// SMALL
	$(window).keydown(function(e) {
		// RIGHT ARROW
		switch (e.keyCode) {
		case 39:
			$('body').addClass('small');
			Size = 20;
			fillElementsForPeriod();
			Blocs();
			setupWorkDisplay();
			Today();
		}
		// LEFT ARROW
		switch (e.keyCode) {
		case 37:
			$('body').removeClass('small');
			Size = 40;
			fillElementsForPeriod();
			setupWorkDisplay();
			Blocs();
			Today();
		}
	});
*/

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
	$('.work').hover(function(event){
		ThisRel = $(this).attr('rel');
		var ThisDuration = $(this).attr('expected-duration');
		if( !ThisDuration )
		{
			ThisDuration = $(this).attr('duration');
		}
		var NoLimit = $(this).attr('nolimit');
		var ThisTeamate = $(this).parent().parent().find('.name').text();
		$('.work').mousemove(function( event ) {
			var Scroller = $(document).scrollTop();
			$(this).parent().find('.description.'+ThisRel).css({ display: 'block', marginLeft: event.pageX+50, marginTop: event.pageY-Size-30-Scroller });
		});
		if (NoLimit == 'NoLimit') {
			$(this).parent().find('.description.'+ThisRel).find('.title span').html(' [ '+ThisTeamate+', sans date de fin ]');
		} else {
			$(this).parent().find('.description.'+ThisRel).find('.title span').html(' [ '+ThisTeamate+', '+ThisDuration+' jour(s) ]');
		}
	}, function() {
		$(this).parent().find('.description.'+ThisRel).css({ display: 'none' });
	});

	// CURSOR
	$(window).mousemove(function( event ) {
		$('#cursor').css({ left: event.pageX });
	});
});
