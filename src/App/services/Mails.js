const nodemailer =  require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const exphbs = require('express-handlebars')
const mailConfig = require('../../config/mail')

const transport = nodemailer.createTransport(mailConfig)

const viewPath = path.resolve(__dirname, '..', 'views', 'emails')

transport.use('compile', hbs({
  viewEngine: {
    extname: '.hbs', // handlebars extension
    layoutsDir: viewPath, // location of handlebars templates
    defaultLayout: 'purchase', // name of main template
    partialsDir: viewPath, // location of your subtemplates aka. header, footer etc
  },
  viewPath,
  defaultLayout: false,
  layoutsDir: "views/layouts/",
  extName: '.hbs'
}))

module.exports = transport
