require('dotenv').config()

const express = require('express');

const auth = require('./auth');

const router = express.Router();

const jwt = require('jsonwebtoken');

const posts = [
  {
    username: "sam",
    title: "post 1"
  },
  {
    username: "rizky",
    title: "post 2"
  }
]

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌏'
  });
});

router.get('/posts',authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if(err) return res.sendStatus(403)

    req.user = user   
    next()
  })
}

router.use('/auth', auth);

module.exports = router;
