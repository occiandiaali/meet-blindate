const express = require("express");
const session = require("express-session");

const dotenv = require("dotenv");
dotenv.config();
const { connectDb } = require("./config/database");
const isHTMX = require("./public/js/isHTMX");
const { verifyToken } = require("./config/isAuth");
const users = require("./data/fakes");
const { login, signUp } = require("./controllers/userController");
const { scheduleMeeting } = require("./controllers/meetingController");
const User = require("./models/userModels");

const app = express();
const PORT = process.env.PORT || 3000;

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/signin");
  }
  next();
}

// DB Config initialization point
connectDb();

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SECRET_SESSION_KEY, //
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
// Routes
// app.get("/", (req, res) => {
//   res.render("index", { users });
// });

app.post("/login", async (req, res) => {
  const { loginusername, loginpassword } = req.body;
  const user = await User.findOne({ username: loginusername });
  console.log("Login pass ", loginpassword);

  if (!user) {
    return res.status(401).send("Invalid credentials");
  }

  req.session.userId = user._id;
  res.redirect("/");
});

app.get("/signin", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/");
  }
  // res.send("Please sign in");
  res.render("signin");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/signin");
  });
});

app.get("/", requireLogin, (req, res) => {
  res.render("index", { users });
});

app.get("/meetings", (req, res) => {
  if (isHTMX(req)) {
    res.render("partials/meetings");
  } else {
    res.render("index", { users }); // or another base template that includes the navbar + #main
  }
});

app.get("/account", (req, res) => {
  if (isHTMX(req)) {
    res.render("partials/account");
  } else {
    res.render("index", { users }); // or another base template that includes the navbar + #main
  }
});
app.get("/settings", (req, res) => {
  if (isHTMX(req)) {
    res.render("partials/settings");
  } else {
    res.render("index", { users }); // or another base template that includes the navbar + #main
  }
});
app.post("/schedule", scheduleMeeting);

// app.get("/signin", (req, res) => {
//   if (isHTMX(req)) {
//     res.render("partials/signin");
//   } else {
//     res.render("index", { users }); // or another base template that includes the navbar + #main
//   }
// });
// app.get("/signin", (req, res) => {
//   res.render("signin");
// });
// app.post("/login", login);
app.post("/signup", signUp);

app.listen(PORT, () =>
  console.log(`App Server is now listening on port ${PORT}..`)
);
