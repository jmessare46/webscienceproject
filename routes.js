var express = require('express');
var router = express.Router();
const Mclient = require("mongodb").MongoClient;
const saltRounds = 10;
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;
const c4 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});
var users;
var shops;
var products;

c4.connect((err)=>
{
    if (err)
    {
        console.log("Could not connect to database using user client!");
        throw err;
    }
    else
    {
        users = c4.db("Project").collection("users");
        shops = c4.db("Project").collection("shops");
        products = c4.db("Project").collection("products");
    }
});


router.get('/', (req, res)=>
{
    if(req.session.user)
    {
        res.sendFile(__dirname + '/index.html');
    }
    else
    {
        res.redirect('/login');
    }
});

router.get('/inventory', (req, res)=>
{
    if(req.session.user)
    {
        res.sendFile(__dirname + '/inventory.html');
    }
    else
    {
        res.redirect('/login');
    }
});

router.get("/search", (req, res)=>
{
    if (req.session.user)
    {
        res.sendFile(__dirname + "/products.html");
    }
    else
    {
        res.redirect('/login');
    }
});

router.get('/login', (req, res)=>
{
    if(req.session.user)
    {
        res.redirect('/');
    }
    else
    {
        res.sendFile(__dirname + '/login.html');
    }
});

// Takes a user to the password reset page
router.get('/user/passreset', (req, res)=>
{
    res.sendFile(__dirname + '/resetpassword.html');
});

// Shows the user registration page
router.get('/user/register', (req, res)=>
{
    res.sendFile(__dirname + '/register.html');
});

// Shows the store registration page
router.get('/store/register', (req, res)=>
{
    res.sendFile(__dirname + '/request.html');
});

/*
 * Returns all of the logged in store owner's products
 */
router.get('/store/products', (req, res)=>
{
    if(req.session.user)
    {
        shops.findOne({owner: new ObjectId(req.session.userid)}, function (err, shop) {
            if(shop !== null)
            {
                // Finds all of the store's products
                products.find({store: new ObjectId(shop._id)}).toArray(function (err, products) {
                    res.send({
                        products: products
                    });
                });
            }
            else
            {
                res.send({
                    userdata: {
                        message: "Logged in user does not own a store",
                        error: err,
                    }
                });
            }
        });
    }
    else
    {
        res.redirect('/login');
    }
});

// Returns the logged in user's store information
router.post('/store/myinfo', (req, res)=>
{
    //TODO: Handle errors here
    // Searches for the user based off of email in the DB.
    shops.findOne({owner: new ObjectId(req.session.userid)}, function (err, docs) {
        if(docs !== null)
        {
            // Load hash from your password DB.
            res.send({
                userdata: docs,
            });
        }
        else
        {
            res.send({
                userdata: {
                    message: "Logged in user does not own a store",
                    error: err,
                }
            })
        }
    });
});

// Creates a user in the database when correct information is given
router.post('/store/update', (req, res)=>
{
    res.setHeader("Content-Type", "application/json");
    if(!req.session.user)
    {
        res.redirect('/login');
    }
    else
    {
        shops.updateOne({"owner":ObjectId(req.session.userid)},
                        {$set:
                            {
                                "name":req.body.store_name,
                                "category":req.body.category,
                                "address":req.body.address,
                                "location":req.body.location,
                                "description":req.body.description
                            }
                        }, (err, result)=>
                        {
                            if (err)
                            {
                                res.status(500).send({"message":"Error occurred. Could not update store information."});
                            }
                            else
                            {
                                res.status(200).send({"message":"Successfully updated store information"});
                            }
                        });

        //TODO: Make this work
        // collection.updateOne(
        //     { owner: req.body.email },
        //     { $set: {
        //             first_name: req.body.firstname,
        //             last_name: req.body.lastname,
        //             favorite_store: req.body.favorite,
        //             account_type: req.body.account_type,
        //             diet: req.body.restrictions,
        //         } },
        //     { upsert: true },
        //     function (resp, err) {
        //         res.redirect('/settings');
        //     }
        // );
    }
});


// Creates a user in the database when correct information is given
router.post('/store/request', (req, res)=>
{
    //TODO: Handle errors here
    // Creates a password hash
    bcrypt.hash(req.body.pass, saltRounds, function(err, hash) {
        var user = {
            "email": req.body.email,
            "first_name": req.body.firstname,
            "last_name": req.body.lastname,
            "username": req.body.user,
            "password": hash,
            "account_type":"vendor"
        };

        // Stores the user in the DB
        users.insertOne(user, function (err, docs) {
            console.log("User created...");
            var store = {
                "name": req.body.storename,
                "category": req.body.category,
                "location": req.body.location,
                "owner": ObjectId(docs.ops[0]._id),
                "description": req.body.description,
                "address": req.body.address
            };
            console.log(store);
            shops.insertOne(store, function (err, docs) {
                console.log("Store created...");

                // Sends user back to the login page
                res.redirect('/login');
            });

        });
    });
});

