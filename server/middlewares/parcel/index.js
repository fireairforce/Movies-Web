// 使用env来获取到当前进程上的env
const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'

module.exports= require(`./${env}.js`);