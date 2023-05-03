const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require("path");
const express = require("express");

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

try {
  console.log("BEFORE prepare")
  app.prepare().then(() => {
    const server = express();
  
    console.log("BEFORE use")
    // Serve static files from the uploads folder
    server.use(express.static('public'));
  
    console.log("BEFORE handle")
    // Handle all other requests with Next.js
    server.all('*', (req, res) => {
      return handle(req, res);
    });
  
    const httpServer = createServer(server);
  
    console.log("BEFORE LISTEN")
    httpServer.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  }).catch(e => {
    console.log("PREPARE CATCH");
    console.error(e);
  })
} catch (error) {
  console.log("error")
  console.error(error);
}

console.log("end")