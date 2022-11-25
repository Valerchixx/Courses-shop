const {Router} = require('express');
const Course = require('../models/Course');
const computePrices = require('../utils/price');
const auth = require('../middleware/auth');
const router = Router();

function mapCartItems(cart) {
	return cart.items.map(item => (item.courseId && {...item.courseId._doc, id: item.courseId.id, count: item.count}));
}

router.post('/add', auth, async (req, res) => {
	const course = await Course.findById(req.body.id);
	await req.user.addToCart(course);
	res.redirect('/cart');
});

router.delete('/remove/:id', auth, async (req, res) => {
	await req.user.removeFromCart(req.params.id);
	const user = await req.user.populate('cart.items.courseId');
	const courses = await mapCartItems(user.cart);
	const cart = {
		courses, price: computePrices(courses),
	};
	res.status(200).json(cart);
});

router.get('/', auth, async (req, res) => {
	const options = {
		path: 'cart.items.courseId',
		match: {'modules.name': req.body.moduleName},
	};
	const user = await req.user
		.populate(options);

	for (let i = 0; i < user.cart.items.length; i++) {
		if (user.cart.items[i].courseId === null) {
			req.user.removeInvalid(user.cart.items[i]._id);
		}
	}

	const courses = await mapCartItems(user.cart);
	res.render('cart', {
		title: 'Cart',
		courses,
		price: computePrices(courses),
		isCart: true,
		csrf: req.csrfToken(),
	});
});

module.exports = router;