router.get('/settings', (req, res)=>
{
    if(req.session.user)
    {
        res.sendFile(__dirname + '/settings.html');
    }
    else
    {
        res.sendFile(__dirname + '/login.html');
    }
});

router.get('/storeinfo', (req, res)=>
{
    if(req.session.user)
    {
        res.sendFile(__dirname + '/storeinfo.html');
    }
    else
    {
        res.sendFile(__dirname + '/login.html');
    }
});

router.get('/price', (req, res)=>
{
    if(req.session.user)
    {
        res.sendFile(__dirname + '/price.html');
    }
    else
    {
        res.sendFile(__dirname + '/login.html');
    }
});

router.get('/navigation', (req, res)=>
{
    if(req.session.user)
    {
        res.sendFile(__dirname + '/navigation.html');
    }
    else
    {
        res.sendFile(__dirname + '/login.html');
    }
});

router.get('/sidebar', (req, res)=>
{
    if(req.session.user)
    {
        res.sendFile(__dirname + '/sidebar.html');
    }
    else
    {
        res.sendFile(__dirname + '/login.html');
    }
});

// Loads the change password page from user settings
router.get('/user/password', (req, res)=>
{
    if(req.session.user)
    {
        res.sendFile(__dirname + '/password.html');
    }
    else
    {
        res.sendFile(__dirname + '/login.html');
    }
});

// Loads the change password page from user settings
router.get('/user/question', (req, res)=>
{
    if(req.session.user)
    {
        res.sendFile(__dirname + '/question.html');
    }
    else
    {
        res.sendFile(__dirname + '/login.html');
    }
});

/*
 * Changes the logged in user's password
 */
router.post('/user/changepassword', (req, res)=>
{
    // Stores the user in the DB
    users.findOne({email: req.session.user.email}, function (err, docs) {
        if(!err)
        {
            // Load hash from your password DB.
            bcrypt.compare(req.body.old_password, docs.password, function(err, bres) {
                // bres == true or false
                if(bres)
                {
                    // Creates a password hash
                    bcrypt.hash(req.body.new_password, saltRounds, function(err, hash) {
                        users.updateOne(
                            { email: req.session.user.email },
                            { $set: {
                                    password: hash,
                                } },
                            { upsert: true },
                            function (resp, err) {
                                res.redirect('/settings');
                            }
                        );
                    });

                    console.log("User's password updated...");
                }
                else
                {
                    res.send({
                        error: "Password provided does not match the one in the database",
                    });
                }
            });
        }
        else
        {
            res.send({
                error: err,
            });
        }
    });
});

/*
 * Gets the logged in user's information and returns it in json.
 */
router.post('/user/myinfo', (req, res)=>
{
    // Stores the user in the DB
    users.findOne({email: req.session.user.email}, function (err, docs) {
        if(!err)
        {
            // Load hash from your password DB.
            res.send({
                // TODO: Get all user information to populate settings information
                userdata: {
                    email: docs.email,
                    username: docs.username,
                    first_name: docs.first_name,
                    last_name: docs.last_name,
                    favorite_store: docs.favorite_store,
                    diet: docs.diet,
                    question: docs.question,
                }
            });
        }
        else
        {
            res.send({
                error: err,
            })
        }
    });
});

/*
 * Verify's the users's security question answer
 */
router.post('/user/verifyanswer', (req, res)=>
{
    // Stores the user in the DB
    users.findOne({email: req.body.email}, function (err, docs) {
        if(!err)
        {
            if(docs.answer === req.body.answer)
            {
                res.send({
                    correct_answer: true,
                });
            }
            else
            {
                res.send({
                    correct_answer: false,
                });
            }
        }
        else
        {
            res.send({
                error: err,
            })
        }
    });
});

/*
 * Change the user's password.
 */
router.post('/user/forgotpass', (req, res)=>
{
    // Stores the user in the DB
    users.findOne({email: req.body.email}, function (err, docs) {
        if(!err)
        {
            // Makes sure the correct answer to the security question is provided
            if(docs.answer === req.body.answer)
            {
                // Creates a password hash
                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    users.updateOne(
                        { email: req.body.email },
                        { $set: {
                                password: hash,
                            } },
                        { upsert: true },
                        function (resp, err) {
                            console.log(req.body.email + "'s password was successfully changed");
                            res.redirect('/login');
                        }
                    );
                });
            }
            else
            {
                res.send({
                    error: "This is not the correct answer to the security question",
                });
            }
        }
        else
        {
            res.send({
                error: err,
            })
        }
    });
});

