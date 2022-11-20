const {Router} = require('express');
const Course = require('../models/Course');
const computePrices = require('../utils/price');
const auth = require('../middleware/auth');
const router = Router();

function mapCartItems(cart) {
	return cart.items.map(item => ({...item.courseId._doc, id: item.courseId.id, count: item.count}));
}

router.post('/add', auth, async (req, res) => {
	const course = await Course.findById(req.body.id);
	console.log(req.user);
	await req.user.addToCart(course);
	res.redirect('/cart');
});

router.delete('/remove/:id', auth, async (req, res) => {
	console.log('id => ', req.params.id);
	await req.user.removeFromCart(req.params.id);
	const user = await req.user.populate('cart.items.courseId');
	const courses = await mapCartItems(user.cart);
	const cart = {
		courses, price: computePrices(courses),
	};
	res.status(200).json(cart);
});

router.get('/', auth, async (req, res) => {
	const user = await req.user.populate('cart.items.courseId');
	const courses = mapCartItems(user.cart);
	res.render('cart', {
		title: 'Cart',
		courses,
		price: computePrices(courses),
		isCart: true,
	});
});

module.exports = router;
