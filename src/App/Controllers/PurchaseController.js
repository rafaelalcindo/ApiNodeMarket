const Ad = require('../Models/Ad')
const User = require('../Models/User')
const Mail = require('../services/Mails')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    // await Mail.sendMail({
    //   from: '"Rafael alcindo" <rafael10expert@gmail.com>',
    //   to: purchaseAd.author.email,
    //   subject: `Solicitação de compra: ${purchaseAd.title}`,
    //   template: 'purchase',
    //   context: { user: user.toJSON() , content, ad: purchaseAd.toJSON() }
    // })

    Queue.create(PurchaseController.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.send()
  }
}

module.exports = new PurchaseController()
