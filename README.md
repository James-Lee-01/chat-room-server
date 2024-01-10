# 聊聊不留痕 - Secret Chat Room (Server)
Secret Chat Room 是個基於 Socket.io 建立的無痕聊天的網站，UI 使用 Material UI (MUI) 建立。內容具有公開聊天室及私人聊天室，離開聊天室後，訊息自動消去不留痕。

此repo為該網站對應後端，使用 Express 和 Socket.io 開發。

## Website - 網站展示
- [聊聊不留痕網站 Secret Chat Room](https://chat-room-client-two.vercel.app/)
- [前端 repo](https://github.com/James-Lee-01/chat-room-client)


## Setup and Activation - 環境建置與啟用
1. 請先確認已安裝 Node.js 與 npm。
2. 開啟終端機(Terminal)進入到存放後端專案的本機位置，執行以下將 **「後端」** 專案 clone ： 

   ```bash
   git clone https://github.com/James-Lee-01/chat-room-server.git
   ```
3. 進入存放此專案的資料夾，開啟之後，透過終端機輸入：

   ```bash
   npm install
   ```
    `.env` 檔案的設置為
    ```
    REACT_APP_ORIGIN = 前端對應網址
    ```

4. 安裝完畢後，執行程式：
   ```bash
   node chatRoomServer.js
   ```

5. 出現紫下訊息則代表成功執行後端 server ：
   ```bash
   Server is running on port 3001
   ```

6. 若欲暫停使用 server 請執行以下：

   ```bash
   ctrl + c
   ```

## Development Tools - 開發工具
- Express: v4.18.2
- Socket.io: v4.7.2

