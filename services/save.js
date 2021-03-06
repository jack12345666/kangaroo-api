let mysql = require("mysql");
let mysqlconfig = require("../config/mysql");
let poolextend = require("../modules/poolextend");
let moment = require("moment");
let { save } = require("../modules/sql");
let json = require("../modules/json");
let pool = mysql.createPool(poolextend({}, mysqlconfig));
const { getId, formatTime } = require("../utils/utils");

let saveData = {

  allSave: (req, res) => { // 查询所有收藏 (管理员)
    let {uid, context, status,  per, page} = req.query;
    status = status || '%%'
    uid = uid || '%%'
    if(context === undefined){context = '%%'} else{context = `%${context}%`}
    pool.getConnection((err, connection) => {
      connection.query(save.getAllSavesRoot,[context, uid, status], (err, result) => {
        if (err) {
          result = undefined;
           json(res, result);
           throw err;
        } else {
          let offset=parseInt(page || 1)
          let limit=parseInt(per || 10)
          let newArry=result.slice((offset-1)*limit, offset*limit)
          let hasmore=offset*limit > result.length ? false : true
          const _result = {
              hasmore,
              list: newArry,
              count: result.length,
              code: 200
          }
          json(res, _result);
        }
      connection.release();
      })
    })
  },
  getSaveByCid : (req, res) => { // 获取文章的收藏数
    let { id, per, page } = req.query
    pool.getConnection((err, connection) => {
      connection.query(save.getSaveByCid, id, (err, result) => {
        if(err){
          result = undefined;
          json(res, result);
          throw err;
        }else{
          let offset=parseInt(page || 1)
          let limit=parseInt(per || 1000)
          let newArry=result.slice((offset-1)*limit, offset*limit)
          let _newArry = [];
          newArry.forEach(item => {
            _newArry.push({
              id: item.id,
              cid: item.cid,
              uid: item.uid,
              create_time: formatTime(moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')),
              status: item.status,
              nickName: item.nickName,
              imgUrl: item.imgUrl,
            })
          })
          let hasmore=offset*limit > result.length ? false : true
          res.send({
            code: 200,
            count: result.length,
            list: _newArry,
            hasmore
          })
        }
        connection.release();
      })
    })
  },
  toSaveByUid: (req, res) => { // 获取用户的收藏作品
    const id = getId(req);
    const {per, page} = req.query;
    pool.getConnection((err, connection) => {
      connection.query(save.toSaveByUid, id, (err, result) => {
        if(err){
          result = undefined;
          throw err;
        }else{
          let offset=parseInt(page || 1)
          let limit=parseInt(per || 1000)
          let newArry=result.slice((offset-1)*limit, offset*limit)
          let hasmore=offset*limit > result.length ? false : true
          const _result = {
              hasmore,
              list: newArry,
              count: result.length,
              code: 200
          }
          json(res, _result);
        }
         connection.release();
      })
    })
  },
  isSaveContent: (req, res) => { //收藏与取消收藏
    let { cid, status } = req.query
    let id = getId(req)
    if(!id){
      res.send({
        code: 301,
        msg: 'token无效',
      })
      return 
    }
    pool.getConnection((err, connection) => {
      connection.query(save.isFirstSave, [id, cid], (err, result) => {
            if(err){
              res.send({
                code: 500,
                msg: '服务器错误'
              })
              throw err
            }else if(result.length > 0){
              connection.query(save.isSaveContent,[status, id, cid], (err, result) => {
                if(err){
                  res.send({
                    code: 500,
                    msg: '服务器错误'
                  })
                  throw err
                }else{
                  res.send({
                    code: 200,
                    msg: status == 1 ? '收藏成功' : '取消收藏'
                  })
                }
              })
            }else{
              connection.query(save.firstSaveContent,[id, cid, status], (err, result) => {
                if(err){
                  res.send({
                    code: 500,
                    msg: '服务器错误'
                  })
                  throw err
                }else{
                  res.send({
                    code: 200,
                    msg: '收藏成功'
                  })
                }
              })
            }
            connection.release();
       })
    })
  },
  saveSign: (req, res) => { // 判断某一内容是否收藏
    let { cid } = req.query
    let id = getId(req)
    if(!id){
      res.send({
        code: 301,
        msg: 'token无效',
      })
      return 
    }
    pool.getConnection((err, connection) => {
      connection.query(save.isFirstSave, [id, cid], (err, result) => {
            if(err){
              res.send({
                code: 500,
                msg: '服务器错误'
              })
              throw err
            }else if(result.length > 0){
               if(result[0].status == 1){
                 res.send({
                   code: 200,
                   sign: true,
                   msg: '已收藏'
                 })
               }else{
                res.send({
                  code: 200,
                  sign: false,
                  msg: '未收藏'
                })
               }
            }else{
              res.send({
              code: 200,
              sign: false,
              msg: '未标记喜欢'
             })
            }
            connection.release();
          })
        })
  },
  getSaveByUid : (req, res) => { // 获得的收藏
    let { uid } = req.query 
    let tokenId = getId(req)
    let id = null;
    if(uid == 'undefined') {
      id = tokenId
    }else {
       id = uid
    }
    if(!tokenId && uid == 'undefined'){
      res.send({
        code: 301,
        msg: '无效请求',
        count: 0
      })
      return 
   }
        pool.getConnection((err, connection) => {
          connection.query(save.getSaveByUid, +id, (err, result) => {
            if(err){
              res.send({
                code: 500,
                msg: '服务器错误',
              })
              throw err
            }else{
              res.send({
                code: 200,
                count: result.length,
              })
            } 
             connection.release();
          })
        })
    }
}

module.exports =  saveData 
