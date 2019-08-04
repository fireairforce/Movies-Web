const {
  get,
  post,
  put,
  controller
} = require('../lib/decorator');
const {
  getAllMovies,
  getMovieDetail,
  getRelativeMovies
} = require('../service/movie');
// 这个router来处理不同的http请求(例如get和post)
@controller('/api/v0/movies')
export class movieController {
  @get('/')
  async getMovies(ctx, next) {
    const {
      type,
      year
    } = ctx.query;
    // 查询所有电影的方法
    const movies = await getAllMovies(type, year)
    ctx.body = {
      movies
    }
  }
  @get('/:id')
  async getMovieDetail(ctx, next) {
    const id = ctx.params.id;
    const movie = await getMovieDetail(id);
    const relativeMovies = await getRelativeMovies(movie);

    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    }
  }
}