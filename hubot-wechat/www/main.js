'use strict';

var express = require('express');
var path = require('path');
var cp = require('child_process');
var fs = require('fs');
var bodyParser = require('body-parser');
var axios = require('axios');
// import axios from 'axios'
// const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support');
// const tough = require('tough-cookie');

// axiosCookieJarSupport(axios);

/// setup express and public resources
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

/// use bodyParser for post data parse
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


/// load website json configuration
var config_json = path.join(__dirname, '..', 'config.json');
var config = {};
if (!fs.existsSync(config_json)) 
    fs.writeFileSync(config_json, JSON.stringify({}));
else config = JSON.parse(fs.readFileSync(config_json, "utf-8"));

function save_config() {
    fs.writeFileSync(config_json, JSON.stringify(config));
}

/// running status 
var running = {};




// list all adapters' status
app.get('/list', function(req, res) {
    res.send({err: 0, status: running});
});

// start an adapter for the robot
app.post('/start/:adapter', function (req, res) {
    var adapter = req.params.adapter;

    if (!(config.name || (config[adapter] && config[adapter].name))) {
        return res.send({err: 201, msg: '通用名字和adapter名字均未设置'});
    }

    var hubot = path.join(__dirname, '..', 'node_modules', '.bin', 'hubot');
    var subenv = {};
    for (var index in process.env) subenv[index] = process.env[index];
    subenv.PATH = 'node_modules/.bin:node_modules/hubot/node_modules/.bin:'+process.env.PATH;
    cp.execFile(hubot, ['--name', config[adapter].name, '-a', adapter], { env: subenv }, function(err, stdout, stderr) {
        console.log(err, stdout);
        running[adapter] = 'running';
    })
    running[adapter] = 'startup';
    
    res.send({err: 0});
});

// stop an adapter
app.post('/stop/:adapter', function (req, res) {
    var adapter = req.params.adapter;
    running[adapter] = 'stop';
    res.send({err: 0});
});


// set the cookie of wechat
app.post('/wechat/cookie', function (req, res) {
    res.send({err: 0});
});

app.post('/name', function (req, res) {
    
    res.send({err: 0});
});

app.post('/name/:adapter', function (req, res) {
    
    res.send({err: 0});
});

app.get('/history', function (req, res) {
    var history = fs.readFileSync(path.join(__dirname, '..', '.hubot_history'), 'utf-8');
    var data = history.split('\n');
    res.send({err: 0, history: data});
});


app.get('/login', function (req, res) {
    var jslogin = "https://login.wx.qq.com/jslogin?appid=wx782c26e4c19acffb&redirect_uri=https%3A%2F%2Fwx.qq.com%2Fcgi-bin%2Fmmwebwx-bin%2Fwebwxnewloginpage&fun=new&lang=en_US&_=";
    axios.get(jslogin+new Date().getTime()).then(async v => {
        if (v.status != 200) return res.send({err: 100, msg: '登录错误，jslogin接口异常'})
        var window = {QRLogin: {}};
        eval(v.data);
        res.send(window.QRLogin);
    });
});

app.get('/login/:uuid', function (req, res) {
    if (config.wechat) return res.send(config.wechat);
    var cgi = "https://login.weixin.qq.com/cgi-bin/mmwebwx-bin/login?loginicon=false&uuid="+ req.params.uuid +"&tip=0&r=-1890169253";
    console.log(cgi);
    axios.get(cgi).then(async v => {
        if (v.status != 200) return res.send({err: 101, msg: '登录错误，cgi接口异常'})
        console.log(v.headers['set-cookie']);
        var window = {};
        eval(v.data);
        if (window.redirect_uri) {
            console.log(window.redirect_uri);
            var ret = await axios.get(window.redirect_uri+"&fun=new&version=v2");
            if (ret.status == 200) {
                console.log(ret.data);
                config.wechat = ret.data;
            }
        }
        res.send(window);
    });
});



app.listen(11611, function () {
  console.log('app listening on port 11611!')
})