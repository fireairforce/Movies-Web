const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
// 用这个文件来完成和数据库的交互

export const getAllMovies = async (type, year) => {
  let query = {};
  if (type) {
    query.movieTypes = {
      $in: [type]
    }
  }
  if (year) {
    query.year = year;
  }
  const movies = await Movie.find(query);
  
  return movies;
}