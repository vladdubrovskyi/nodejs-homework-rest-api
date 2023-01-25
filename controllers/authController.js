const { User } = require("../models/users");
const { BadRequest, Conflict, Unauthorized } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const savedUser = await User.create({
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      data: {
        user: {
          email,
          id: savedUser._id,
        },
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      throw BadRequest("Passaword and email are obligatory");
    }

    if (error.message.includes("E11000 duplicate key error")) {
      throw Conflict("This email is already taken");
    }
    console.log(error.name);
    throw error;
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const storedUser = await User.findOne({
    email,
  });

  if (!storedUser) {
    throw Unauthorized("Email or password is wrong");
  }
  const isPasswordValid = await bcrypt.compare(password, storedUser.password);
  if (!isPasswordValid) {
    throw Unauthorized("Email or password is wrong");
  }

  const payload = { id: storedUser._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  return res.json({
    user: { email },
    data: {
      token,
    },
  });
}

module.exports = {
  register,
  login,
};
