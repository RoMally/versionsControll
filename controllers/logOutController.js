const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

const fsPromises = require('fs').promises;
const { response } = require('express');
const path = require('path');

const handleLogOut = async (req, res) => {
    // On client, also delete the accesToken

    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204); // No contetnt    
    const refreshToken = cookies.jwt;

    // if refreshToken in db?
    const foundUSer = usersDB.users.find(person => person.refreshToken === refreshToken);   
    
    if (!foundUSer){
        res.clearCookie('jwt', {httpOnly : true} );
        return res.sendStatus(204); //Forbidden
    }        
    
    // Delete refreshToken in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== refreshToken)
    const currentUSer = {...foundUSer, refreshToken: ''}
    usersDB.setUsers([...otherUsers, currentUSer]);
    
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json' ),
        JSON.stringify(usersDB.users)
    );
    res.clearCookie('jwt', {httpOnly : true},  ); // secure: true - only on https
    res.status(204).json({"message": "You are log out"});
}

module.exports = {handleLogOut}