require('dotenv').config()

const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

let refreshTokens = [] // should move to db or anything

router.post('/', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { name: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.ACCESS_TOKEN_REFRESH)
  refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })
});

router.post('/refreshToken', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.ACCESS_TOKEN_REFRESH, (err, user) => {
    if (err) {
      return res,sendStatus(403)
    }
    const accessToken = generateAccessToken({name: user.name})
    res.json(accessToken)
  })
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}

router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

module.exports = router;
