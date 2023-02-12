const { User } = require("../models/users");
const { BadRequest, Conflict, Unauthorized, NotFound } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const { createVerifyEmail, sendEmail } = require("../helpers/index");

async function register(req, res, next) {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const avatar = gravatar.url(email);
  const verificationToken = uuidv4();
  try {
    const savedUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL: avatar,
      verificationToken: verificationToken,
    });
    const mail = await createVerifyEmail(email, verificationToken);

    await sendEmail(mail);

    res.status(201).json({
      data: {
        user: {
          email,
          id: savedUser._id,
          verificationToken,
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

  if (!storedUser || !storedUser.verify) {
    throw Unauthorized("Email or password is wrong or not verified");
  }
  const isPasswordValid = await bcrypt.compare(password, storedUser.password);
  if (!isPasswordValid) {
    throw Unauthorized("Email or password is wrong");
  }

  const payload = { id: storedUser._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  await User.findByIdAndUpdate(storedUser._id, { token });

  return res.json({
    user: { email },
    data: {
      token,
    },
  });
}

const logout = async (req, res) => {
  const { id } = req.user;

  await User.findByIdAndUpdate(id, { token: null });

  res.status(204).json();
};

const current = (req, res) => {
  const { email } = req.user;

  res.json({
    email,
  });
};

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = async (req, res) => {
  // const { path, originalname } = req.file;
  const { _id: id } = req.user;
  const imageName = `${id}_${req.file.originalname}`;

  try {
    const resultUpload = path.join(avatarsDir, imageName);
    await fs.rename(req.file.path, resultUpload);
    const avatarURL = path.join("public", "avatars", imageName);
    Jimp.read(avatarURL).then((avatar) => {
      return avatar.resize(250, 250).write(avatarURL);
    });

    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    res.json({ avatarURL });
  } catch (error) {
    await fs.unlick(req.file.path);
    throw error;
  }
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  console.log(req.params);
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw NotFound("Not found!!!!!!!!");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({
    message: "Verification successful",
  });
};

const resendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw NotFound();
  }

  if (user.verify) {
    throw BadRequest("Verification has already been passed");
  }

  const mail = createVerifyEmail(email, user.verificationToken);

  await sendEmail(mail);

  res.json({
    message: "Verification email sent",
  });
};

module.exports = {
  register,
  login,
  logout,
  current,
  updateAvatar,
  verify,
  resendEmail,
};
