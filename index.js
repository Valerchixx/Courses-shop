const express = require('express');
const mongoose = require('mongoose');
const exhbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const homeRoute = require('./routes/home');
const coursesRoute = require('./routes/courses');
const ordersRoute = require('./routes/orders');
const addRoute = require('./routes/add');
const authnRoute = require('./routes/login');
const path = require('path');
const cartRoute = require('./routes/cart');
const User = require('./models/User');

const PORT = process.env.PORT || 3000;
const app = express();

const hbs = exhbs.create({
	defaultLayout: 'main',
	extname: 'hbs',
	handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(async (req, res, next) => {
	try {
		const user = await User.findById('636be0fea700fb6b8b84d0d3');
		req.user = user;
		next();
	} catch (e) {
		console.log(e);
	}
});
app.use('/', homeRoute);
app.use('/add', addRoute);
app.use('/courses', coursesRoute);
app.use('/cart', cartRoute);
app.use('/orders', ordersRoute);
app.use('/auth', authnRoute);

async function start() {
	try {
		const url = 'mongodb+srv://Lera:UydvyTymKQ7Y9t2Z@cluster.ezqdjlb.mongodb.net/shop';
		await mongoose.connect(url, {
			useNewUrlParser: true,
		});
		const candidate = await User.findOne();
		if (!candidate) {
			const user = new User({
				email: 'vproshahcenko@gmail.com',
				name: 'Lera',
				cart: {items: []},
			});
			await user.save();
		}

		app.listen(PORT, () => {
			console.log(`Server is listening on port: ${PORT}`);
		});
	} catch (e) {
		console.log(e);
	}
}

start();

