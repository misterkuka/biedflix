'use strict';
module.exports = function(app) {
  var movies = require('../controllers/mainController');

  app.route('/movies')
    .get(movies.list_all_movies)
    .post(movies.add_movie)

  app.route('/movies/:id')
    .get(movies.stream_movie)
  app.route('/movies/:id/thumb')
    .get(movies.thumbnail)
};
