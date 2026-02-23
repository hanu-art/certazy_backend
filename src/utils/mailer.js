// src/utils/mailer.js

import nodemailer from 'nodemailer'
import env from '../config/env.js'
console.log(env.smtp.pass)
const transporter = nodemailer.createTransport({
  host  : env.smtp.host,
  port  : env.smtp.port,
  secure: env.smtp.port === 465,
  auth  : {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
})

// Startup pe connection verify karo
transporter.verify((err) => {
  if (err) console.error('Mailer connection failed:', err.message)
  else     console.log('✅ Mailer ready')
})

// ─── CORE SEND ───────────────────────────────────────────────
const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from   : env.smtp.from,
    to,
    subject,
    html,
  })
}

// ─── TEMPLATES ───────────────────────────────────────────────

// 1. Welcome mail — register ke baad
const sendWelcomeMail = (to, name) => {
  return sendMail({
    to,
    subject: 'Welcome to EduPlatform! 🎓',
    html   : `
      <h2>Welcome, ${name}!</h2>
      <p>Your account has been created successfully.</p>
      <p>Start learning today — explore our courses.</p>
      <br/>
      <a href="${env.frontendUrl}/courses">Browse Courses</a>
    `,
  })
}

// 2. Discount link mail — admin bhejega
const sendDiscountMail = (to, { name, courseTitle, originalPrice, discountPrice, token, expiresAt }) => {
  return sendMail({
    to,
    subject: `Special Offer for You — ${courseTitle} 🎟️`,
    html   : `
      <h2>Hi ${name}, you have a special offer!</h2>
      <p><b>Course:</b> ${courseTitle}</p>
      <p><b>Original Price:</b> $${originalPrice}</p>
      <p><b>Your Price:</b> $${discountPrice}</p>
      <p><b>Valid Till:</b> ${new Date(expiresAt).toLocaleString()}</p>
      <br/>
      <a href="${env.frontendUrl}/checkout?token=${token}">Claim Offer</a>
    `,
  })
}

// 3. Invoice mail — payment ke baad
const sendInvoiceMail = (to, { name, courseTitle, amount, invoiceUrl, transactionId }) => {
  return sendMail({
    to,
    subject: `Invoice — ${courseTitle} ✅`,
    html   : `
      <h2>Payment Successful!</h2>
      <p>Hi ${name}, thank you for your purchase.</p>
      <p><b>Course:</b> ${courseTitle}</p>
      <p><b>Amount Paid:</b> $${amount}</p>
      <p><b>Transaction ID:</b> ${transactionId}</p>
      <br/>
      <a href="${invoiceUrl}">Download Invoice</a>
    `,
  })
}

// 4. Sub-admin credentials mail — admin ne banaya
const sendSubAdminCredsMail = (to, { name, password }) => {
  return sendMail({
    to,
    subject: 'Your Admin Account is Ready 🔐',
    html   : `
      <h2>Hi ${name}!</h2>
      <p>Your sub-admin account has been created.</p>
      <p><b>Email:</b> ${to}</p>
      <p><b>Password:</b> ${password}</p>
      <br/>
      <a href="${env.frontendUrl}/login">Login Here</a>
      <br/><br/>
      <small>Please change your password after first login.</small>
    `,
  })
}

export {
  sendWelcomeMail,
  sendDiscountMail,
  sendInvoiceMail,
  sendSubAdminCredsMail,
}