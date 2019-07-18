// http://api.douban.com/v2/user/1000001?apikey=XXX
// /v2/movie/subject/1764796
// http://api.douban.com/v2/movie/subject/1764796

// 引入一个服务端的请求库
const rp = require('request-promise-native');

async function fetchMovie(item) {
    const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}?apikey=0df993c66c0c636e29ecbb5344252a4a`;

    const res = await rp(url);
    return res;
};

(async () => {
    let movies = [{
            doubanId: 1292052,
            title: '肖申克的救赎',
            rate: 9.6,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p480747492.jpg'
        },
        {
            doubanId: 1652592,
            title: '阿丽塔：战斗天使',
            rate: 7.6,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2544987866.jpg'
        }]
        movies.map(async movie=>{
            let movieData = await fetchMovie(movie);
            //  movieData最后返回的数据是string,我们把它格式化成JSON
            try{
                movieData = JSON.parse(movieData);
                console.log(movieData.tags);
                console.log(movieData.summary);
            } catch(err){
                console.log(err);
            }
            // console.log('movieData: ', movieData);
        })
})();