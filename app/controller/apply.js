'use strict';

const Controller = require('egg').Controller;

class ApplyController extends Controller {
  async addFriend() {
    const {ctx,app} = this;
    // 拿到当前用户的id
    let current_user_id = ctx.authUser.id;
    // 验证参数
    ctx.validate({
      friend_id: { type: 'int', required: true, desc: '好友id' },
      nickname: { type: 'string', required: false, desc: '昵称' },
      lookme: { type: 'int',
      range:{
        in:[0,1]
      },
       required: true, desc: '看我' },
      lookhim: { type: 'int',
      range:{
        in:[0,1]
      },
      required: true, desc: '看他' },
    });
    let {friend_id,nickname,lookme, lookhim} = ctx.request.body;
    // 不能添加自己
    if(current_user_id===friend_id){
      ctx.throw(400,"不能添加自己");
    }
    // 对方是否存在
    let user = await app.model.User.findOne({
      where:{
        id:friend_id,
        status:1
      }
    })
    if(!user){
      ctx.throw(400,"该用户不存在或已被禁用")
    }
    // 之前是否申请过了
    if(await app.model.Apply.findOne({
      where:{
        user_id:current_user_id,
        friend_id,
        status:['pending','agree']
      }
    })){
      ctx.throw(400,"你之前已经申请过了!");
    }
    // 创建申请
    let apply = await app.model.Apply.create({
      user_id:current_user_id,
      friend_id,
      lookme,
      lookhim,
      nickname
    })

    if(!apply){
      ctx.throw(400,"申请失败!");
    }
    ctx.apiSuccess(apply);
  }
}

module.exports = ApplyController;
