var express = require('express');
var router = express.Router();
const Mclient = require("mongodb").MongoClient;
const saltRounds = 10;
const bcrypt = require('bcrypt');

router.get('/', (req, res)=>
{
    if(req.session.user)
    {
        res.sendFile(__dirname + '/index.html');
    }
    else
    {
        res.sendFile(__dirname + '/login.html');
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
        res.sendFile(__dirname + '/login.html');
    }
});

router.get('/login', (req, res)=>
{
    if(req.session.user)
    {
        res.sendFile(__dirname + '/index.html');
    }
    else
    {
        res.sendFile(__dirname + '/login.html');
    }
});

router.get('/register', (req, res)=>
{
    res.sendFile(__dirname + '/register.html');
});

router.get('/request', (req, res)=>
{
    if(req.session.user)
    {
        res.sendFile(__dirname + '/request.html');
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


// Creates a user in the database when correct information is given
router.post('/user/create', (req, res)=>
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
router.post('/user/auth', (req, res)=>
{
    var c4 = new Mclient("mongodb+srv://admin:thisisanadmin@cluster0-yknsv.mongodb.net", {useNewUrlParser:true});

    c4.connect(err => {

        const collection = c4.db("Project").collection("users");

        c4.connect(err => {
            // Stores the user in the DB
            collection.findOne({email: req.body.email}, function (err, docs) {
                // Load hash from your password DB.
                bcrypt.compare(req.body.password, docs.password, function(err, bres) {
                    // res == true or false
                    if(bres)
                    {
                        console.log(req.body.email + ' authenticated...');
                        req.session.user = req.body;
                        res.redirect('/');
                    }
                    else
                    {
                        console.log('Password did not match DB record...');
                        res.redirect('/login');
                    }
                });
            });
        });
    });

    c4.close();
});

// Logs a user out and removes their session data
router.post('/signout', (req, res)=>
{
    console.log("Logging out " + req.session.user.email);
    req.session.user = null;
    res.redirect('/login');
});

module.exports = router;
