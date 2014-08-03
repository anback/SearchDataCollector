
var moment = require('moment');

console.log(moment().format('YYYY-MM-DD hh:mm:ss'));
var mubsub = require('mubsub');

var client = mubsub('mongodb://swalo:84kAanan@ds051658.mongolab.com:51658/swalo');
var channel = client.channel('searches');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'aragorn.mrorange.local',
  user     : 'sa',
  password : 'homermad!'
});

function GetSearchQuery() {

  var CreateDate = moment().subtract(10, 's').format('YYYY-MM-DD hh:mm:ss');
  var sqlQuery = "SELECT in_FromCity, in_ToCity, in_DepartureDate, in_ReturnDate, Created FROM tomtom.statisticsairsearchlog where in_ReturnDate != '0001-01-01 00:00:00' and SearchName = 'GETAIRFARESMAIN' and Created > '{0}' and out_BestNumberOfSeg > 5.0 and out_BestTotalPrice > 300.0 order by Created desc limit 10"
  sqlQuery = sqlQuery.format(CreateDate);
  return sqlQuery;
}

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function GetSearchData() {
  console.log("**************** NEW SEARCH *****************")
  var sql = GetSearchQuery();
  console.log(sql);
  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    rows.forEach(function(item) {
      console.log(item);
      channel.publish('NewSearch', item); 
    })
  });
}

connection.connect();
client.on('error', console.error);
channel.on('error', console.error);

GetSearchData();
setInterval(GetSearchData, 1000 );

