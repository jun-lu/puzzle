var http = require('http');

http.createServer(function (req, res) {

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello Node.js\n');
	
}).listen(8124);

/*
	nohup 命令 &
	netstat -untpl  查看全部进程
	killall 进程名字 杀死进程
	kill -9 pid  杀死指定ID进程
*/