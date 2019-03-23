const express = require("express");
const app = express();
const Mclient = require("mongodb").MongoClient;

const user = "mongodb+srv://generalcustomer:customer@cluster0-yknsv.mongodb.net"; 
const vendor = "mongodb+srv://generalvendor:thegeneralamazingvendor@cluster0-yknsv.mongodb.net"; 
const dbname = "Project";

const userclient = new Mclient(user, {useNewUrlParser:true});
const vendorclient = new Mclient(vendor, {useNewUrlParser:true});

var c1 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});
var c2 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});
var c3 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});
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
              required:["email", "password", "salt", "favorites", "filter", "store_owner", "history"],
              properties:
              {
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
                  description:"must be an array of filte strings and is required"
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
                }
                profile_iamge:
                {
                  bsonType:"string",
                  description:"must be a string as a file path to an iamge, and is not required"
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
              required:["owner", "location", "products", "description"],
              properties:
              {
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

app.use('/', express.static('/'));

app.get('/', (req, res)=>
{
  res.sendFile(__dirname + "/inventory.html");
})

app.listen(3000, ()=>
{
  console.log("server running");
  //addUser({"email":"ba@rpi.edu", "password":"123", "salt":"123", "favorites":[], "filter":[], "store_owner":false}); // Sample user
  /*vendorclient.connect((err)=>
  {
    client.db(dbname).collection("shops").insertOne({"owner":"test", "location":[1, 1], "products":[], "description":"hi"},(err, result)=>
      {
        if (err)
        {
          console.log("works");
        }
        console.log(result);
      });
    vendorclient.close();
  });*/
  //getAllShops();
})

function addUser(userinfo)
{
  userclient.connect((err)=>
  {
    if (err)
    {
      // Output error to front end
    }
    let db = userclient.db(dbname);
    let usertable = db.collection('users');
    // Check if email is already used
    usertable.findOne({"email":userinfo["email"]}, (err, result)=>
    {
      if (result == null)
      { // Add user since there is no existing user with that email
        usertable.insertOne(userinfo, (err, result)=>
        {
          if (err)
          {
            // tell the user that something happened and they couldn't create their account
          }
          else
          {
            // account successfully created, so tell the user in the front end
          }
        });
      }
      else
      {
        // Tell the user that the user already exists
      }
    });
    userclient.close();
  });
}

function getAllShops()
{
  userclient.connect((err)=>
  {
    userclient.db(dbname).collection('shops').find({},{"projection":{"location":1, "description":1, "picture":1}}).toArray((err, shops)=>
    {
      console.log(shops);
    });
    userclient.close();
  });
}

// Query Products
// Query Users for Login
// Modify Shops and Products at the same time
// Add to Users table for new User

/*Shops -- used for shop data
 - owner
 - location
 - Products
 - description
 - picture
 {
   "owner":"none",
   "location":[],
   "products":[],
   "description":"failed",
   "picture":"none"
 }

Users
 - email
 - password
 - salt
 - favorite stores
 - filter preferences
 {
   "email":"none",
   "salt":"none",
   "password":"stuff",
   "favorites":"stuff",
   "filter":[],
   "store_owner":false
 }

Products -- used for quick searching
 - name
 - price
 - stores
 - picture
 {
   "name":"orange",
   "price":500,
   "stores":["object_id's"],
   "picture":"none"
 }

 generalcustomer - customer
 generalvendor - thegeneralamazingvendor
 */

 /*
 db.createCollection("shops", {
      validator:
      {
        $jsonSchema:{
          bsonType: "object",
          required:["owner", "location", "products", "description"],
          properties:
          {
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
    })
 */

 function createDependencies(db)
 {
  return 0;
 }