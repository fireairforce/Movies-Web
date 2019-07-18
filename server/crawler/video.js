// 前缀是subject，后缀是豆瓣ID
const puppeteer = require('puppeteer');

const base = `https://movie.douban.com/subject/`;
const doubanId = '1849031';
const videoBase = `https://movie.douban.com/trailer/219491/#content`;

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
});

(async () => {
    console.log('开始访问详情界面');
    // 相当于是个看不到的浏览器
    const broswer = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })
    const page = await broswer.newPage();
    await page.goto(base + doubanId, {
        waitUntil: 'networkidle2'
        // 当网页空闲的时候，表示页面已经加载完成了
    })
    await sleep(3000);
    // 来获取详情页面
    const result = await page.evaluate(() => {
        //  回调函数里面的代码都是在浏览器环境里面执行的,用 var 声明变量可能比较保险  
        var $ = window.$;
        var it = $('.related-pic-video');

        if (it && it.length > 0) {
            var link = it.attr('href');
            // 将括号里面的url提取出来
            var cover = it.attr('style').match(/\((.+?)\)/g)[0].slice(1, -1);
            return {
                link,
                cover
            }
        }
        return {};
    })
    let video;
    if (result.link || result.cover) {
        await page.goto(result.link, {
            waitUntil: 'networkidle2'
        })
        //    等待个2s
        await sleep(2000);
        video = await page.evaluate(() => {
            var $ = window.$;
            var it = $('source');
            if (it && it.length >= 0) {
                return it.attr('src');
            }
            return ''
        })
    }
    const data = {
        video,
        doubanId,
        cover: result.cover
    }
    // https://img3.doubanio.com/view/photo/l_ratio_poster/public/p1312700744.jpg
    broswer.close();
    process.send({
        data
    });
    process.exit(0);
})();