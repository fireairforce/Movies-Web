const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;
const SALT_WORK_FACTOR = 10;
// 设计最大的密码输入出错次数
const MAX_LOGIN_ATTEMPTS = 5;
// 锁定时间为2h
const LOCK_TIME = 2 * 60 * 60 * 1000

const userSchema = new Schema({
    // 设置该字段为 唯一字段
    username: {
        unique: true,
        type: String,
        required: true,
    },
    email: {
        unique: true,
        type: String,
        required: true
    },
    // 密码要进行一个比较精细的控制
    password: {
        unique: true,
        required: true,
        type: String
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
        // 默认值为0，必须要传
    },
    lockUntil: Number,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        upDateAt: {
            type: Date,
            default: Date.now()
        }
    }
})
userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.upDateAt = Date.now();
    } else {
        this.meta.upDateAt = Date.now();
    }
    next();
});
// 使用mongoose里面的一个虚拟字段的使用方法,这个字段不会被存进数据库
userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
})

// 在数据保存进数据库之前，对密码进行一个加密处理
userSchema.pre('save', function (next) {
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(this.password, salt, (error, hash) => {
            if (error) return next(error);
            this.password = hash;
            next();
        })
    })
    next();
});
// methods是实例方法
userSchema.methods = {
    comparePassword: (_password, password) => {
        // 来做一个明文密码与存储密码的比对
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, (err, isMatch) => {
                if (!err) {
                    //    如果比对过程中没有出现问题,状态修改为完成
                    resolve(isMatch);
                } else {
                    //    如果比对过程中出现问题，那么就抛出错误
                    reject(err);
                }
            })
        })
    },
    // 判断用户是否超过登录次数然后将其进行一个锁定
    // 但是如果锁定时间比until晚了的话证明我们已经过了这个有效期了
    incLoginAttepts: (user) => {
        return new Promise((resolve, reject) => {
            if (this.lockUntil && this.lockUntil < Date.now()) {
                // 如果当前用户已经被锁定
                this.update({
                    $set: {
                        loginAttempts: 1
                    },
                    $unset: {
                        lockUntil: 1
                    }
                }, (err) => {
                    if (!err) {
                        resolve(true);
                    } else reject(false);
                })
            } else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                }
                if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME
                    }
                }
                this.update(updates, err => {
                    if (!err) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                })
            }
        })
    }
}
mongoose.model('User', userSchema);