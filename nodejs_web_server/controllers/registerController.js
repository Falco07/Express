const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data }
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

// main function to process registration
const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required' });
    }
    
    // Check if user exists
    const duplicate = usersDB.users.find(person => person.username === user);
    if (duplicate) return res.sendStatus(409); // Conflict
    
    try {
        // Encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10); // Fixed typo in variable name
        
        // Assign default role if none provided
         const userRoles = roles && typeof roles === 'object' ? roles : { User: 2001 };
        // Store new user
        const newUser = { "username": user, "password": hashedPwd, "roles": userRoles, "refreshToken": "" }; // Fixed variable name
        
        usersDB.setUsers([...usersDB.users, newUser]); // Fixed typo in variable name
        
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'), // Fixed filename to match require
            JSON.stringify(usersDB.users)
        );
        
        console.log(usersDB.users);
        res.status(201).json({ "success": `New user ${user} created` });
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
};

module.exports = { handleNewUser };