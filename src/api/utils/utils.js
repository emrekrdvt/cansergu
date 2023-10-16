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

  bio: Joi.string(),
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
      from: `"FuFront 👻" <${myMail}>`,
      to: `<${mail}>`,
      subject: "Hello from FuFront",
      html: `<html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }
    
          .content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
    
          p {
            font-size: 16px;
            margin: 0;
          }
    
          a.button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
          }
    
          a.button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="content">
          <p>Hello,</p>
          <p>Please click the button below to confirm your account:</p>
          <a href="http://localhost:4545/api/auth/verify?token=${token}" class="button">Confirm</a>
        </div>
      </body>
    </html>    
    `,
    });
  } catch (error) {
    throw error;
  }
};
