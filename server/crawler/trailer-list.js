const url = `https://movie.douban.com/tag/#/?sort=U&range=6,10&tags=`

const puppeteer = require('puppeteer');

const sleep = time => new Promise(resolve => {
    setTimeout(resolve,time)
})

// 声明一个自动执行的函数
;(async ()=>{
   console.log('Start vist the target page');

   const browser = await puppeteer.launch({
       args: ['--no-sandbox'],   // 启动非沙箱模式
       dumpio: false
   })

   const page = await browser.newPage();
   await page.goto(url,{
       waitUntil: 'networkidle2'
   })
    //    等待3000ms再做其他函数
   await sleep(3000);
   //    等到页面出现加载更多的按钮之后再执行
   await page.waitForSelector('.more')
  //    写一个循环相当于抓取两页的内容
  for(let i =0;i<1;i++){ 
      await sleep(3000);
      await page.click('.more'); 
  }

  const result = await page.evaluate(() => {
      var $ = window.$;
      var items = $('.list-wp a')
       // links来存储爬取到的数据
      var  links = []
      if(items.length>=1){  // 如果items爬出到的数据不为空
           items.each((item,index)=>{
                let it = $(item);
                // 获取豆瓣的ID
                let doubanId = it.find('div').data('id');
                let title = it.find('.title').text();
                let rate = Number(it.find('.title').text());
                // 我们这里拿到的是一个比较小的图片，通过分析图片的url地址，可以考虑将s_radio换成l_radio来获取到一个高清的图片
                // let poster = it.find('img').attr('src').replace('s_ratio','l_ratio')
                let poster = " "
                links.push({
                    doubanId,
                    title,
                    rate,
                    poster
                })
           })
      }
     return links;
  })
  console.log("result:",result);
  browser.close();
})()