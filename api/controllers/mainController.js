var mongoose = require('mongoose'),
  Movie = mongoose.model('Movies'),
  fs = require('fs'),
  path = require('path'),
  busboy = require('connect-busboy'),
  crypto = require('crypto'),
  thumbsupply = require('thumbsupply')




//PRZESYŁAMY PLICZORY

exports.add_movie = (req, res, next) => {

const movie_id = crypto.randomBytes(16).toString("hex");
const uploadPath = path.join(__dirname, '../../assets'); // Register the upload path
req.pipe(req.busboy);
let formdata = new Map();

req.busboy.on('field', (key, value) => {
  formdata.set(key,value);
  console.log(key, value);
});


  console.log(formdata.get('name'))
  req.busboy.on('file', (fieldname, file, filename) =>{
      console.log(`Upload of '${movie_id}' started`);
      const movie_name = movie_id + ".mp4"
      const fstream = fs.createWriteStream(path.join(uploadPath, movie_name));

      file.pipe(fstream);

      fstream.on('close', () => {
        console.log(`Przesyłanie pliku '${movie_id}'zakończone`);

  })
})

//po przesłaniu pliku zapisujemy inofrmacje o nim w bazie
req.busboy.on('finish', () => {
  formdata.set('filename', movie_id + '.mp4')

  var new_movie = new Movie(Object.fromEntries(formdata));
  new_movie.save(function(err, movie) {
    if(err)
      res.send(err)
      console.log(err)
    res.json(movie)
    console.log(movie)
})
})
}

exports.list_all_movies = (req, res) => {
  Movie.find({}, (err, movies) => {

    var movieMap = {};

    movies.forEach((movie) => {
      movieMap[movie.filename] = movie;
    });
    res.send(movies);
  })


}

exports.thumbnail = (req, res) => {
    console.log(req.params.id)
    const filepath = path.join(__dirname, '../../assets/' + req.params.id);
  thumbsupply.generateThumbnail(filepath)
  .then(thumb => res.sendFile(thumb));
}

exports.stream_movie = (req, res) => {
    const filepath = path.join(__dirname, '../../assets/' + req.params.id);
    const stat = fs.statSync(filepath);
    const fileSize = stat.size;
    const range = req.headers.range;
    console.log('stream done')
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;
        const chunksize = (end-start) + 1;
        const file = fs.createReadStream(filepath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(filepath).pipe(res);
    }
};
