const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { connectDb } = require("./config/database");
const isHTMX = require("./public/js/isHTMX");

const users = require("./data/fakes");
const { signUp } = require("./controllers/userController");
const { scheduleMeeting } = require("./controllers/meetingController");

const app = express();
const PORT = process.env.PORT || 3000;

// DB Config initialization point
connectDb();

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
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

app.get("/signin", (req, res) => {
  if (isHTMX(req)) {
    res.render("partials/signin");
  } else {
    res.render("index", { users }); // or another base template that includes the navbar + #main
  }
});
app.post("/signup", signUp);

app.listen(PORT, () =>
  console.log(`App Server is listening on port ${PORT}..`)
);
