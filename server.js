const express = require('express');
const Mclient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
var bodyParser = require("body-parser");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var readline = require("readline");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const app = express();
const user = "mongodb+srv://generalcustomer:customer@cluster0-yknsv.mongodb.net/"; 
const vendor = "mongodb+srv://generalvendor:thegeneralamazingvendor@cluster0-yknsv.mongodb.net/"; 
const dbname = "Project";

const userclient = new Mclient(user, {useNewUrlParser:true});
const vendorclient = new Mclient(vendor, {useNewUrlParser:true});
userclient.connect((err)=>
{
  if (err)
  {
    console.log("Could not connect to Db using userclient!");
    throw err;
  }
});
vendorclient.connect((err)=>
{
  if (err)
  {
    console.log("Could not connect to Db using vendorclient!");
    throw err;
  }
});


var c1 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});
var c2 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});
var c3 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});

// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'web_science',
  secret: 'shooping',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.web_science && !req.session.user) {
    res.clearCookie('web_science');
  }
  next();
});

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
              required:["username", "email", "password", "account_type", "first_name", "last_name", "favorite_store", "vegan", "peanut", "gluten", "vegetarian"],
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
              console.log("Could not make 'users' collection");
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
              required:["owner", "location", "description", "name"],
              properties:
              {
                name:
                {
                  bsonType:"string",
                  description:"must be a string for the store name and is required"
                },
                owner:
                {
                  bsonType: "objectId",
                  description:"must be an array of objectId refering to its owners and is required"
                },
                location:
                {
                  bsonType:"array",
                  items:
                  {
                    "type":"number",
                    "minItems":2,
                    "maxItems":2
                  },
                  description:"must be an array of [lat, lon] coordinates and is required"
                },
                description:
                {
                  bsonType:"string",
                  description:"must be a string and is required"
                },
                picture:
                {
                  bsonType:"string",
                  description:"must be a string to store the picture url and is not requred"
                }
              }
            }
          }
        }, (err1, collection)=>
        {
          if (err1) throw err1;
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
              required:["name", "price", "store"],
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
                store:
                {
                  bsonType:"objectId",
                  description:"must be a store's objectId that exist in the entire database(checked on insertion) and is required"
                },
                description:
                {
                  bsonType:"string",
                  description:"must be a string and is required"
                },
                picture:
                {
                  bsonType:"string",
                  description:"must be a string to store the path to the picture and is not requred"
                }
              }
            }
          }
        }, (err1, collection)=>
        {
          console.log("'products' collection created!");
          /*collection.createIndex({"name":1}, {unique:true}, (err2, result)=>
          {
            if (err2)
            {
              console.log("Could not make 'products' collection");
              throw err2;
            }
            else
            {
              console.log("Successfully made product names unique");
            }
            c3.close();
          });*/
          c3.close();
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

// Links the routes to the main js page
var routes = require('./routes.js');

app.use('/', routes);

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

app.get("/temp", (req, res)=>
{
  //add_update_product(ObjectId("5cac14c3e52ab45423d33424"), {"name" : "orange", "price" : 0.5, "store" : ObjectId("5cac14c3e52ab45423d33424")}, "add", res);
  //all_products(res);
  //find_shop("hi", res);
  //specific_vendor_shops(ObjectId("5cac099386d1af000008fe16"), res);
  //product_search("orange", res);
  shop_products(ObjectId("5cac14c3e52ab45423d33424"), res);
});

const server = app.listen(3000, ()=>
{
  console.log("Server is up");
});

// Server shutdown code
// Code to get the server to terminate in the console when pressing the Esc key
process.stdin.on("keypress", (str, key) => 
{
  if (key.name == "c" && key.ctrl)
  {
    console.log("Closing DB connections.");
    userclient.close((err, result)=>
    {
      if (err)
      {
        console.log("Error occurred in closing connection to userclient");
        throw err;
      }
      console.log("Closed userclient");
      vendorclient.close((err1, result1)=>
      {
        if (err)
        {
          console.log("Error occurred in closing connection to vendorclient");
          throw err;
        }
        console.log("Closed vendorclient");
        server.close(()=>
        {
          console.log("Terminating Server!");
          process.exit(0);
        });
      });
    });
  }
});

//NOTE: need to convert ObjectId strings to ObjectId before passing into functions

/**
* @param shop_id is an Object_id of the shop
* @param shop_info is a JSON object matching the required fields for a shop document
* @param res is the response handler object
* @modifies res
* @effects returns a response message through res.
*/
function update_shop_information(shop_id, shop_info, res)
{
  res.setHeader("Content-Type", "text/plain");
  vendorclient.db(dbname).collection("shops", (err, shops_collection)=>
  {
    if (err)
    {
      res.status(500).send("Could not connect to Database collection. Please try again later!");
    }
    else
    {
      shops_collection.updateOne({"_id":shop_id}, shop_info, (err1, result)=>
      {
        if (err1)
        {
          res.status(500).send("Could not update store information. Please try again later!");
        }
        else
        {
          res.status(200).send("Store information successfully updated!");
        }
      });
    }
  });
}

/**
* @param shop_id is the ObjectId of the specific shop to add/update the product to
* @param product_data is the product object that matches the document fields for all the products
* @param operation is a string defining the operation to perform
* @res is the response object
* @modifies products
* @effects either adds the product_data as a new document if operation == "add" and the shop associated
*          with the product_data exists and the product is not a duplicate for the same store.
*          otherwise, if operation == "update" updates the product information in 'products' collection
*          otherwise, sends a response of an invalid operation
*/
function add_update_product(shop_id, product_data, operation, res)
{
  res.setHeader("Content-Type", "text/plain");
  vendorclient.db(dbname).collection("products", (err, products_collection)=>
  {
    if (err)
    {
      res.status(500).send("Could not connect to Database collection. Please try again later!");
    }
    else
    {
      if (operation == "add")
      {
        // Check if product already exists
        products_collection.find({"name":product_data["name"], "store":shop_id}).toArray((err1, doc)=>
        {
          if (err1)
          {
            res.status(500).send("A server error occurred. Please try adding this item later.");
          }
          else
          {
            if (doc.length == 0)
            { // If product doesn't exist, assume that the store id is valid and add it
              products_collection.insertOne(product_data, (err2, result)=>
              {
                if (err2)
                {
                  res.status(500).send("Could not add item. Please try again.");
                }
                else
                {
                  res.status(200).send(product_data["name"] + " successfully added!");
                }
              });
            }
            else
            {
              res.status(400).send("Item already exists!");
            }
          }
        });
      }
      else if (operation == "update")
      {
        product_collection.updateOne({"_id":product_data["_id"]}, product_data, (err3, result)=>
        {
          if (err3)
          {
            res.status(500).send("Error occurred. Could not update " + product_data["name"] + " information.");
          }
          else
          {
            // Success so don't interrupt the user.
            res.status(200).send();
          }
        });
      }
      else
      {
        res.status(501).send("The server does not support the " + operation + " operation!");
      }
    }
  });
}

/*function get_owned_shops(ownerid)
{

}*/

/** Function to find out all the shops in the database
* @param response is the response handler from the post request
* @modifies response
* @effect response sends back either an error message in plain text or
*         a json of {"data":[...]} that contains an array of {"_id", "name"}
*         json objects                            store _id and store name
*/
function list_all_shops(response)
{
  userclient.db(dbname).collection("shops", (err, shop_collection)=>
  {
    response.setHeader("Content-Type", "text/plain");
    if (err)
    {
      response.status(500).send("Error accessing to shop collections.");
      throw err;
    }
    else
    {
      shop_collection.find({}, {"projection":{"name":1}}).toArray((err1, list)=>
      {
        if (err1)
        {
          response.status(500).send("Error reading from shpo collections.");
          throw err1;
        }
        else
        {
          response.setHeader("Content-Type", "application/json");
          response.status(200).send("{\"data\":[" + list.toString() + "]}");
        }
      });
    }
  });
}

/**function to find out all the products in the database
* @param response is the response object from a request
* @modifies response
* @effect response sends back either an error message or a json of 
*         a json of {"data":[...]} that contains an array of {"_id", "name"}
*         json objects                           product _id and product name
*/
function list_all_products(response)
{
  userclient.db(dbname).collection("products", (err, product_collection)=>
  {
    response.setHeader("Content-Type", "text/plain");
    if (err)
    {
      response.status(500).send("Error accessing to shop collections.");
      throw err;
    }
    else
    {
      product_collection.find({}, {"projection":{"name":1}}).toArray((err1, list)=>
      {
        if (err1)
        {
          response.status(500).send("Error reading from product collections.");
          throw err1;
        }
        else
        {
          response.setHeader("Content-Type", "application/json");
          response.status(200).send("{\"data\":[" + list.toString() + "]}");
        }
      });
    }
  });
}

/** function to find a specific shop in the database by shop name
* @param shop_name is a string denoting the name of the shopt of ind
* @param response is the response object
* @modifes response
* @effect response sends back either an error message or a json of 
*         {"found":bool, [shopinfo objects]} or a plain text error
*/
function find_shop_by_name(shop_name, response)
{
  response.setHeader("Content-Type", "text/plain");
  userclient.db(dbname).collection("shops", (err, shop_collection)=>
  {
    if (err)
    {
      response.status(500).send("Error accessing shop collections.");
    }
    else
    {
      shop_collection.find({"name":shop_name}).toArray((err1, result)=>
      {
        if (err1)
        {
          response.status(500).send("Error reading shop collections");
        }
        else
        {
          response.setHeader("Content-Type", "application/json");
          if (result.length == 0)
          {
            response.status(200).send({"found":false});
          }
          else
          {
            response.status(200).send({"found":true, "data":result});
            console.log(result);
          }
        }
      });
    }
  });
}

/** function to find a list of all the shops a specific vendor owns
* @param vendor_id is an ObjectId relating to a valid vendor
* @param response is the response object
* @modifies response
* @effect response sends json object of {"data":[{_id:, name:}]} pertaining to the
*         shops that vendor_id owns
*/
function list_specific_vendor_shops(vendor_id, response)
{
  response.setHeader("Content-Type", "text/plain");
  userclient.db(dbname).collection("shops", (err, shop_collection)=>
  {
    if (err)
    {
      console.log("Error accessing shop collection so halt application");
      throw err;
    }
    else
    {
      shop_collection.find({"owner":vendor_id}, {"projection":{"nameOnly":1}}).toArray((err1, shops)=>
      {
        if (err1)
        {
          console.log("Error reading shop collection so halt application");
          throw err1;
        }
        else
        {
          response.setHeader("Content-Type", "application/json");
          response.status(200).send({"data":shops});
        }
      });
    }
  });
}

/** function to find a product by product name
* @param product_name is a string of the product name
* @param response the response object
* @modifies response
* @effects response sends back a json of {"found":bool, [product data]} for all
*          the products with the same name as product_name
*          {"found":false, "message"} if something occurred
*/
function product_search_by_name(product_name, response)
{
  response.setHeader("Content-Type", "application/json");
  userclient.db(dbname).collection("products", (err, prod_collection)=>
  {
    if (err)
    {
      response.status(500).send({"found":false, "message":"Error accessing product collections"});
    }
    else
    {
      prod_collection.find({"name":product_name}).toArray((err1, results)=>
      {
        if (err1)
        {
          response.status(500).send({"found":false, "message":"Error reading product collections"});
        }
        else
        {
          response.setHeader("Content-Type", "application/json");
          response.status(200).send({"found":true, "data":results});
        }
      });
    }
  });
}

/** function to find all the products owned by a shop base don the shopid
* @param shop_id is the ObjectId of a shop
* @param response is the response object
* @modifies response
* @effects response sends a json object of {"data":[product info]}
*          Notes that "message":"usefull message" will be sent back
*/
function list_shop_products(shop_id, response)
{
  response.setHeader("Content-Type", "application/json");
  userclient.db(dbname).collection("products", (err, prod_collection)=>
  {
    if (err)
    {
      response.status(500).send({"message":"Error occurred. Could not access product collection."});
    }
    else
    {
      prod_collection.find({"store":shop_id}).toArray((err1, results)=>
      {
        if (err1)
        {
          response.status(500).send({"message":"Error occurred. Could not read product collection."});
        }
        else
        {
          response.status(200).send({"message":"Found " + results.length + " results.", "data":results});
        }
      });
    }
  });
}
