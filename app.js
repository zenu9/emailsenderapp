const nodemailer = require('nodemailer');
const readline = require('readline');
const handlebars = require('handlebars');
const fs = require('fs');
require('dotenv').config();

const template = fs.readFileSync('template.hbs', 'utf8');
const compileTemplate = handlebars.compile(template);

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

// Email sending function
async function sendEMail(recipient, subject, message, data) {
    try {
        const htmlContent = compileTemplate(data);
        const mailOptions = {
            from: process.env.USER,
            to: recipient,
            subject: subject,
            text: message,
            html: htmlContent,
            attachments: [
                {
                    filename: 'lab.pdf',
                    path: './lab.pdf'
                },
                {
                    filename: 'crispycrab.png',
                    path: './crispycrab.png'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        console.log(`Error occured: ${error}`);
    }
}

const data = {
    name: 'Arman',
    activationCode: '123456',
    appName: 'EA'
};

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt user for email details
rl.question('Enter recipient email address: ', (recipient) => {
    rl.question('Enter email subject: ', (subject) => {
      rl.question('Enter message: ', (message) => {
        sendEMail(recipient, subject, message, data)
          .then(() => {
            rl.close();
          })
          .catch((error) => {
            console.error(error);
            rl.close();
          });
        });
    });
});
