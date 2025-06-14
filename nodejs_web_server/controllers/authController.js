// load list of users from local file
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
// encrypt password for security reasons
const bcrypt = require("bcrypt");
// used to create jwt for auth
const jwt = require("jsonwebtoken");
// load secrets from our env file
require("dotenv").config();
// Used to read/write files (like updating users.json) using async/await.
const fsPromises = require("fs").promises;
// Helps build file paths that work across all operating systems.
const path = require("path");
// main login function
const handleLogin = async (req, res) => {
  // get user and pwd from request
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    // if either is missing send this error
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  // Search for user with given username
  const foundUser = usersDB.users.find((person) => person.username === user);
  //   if user not found show this error
  if (!foundUser) return res.sendStatus(401); // Unauthorized - Fixed typo (res,sendStatus -> res.sendStatus)

  // Evaluate password
  try {
    // Compares the entered password with the hashed password from the file.
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
      const roles = Object.values(foundUser.roles);
      // create JWTs
      const accessToken = jwt.sign(
        {
          userinfo: {
            username: foundUser.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      // saving refresh token with current user
      const otherUsers = usersDB.users.filter(
        (person) => person.username !== foundUser.username
      );
      //   Adds the refreshToken to the current user's data.
      const currentUser = { ...foundUser, refreshToken };
      //   Replaces the full users list with the updated one.
      usersDB.setUsers([...otherUsers, currentUser]);
      //   Saves the updated users (with refresh token) back to users.json
      await fsPromises.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(usersDB.users, null, 2) // Pretty print
      );
      //   Sends the refresh token as a secure HTTP-only cookie.
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // send only over HTTPS
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      }); //1 day
      //   Sends the access token in the JSON response.
      res.json({ accessToken });
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error processing login" });
  }
};

module.exports = { handleLogin };
