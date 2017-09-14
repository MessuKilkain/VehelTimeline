// VARIABLE
var Month = 0; var Duration = 0;
var Start = 0;
var Number = 0; var ThisRel = 0;
var ThisDuration = 0;
var ThisTeamate = 0;
var ThisProject = 0;
var TodayIs = 13; var Size = 40;
function initializePeriod(fromDate, toDate)
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
}
function Blocs() {
	// CREATE BLOC
	$('.blocs').empty();
	$('#period .days .bloc').each(function(){
		Number++
		//$('.blocs').append('<div class="date">'+Number+'</div>');
		$('.blocs').append('<div class="date"></div>');
	});
}
function Work() {
	$('.work').each(function(){
		// CREATE WORK
		var This = $(this);
		TheMonth = This.attr('month');
		Duration = This.attr('duration');
		Start = This.attr('start');
		This.css({ width: Size*Duration+(2*Duration), left: Size*(Start-1)+(2*(Start-1))+(TheMonth*Size+TheMonth*2) });
	});
}
function Click() {
	// CLICK PERIOD
	$('#calendar .month').click(function() {
		var Defil = $(this).attr('duration');
		if ($(this).hasClass('first')) {
			$('#today').stop().animate({ marginLeft: 0 });
			$('#period').stop().animate({ marginLeft: 300 });
			$('.blocs, .work').stop().animate({ marginLeft: 0 });
		} else {
			$('#today').stop().animate({ marginLeft: -(Defil*Size + Defil*2)+340 });
			$('#period').stop().animate({ marginLeft: -(Defil*Size + Defil*2)+340 });
			$('.blocs, .work').stop().animate({ marginLeft: -((Defil-1)*Size + (Defil-1)*2) });
		}
	});
}
function Today() {
	$('#today').css({ left: (TodayIs-1)*Size+((TodayIs-1)*2)+301 });
}

$(document).ready(function() {
	initializePeriod();
	Blocs();
	Work();
	Click();
	Today();

/*
	// SMALL
	$(window).keydown(function(e) {
		// RIGHT ARROW
		switch (e.keyCode) {
		case 39:
			$('body').addClass('small');
			Size = 20;
			Blocs();
			Work();
			Click();
			Today();
		}
		// LEFT ARROW
		switch (e.keyCode) {
		case 37:
			$('body').removeClass('small');
			Size = 40;
			Work();
			Blocs();
			Click();
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