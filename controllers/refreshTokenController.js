const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401);    
    const refreshToken = cookies.jwt;

    const foundUSer = usersDB.users.find(person => person.refreshToken === refreshToken);
    //console.log(foundUSer)
    
    if (!foundUSer) return res.sendStatus(403); //Forbidden
        
    
    //evaluate jwt
    jwt.verify(
        refreshToken,        
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {            
            if (err || foundUSer.username !== decoded.username) return res.sendStatus(401);
            const accessToken = jwt.sign(
                {"username": decoded.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );            
            res.json({accessToken})
        }
    );   
}

module.exports = {handleRefreshToken}