var mubsub = require('mubsub');

var client = mubsub('mongodb://swalo:84kAanan@ds051658.mongolab.com:51658/swalo');
var channel = client.channel('addons');

client.on('error', console.error);
channel.on('error', console.error);


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'aragorn.mrorange.local',
  user     : 'sa',
  password : 'homermad!'
});

connection.connect();

//Here is where it all happens
channel.subscribe('NewAddon', function (message) {
  	

function addMinutesAndFormat(date, minutes) {
    console.log("trying to parse: ")
    console.log(date);
    	var dateObject = new Date(date);
    	console.log(dateObject);

      var newObejct = new Date(dateObject.getTime() + minutes*60000).toJSON();
      return formatdate(newObejct);
	}

	function formatdate(date)  {
    if(date.length > 19)
      date = date.substring(0,18);

    return date.replace('T', ' ');

  }

	var now = new Date().toJSON();

	var nametempalte = "Automatic Addon: {0}, {1}, {2} EUR";

	var sqlstatement = String.format(sqlTemplate,
		message.Origin,
		message.Dest,
		message.ItineraryMarkup,
		String.format(nametempalte, message.Origin, message.Dest, message.ItineraryMarkup),
		addMinutesAndFormat(now, 0),
		addMinutesAndFormat(now, 60 * 24),
		addMinutesAndFormat(message.OutboundItineraryLegDepartureDateTime, -1),
		addMinutesAndFormat(message.OutboundItineraryLegDepartureDateTime, 1),
  		addMinutesAndFormat(message.InboundItineraryLegArrivalDateTime, -1),
		addMinutesAndFormat(message.InboundItineraryLegArrivalDateTime, 1));

	
  	
	connection.query(sqlstatement, function(err, rows, fields) {
		if (err) throw err;
		console.log("Successfully inserted addon");
	});
	//connection.end();
	

	console.log(sqlstatement);
});


var sqlTemplate = "INSERT INTO tomtom.addon(Active,FareTypes,FareBasis,PackagePriceFares,PTCCodes,Domestics,Cities1,Cities2,Carriers,Continents,BaseFareAmount,Name,StartDateTime,StopDateTime,MinimumFromDate,MaximumFromDate,MinimumToDate,MaximumToDate,OverridePriority,PartnerId,DisregardParents,Flights,BookingClasses,Countries1,Countries2,Continents1,Continents2,Hotels,RoomTypes,StarRatings,CRS,BookWeekdaysEnabledBitMask,DepartureWeekdaysEnabledBitMask,IsRestricted,CabinTypeEnabledBitMask,FlightQualityEnabledBitMask)VALUES (1,'','','','','','{0}','{1}','','','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',999,79,0,'','','','','','','','','','',127,127,0,7,45)";



/*
channel.publish('bar', { foo: 'bar' });
channel.publish('baz', 'baz');
*/

String.format = function() {
	      var s = arguments[0];
	      for (var i = 0; i < arguments.length - 1; i++) {       
	          var reg = new RegExp("\\{" + i + "\\}", "gm");             
	          s = s.replace(reg, arguments[i + 1]);
	      }
	      return s;
	};