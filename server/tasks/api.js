// http://api.douban.com/v2/user/1000001?apikey=XXX
// /v2/movie/subject/1764796
// http://api.douban.com/v2/movie/subject/1764796

// 引入一个服务端的请求库
const rp = require('request-promise-native');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
const Category = mongoose.model('Category');

async function fetchMovie(item) {
    // console.log(item);
    const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}?apikey=0df993c66c0c636e29ecbb5344252a4a`;
    //  rp能够直接去请求这个url
    const res = await rp(url);
    let body;
    try{
        body = JSON.parse(res);
    } catch(err){
        console.log(err);
    }
    return body;
};

(async () => {
    // 在爬取到的数据里面查询有的数据
    // 满足下面几种条件的数据被拿出来
    let movies = await Movie.find({
        $or: [
            // 这个字段没有
          { summary: { $exists: false } },
          { summary: null },
          { title: '' },
          { summary: '' } 
        ]
    })
    // 这里注意API的限额
    for(let i = 0;i < [movies[0]].length ;i++){
        let movie = movies[i];
        // 请求一波获得一个数据
        let movieData = await fetchMovie(movie);
        if(movieData){
            let tags = movieData.tags || [];
            movie.tags = tags;
            movie.summary = movieData.summary || '';
            movie.title = movieData.alt_title || movieData.title || '';
            movie.rawTitle = movieData.title || '';
            movie.movieTypes = movieData.genres || [];
            for(let i = 0;i<movie.movieTypes.length;i++){
                let item = movie.movieTypes[i];
                //  在数据库里面查找一下有没有保存过这条数据
                let cat = await Category.findOne({
                    name: item
                })
                if(!cat) {
                    // 如果没有没存储过，往里面添加一下
                    cat = new Category({
                        name: item,
                        movies: [movie._id]
                    })
                } else {
                    // 如果里面存储过我们判断一下里面有没有保存过电影的id
                    if(cat.movies.indexOf(movie._id === -1)) {
                        cat.movies.push(cat._id);
                    }
                }
                //  将 cat 存进数据库
                await cat.save();
                if(!movie.category){
                    movie.category.push(cat._id);
                } else {
                    if(movie.category.indexOf(cat._id) === -1) {
                        movie.category.push(cat._id);
                    }
                }
            }  
             let date = movieData.pubdates[0].split('(')[0] || '';
             let country = movieData.countries || '未知';
             let pubdates = [];
             pubdates.push({
                 date: new Date(date),
                 country
             })
             movie.pubdate = pubdates;
             for(let i = 0;i<movieData.tags.length;i++){
                 movie.tags.push(movieData.tags[i]);
             }
            //  movieData.tags.forEach(function(tag){
            //    movie.tags.push(tag.name);
            //  })
            await movie.save();
        }
    }
        // movies.map(async movie=>{
        //     let movieData = await fetchMovie(movie);
        //     //  movieData最后返回的数据是string,我们把它格式化成JSON
        //     try{
        //         movieData = JSON.parse(movieData);
        //         console.log(movieData.tags);
        //         console.log(movieData.summary);
        //     } catch(err){
        //         console.log(err);
        //     }
        //     // console.log('movieData: ', movieData);
        // })
})();