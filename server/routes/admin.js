
const {
  controller,
  post,
  get,
  auth,
  admin,
  required,
  del
} = require('../lib/decorator');
const {
  checkPassword
} = require('../service/user');
const {
  getAllMovies,
  findOneRemove
} = require('../service/movie');

@controller('/admin')
export class adminController {
  @get('/movie/list')
  @auth
  @admin('admin')
  async getMovieList(ctx,next) {
    const movies = await getAllMovies();
    ctx.body = {
      success: true,
      data: movies
    }
  }

  @del('/movies')
  @required({
    query:['id']
  })
  async remove (ctx,next) {
    const id = ctx.query.id;
    const movie = await findOneRemove(id);
    const movies = await getAllMovies();

    ctx.body = {
      data:movies,
      success:true
    }
  }

  @post('/login')
  @required({
    body: ['email','password']
  })
  async login(ctx, next) {
    // 要写一个解析post的中间价
    // 通过 request 里面的 body 拿到 email 和 password
    // console.log(ctx.request.body);
    const {
      email,
      password
    } = ctx.request.body;
    const matchData = await checkPassword(email, password);

    if (!matchData.user) {
      return (ctx.body = {
        success: false,
        err: '用户不存在'
      })
    }
    // 如果返回了true
    if (matchData.match) {
      ctx.session.user = {
        _id: matchData.user._id,
        email: matchData.user.email,
        role: matchData.user.role,
        username: matchData.user.username
      }
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