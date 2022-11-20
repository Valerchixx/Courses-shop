const {Router} = require('express');
const User = require('../models/User');
const router = Router();

router.get('/login', async (req, res) => {
	res.render('../views/auth/login.hbs', {
		titlle: 'Authorisation',
		isLogin: true,
	});
});

router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login#login');
	});
});

router.post('/login', async (req, res) => {
	const user = await User.findById('636be0fea700fb6b8b84d0d3');
	req.session.isAuth = true;
	req.session.user = user;
	req.session.save(err => {
		if (err) {
			throw err;
		}

		res.redirect('/');
	});
});
module.exports = router;
