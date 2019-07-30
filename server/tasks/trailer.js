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
        if(data.video){
            movie.video = data.video;
            movie.cover = data.cover;
            await movie.save();
            // 
        } else {
            // 如果这条video已经存在了,就把他从movie原来的数据库里面移走即可,否则存进去就行,当然category里面也要记得移走
            await movie.remove();
            let movieTypes = movie.movieTypes
            for(let i = 0;i<movieTypes.length;i++){
                let type = movieTypes[i];
                let cat = Category.findOne({
                   name: type
                })
                if(cat){
                    let idx = cat.movies.indexOf(movie._id)
                    if(idx > -1){
                      cat.movies = cat.movies.splice(idx,1);
                    }
                    await cat.save();
                }
            }
        }
        // console.log(data);
    })
    child.send(movies)
})();
