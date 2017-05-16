
export = function (robot) {
    robot.hear(/hello/i, res => res.send('你好啊~'))
}