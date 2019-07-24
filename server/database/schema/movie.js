// 电影的数据模型

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Mixed比较适用于数据类型变化比较频繁的数据
const {
    Mixed,
    ObjectId
} = Schema.Types;

const movieSchema = new Schema({
    doubanId: {
        unique: true,
        type: String
    },
    category: [{
        type: ObjectId,
        ref: 'Category'
    }],
    rate: Number,
    title: String,
    // 简介
    summary: String,
    // url地址
    video: String,
    // 海报图
    poster: String,
    // 封面地址
    cover: String,

    // 图床上面的ID
    videoKey: String,
    posterKey: String,
    coverKey: String,

    rawTitle: String,
    // 电影的类别,申明成数组，数组里面的每一个值都为字符串
    movieTypes: [String],

    pubdate: Mixed,
    year: Number,
    // 标签使用数组类型声明数组
    tags: Array,

    meta: {
        // 这条数据被创建时的时间
        createdAt: {
            type: Date,
            default: Date.now()
        },
        // 这条数据上传的时间
        upDatedAt: {
            type: Date,
            default: Date.now()
        }
    }
});
movieSchema.pre('save', function (next) {
    if (this.isNew) { 
        // this 值得是 当前的数据的save实体
        this.meta.createdAt = this.meta.upDatedAt = Date.now();
    } else {
        this.meta.upDatedAt = Date.now();
    }
    next();
})
// 先将这个模型建立起来，然后再将这个模型发布出去
// 传入两个参数
mongoose.model('Movie', movieSchema)