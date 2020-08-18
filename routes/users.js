var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const secret = 'dwikosecret'

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  retype = req.body.retype

  let response = {
    message: "",
    data: {},
    token: ""
  }

  if (password != retype) return res.status(500).json({
    error: true,
    message: "password doesn't match"
  })

  User.findOne({email})
  .then(result => {
    if (result) {
      response.message = 'Email already Exist';
      return res.status(500).json(response)
    } else {
      var token = jwt.sign({email: email}, secret);
      let user = new User({
        email: email,
        password: password,
        token: token
      })
      user.save()
      .then(data => {
        response.message = "Register Success"
        response.data.email = email
        response.token = token
        res.status(201).json(response)
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
    }
  }).catch(err => {
    res.status(500).json({
      error: true,
      message: 'Error Users'
    })
  })
})

router.post('/login', (req, res) => {
  let email = req.body.email
  let password = req.body.password

  let response = {
    message: "",
    data: {},
    token: ""
  }

  User.findOne({email})
  .then(data => {
    bcrypt.compare(password, data.password)
    .then(check => {
      if (check) {
        if (data.token) {
          response.token = data.token;
          response.data.email = email;
          response.message = "Login Success"
          res.status(201).json(response)
        } else {
          const newToken = jwt.sign({email: data.email}, secret)
          user.updateOne({ email: data.email}, { token: newToken })
          .then(() => {
            response.token = newToken;
            response.data.email = data.email;
            response.message = "Login Success";
            res.status(201).json(response)
          })
        }
      } else {
        response.message = "Failed";
        res.status(500).json(response)
      }
    }).catch(err => {
      response.message = "Failed"
      res.status(500).json(response)
    })
  }).catch(err => {
    response.message = "Email Doesn't Exist"
    res.status(500).json(response)
  })
})

router.post('/check', (req, res) => {
  jwt.verify(req.body.token, 'dwikosecret', (err, get) => {
    if (err) {
      res.json({valid: false})
    } else {
      res.json({valid: true})
    }
  })
})

router.get('/destroy', (req,res) => {
  // let email = req.session.user.email;
  // console.log(email)
  // User.findOne({email}, (err, ready) => {
  //   ready.update({$set: {token: ''}}).exec((err, get) => {
  //     req.session.destroy((err) => {
  //       return res.status(200).json({logout: true})
  //     })
  //   })
  // })
  let token = req.body.token

  if(!token) {
    res.status(500).json({logout: false})
  } else {
    const decode = jwt.verify(token, 'dwikosecret')
    User.findOneAndUpdate({email: decode.email}, {token: ""}, {new: true})
    .then(result => {
      res.status(200).json({logout: true})
    })
    .catch(err => {
      res.status(500).json({logout: false})
    })
  }
})


module.exports = router;
