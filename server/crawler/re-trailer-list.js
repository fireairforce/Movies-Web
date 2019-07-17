const url = `https://movie.douban.com/tag/#/?sort=U&range=6,10&tags=`
const puppeteer = require('puppeteer');

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
});

(async () => {
    console.log('start now');
    // 相当于是个看不到的浏览器
    const broswer = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })
    const page = await broswer.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle2'
        // 当网页空闲的时候，表示页面已经加载完成了
    })
    await sleep(3000);
    await page.waitForSelector('.more');
    for (let i = 0; i < 2; i++) {
        // 只爬取三页的数据
        await page.click('.more')
    }
    // 对数据进行抓取
    const result = await page.evaluate(() => {
        //  回调函数里面的代码都是在浏览器环境里面执行的,用 var 声明变量可能比较保险  
        var $ = window.$;
        var items = $('.list-wp a');
        var links = [];
        if (items.length >= 1) {
            items.each((index, item) => {
                let it = $(item);
                let doubanId = it.find('div').data('id');
                let title = it.find('.title').text();
                let rate = Number(it.find('.rate').text());
                let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio');
                links.push({
                    doubanId,
                    title,
                    rate,
                    poster
                })
            })
            return links;
        }
    })
    broswer.close();
    console.log(result);
})()