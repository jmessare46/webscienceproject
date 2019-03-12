const express = require('express');

const app = express();

// Allows direct access to stylesheet files
app.use('/css', express.static(__dirname + '/css'));

// Allows direct access to js files
app.use('/js', express.static(__dirname + '/js'));

// Allows direct access to js files
app.use('/images', express.static(__dirname + '/images'));

// Allows direct access to js files
app.use('/vendors', express.static(__dirname + '/vendors'));

// Allows direct access to js files
app.use('/fonts', express.static(__dirname + '/fonts'));

app.get('/', (req, res)=>
{
  res.sendFile(__dirname + '/index.html');
});

app.get('/inventory', (req, res)=>
{
  res.sendFile(__dirname + '/inventory.html');
});

app.get('/login', (req, res)=>
{
  res.sendFile(__dirname + '/login.html');
});

app.get('/register', (req, res)=>
{
  res.sendFile(__dirname + '/register.html');
});

app.get('/request', (req, res)=>
{
  res.sendFile(__dirname + '/request.html');
});

app.get('/storeinfo', (req, res)=>
{
  res.sendFile(__dirname + '/storeinfo.html');
});

app.get('/price', (req, res)=>
{
  res.sendFile(__dirname + '/price.html');
});

app.get('/navigation', (req, res)=>
{
  res.sendFile(__dirname + '/navigation.html');
});

app.get('/sidebar', (req, res)=>
{
  res.sendFile(__dirname + '/sidebar.html');
});

app.listen(3000, ()=>
{
  console.log("Server is up");
});
