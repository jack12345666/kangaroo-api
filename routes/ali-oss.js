let express = require('express');
let router = express.Router();
let OSS = require('ali-oss')
let client = new OSS({
	region: 'oss-cn-hangzhou',//阿里云对象存储地域名
	accessKeyId: 'LTAI4FeDftBXQdzfFPrLnSdy',//api接口id
	accessKeySecret: 'oq9bbUCSP7jumbsqk2WOxTTsHwghDJ ',//api接口密码
})
client.useBucket('kangaroo-app')//使用的存储桶名

router.post('/uploadOss', async (req, res) => {
    try {
        var fileName = ''
        if(req.fields.type === 'video'){
             fileName =`${req.fields.type}/`+ Date.now() + '.mp4';
        }else if(req.fields.type === 'img' || req.fields.type === 'avater'){
            if(req.files.file.type === 'image/jpeg') {
                fileName =`${req.fields.type}/`+ Date.now() + '.jpg';
            }else if(req.files.file.type === 'image/png') {
                fileName =`${req.fields.type}/`+ Date.now() + '.png';
            }else if(req.files.file.type === 'image/gif') {
                fileName =`${req.fields.type}/`+ Date.now() + '.gif';
            }else {
                fileName =`${req.fields.type}/`+ Date.now() + '.png';
            }
            
        }else if(req.fields.type === 'mp3'){
            fileName =`${req.fields.type}/`+ Date.now() + '.mp3';
        }
        let result = await client.put(fileName, req.files.file.path)
        if(result){
            res.send({
                code: 200,
                msg: '上传成功',
                data: result.url
            })   
        }else{
            res.send({
                code: 101,
                msg: '上传失败'
            })
        }
        } catch (err) {
            console.log(err)
        }
     
})

module.exports = router;