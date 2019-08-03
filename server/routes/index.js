const Router = require('koa-router');
const mongoose = require('mongoose');
const router = new Router();

// 这个router来处理不同的http请求(例如get和post)

// 我们可以在路由的get请求里面接一个中间件的回调方式
router.get('/movies', async (ctx,next)=>{
  const Category = mongoose.model('Catagory');
  const cats = await Category.find({});
  ctx.body = cats;
  return next();
  // 通过在这个中间件里面做一些数据过滤之后然后再进入下一步
},async (ctx, next) => {
  // 先拿到 Movie 的数据库里面所有的数据,然后再按照创建时间来进行一个排序
  const Movie = mongoose.model('Movie');
  const movies = await Movie.find({}).sort({
    'meta-createdAt': -1
  })
  ctx.body = {
    movies
  }
})
// 通过一个具体的样例来进行测试
router.get('/movies/:id', async (ctx, next) => {
    const Movie = mongoose.model('Movie'); 
    const id = ctx.params.id;
    const movie = await Movie.findOne({_id:id})
    ctx.body = {
      movie
    }
})

module.exports = router