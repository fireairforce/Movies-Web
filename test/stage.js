const {
    readFile
} = require('fs');
const EventEmitter = require('events');


// 这个的优先级
class EE extends EventEmitter {}

const yy = new EE();
yy.on('event', () => {
    console.log('出大事了');
})

setTimeout(() => {
    console.log('0 毫秒后执行定时器回调');
}, 0)

setTimeout(() => {
    console.log('100 毫秒后执行定时器回调');
}, 100)


setTimeout(() => {
    console.log('200 毫秒后执行定时器回调');
}, 200)

readFile('./../../package.json', 'utf-8', data => {
    console.log('完成文件 1 读操作的回调');
})

readFile('./../../ReadMe.md','utf-8', data => {
    console.log('完成文件 2 读操作的回调');
})

setImmediate(() => {
    console.log('immediate 立即回调');
})

process.nextTick(() => {
    console.log('process.nextTick 回调');
})

Promise.resolve().then(() => {
    yy.emit('event');
    // process在事件机制中的优先级
    process.nextTick(() => {
        console.log('process.nextTick 的第二次回调');
    })
    console.log('Promise的第 1 次回调');
}).then(() => {
    console.log('Promise的第 2 次回调');
})