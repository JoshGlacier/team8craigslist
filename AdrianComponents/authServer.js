require('dotenv').config()
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken'); 

app.use(express.json()); 

let refreshTokens = []

app.post('/token', function(req, res ){
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(err, user) {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken})
    })
})

app.delete('/logout', function(req, res) {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204);
})

app.post('/login', authenticateToken, function(req, res) {
    //Authenticate user
    const username = req.body.username;
    const user = { name: username }  
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env. ACCESS_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken: accessToken, refreshToken: refreshToken })
});

app.post('homepage', authenticateToken, function(req, res) {

});

function generateAccessToken(user) {
    return  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h'}) 
}
