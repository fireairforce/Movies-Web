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
// 这个是第一阶段里面的函数
setTimeout(()=>{
    console.log('[阶段1....定时器] 定时器 回调1');
},0)

setTimeout(()=>{
    console.log('[阶段1....定时器] 定时器 回调2');
    // 这个回调函数并不处于任何一个阶段
    process.nextTick(()=>{
        console.log('[...待切入下一阶段] nextTick 回调2');
    });
},0)

setTimeout(()=>{
    console.log('[阶段1....定时器] 定时器 回调3');
},0)

setTimeout(()=>{
    console.log('[阶段1....定时器] 定时器 回调4');
},0)

process.nextTick(()=>{
    console.log('[...待切入下一阶段] nextTick 回调1');
});

process.nextTick(()=>{
    console.log('[...待切入下一阶段] nextTick 回调2');
});