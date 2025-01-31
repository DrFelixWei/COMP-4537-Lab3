const http = require('http');
const fs = require('fs');
const { Utils } = require('./modules/utils');
const messages = require('./locals/en.json');

class Server {
  constructor(port) {
    this.port = port;
    this.utils = new Utils();
  }

  start() {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://${req.headers.host}`);

      if (url.pathname === '/COMP4537/labs/3/getDate/' && url.searchParams.has('name')) {
        this.handleGetDate(url, res);
      } else if (url.pathname === '/COMP4537/labs/3/writeFile/' && url.searchParams.has('text')) {
        this.handleWriteFile(url, res);
      } else if (url.pathname.startsWith('/COMP4537/labs/3/readFile/')) {
        this.handleReadFile(url, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<div style="color: red;">Error: Invalid Request</div>');
      }
    });

    server.listen(this.port, () => {
      console.log(`Server running at ${this.port}/`);
    });
  }

  handleGetDate(url, res) {
    const name = url.searchParams.get('name');
    const dateTime = this.utils.getDate();
    const message = messages.welcomeMessage.replace('%1', name).replace('%2', dateTime);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<div style="color: blue;">${message}</div>`);
  }

  handleWriteFile(url, res) {
    const text = url.searchParams.get('text');
    const filePath = 'file.txt';

    fs.appendFile(filePath, text + '\n', (err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<div style="color: red;">Error writing to file</div>');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<div style="color: green;">Text successfully appended to file.txt</div>');
    });
  }

  handleReadFile(url, res) {
    const filePath = url.pathname.replace('/COMP4537/labs/3/readFile/', '');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`<div style="color: red;">Error: File not found (${filePath})</div>`);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<pre>${data}</pre>`);
    });
  }
}

const port = 3000;
const app = new Server(port);
app.start();