/*
 * Get's information about a given user from the DB.
 *
 * @param email - the email of the user you are trying to find information about
 */
router.post('/user/info', (req, res)=>
{
    // Searches for the user based off of email in the DB.
    users.findOne({email: req.body.email}, function (err, docs) {
        if(docs !== null)
        {
            // Load hash from your password DB.
            res.send({
                // TODO: Get all user information to populate settings information
                userdata: {
                    email: docs.email,
                    username: docs.username,
                    country: docs.country,
                    first_name: docs.first_name,
                    last_name: docs.last_name,
                    question: docs.question,
                }
            });
        }
        else
        {
            res.send({
                message: "User with the email '" + req.body.email + "' does not exist",
                error: err,
            });
        }
    });
});

// Returns boolean of whether a user is a shop owner or not based on the posted id under name="id"
router.post("/user/isowner", (req, res)=>
{
  users.findOne({"email":req.body.email}, {"projection":{"account_type":1}}, (err, result)=>
  {
    if (err)
    {
      res.status(500).send({"message":"Error occurred. Could not execute command."});
    }
    else if (result == null)
    {
      res.status(404).send({"message":"There is no user with the email " + req.body.email});
    }
    else
    {
      res.status(200).send({"message":"Successfully executed command.", "isowner":(result.account_type != "user" ? true: false)});
    }
  });
});

// Creates a user in the database when correct information is given
router.post('/user/updateprofile', (req, res)=>
{
    if(!req.session.user)
    {
        res.redirect('/login');
    }
    else
    {
        users.updateOne(
            { email: req.body.email },
            { $set: {
                    first_name: req.body.firstname,
                    last_name: req.body.lastname,
                    favorite_store: req.body.favorite,
                    diet: req.body.restrictions
                } },
            { upsert: true },
            function (err, resp) {
                console.log(err)
                console.log(resp);
                res.redirect('/settings');
            });
     }
});

// Updates logged in user's security question and password
router.post('/user/setquestion', (req, res)=>
{
    if(!req.session.user)
    {
        res.redirect('/login');
    }
    else
    {
        console.log(req.body);

        users.updateOne(
            { email: req.session.user.email },
            { $set: {
                    question: req.body.question,
                    answer: req.body.answer,
                } },
            { upsert: true },
            function (resp, err) {
                res.redirect('/settings');
            }
        );
    }
});

/*
 * Returns whether or not the logged in user is a store owner.
 */
router.get('/user/isowner', (req, res) =>
{
    if(req.session.user)
    {
        shops.findOne({owner: new ObjectId(req.session.userid)}, function (err, docs) {
            if(docs !== null)
            {
                // Is a store owner
                res.send({
                    is_owner: true,
                });
            }
            else
            {
                // Is not a store owner
                res.send({
                    is_owner: false,
                });
            }
        });
    }
    else
    {
        res.send({
            error: "You must be logged in to use this function",
        });
    }
});

// Creates a user in the database when correct information is given
router.post('/user/create', (req, res)=>
{

    // TODO: May want to validate some of the data before we store the user here
    // Creates a password hash
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        var user = {
            email: req.body.email,
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            username: req.body.user,
            question: req.body.question,
            answer: req.body.answer,
            password: hash,
            favorite_store: ""
        };

        // Stores the user in the DB
        users.insertOne(user, function (err, docs) {
            console.log("User created...");
            console.log(err);
        });
    });

    // Sends user back to the registration page
    res.redirect('/user/register');
});

// Authenticates a user at the login page
router.post('/user/auth', (req, res)=>
{
    // Stores the user in the DB
    users.findOne({email: req.body.email}, function (err, docs) {
        // Checks to make sure an account was found
        if(docs !== null)
        {
            // Load hash from your password DB.
            bcrypt.compare(req.body.password, docs.password, function(err, bres) {
                // res == true or false
                if(bres)
                {
                    // TODO: Fix so the user's information isn't stored in plain text
                    console.log(req.body.email + ' authenticated...');
                    req.session.user = docs;
                    req.session.userid = docs._id;
                    res.redirect('/');
                }
                else
                {
                    console.log('Password is incorrect...');
                    res.redirect('/login');
                }
            });
        }
        else
        {
            console.log("Account does not exist...");
            res.redirect('/login');
        }
    });
});

