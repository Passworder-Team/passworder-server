const app = require("../app");
// const http = require("http");
// const server = http.createServer(app);
// const port = +process.env.PORT;

// server.listen(port, () => console.log("This server run on port :", port));

const fs = require('fs');
const http = require('http');
const https = require('https');
// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/api-passworder.nafies.tech/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/api-passworder.nafies.tech/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/api-passworder.nafies.tech/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

