const sgMail = require("@sendgrid/mail");
require("dotenv").config();

function tryCatchWrapper(endpointFn) {
  return async (req, res, next) => {
    try {
      await endpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

class MyError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const { BASE_URL } = process.env;

const createVerifyEmail = (email, verificationToken) => {
  const mail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Follow the link to verify email</a>`,
  };

  return mail;
};

const { SEND_GRID_KEY } = process.env;

sgMail.setApiKey(SEND_GRID_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "igorgoris@ukr.net" };
  try {
    await sgMail.send(email);
    console.log(email, "sent");
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  tryCatchWrapper,
  MyError,
  createVerifyEmail,
  sendEmail,
};
