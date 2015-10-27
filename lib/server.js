var express = require('express');
var join = require('path').join;
var cwd = process.cwd();
var env = process.env;

var app = express()
  .set('trust proxy', true)
  .set('views', join(cwd, 'views'))
  .set('view engine', 'jade')
  .use(express.static(join(cwd, 'public')))

  /*.set('query parser', qs.parse)
  .use('/robots.txt', robots())
  .use(favicon(join(cwd, 'lib/static/favicon.ico')))
  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended:false }))
  .use(bodyParser.json())
  .use(methodOverride());*/

app.get('/retsly', function(req, res, next){
  res.render('retsly');
});

app.get('/reso', function(req, res, next){
  res.render('reso');
});

app.listen(3003)
  .on('error', quit);

process
  .on('SIGTERM', quit)
  .on('SIGINT', quit);



function quit (err) {
  console.log('quitting',err);
  process.exit(1);

}
