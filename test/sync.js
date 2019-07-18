// 通过doSync来模拟同步的过程
const doSync = (sth, time) => new Promise(resolve => {
    setTimeout(() => {
        console.log(sth + '用了' + time + '毫秒');
        resolve();
    }, time)
});

const doAsync = (sth, time, cb) => {
    setTimeout(() => {
        console.log(sth + '用了' + time + '毫秒');
        // 使用cb来做一个判断，如果有回调的话，执行回调函数
        cb && cb();
    })
};

const doElse = (sth) => {
    console.log(sth);
};

const Wd = {
    doSync,
    doAsync
};
const Xyx = {
    doSync,
    doAsync,
    doElse
};

(async () => {
    // 同步阻塞的过程
    // 表示第一个用户已经来等待
    console.log('case1: xyx等待wd的座位');
    //  里面使用的人需要用1000ms
    await Wd.doSync('wd 正在吃饭 ', 1000);
    console.log('啥也没干，一直等待');
    await Xyx.doSync('xyx吃饭', 2000);
    Xyx.doElse('xyx 去忙别的去了');



    // 能够主动通知调用方的系统的过程
    console.log('case3: xyx来餐厅按下通知开关');
    Wd.doAsync('wd 正在吃饭', 1000, () => {
       console.log('餐厅通知xyx来恰饭');
       Xyx.doAsync('xyx恰饭',2000);
    })
    Xyx.doElse('xyx 去忙别的去了');
})()