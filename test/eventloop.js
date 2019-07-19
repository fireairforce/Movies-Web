const {
    readFile,
    readFileSync
} = require('fs');

const { resolve } = require('path');

// 在checked（第三个阶段）会执行的函数
setImmediate(() => {
    console.log('[阶段3.immediate] immediate 回调1');
})

setImmediate(() => {
    console.log('[阶段3.immediate] immediate 回调2');
})

setImmediate(() => {
    console.log('[阶段3.immediate] immediate 回调3');
})

Promise.resolve().then(() => {
    console.log('[...待切入下一个阶段] promise 回调1');
    setImmediate(() => { // 这个回调会在阶段三来执行
        console.log('[...阶段3.immediate] promise 回调1 增加的immediate 回调4');
    })
})

readFile('../package.json', 'utf-8', data => {
    console.log('[阶段2...IO 回调] 读文件回调1');
    readFile(resolve(__dirname,'../video.mp4'), 'utf-8', data => { // 读一个体积比较大的文件
        console.log('[阶段2...IO 回调] 读文件回调2');
        setImmediate(() => { // 这个回调会在阶段三来执行
            console.log('[...阶段3.immediate] 读文件 回调2 增加的immediate 回调4');
        })
    })
    setImmediate(() => {
        console.log('[....阶段3.immediate] immediate 回调4');
        Promise.resolve().then(() => {
            console.log('[...待切入下一个阶段] promise 回调2');
            process.nextTick(()=>{
                console.log('[...待切入下一阶段] promise 回调2增加的 nextTick 回调5');
            })
        }).then(()=>{
            console.log('[...待切入写一个阶段] promise 回调3');
        })
    })
    setImmediate(()=>{
        console.log('[...阶段3.immediate] immediate 回调5');
        process.nextTick(()=>{
            console.log('[...待切入下一个阶段] immediate 回调5 增加的 nextTick 回调6');
        })
        console.log('[...待切入到下一个阶段]  这里正在同步阻塞读写一个大文件');
        const video = readFileSync(resolve(__dirname,'../video.mp4'),'utf-8');
        process.nextTick(()=>{
            console.log('[...待切入下一个阶段] immediate 回调5 增加的 nextTick 回调7');
        })
        readFile('../package.json','utf-8',data=>{
            console.log('[阶段2...IO 回调] 读文件回调2');
        })
        setImmediate(() => { // 这个回调会在阶段三来执行
            console.log('[...阶段3.immediate] 读文件 回调2 增加的immediate 回调6');
        })
        setTimeout(()=>{
            console.log('[阶段1....定时器] 定时器回调8');
        },0)
    })
    process.nextTick(()=>{
        console.log('[...待切入下一阶段] 读文件回调 1 增加的 nextTick 回调6');
    });
    setTimeout(() => {
        console.log('[阶段1....定时器] 定时器 回调6');
    }, 0)
    setTimeout(() => {
        console.log('[阶段1....定时器] 定时器 回调7');
    }, 0)
})

// 这个是第一阶段里面的函数
setTimeout(() => {
    console.log('[阶段1....定时器] 定时器 回调1');
}, 0)

setTimeout(() => {
    console.log('[阶段1....定时器] 定时器 回调5');
    // 这个回调函数并不处于任何一个阶段
    process.nextTick(() => {
        console.log('[...待切入下一阶段] nextTick 回调2');
    });
}, 0)

setTimeout(() => {
    console.log('[阶段1....定时器] 定时器 回调3');
}, 0)

setTimeout(() => {
    console.log('[阶段1....定时器] 定时器 回调4');
}, 0)

process.nextTick(() => {
    console.log('[...待切入下一阶段] nextTick 回调1');
});

process.nextTick(() => {
    console.log('[...待切入下一阶段] nextTick 回调2');
    process.nextTick(() => {
        console.log('[...待切入下一阶段] nextTick 回调4');
    })
})

process.nextTick(() => {
    console.log('[...待切入下一阶段] nextTick 回调3');
});