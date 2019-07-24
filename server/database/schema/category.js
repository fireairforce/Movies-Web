// 电影的数据模型

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const categorySchema = new Schema({
    name: {
      type: String,
      unique: true,
    },
    movies: [{
        type: ObjectId,
        ref: 'Movie'
    }],
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
categorySchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.upDatedAt = Date.now();
    } else {
        this.meta.upDatedAt = Date.now();
    }
    next();
})
// 先将这个模型建立起来，然后再将这个模型发布出去
// 传入两个参数
mongoose.model('Category', categorySchema)