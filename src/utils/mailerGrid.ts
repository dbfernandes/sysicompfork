import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'

dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendEmail(destination: string) {
    const msg = {
        to: destination, // Change to your recipient
        from: process.env.SENDGRID_EMAIL_SEND, // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

export default sgMail