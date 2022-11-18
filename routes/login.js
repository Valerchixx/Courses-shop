const {Router} = require('express');
const router = Router();

router.get('/login', async (req, res) => {
	res.render('../views/auth/login.hbs', {
		titlle: 'Authorisation',
		isLogin: true,
	});
});

module.exports = router;
