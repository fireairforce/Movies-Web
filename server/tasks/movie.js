//  首先调用一个子进程,子进程和事件循环这个机制是有很大区别的.
const cp = require('child_process');
const {
    resolve
} = require('path');
const mongoose = require('mongoose');
// 导入mongoose，拿到movie的模型
const Movie = mongoose.model('Movie');

(async () => {
    const script = resolve(__dirname, '../crawler/trailer-list.js')
    // 调用子进程上面的 fork 方法 ,它可以派生出一个子进程对象   
    const child = cp.fork(script, []);
    // 设置一个invoked变量来标识爬虫脚本是否有被运行过    
    let invoked = false;
    //  用一个回调函数来监听异常 
    child.on('error', err => {
        if (invoked) {
            return;
        } else {
            invoked = true;
        }
        console.log(err);
    })
    child.on('exit', code => {
        if (invoked) {
            return;
        } else {
            invoked = true;
        }
        let err = code === 0 ? null : new Error('exit code ' + code);
        console.log('err: ', err);
    })
    child.on('message', data => {
        let result = data.result;
        console.log('result: ', result);
        // 遍历爬去到的数据，然后在数据库里面查找一波
        result.forEach(async item => {
            // 根据豆瓣ID来查找一下数据库里面有没有这组数据，如果没有就把它存进去
            console.log(item.doubanId);
            let movie = await Movie.findOne({
                doubanId: item.doubanId
            })

            if (!movie) {
                movie = new Movie(item);
                await movie.save();
            }
        })
    })
})();