//  首先调用一个子进程,子进程和事件循环这个机制是有很大区别的.
const cp = require('child_process');
const {
    resolve
} = require('path');

(async () => {
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
    child.on('message', data => {
        console.log(data);
    })
})();
