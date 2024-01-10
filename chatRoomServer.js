const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);

const originUrl = process.env.REACT_APP_ORIGIN || 'http://localhost:3000';

// 設定 CORS 配置
const io =  new Server(server, {
  cors: {
    origin: originUrl, // 允許來自這個來源的請求
    methods: ["GET", "POST"],
    credentials: true, // 如果需要傳送 cookies，請設定為 true
  }
});

//儲存已連線的用戶和他們所在的聊天室
const connectedUsers = new Map();

// 處理 Socket.io 連線
io.on('connection', (socket) => {
  // 監聽加入房間的請求
  socket.on('join room', ({userId, username, roomName}) => {
    socket.join(roomName);
    // 將用戶加入特定房間
    connectedUsers.set(socket.id, {userId, username, roomName});
    console.log(`User: ${username} connected id: ${userId} to room: ${roomName}`);

    // 通知房間內用戶有人加入並回傳其資訊
    io.to(roomName).emit('user joined', { userId, username });

    // 廣播在線使用者列表給特定房間
    const onlineUsers = Array.from(connectedUsers.values())
      .filter(user => user.roomName === roomName)
      .map(user => ({ userId: user.userId, username: user.username }));

    io.to(roomName).emit('online users', onlineUsers);
  });

  // 監聽主動離開房間的請求
  socket.on('leave room', ({userId, roomName}) => {
    console.log(`User disconnected with id: ${userId} from room: ${roomName}`);
    //通知房間內的用戶有人離開
    //從Map中根據 Socket.id 取得使用者的相關資訊。
    const user = connectedUsers.get(socket.id);
    io.to(roomName).emit("user left", { userId, username: user.username });

    socket.leave(roomName);
    // 從房間中移除用戶
    connectedUsers.delete(socket.id);

    // 廣播在線使用者列表給特定房間
    const onlineUsers = Array.from(connectedUsers.values())
      .filter(user => user.roomName === roomName)
      .map(user => ({ userId: user.userId, username: user.username }));

    io.to(roomName).emit('online users', onlineUsers);
    
  });

  
  // 監聽發送的聊天訊息事件
  socket.on('chat message', (messageString) => {
    const message = JSON.parse(messageString);
    // 確認發送訊息的用戶所在的房間
    const roomName = message.room;
    // 將接收到的訊息廣給特定房間的客戶端
    io.to(roomName).emit("chat message", { ...message });
  });

  // 當客戶端被動斷線時(關閉視窗)
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const { userId, username, roomName } = user;
      io.to(roomName).emit("user left", { userId, username });

      console.log(`User ${username} disconnected ${userId} from room ${roomName}`);

      socket.leave(roomName);
      connectedUsers.delete(socket.id);
    }
  });
});

// 設定伺服器的 port
const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
