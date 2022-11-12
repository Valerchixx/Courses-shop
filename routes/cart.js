/* eslint-disable no-return-assign */
const {Router} = require('express');
const Course = require('../models/Course');
const router = Router();

function mapCartItems(cart) {
	return cart.items.map(item => ({...item.courseId._doc, id: item.courseId.id, count: item.count}));
}

function computePrices(courses) {
	return courses.reduce((total, course) => total += course.price * course.count, 0);
}

router.post('/add', async (req, res) => {
	const course = await Course.findById(req.body.id);
	await req.user.addToCart(course);
	res.redirect('/cart');
});

router.delete('/remove/:id', async (req, res) => {
	console.log('id => ', req.params.id);
	await req.user.removeFromCart(req.params.id);
	const user = await req.user.populate('cart.items.courseId');
	const courses = await mapCartItems(user.cart);
	const cart = {
		courses, price: computePrices(courses),
	};
	res.status(200).json(cart);
});

router.get('/', async (req, res) => {
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
