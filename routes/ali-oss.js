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
        let fileName = Date.now() + '.png';
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