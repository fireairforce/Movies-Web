const {
  controller,
  post,
  get,
  auth
} = require('../lib/decorator');
const {
  checkPassword
} = require('../service/user');
const {
  getAllMovies,
  getMovieDetail,
  getRelativeMovies
} = require('../service/movie');

@controller('/admin')
export class userController {
  @get('/list')
  @auth
  async getMovieList(ctx,next) {
    const { type, year } = ctx.query;
    const movies = await getAllMovies();

    ctx.body = {
      success: true,
      data: movies
    }
  }
  @post('/login')
  async login(ctx, next) {
    // 要写一个解析post的中间价
    // 通过 request 里面的 body 拿到 email 和 password
    // console.log(ctx.request.body);
    const {
      email,
      password
    } = ctx.request.body;
    const matchData = await checkPassword(email, password);
    // console.log(matchData);
    // 如果用户信息压根不存在
    if (!matchData.user) {
      return (ctx.body = {
        success: false,
        err: '用户不存在'
      })
    }
    // 如果返回了true
    if (matchData.match) {
      return (ctx.body = {
        success: true
      })
    }

    return (ctx.body = {
      success: false,
      err:'密码不正确'
    })
  }
}