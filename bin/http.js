const app = require("../app");
const http = require("http");
const server = http.createServer(app);
const port = +process.env.PORT;

server.listen(port, () => console.log("this server run in port :", port));
