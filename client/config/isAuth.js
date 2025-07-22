const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      throw new Error();
    }
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error Validating Token" });
  }
};

//const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/signin");
  }
  jwt.verify(token, "YOUR_SECRET_KEY", (err, decoded) => {
    if (err) {
      return res.redirect("/signin");
    }
    req.user = decoded;
    next();
  });
};
