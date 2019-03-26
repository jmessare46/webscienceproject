const express = require('express');
const Mclient = require("mongodb").MongoClient;
var bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const user = "mongodb+srv://generalcustomer:customer@cluster0-yknsv.mongodb.net"; 
const vendor = "mongodb+srv://generalvendor:thegeneralamazingvendor@cluster0-yknsv.mongodb.net"; 
const dbname = "Project";

const userclient = new Mclient(user, {useNewUrlParser:true});
const vendorclient = new Mclient(vendor, {useNewUrlParser:true});

var c1 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});
var c2 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});
var c3 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});

// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

c1.connect((err)=>
{
  if (err)
  {
    console.log("Could not connect to admin account");
    throw err;
  }
  else
  {
    let db = c1.db(dbname);
    db.listCollections({"name":"users"},{"nameOnly":true}).toArray((err, n)=>
    {
      if (n.length == 0)
      {
        db.createCollection("users", {validator:
          {
            $jsonSchema:{
              bsonType: "object",
              required:["username", "email", "password", "country"],
              properties:
              {
                username:
                {
                  bsonType: "string",
                  description:"must be a string and is required"
                },
                email:
                {
                  bsonType: "string",
                  description:"must be a string and is required"
                },
                password:
                {
                  bsonType:"string",
                  description:"must be a hashed string and is required"
                },
                country:
                {
                  bsonType: "string",
                  description:"must be a string and is required"
                },
                salt:
                {
                  bsonType:"string",
                  description:"must be a string and is required"
                },
                favorites:
                {
                  bsonType:["objectId"],
                  description:"must be an array of objectId referingt to stores and is required"
                },
                filter:
                {
                  bsonType:["string"],
                  description:"must be an array of filter strings and is required"
                },
                store_owner:
                {
                  bsonType:"bool",
                  description:"must be a boolean telling whether a user is a store owner and is required"
                },
                history:
                {
                  bsonType:["object"],
                  description:"must be an array of past purchasing history"
                },
                profile_image:
                {
                  bsonType:"string",
                  description:"must be a string as a file path to an iamge, and is not required"
                },
                flex:
                {
                  bsonType:"double",
                  description:"must be a double and is required"
                },
                swipe:
                {
                  bsonType:"int",
                  description:"must be an integer and is required"
                }
              }
            }
          }
        }, (err1, collection)=>
        {
          console.log("'users' collection created!");
          collection.createIndex({"email":1}, {unique:true}, (err2, result)=>
          {
            if (err2)
            {
              console.log("Could not make 'users' collection")
              throw err2;
            }
            else
            {
              console.log("Successfully made user emails unique");
            }
            c1.close();
          });
        });
      }
      else
      {
        console.log("'users' collection already exists!");
        c1.close();
      }
    });
  }
});

c2.connect((err)=>
{
  if (err)
  {
    console.log("Could not connect to admin account");
    throw err;
  }
  else
  {
    let db = c2.db(dbname);
    db.listCollections({"name":"shops"}, {"nameOnly":true}).toArray((err, n)=>
    {
      if (n.length == 0)
      {
        db.createCollection("shops", {
          validator:
          {
            $jsonSchema:{
              bsonType: "object",
              required:["owner", "location", "products", "description", "name"],
              properties:
              {
                name:
                {
                  bsonType:"string",
                  description:"must be a string for the store name and is required"
                },
                owner:
                {
                  bsonType: ["objectId"],
                  description:"must be an array of objectId refering to its owners and is required"
                },
                location:
                {
                  bsonType:["double"],
                  description:"must be an array of [lat, lon] coordinates and is required"
                },
                products:
                {
                  bsonType:["objectId"],
                  description:"must be an array of product objectId's that exist in the entire database(checked on insertion) and is required"
                },
                description:
                {
                  bsonType:"string",
                  description:"must be a string and is required"
                },
                picture:
                {
                  bsonType:"binData",
                  description:"must be a binData to store the picture and is not requred"
                }
              }
            }
          }
        }, (err1, collection)=>
        {
          console.log("'shops' collection created!");
          c2.close();
        });
      }
      else
      {
        console.log("'shops' collection already exists");
        c2.close();
      }
    });
  }
});

c3.connect((err)=>
{
  if (err)
  {
    console.log("Could not connect to admin account");
    throw err;
  }
  else
  {
    let db = c3.db(dbname);
    db.listCollections({"name":"products"}, {"nameOnly":true}).toArray((err, n)=>
    {
      if (n.length == 0)
      {
        db.createCollection("products", {
          validator:
          {
            $jsonSchema:{
              bsonType: "object",
              required:["name", "price", "stores"],
              properties:
              {
                name:
                {
                  bsonType: "string",
                  description:"must be a string and is required"
                },
                price:
                {
                  bsonType:"double",
                  description:"must be a double  and is required"
                },
                stores:
                {
                  bsonType:["objectId"],
                  description:"must be an array of store objectId's that exist in the entire database(checked on insertion) and is required"
                },
                description:
                {
                  bsonType:"string",
                  description:"must be a string and is required"
                },
                picture:
                {
                  bsonType:"binData",
                  description:"must be a binData to store the picture and is not requred"
                }
              }
            }
          }
        }, (err1, collection)=>
        {
          console.log("'products' collection created!");
          collection.createIndex({"name":1}, {unique:true}, (err2, result)=>
          {
            if (err2)
            {
              console.log("Could not make 'products' collection")
              throw err2;
            }
            else
            {
              console.log("Successfully made product names unique");
            }
            c3.close();
          });
        });
      }
      else
      {
        console.log("'products' collection already exists");
        c3.close();
      }
    });
  }
});

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

// Creates a user in the database when correct information is given
app.post('/user/create', (req, res)=>
{
  var c4 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});

  // TODO: May want to validate some of the data before we store the user here
  c4.connect(err => {
      // Creates a password hash
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const collection = c4.db("Project").collection("users");

        var user = {
          email: req.body.email,
          username: req.body.user,
          country: req.body.country,
          password: hash
        };

        console.log(user);

        // Stores the user in the DB
        collection.insertOne(user, function (err, docs) {
          console.log("User created...");
        });
      });

      // Sends user back to the registration page
      res.redirect('/register');
    });

  c4.close();
});

// Authenticates a user at the login page
app.post('/user/auth', (req, res)=>
{
  var c4 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});

  c4.connect(err => {

    const collection = c4.db("Project").collection("users");

    console.log(req.body);

    c4.connect(err => {
      // Stores the user in the DB
      collection.findOne({email: req.body.email}, function (err, docs) {
        console.log(docs);
        // Load hash from your password DB.
        bcrypt.compare(req.body.password, docs.password, function(err, bres) {
          // res == true or false
          if(bres)
          {
            res.redirect('/');
          }
          else
          {
            res.redirect('/login');
          }
        });
      });
    });
  });

  c4.close();
});

app.listen(3000, ()=>
{
  console.log("Server is up");
});
