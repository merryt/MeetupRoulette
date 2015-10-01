var http = require("http");
var url = require("url");



function start(route){
  var onRequest = function(request, response){

    var pathname = url.parse(request.url).pathname;
    console.log("request for "+ pathname +" received.");

    route(pathname);

    response.writeHead(200, {"Content-Type": "text/html"});

    response.write("<html><head><title>MeetupRoulette</title></head><body>\n");

    var currentTime = Date.now();
    var futureTime = currentTime + 24 * 60 * 60 * 1000;
    var data;
    var personalKey;
    var options = {
      host: 'api.meetup.com',
      port: 80,
      path: '/2/open_events?key='+ personalKey +'&sign=true&photo-host=public&zip=80205&time='+ currentTime +','+ futureTime +'&radius=100&order=trending&page=5',
      method: 'GET'
    };

    http.request(options, function(res) {
      // console.log(options.path);
      //console.log('STATUS: ' + res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(res.headers));
      var itemPick = Math.floor(Math.random() * 5);
      res.setEncoding('utf8');
      var oBoy="";
      // var oBoy = '<script>var data = ';
      res.on('data', function (chunk) {
        // console.info('GET result:\n');
        // process.stdout.write('<script>var data="' + chunk +'"</script>');
        // console.info('\n\nCall completed');
        oBoy += chunk;
      });
      res.on('end', function(){
        // oBoy += '</script>';
        var test = JSON.parse(oBoy);
        console.log(itemPick)
        console.log(test.results[itemPick].name);
        response.write('<h3>' + test.results[itemPick].name + '</h3>');
        response.write('<p>' + test.results[itemPick].description + '</p>');
        response.write('<a href="'+ test.results[itemPick].event_url+'">All right! Sign me up</a>');
        response.write('</body></html>');
        response.end()
      })

    }).end();




  };

  http.createServer(onRequest).listen(8888);
  console.log("server has started");
}

exports.start = start;
