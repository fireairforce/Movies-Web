const Koa = require('koa');
const {
    resolve
} = require('path');
const {
    connect,
    initSchemas,
    initAdmin
} = require('./database/init');
const app = new Koa();
// 使用ramda的一个库
const R = require('ramda');
// 声明一个中间件的数组
const MIDDLEWARES = ['router','parcel'];

const useMiddlewares = (app) => {
    // 使用 R.map来遍历所有中间件
    R.map(R.compose(
        // 使用R.compose来
        R.forEachObjIndexed(

            initWith => initWith(app)
        ),
        // require上面通过R.forEachObjIndexed
        require,
        // name 在拿到middlewares下面的中间件之后会向上传给require
        name => resolve(__dirname, `./middlewares/${name}`)
    ))(MIDDLEWARES)
};

;(async () => {
    await connect();

    initSchemas();

    await initAdmin();

    await useMiddlewares(app);
    app.listen(1234);
    //   把它 require 进来，他就会启动子进程去爬取数据，然后把爬取到的数据存在数据库里面  
    //  require('./tasks/movie');
    //  require('./tasks/api');
    //  require('./tasks/trailer');
    //  require('./tasks/qiniu');
})();