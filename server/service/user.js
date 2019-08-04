// 处理登录和后台相关的操作
const mongoose = require('mongoose');
const User = mongoose.model('User');

// 用来校验登录的用户名和密码是否正确
export const checkPassword = async (email, password) => {
  let match = false;
  const user = await User.findOne({
    email
  })
  // 首先去数据库里面查找登录用户的邮箱，如果邮箱是存在的，那么就去比对用户的密码
  if (user) {
    // 这里直接用user实体里面的方法去进行密码的比对
    match = await user.comparePassword(password,user.password);
  }
  return {
    match,
    user
  }
}