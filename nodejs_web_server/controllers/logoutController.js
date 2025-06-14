// Load list of users from local file
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
// Main refresh token handler
const handleLogout =  async (req, res) => {
  // on client, also delete access token
  const cookies = req.cookies;
  // If no token in cookies
  if (!cookies.jwt) {
    return res.sendStatus(204); //No content
  }
  const refreshToken = cookies?.jwt;
  // Find user with matching refresh token
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(204);// successful but no content
  }
  //Delete refresh token in DB
  const otherUSers =usersDB.users.filter((person)=> person.refreshToken !== foundUser.refreshToken);
  const currentUser ={...foundUser, refreshToken: ''};
  usersDB.setUsers([...otherUSers, currentUser]);
  await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'),
  JSON.stringify(usersDB.users)
);
res.clearCookie('jwt', {httpOnly: true, sameSite: "none", secure: true,  maxAge: 24 * 60 * 60 * 1000})
res.sendStatus(204);
};

module.exports = { handleLogout };
