require("dotenv").config(); //sensitive information(tokens)
const fs = require("fs");
const nodemailer = require("nodemailer");

//create trasnporter auth type OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN,
  },
});

//import data from data.json
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

//template
function template(varjson1, varjson2) {
  //add as many variables as you want
  return `
  <p>Dear Reciver</p>
  <p>Body</p>
  
  <p>Best regards,</p>
  
  `;
}

//send multiple emails
data.forEach(({ targetEmail, varjson1, varjson2 }) => {
  const htmlTemplate = template(varjson1, varjson2);

  const sub = "Subject title";

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: targetEmail,
    subject: `${sub} ${companyName}`,
    //replace html elements (body variables extracted from data.json)

    html: htmlTemplate
      .replace(/\[var1\]/g, varjson1)
      .replace(/\[var2\]/g, varjson2),
    // .replace(/\[var3\]/g, varjon3),
    //attachments (like pdf)
    attachments: [
      {
        filename: "filename",
        path: "PATH/TODOC", //specify your path to your attachment
      },
      // {
      //   filename: "file2",
      //   path: "path2",
      // },
    ],
  };

  //send mail function
  transporter.sendMail(mailOptions, (error, info) => {
    console.log(`Email sent to ${email}`);
    console.log(`Info Response:${info.response} `); //recive email respone (200 ) for success
    if (error) {
      console.error(`Error sending email to ${email}:`, error);
      return;
    }
  });
});
