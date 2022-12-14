const {Router} = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = Router();

router.get('/login', async (req, res) => {
	res.render('../views/auth/login.hbs', {
		titlle: 'Authorisation',
		isLogin: true,
		loginError: req.flash('loginError'),
		registerError: req.flash('registerError'),
	});
});

router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login#login');
	});
});

router.post('/login', async (req, res) => {
	try {
		const {email, password} = req.body;
		const candidate = await User.findOne({email});
		if (candidate) {
			const areSame = await bcrypt.compare(password, candidate.password);
			if (areSame) {
				req.session.user = candidate;
				req.session.isAuth = true;
				req.session.save(err => {
					if (err) {
						throw err;
					}

					res.redirect('/');
				});
			} else {
				req.flash('loginError', 'Passwords are not matched');
				res.redirect('/auth/login#login');
			}
		} else {
			req.flash('loginError', 'User with this name doesn\'t exist');
			res.redirect('/auth/login#login');
		}
	} catch (error) {
		console.log(error);
	}
});

router.post('/register', async (req, res) => {
	try {
		const {email, password, name} = req.body;
		const candidate = await User.findOne({email});
		if (candidate) {
			req.flash('registerError', 'User with this name already exist');
			res.redirect('/auth/login#register');
		} else {
			const hashpass = await bcrypt.hash(password, 10);
			const user = new User({
				email, name, password: hashpass, cart: {items: []},
			});

			await user.save();
			res.redirect('/auth/login#login');
		}
	} catch (error) {
		console.log(error);
	}
});
module.exports = router;
