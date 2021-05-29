require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5'); // For md5

const bcrypt = require('bcrypt');
const saltRounds = 10;



const app = express();

app.use(express.static("public"));
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB" , { useNewUrlParser: true , useUnifiedTopology: true})

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// to access the env variables use process.env.<variable_name>
// console.log(process.env.SECRETS);
// userSchema.plugin(encrypt, { secret: process.env.SECRETS , encryptedFields: ["password"] });

const User = new mongoose.model("User" , userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login" , (req, res) => {
  res.render("login");
});

app.get("/register" , (req, res) => {
  res.render("register");
});

app.post("/register" , (req, res) => {
  bcrypt.hash(req.body.password , saltRounds, (err, hash) => {
    const newUser = new User({
      email: req.body.username,
      // password: md5(req.body.password)
      password: hash
    })

    newUser.save((err) => {
      if(err) {
        res.send(err)
      } else {
        res.render("secrets");
      }
    });
  });

});

app.post("/login" , (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username} , (err , foundUser) => {
    if(err) {
      console.log(err);
    } else {
      if(foundUser){
        // if( foundUser.password === password) {
        bcrypt.compare(password, foundUser.password, (err, result) => {
          console.log(foundUser.password);
          if(result === true) {

            res.render("secrets");
          } else {
            res.send("Wrong Password!!!")
          }
        })
        }
      }
  });
});


app.listen(3000, () => {
  console.log("Server has started on port 3000.");
});
