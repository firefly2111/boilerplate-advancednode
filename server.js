'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const passport = require("passport");
const session = require("express-session");
const ObjectID = require("mongodb").ObjectID;
const mongo = require("mongodb").MongoClient;
const LocalStrategy = require("passport-local");

const app = express();

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.use(passport.initialize());
app.use(passport.session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUnitialized: true
}));

mongo.connect(process.env.DATABASE, (err, db) => {
  if(err){
    console.log(err);
  }else{
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
      db.collection("users").findOne({_id: new ObjectID(id)}, (err, doc) => {
        
      });
    });
    passport.use(new LocalStrategy((username, password, done) => {
      db.collection("users").findOne({username: username}, (err, user) => {
        if(err){return done(err)}
        if(!user){return done(null, false)}
        if(password !== user.password){return done(null, false)}
        return done(null, user);
      });
    }));
    
    
    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  }
});


app.route('/')
  .get((req, res) => {
    res.render(process.cwd() + '/views/pug/index.pug', {title: "Hello", message: "Please login56", showLogin: true});
  });

