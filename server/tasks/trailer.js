//  首先调用一个子进程,子进程和事件循环这个机制是有很大区别的.
const cp = require('child_process');
const { resolve } = require('path');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
const Category = mongoose.model('Category');

(async () => {
    let movies = await Movie.find({
        $or: [
            // 满足 video 这个字段没有 或者 video 这个字段的值是空
          { video: { $exists: false } }, 
          { video: null },
        ]
    })
    const script = resolve(__dirname, '../crawler/video.js')
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
    child.on('message', async data => {
        let doubanId = data.doubanId;
        let movie = await Movie.findOne({
            doubanId: doubanId
        })
        // 如果有预告片和封面图，就将这些值取下来存好，放进数据库。
        if(data.video){
            movie.video = data.video;
            movie.cover = data.cover;
            await movie.save();
        } else {
            // 如果我们抓取到的那个数据是没有video的话，我们直接将这条数据直接移走就行了，不需要没有预告片的数据
            await movie.remove();
            // 只是删了电影可能还不够，还需要从目录层里面删一下
            let movieTypes = movie.movieTypes

            for(let i = 0;i<movieTypes.length;i++){
                let type = movieTypes[i];
                // 拿到每一个type，然后查询一下
                let cat = Category.findOne({
                   name: type
                })
                // 如果那一条电影被删了，那么分类里面对应的分类也要跟着删除
                if(cat && cat.movies){
                    let idx = cat.movies.indexOf(movie._id)
                    if(idx > -1){
                      cat.movies = cat.movies.splice(idx,1);
                    }
                    await cat.save();
                }
            }
        }
        console.log(data);
    })
    // 将数据库里面查询到的movies发送给video 去爬取
    child.send(movies)
})();
