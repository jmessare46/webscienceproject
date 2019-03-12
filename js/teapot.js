const express = require('express');
const app = express();
const server = require('http').createServer(app);

app.use('/', express.static(__dirname));

app.get('/teapot', (req, res)=>
{
  res.sendStatus(418);
});

server.listen(3000, ()=>
{
  console.log("Started Server! Listening on port 3000.");
});