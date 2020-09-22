const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const nunjucks = require('nunjucks')
const path = require('path')
const Flash = require('connect-flash')
const mongoose = require('mongoose')
const databaseConfig = require('./config/database')
const Sentry = require('@sentry/node');
const sentryConfig = require('./config/sentry')

const Youch = require('youch')

const { validate } = require('express-validation')

class App {
  constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV != 'production'

    this.database()
    this.middleware()
    this.routes()
    this.exception()
  }

  database() {
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middleware() {
    this.express.use(express.json())
    this.express.use(Flash())
    this.express.use(
      session({
        secret: "AppMarket",
        resave: true,
        store: new FileStore({
          path: path.resolve(__dirname, '..', 'tmp', 'sessions')
        }),
        saveUninitialized: false
      })
    )

    this.express.use(Sentry.Handlers.requestHandler())

  }

  routes () {
    this.express.use(require('./routes'))
  }

  exception () {
    this.express.use((err, req, res, next) => {
      // console.log(err.statusCode)
      // console.log(err.details)

      if (process.env.NODE_ENV == 'production') {
        this.express.use(Sentry.Handlers.errorHandler())
      }

      if (err.details != undefined) {
        return res.status(err.statusCode).json(err)
      }

      if (process.env.NODE_ENV != 'production') {
        const youch = new Youch(err, req)

        return res.send(youch.toJSON())
      }

      return res
        .status(err.status || 500)
        .json({ error: 'Internal Server Error' })
    })

  }

  sentry () {
    Sentry.init(sentryConfig)
  }


}

module.exports = new App().express;
