const {Router} = require('express');
const Cart = require('../models/Cart');
const Course = require('../models/Course');
const router = Router();

router.post('/add', async (req,res) => {
    const course = await Course.getById(req.body.id);
    await Cart.add(course);
    res.redirect('/cart');
});

router.delete('/remove/:id', async (req, res) => {
    const cart = await Cart.remove(req.params.id)
    res.status(200).json(cart)

});

router.get('/', async (req,res) => {
    const cart = await Cart.fetch();
    res.render('cart', {
        title: 'Cart',
        courses: cart.courses,
        price: cart.price,
        isCart:true
    })
})

module.exports = router;