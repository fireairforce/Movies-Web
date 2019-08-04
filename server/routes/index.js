// const Router = require('koa-router');
const mongoose = require('mongoose');
// const router = new Router();
const { get,post,put,controller } = require('../lib/decorator');
// 这个router来处理不同的http请求(例如get和post)
@controller('/api/v0/movies')
export class movieController{
  @get('/')
  async getMovies(ctx,next) {
    const Movie = mongoose.model('Movie');
    const movies = await Movie.find({}).sort({
      'meta.createdAt': -1
    })
    ctx.body = {
      movies
    }
  }
  @get('/:id')
  async getMovieDetail(ctx,next){
     const Movie = mongoose.model('Movie');
     const id = ctx.params.id;
     const movie = await Movie.findOne({_id:id});
     ctx.body = {
       movie
     }
  }
}
// module.exports = router