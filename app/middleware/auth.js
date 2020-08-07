module.exports = (option, app) =>{
  return async(ctx,next) =>{
    // 获取header 头token
    const {token}  = ctx.header;
    if(!token){
      ctx.throw(400,"您没有权限访问该接口!");
    }
    // 根据token解密，换取用户信息
    let user = {};
    try {
      user = ctx.checkToken(token);
    } catch (error) {
      let fail = error.name === "TokenExpiredError"?"token 已过期！请重新获取令牌":"Token 令牌不合法!";
      ctx.throw(400,fail);
    }
    // 判断当前用户是否登录
    let t = await ctx.service.cache.get('user_'+user.id);
    if(!t||t!==token){
      ctx.throw(400,"Token不合法")
    }
    // 获取当前用户，验证当前用户是否被禁用
    user = await app.model.User.findByPk(user.id);
    if(!user || user.status == 0){
      ctx.throw(400,'用户不存在或已被禁用');
    }
    // 把user信息挂载到全局ctx上
    ctx.authUser = user;
    await next();
  }
}