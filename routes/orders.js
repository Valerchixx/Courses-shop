/* eslint-disable no-return-assign */
const {Router} = require('express');
const Order = require('../models/Order');
const router = Router();

router.get('/', async (req, res) => {
	try {
		const orders = await Order.find({'user.userId': req.user._id}).populate('user.userId');
		res.render('orders', {
			isOrder: true,
			title: 'Order',
			orders: orders.map(o => ({
				...o._doc,
				price: o.courses.reduce((total, course) => total += course.course.price * course.count, 0),
			})),
		});
	} catch (error) {
		console.log(error);
	}
});

router.post('/', async (req, res) => {
	try {
		const user = await req.user.populate('cart.items.courseId');
		const courses = user.cart.items.map(i => ({
			count: i.count,
			course: {...i.courseId._doc},
		}));
		const order = new Order({
			user: {
				name: req.user.name,
				userId: req.user,
			},
			courses,

		});

		await order.save();
		await req.user.cleanCart();
		res.redirect('/orders');
	} catch (error) {
		console.log(error);
	}
});
module.exports = router;
