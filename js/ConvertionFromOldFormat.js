
if( !timeline.old )
{
	timeline.old = {};
}

timeline.old.oldWorkFunction = function(size=40) {
	$('.work').each(function(){
		// CREATE WORK
		var thisElement = $(this);
		var TheMonth = thisElement.attr('month');
		var Duration = thisElement.attr('duration');
		var Start = thisElement.attr('start');
		thisElement.css({ width: size*Duration+(2*Duration), left: size*(Start-1)+(2*(Start-1))+(TheMonth*size+TheMonth*2) });
	});
};
timeline.old.convertOldFormatFromStartDate = function(startDate=null) {
	$('.work').each(function(index,element){
		var el = $(element);
		var newStartDate = new Date('2017-09-01');
		if( null != startDate )
		{
			newStartDate = new Date(startDate);
		}
		// console.log("Element : "+el);
		// console.log("month : "+el.attr('month'));
		// console.log("start : "+el.attr('start'));
		// console.log("duration : "+el.attr('duration'));
		// newStartDate.setMonth(newStartDate.getMonth()+parseInt(el.attr('month')));
		// newStartDate.setDate(parseInt(el.attr('start')));
		newStartDate.setDate(parseInt(el.attr('start'))+parseInt(el.attr('month')));
		console.log("newStartDate : "+newStartDate.toISOString());
		el.attr('start-date',newStartDate.toISOString());
		el.attr('expected-duration',el.attr('duration'));
	});
};
