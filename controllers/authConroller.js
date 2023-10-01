const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) return res.status(400).json({'message': 'Username and password are required!'});
    const foundUSer = usersDB.users.find(person => person.username === user);
    if (!foundUSer) return res.sendStatus(401); //Unauthorized

    //evaluate Password

    const match = await bcrypt.compare(pwd, foundUSer.password);
    if (match) {
        const accessToken = jwt.sign(
            {"username": foundUSer.username},            
            process.env.ACCESS_TOKEN_SECRET,            
            {expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            {"username": foundUSer.username},            
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );

        // Saving refreshToken with current user
        const otherUSers = usersDB.users.filter(person => person.username !== foundUSer.username);
        const currentUSer = {...foundUSer, refreshToken};
        usersDB.setUsers([...otherUSers, currentUSer]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 *1000});        
        res.json({accessToken});
    }else {
        res.sendStatus(401)
    }
}

module.exports = {handleLogin};