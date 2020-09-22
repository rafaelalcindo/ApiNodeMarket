const express = require('express')
const upload = require('multer')
const { validate } = require('express-validation')
const handle = require('express-async-handler')

const routes = express.Router()
const authMiddleware = require('./App/middlewares/auth')

const UserController = require('./App/Controllers/UserController')
const SessionController = require('./App/Controllers/SessionController')
const AdController = require('./App/Controllers/AdController')
const PurchaseController = require('./App/Controllers/PurchaseController')

const validators = require('./App/validators')

routes.post('/users', validate(validators.User), handle(UserController.store))
routes.post('/sessions', validate(validators.Session), handle(SessionController.store))

routes.get('/teste', authMiddleware, (req, res) => res.json({ ok: true }))

routes.use(authMiddleware)

routes.get('/ads', AdController.index)
routes.get('/ads/:id', AdController.show)
routes.post('/ads', validate(validators.Ad), handle(AdController.store))
routes.put('/ads/:id', validate(validators.Ad), handle(AdController.update))
routes.delete('/ads/:id', AdController.destroy)

routes.post('/purchases', validate(validators.Purchase), PurchaseController.store)


module.exports = routes;
