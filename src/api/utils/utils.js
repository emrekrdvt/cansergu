const Joi = require("joi");
const nodemailer = require("nodemailer");
const myMail = process.env.MAIL;
const pass = process.env.PASS;

exports.createUserValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(4).max(20).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),

  email: Joi.string().email().required(),
});

exports.updateUserValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(4).max(20),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),

  email: Joi.string().email(),
});

exports.sendMail = async (mail, token) => {
  console.log(myMail, pass);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: myMail,
        pass: pass,
      },
    });
    const info = await transporter.sendMail({
      from: `"Fred Foo 👻" <${myMail}>`,
      to: `<${mail}>`,
      subject: "Hello from FuFront",
      html: `<html>
      <head>
        <style>
          body {
            background-size: cover;
            background-repeat: no-repeat;
            background-attachment: fixed;
            text-align: center;
          }
          .content {
            background-color: rgba(255, 255, 255, 0.8);
            padding: 20px;
            border-radius: 10px;
            display: inline-block;
          }
          p {
            font-size: 16px;
            color: #333;
          }
          a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="content">
          <p>Hello,</p>
          <p>Please click the button below to confirm your account:</p>
          <a href="http://localhost:4545/api/auth/verify?token=${token}">Confirm</a>
        </div>
      </body>
    </html>
    
    `,
    });
  } catch (error) {
    console.log(error);
  }
};
