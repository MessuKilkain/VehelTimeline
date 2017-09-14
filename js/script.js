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
	offsetForDate: function(dateForExpectingOffset) {
		var offset = 0;
		if( null != this.fromDate && null != dateForExpectingOffset )
		{
			offset = ( dateForExpectingOffset.getTime() - this.fromDate.getTime() )/OneDayLengthInMilliseconds;
			offset = offset * this.xStepPerBloc;
		}
		return offset;
	}
};
var ThisRel = 0;
var ThisDuration = 0;
var ThisTeamate = 0;
var ThisProject = 0;
var TodayIs = 13; var Size = 40;
function fillElementsForPeriod(fromDate, toDate)
{
	if(!fromDate)
	{
		fromDate = new Date();
		// Set to first day of the month
		fromDate.setDate(1);
		fromDate.setMonth(fromDate.getMonth()-2);
	}
	if(!toDate)
	{
		toDate = new Date();
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
	}
	DisplayTimelineAtDate(new Date(),false);
	// CLICK PERIOD
	$('#calendar .month').click(function() {
		// We get a string, we need a Date object.
		var dateToScrollTo = $(this).attr('date');
		// console.log("dateToScrollTo : "+dateToScrollTo);
		DisplayTimelineAtDate(new Date(dateToScrollTo));
	});
}
function DisplayTimelineAtDate(dateToDisplayTimelineAt,animated=true)
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
function Work() {
	$('.work').each(function(){
		// CREATE WORK
		var This = $(this);
		var TheMonth = This.attr('month');
		var Duration = This.attr('duration');
		var Start = This.attr('start');
		This.css({ width: Size*Duration+(2*Duration), left: Size*(Start-1)+(2*(Start-1))+(TheMonth*Size+TheMonth*2) });
	});
}
function Today() {
	$('#today').css({ left: timelineConfig.offsetForDate(new Date())+$('#period').position().left });
}

$(document).ready(function() {
	fillElementsForPeriod();
	Blocs();
	Work();
	Today();

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
			Work();
			Today();
		}
		// LEFT ARROW
		switch (e.keyCode) {
		case 37:
			$('body').removeClass('small');
			Size = 40;
			fillElementsForPeriod();
			Work();
			Blocs();
			Today();
		}
	});
*/

	// CLICK FILTER PROJECT
	$('#legend .filter_project').click(function() {
		ThisProject = $(this).attr('rel');
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
		ThisProject = $(this).attr('rel');
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
		ThisProject = $(this).attr('rel');
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
		ThisDuration = $(this).attr('duration');
		var NoLimit = $(this).attr('nolimit');
		ThisTeamate = $(this).parent().parent().find('.name').text();
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