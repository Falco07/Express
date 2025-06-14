const express = require("express");
const path = require("path");
const cors = require("cors");
const corsOptions = require('./config/coresOptions')
const PORT = process.env.PORT || 3500;
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const cookieParser = require('cookie-parser');
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require('./middleware/credentials')

// custon middleware logger
app.use(logger);

app.use(credentials)

// cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleare to handle json data
app.use(express.json());

// middleware for cookies
app.use(cookieParser())

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, "/public")));


// Routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT)
app.use("/employees", require("./routes/api/employees"));

// Catch-all 404
app.all("/*splat", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    return res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: " 404 Not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

// Custom error handler (for server errors only)
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
