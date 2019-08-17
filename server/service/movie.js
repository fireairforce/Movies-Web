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

export const findOneRemove = async (id) => {
  const movie = await Movie.findOne({
    _id: id
  });
  if(movie){
    await movie.remove();
  }
}

export const getMovieDetail = async (id) => {
  const movie = await Movie.findOne({
    _id: id
  });
  return movie;
}

export const getRelativeMovies = async (movie) => {
  const movies = await Movie.find({
    // 通过in 去数据库里面找一个数组值，这个数组的值就是传递过来的movie.movieTypes
    movieTypes: {
      $in: movie.movieTypes
      // in的后面接的值是一个数组
    }
  })
  return movies;
}