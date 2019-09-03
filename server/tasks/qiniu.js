const qiniu = require('qiniu');
const nanoid = require('nanoid');
const config = require('../config');
const bucket = config.qiniu.bucket;
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK);
const cfg = new qiniu.conf.Config();
// 首先在qiniu.js里面声明一个上传对象
const client = new qiniu.rs.BucketManager(mac, cfg);

const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');

const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
        // 上传对象有个方法叫做fetch,它能够从网络上来获取某一份静态的资源
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err);
            } else {
                if (info.statusCode === 200) {
                    resolve({
                        key
                    });
                } else {
                    reject(info);
                }
            }
        });
    })
};

(async () => {
    let movies = await Movie.find({
        $or:[
            { videoKey:{$exists: false} },
            { videoKey: null },
            { videoKey: '' },
        ]
    })
    console.log(movies);
    for(let i = 0;i<movies.length;i++){
        let movie = movies[i];
        //  如果movie对象里面有视频，并且这个视频没有被上传过的话
        if (movie.video && !movie.key) {
            try {
                console.log('开始上传 video');
                let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4');
                console.log('开始上传 cover');
                let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png');
                console.log('开始上传 poster');
                let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png');
                if (videoData.key) {
                    movie.videoKey = videoData.key;
                }
                if (coverData.key) {
                    movie.coverKey = coverData.key;
                }
                if (posterData.key) {
                    movie.posterKey = posterData.key;
                }
                console.log(movie);
                await movie.save();
            } catch (err) {
                console.log(err);
            }
        }
    }
})()