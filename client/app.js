const express = require("express");
const session = require("express-session");

const dotenv = require("dotenv");
dotenv.config();
const { connectDb } = require("./config/database");
const isHTMX = require("./public/js/isHTMX");
const uuidv4 = require("./public/js/uuidv4");
const { verifyToken } = require("./config/isAuth");
const users = require("./data/fakes");
const { login, signUp } = require("./controllers/userController");
const { scheduleMeeting } = require("./controllers/meetingController");
const User = require("./models/userModels");
const Meeting = require("./models/meetingModel");

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
  console.log("User ", user);
  // console.log("Session ", req.session);

  if (!user) {
    return res.status(401).send("Invalid credentials");
  }

  req.session.userId = user._id;
  req.session.username = user.username;
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

app.post("/schedule", async (req, res) => {
  const { crush, environment, meetingDay, duration } = req.body;
  const roomId = uuidv4();
  const participants = [];
  let sessionUser = req.session.username;
  console.log("Session user ", sessionUser);
  (participants[0] = crush), (participants[1] = sessionUser);
  try {
    // Save the document
    const newMeet = new Meeting({
      roomId,
      environment,
      meetingDay,
      duration,
      participants,
    });

    await newMeet.save();
    console.log("Scheduled ", newMeet);
    return res.status(200).send(
      `
        <div style="width: 450px;height:450px;padding:4px;">
        <button onclick="window.location.assign('/')" style="width:64px;background-color:green;color:white;border-radius:14px;cursor:pointer;">Continue</button>
        <p>You've scheduled a new Meeting!</p>
        </div>
        `
    );
    // res.render("partials/meetings", { meeting: newMeet });
    // res.redirect("/meetings?meeting=newMeet");
  } catch (error) {
    console.error("Schedule err", error);
  }
});

app.get("/meetings", async (req, res) => {
  try {
    const meetings = await Meeting.find({
      participants: req.session.username,
    });
    console.log("/meetings ", meetings);
    res.render("partials/meetings", { meetings });
    // if (isHTMX(req)) {
    //   res.render("partials/meetings", meetings);
    //   //  res.json(meetings);
    // } else {
    //   res.render("index", { users }); // or another base template that includes the navbar + #main
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("fetch err ", error.message);
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
// app.post("/schedule", scheduleMeeting);

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
