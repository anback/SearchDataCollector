var mubsub = require('mubsub');
var datejs = require('datejs');

var client = mubsub('mongodb://swalo:84kAanan@ds051658.mongolab.com:51658/swalo');
var channel = client.channel('searches');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'aragorn.mrorange.local',
  user     : 'sa',
  password : 'homermad!'
});

function GetSearchQuery() {

  var CreateDate = new Date().add({ seconds: -40}).toString('yyyy-MM-dd HH:mm:ss');
  var CreateDate2 = new Date().add({ seconds: -30}).toString('yyyy-MM-dd HH:mm:ss');
  console.log(CreateDate);
  /*out_BestTotalPrice > 300.0 and*/
  var sqlQuery = "SELECT in_FromCity, in_ToCity, in_DepartureDate, in_ReturnDate, Created FROM tomtom.statisticsairsearchlog where in_OneWay = 0 and out_BestNumberOfSeg > 3 and SearchName = 'GETAIRFARESMAIN' and Created > '{0}' and Created < '{1}' order by Created"
  sqlQuery = sqlQuery.format(CreateDate, CreateDate2);
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
    console.log('Got' + rows.length + " rows");

    channel.publish('NewSearch', rows); 
    /*
      rows.forEach(function(item) {
        //console.log(item);
        console.log("Sending SearchData: " + item.in_FromCity + item.in_ToCity + item.in_DepartureDate + item.in_ReturnDate );
        channel.publish('NewSearch', item); 
      })
    */
  });
}

connection.connect();
client.on('error', console.error);
channel.on('error', console.error);

GetSearchData();
setInterval(GetSearchData, 10000 );

