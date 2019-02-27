const express = require('express');

const app = express();

app.use('/', express.static(__dirname + '/'));
app.get('/inventory', (req, res)=>
{
  res.sendFile(__dirname + '/inventory.html');
});

app.listen(3000, ()=>
{
  console.log("Server is up");
});
