const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service : 'Gmail',
    secure : false,
    auth : {
        user : process.env.USER,
        pass : process.env.PASS
    }
});

const sendSignupMail = (emailid, name) => {
    try{
        const info = transporter.sendMail({
            from: process.env.USER,
            to: emailid,
            subject: 'Welcome to The Vault – Registration Successful',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #121826; color: #fefefe; padding: 30px; border-radius: 8px;">
                    <div style="max-width: 600px; margin: auto; background-color: #1b2232; padding: 30px; border-radius: 8px;">
                        <h2 style="color: #2daaff;">Welcome, ${name}!</h2>
                        <p style="font-size: 16px; line-height: 1.6;">
                            Your registration at <strong>The Vault</strong> has been successfully completed.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6;">
                            You now have secure access to manage your passwords and data in one place. Stay safe and enjoy a seamless experience with us.
                        </p>
                        <hr style="border-color: #2daaff; margin: 20px 0;">
                        <p style="margin-top: 30px; font-size: 14px; color: #fefefe;">
                            Thank you,<br/>
                            <span style="color: orange;">The Vault</span>
                        </p>
                    </div>
                </div>
            `
        });
        console.log("Signup email sent to:", name);
    } 
    catch(error){
        console.log("Error sending signup email", error);
    }
};


const sendVFCodeMail = (emailid, vfcode) => {
    try{
        const info = transporter.sendMail({
            from: process.env.USER,
            to: emailid,
            subject: `${vfcode} – The Vault Password Reset`,
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #121826; color: #fefefe; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background-color: #1b2232; padding: 30px; border-radius: 8px;">
                        <h2 style="color: #2daaff; margin-bottom: 10px;">Reset Your Password</h2>
                        <p style="font-size: 16px; line-height: 1.6;">
                            We received a request to reset your password. Use the verification code below to proceed:
                        </p>
                        <div style="margin: 20px 0; text-align: center;">
                            <span style="display: inline-block; background-color: #2daaff; color: #121826; font-size: 24px; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                                ${vfcode}
                            </span>
                        </div>
                        <p style="font-size: 14px; color: #aaa;">
                            If you have requested multiple verification codes, only the recent one is valid.
                        </p>
                        <hr style="border-color: #2daaff; margin: 30px 0;">
                        <p style="font-size: 14px; color: #fefefe;">
                            Thank you,<br/>
                            <span style="color: orange;">The Vault</span>
                        </p>
                    </div>
                </div>
            `
        });
        console.log("Verification code email sent");
    }
    catch(error){
        console.log("Error sending verification email", error);
    }
};


module.exports = {sendSignupMail, sendVFCodeMail};