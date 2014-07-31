var mubsub = require('mubsub');

var client = mubsub('mongodb://swalo:84kAanan@ds051658.mongolab.com:51658/swalo');
var channel = client.channel('searches');
var sqlQuery = "SELECT in_FromCity, in_ToCity, in_DepartureDate, in_ReturnDate, Created FROM tomtom.statisticsairsearchlog where in_ReturnDate != '0001-01-01 00:00:00' order by Created desc limit 3"
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'aragorn.mrorange.local',
  user     : 'sa',
  password : 'homermad!'
});

function GetSearchData() {
  console.log("Getting Search Data")
  connection.query(sqlQuery, function(err, rows, fields) {
    if (err) throw err;
    console.log("Found Data")
    rows.forEach(function(item) {

      console.log("Publishing Data ..");
      console.log(item);
      channel.publish('NewSearch', item); 
    })
  });
}

connection.connect();
client.on('error', console.error);
channel.on('error', console.error);

GetSearchData();
setInterval(GetSearchData, 6500 );