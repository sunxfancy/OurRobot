
import {turlingApi, turlingKey} from '../conf'

export = (robot) => {
    robot.respond(/[\u4E00-\u9FA5\uF900-\uFA2D]+/, msg => {
        let user = msg.message.user.name
        // console.log(hashCode(user))
        robot.http(turlingApi).post(JSON.stringify({
            key: turlingKey,
            info: msg.message.text,
            userid: hashCode(user)
        }))((err, res, body) => {
            if (!err) {msg.send(JSON.parse(body).text)}
            else msg.send(err)
        })
    })
}

function hashCode(str) {
	var hash = 0;
	if (str.length == 0) return hash;
	for (let i = 0; i < str.length; i++) {
		let char = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash.toString();
}
