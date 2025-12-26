const User = require("../models/user")
const  jwt  = require('jsonwebtoken')
 const createUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log("request body", req.body);

    if (!fullName) {
      return res.status(400).json({ error: true, message: "Full Name is required" });
    }
    if (!email) {
      return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: true, message: "Password is required" });
    }
 
    const isUser = await User.findOne({ email: email });
    if (isUser) {
      return res.json({ error: true, message: "User already exists" });
    }

    const user = new User({ fullName, email, password });
    await user.save();

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email }, 
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30000m" }
    );

    return res.json({
      error: false,
      user,
      accessToken,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}

 const loginUser= async (req, res) => {
  
  const { email, password } = req.body
  if (!email) {
    return res.status(400).json({ message: "Email is require" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is require" });
  }
  const userInfo = await User.findOne({ email: email })
  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }
  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
   const accessToken = jwt.sign(
  { _id: userInfo._id, email: userInfo.email },  // ✅ SAME AS SIGNUP
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: "36000m" }
);
    return res.status(200).json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    })
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
}
 module.exports = {createUser,loginUser}