// Logs a user out and removes their session data
router.post('/signout', (req, res)=>
{
    //console.log("Logging out " + req.session.user.email);
    req.session.destroy();
    res.redirect('/login');
});

module.exports.router = router;
module.exports.c4 = c4;


////////////////////////////////////////////////////////////////////////////////
// API routes                                                                 //
////////////////////////////////////////////////////////////////////////////////

// Route to search product by name (optional store name parameter)
// On success, returns the detail(s) of the product(s) with the given product name
// correct api call is localhost:3000/api/v1/productSearch?product=SINGLE_PRODUCT_NAME&store=OPTOINAL_STORE_NAME
router.get("/api/v1/productSearch", (req, res)=>
{
  res.setHeader("Content-Type", "application/json");
  let querydata = req.query;
  if ((typeof(querydata.product) === "undefined") || (typeof(querydata.product) !== "string"))
  {
    res.status(400).send({"message":"User error. Correct usage is a " + req.get('host') + "/api/v1/productSearch/?product=SINGLE_PRODUCT_NAME&store=OPTIONAL_STORE_NAME", "error":true});
  }
  else if (typeof(querydata.store) === "undefined")
  { // No store name
    products.find({"name":querydata.product}).toArray((err, items)=>
    {
      if (err)
      {
        res.status(500).send({"message":"Server error occurred. Check errormessage", "error":true, "errormessage":err});
      }
      else
      {
        res.status(200).send({"message":"Successfully executed query.", "data":items, "error":false});
      }
    });
  }
  else
  { // Store name provided
    shops.find({"name":querydata.store}, {"projection":{"_id":1}}).toArray((err, stores)=>
    {
      if (err)
      {
        res.status(500).send({"message":"Server error occurred. Check errormessage", "error":true, "errormessage":err});
      }
      else
      {
        if (stores.length == 0)
        { // No shop by that name so return
          res.status(400).send({"message":"Optional store name: " + querydata.store + " does not exist.", "store_exists":false});
        }
        else
        {
          // Convert to ObjectId for $in operator
          stores.forEach((shop, ind)=>
          {
            stores[ind] = ObjectId(shop._id);
          });
          products.find({"name":querydata.product, "store":{$in : stores}}).toArray((err1, items)=>
          {
            if (err1)
            {
              res.status(500).send({"message":"Server error occurred. Check errormessage", "error":true, "errormessage":err1, "store_exists":true});
            }
            else
            {
              res.status(200).send({"message":"Successfully executed query.", "data":items, "error":false, "store_exists":true});
            }
          });
        }
      }
    })
  }
});

// Route to search get store information, searching by store name
// On success, returns the detail(s) of the store(s) with the given store name
// correct api call is localhost:3000/api/v1/store/?store=STORE_NAME
router.get("/api/v1/store", (req, res)=>
{
  res.setHeader("Content-Type", "application/json");
  if (typeof(req.query.store) === "undefined")
  {
    res.status(400).send({"message":"User error. Correct usage is a " + req.get('host') + "/api/v1/store/?store=STORE_NAME", "error":true});
  }
  else
  {
    shops.find({"name":req.query.store}).toArray((err, stores)=>
    {
      if (err)
      {
        res.status(500).send({"message":"Server error occurred. Check errormessage", "error":true, "errormessage":err});
      }
      else
      {
        res.status(200).send({"message":"Successfully executed query.", "data":stores, "error":false})
      }
    });
  }
});

// Route to get the counts of favorite stores
// On success, returns an array of { store name, store id, frequency } where frequency is the count
// of the number of users that favorite that store.
// correct api call is localhost:3000/api/v1/favoriteStatistic
router.get("/api/v1/favoriteStatistic", (req, res)=>
{
  res.setHeader("Content-Type", "application/json");
  shops.find({}, {"projection":{"_id":1, "name":1}}).toArray((err, stores)=>
  {
    if (err)
    {
      res.status(500).send({"message":"Server error occurred. Check errormessage", "error":true, "errormessage":err});
    }
    else
    {
      stores.forEach((store, ind)=>
      {
        users.countDocuments({"favorite_store":store._id}, (err1, result)=>
        {
          if (err1)
          {
            res.status(500).send({"message":"Server error occurred. Check errormessage", "error":true, "errormessage":err1});
          }
          else
          {
            store["frequency"] = result;
          }

          if (ind == stores.length-1)
          {
            res.status(200).send({"message":"Successfully executed commands.", "data":stores, "error":false})
          }
        });
      });
    }
  });
});

