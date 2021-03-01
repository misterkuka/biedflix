const express = require("express"),
  app = express(),
  fs = require('fs'),
  mongoose = require('mongoose'),
  movie = require('./api/models/mainModel'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  busboy = require('connect-busboy');


//łączymy z mongo
mongoose.Promise = global.Promise;
//naprawiamy deprecation warnings, bo mongoose jest jakiś dziwny
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//i w końcu łączymy z bazą
mongoose.connect('mongodb://localhost/Moviedb');



app.use(bodyParser.urlencoded({limit:'4000mb',extended:true,parameterLimit: 1000000}));
app.use(bodyParser.json({limit:'4000mb',extended:true}));


app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware


app.use(cors())

var routes = require('./api/routes/mainRouters');
routes(app);

app.listen(3000, function () {
  console.log("Listening on port 3000!");
});


//Jakby komuś się adresik pomylił
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' nie znaleziono heh'})
});
