const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModels");

exports.signUp = async (req, res) => {
  const {
    //   first_name,
    //   last_name,
    username,
    password,
    //   fun_fact,
    //   avatar,
    //   voice_sample,
  } = req.body;
  try {
    // Check If The Input Fields are Valid
    // if (!first_name || !last_name || !username || !password) {
    //   return res.status(400).json({ message: "Please Input required fields!" });
    // }

    // Check If User Exists In The Database
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).send(`
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;padding:12px;">
        <button onclick="window.location.assign('/')">Try again</button>
      <p style="color:red;font-weight:bold">
        Please, choose a different username..
      </p>
      </div>
    `);
      // .json({ message: "Please, choose a different username.." });
    }

    // Hash The User's Password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save The User To The Database
    const newUser = new User({
      //   first_name,
      //   last_name,
      username,
      password: hashedPassword,
      //   fun_fact,
      //   avatar,
      //   voice_sample,
    });

    await newUser.save();
    console.log("User Created Successfully", newUser);
    res.redirect("/");

    // return res
    //   .status(201)
    //   .json({ message: "User Created Successfully", newUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`
      <div class="p-4 bg-red-100 text-red-600 rounded">
        Failed to create User because ${error.message}
      </div>
    `);
  }
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check If The Input Fields are Valid
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please Input Username and Password" });
    }

    // Check If User Exists In The Database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare Passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET_KEY || "1234!@#%<{*&)",
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .json({ message: "Login Successful", data: user, token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error during login" });
  }
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.getAllUsers = async (req, res) => {};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.getUser = async (req, res) => {};
