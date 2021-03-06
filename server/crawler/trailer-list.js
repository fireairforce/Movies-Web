const url = `https://movie.douban.com/tag/#/?sort=U&range=6,10&tags=`
const puppeteer = require('puppeteer');

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
});
let scrape = async () => {
    console.log('Start Now');
    // 将其设置为没有沙箱的模式
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle2'
    })
    await page.waitFor(3000);
    await page.waitForSelector('.more');
    for (let i = 0; i < 2; i++) {
        await page.click('.more');
        await page.waitFor(3000);
    }
    // evaluate 可以使得在函数里面能够使用dom操作
    const result = await page.evaluate(() => {
        let items = document.querySelectorAll('a.item')
        let links = [];
        if (items.length >= 1) {
            items.forEach((item, index) => {
                let text = item.innerText;
                //   电影的评分
                let rate = Number(text.slice(text.length - 4, text.length));
                //  电影的标题
                let title = item.innerText.slice(0, -4);
                // 电影的doubanID
                let doubanId = item.pathname.match(/\d+/)[0];
                // 电影的海报图片地址
                let poster = item.childNodes[0].childNodes[0].childNodes[0].currentSrc.replace('s_ratio', 'l_ratio')
                links.push({
                    rate,
                    title,
                    doubanId,
                    poster
                })
            })
        }
        return links;
    })
    browser.close();
    // 把结果发送到主进程中去
    process.send({
        result
    });
    process.exit(0);
    return result;

}
scrape();
//  想要看结果可以回调一次
// scrape().then(res => {
//      console.log(res);
// })