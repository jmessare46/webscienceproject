const express = require("express");
const app = express();
const Mclient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017";
const dbname = "Project";

Mclient.connect(url, (err, client)=>
{
  if (err)
  {
    console.log("error occurred");
    throw err;
  }
  else
  {
    // specify db to use
    let db = client.db(dbname).admin();
    db.collection("Shops", (err, collection)=>
    {
      if (err)
      {
        console.log("fail");
        //tell user there is an error
      }
      else
      {
        collection.find().toArray((err, shops) => 
        {
          if (err)
          {
            // Tell user there is an error
            console.log("fail in array");
          }
          else
          {
            // shops is where all the items are.
            console.log("works");
          }
        });
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
})

// Query Shops
function getShops()
{

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
 */