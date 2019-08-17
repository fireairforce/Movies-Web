const mongoose = require('mongoose');
const db = 'mongodb://localhost/douban-test';
const glob = require('glob');
const {
    resolve
} = require('path');


// 指定一下mongoose里面的promise
mongoose.Promise = global.Promise;
// 通过exports来暴露一个方法给外面,拿到所有的Schemas，这些schemas下面它会自动通过里面的mongoose.model来创建
exports.initSchemas = () => {
    // 这里用到一个glob一个库，类似于在shell脚本里面匹配符合所有规则的文件
    // 拿到所有schema下面所有的js文件，然后通过forEach逐步加载进来
    glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}
// 利用这个函数来创建一个管理员账号
exports.initAdmin = async() => {
    const User = mongoose.model('User');
    // 先在数据库里面查询一下我们要创建的数据里面是否存在
    let user = await User.findOne({
        username:'zoomdong'
    })
    if(!user){
        const user = new User({
            username:'zoomdong',
            email:'wudong@hrsoft.net',
            password:'wd1344492820.',
            role:'admin'
        })
        await user.save();
    }
 }

exports.connect = () => {
    // 连接次数到达一定的限度之后将不会在继续连接数据库，因为没有意义。
    let maxConnectTimes = 0;
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') { // 判断是否为生产环境
            // 如果不是生产环境的话，打印一下debug的日志
            mongoose.set('debug', true);
        }
        // 使用mongoose来连接本地 mongoDB 的地址
        // mongoose.connect(DB_URL);
        mongoose.connect(db);
        // 对连接来增加一些监听
        mongoose.connection.on('disconnected', function () {
            maxConnectTimes++;
            if (maxConnectTimes < 5) {
                mongoose.connect(db);
            } else {
                throw new Error('数据库挂了吧，快去修吧')
            }
        })
        mongoose.connection.on('error', function () {
            maxConnectTimes++;
            if (maxConnectTimes < 5) {
                mongoose.connect(db);
            } else {
                throw new Error('数据库挂了吧，快去修吧')
            }
        })
        mongoose.connection.once('open', function () {
            // 我们可以先用mongoose来建立一个数据库的模型
            // const Dog = mongoose.model('Dog',{
            //     name: String,
            // })
            // const dogA = new Dog({ name:'阿尔法' })
            // dogA.save().then(()=>{
            //     console.log('存储成功');
            // })
            // 连接成功之后使用resolve来改变一下状态
            resolve();
            console.log('MongoDB Connected successfully');
        })
    })
}