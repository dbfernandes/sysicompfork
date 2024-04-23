const path = require('path')
const { request } = require('express')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const { host, port, user, pass } = require("../config/mail-sample.json")


const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    }
})

transport.use('compile', hbs({
    viewEngine: {
        extName: ".html",
        partialsDir: path.resolve('./src/views/mail'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./app/views/mail/'),
    extName: '.html',
}))

module.exports = transport;