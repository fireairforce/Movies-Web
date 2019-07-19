const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017' // mongodb的默认地址
// 指定一下mongoose里面的promise
mongoose.Promise = global.Promise;
// 通过exports来暴露一个方法给外面
exports.connect = () => {
    if (process.env.NODE_ENV !== 'production') { // 判断是否为生产环境
        // 如果不是生产环境的话，打印一下debug的日志
        mongoose.set('debug', true)
    }
    mongoose.connect(DB_URL);
    mongoose.connection.on('connected',function(){
        console.log('mongo connect success');
    })
}