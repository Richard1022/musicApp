var express = require('express');
var config = require('./config/index');
var axios = require('axios');

var app = express()
var apiRoutes = express.Router();

apiRoutes.get('/getDiscList', function (req, res) {
    var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com' //从真实的QQ的服务器地址通过axios发送一个http请求 同事修改refer host,修改成QQ相关refer,host;
        },
        params: req.query  //将浏览器端发来的请求参数 头传给服务端,QQ服务端响应
    }).then((response) => {
        res.json(response.data) // 在把响应的内容 通过res.json 发送到输出到浏览器端
    }).catch((e) => {
        console.log(e)
    })
});
apiRoutes.get('/getLyric', function (req, res) {
    var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com' //从真实的QQ的服务器地址通过axios发送一个http请求 同事修改refer host,修改成QQ相关refer,host;
        },
        params: req.query  //将浏览器端发来的请求参数 头传给服务端,QQ服务端响应
    }).then((response) => {
        var ret = response.data;
        if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/;
            var matched = ret.match(reg); //正则匹配转换成json
            if (matched) {
                ret = JSON.parse(matched[1]);
            }
        }
        res.json(ret);//通过res.json输出
    }).catch((e) => {
        console.log(e)
    })
});

apiRoutes.get('/getSongMenu', function (req, res) {
    var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com' //从真实的QQ的服务器地址通过axios发送一个http请求 同事修改refer host,修改成QQ相关refer,host;
        },
        params: req.query  //将浏览器端发来的请求参数 头传给服务端,QQ服务端响应
    }).then((response) => {
        res.json(response.data) // 在把响应的内容 通过res.json 发送到输出到浏览器端
    }).catch((e) => {
        console.log(e)
    })
});

app.use('/api', apiRoutes) //代理异步请求

app.use(express.static('./dist')) // 静态资源目录

var port = process.env.PORT || config.build.port; // 环境配置端口号|| config port
module.exports = app.listen(port,function(err){
    if(err){
        console.log(err);
        return;
    };
    console.log('listening at localhost:'+port+'!');
});