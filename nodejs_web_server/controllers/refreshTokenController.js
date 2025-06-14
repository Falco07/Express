// Load list of users from local file
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

// Used to create JWT for auth
const jwt = require("jsonwebtoken");

// Load secrets from our .env file
require("dotenv").config();

// Main refresh token handler
const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.jwt;

  // ✅ Log the token for debugging
  console.log("Refresh Token (cookie):", refreshToken);

  // If no token in cookies
  if (!refreshToken) {
    return res.sendStatus(401); // Unauthorized
  }

  // Find user with matching refresh token
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser) {
    return res.sendStatus(403); // Forbidden
  }

  // Verify refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403); // Forbidden
    }
    const roles = Object.values(foundUser.roles);
    // If valid, issue a new access token
    const accessToken = jwt.sign(
      { userinfo: { username: decoded.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
