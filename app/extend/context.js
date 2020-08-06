module.exports = {
  // api 返回成功
  apiSuccess(data = '', msg="ok",code = 200){
    this.status = code;
    this.body = {
      msg,
      data
    }
  },
  apiFail(data = '', msg="fail",code = 400){
    this.status = code;
    this.body = {
      msg,
      data
    }
  },
};