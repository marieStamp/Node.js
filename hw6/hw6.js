const socket = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    const readStream = fs.createReadStream(indexPath);

    readStream.pipe(res);
});

const io = socket(server);

let clientsAmount = 0;
   io.on('connection', function (socket) {
    clientsAmount++;
    io.emit('clients-amount', { clientsAmount });
    console.log('New connection');
    socket.broadcast.emit('connection-change', { msg: 'New user connected' });

    socket.on('client-msg', (data) => {
        io.emit('server-msg', { msg: data.msg, userName: data.userName});
    });

    socket.conn.on("close", (reason) => {
        socket.broadcast.emit('connection-change', { msg: 'One user disconnected' });
        clientsAmount--;
        io.emit('clients-amount', { clientsAmount });
    });
});

server.listen(5000);