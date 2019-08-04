const {
  controller,
  post,
  get,
  put
} = require('../lib/decorator');
const {
  checkPassword
} = require('../service/user');

@controller('/api/v0/user')
export class userController {
  @post('/')
  async login(ctx, next) {
    // 通过 request 里面的 body 拿到 email 和 password
    const {
      email,
      password
    } = ctx.request.body;
    const matchData = await checkPassword(email, password);
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
      success: true,
      err:'密码不正确'

    })
  }
}