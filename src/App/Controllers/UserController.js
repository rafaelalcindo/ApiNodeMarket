const User = require('../Models/User')

class UserController {
  async store (req, res) {
    console.log(req.body)
    const { email } = req.body

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Usuário já existe' })
    }

    const user = await User.create(req.body)

    return res.json(user)
  }
}

module.exports = new UserController()
