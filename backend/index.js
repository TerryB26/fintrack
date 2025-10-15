// Minimal HTTP server to unblock start script; replace with your NestJS bootstrap when ready.
const http = require('http');

const port = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Backend running');
});

server.listen(port, () => {
  console.log(`Backend HTTP server listening on http://localhost:${port}`);
});
