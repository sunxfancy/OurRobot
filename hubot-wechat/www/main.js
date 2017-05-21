var express = require('express');
var path = require('path');
var cp = require('child_process');
var fs = require('fs');
var bodyParser = require('body-parser')

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

app.listen(11611, function () {
  console.log('app listening on port 11611!')
})