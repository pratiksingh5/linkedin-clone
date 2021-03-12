var express = require('express');
var router = express.Router();
let UserModel = require('./users');
let passport = require('passport');
let passportLocal = require('passport-local');
const { body, validationResult } = require('express-validator');
var cookieParser = require('cookie-parser');


passport.use(new passportLocal(UserModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing', { title: 'Express' });
});

/* GET home page. */
router.get('/dashboard', isLoggedIn ,function(req, res, next) {
  UserModel.findOne({username: req.session.passport.user})
  .then(function(founduser){
    res.render('index', { title: 'Dashboard', founduser });
  })
});

/* GET home page. */
router.get('/signin', function(req, res, next) {
  res.render('register');
});


router.post('/register',
body('username')
.custom(function(value){
  return UserModel.findOne({username: value})
  .then(function(a){
    if(a){
      return Promise.reject("Username already Exists")
    }
  })
}),body('password').isLength({min:6}).withMessage('Password should be more than 6 characters'),function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('register',{errors: errors.array()})
  }

  var newUser= new UserModel({
    username:req.body.username,
    password:req.body.password,
    number : req.body.number
  })
  UserModel.register(newUser,req.body.password)
  .then(function(){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/dashboard');
    })
  })
  .catch(function(e){
    console.log(e);
  })
})


router.post('/login',passport.authenticate('local',{
  successRedirect:'/dashboard',
  failureRedirect:'/'
}),function(req,res){
})


router.get('/logout',function(req,res){
  req.logOut();
  res.redirect('/');
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}

module.exports = router;
