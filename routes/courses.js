const {Router} = require('express');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', async (req, res) => {
	const courses = await Course.find().populate('userId', 'email name');
	res.render('courses', {
		title: 'Courses',
		isCourses: true,
		courses,
	});
});

router.get('/:id', async (req, res) => {
	const course = await Course.findById(req.params.id);
	res.render('course', {
		title: 'Course',
		course,
	});
});

router.post('/edit', auth, async (req, res) => {
	const {id} = req.body;
	delete req.body.id;
	await Course.findByIdAndUpdate(id, req.body);
	res.redirect('/courses');
});

router.post('/remove', auth, async (req, res) => {
	try {
		await Course.deleteOne({_id: req.body.id});
		res.redirect('/courses');
	} catch (e) {
		console.log(e);
	}
});

router.get('/:id/edit', auth, async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/');
	}

	const course = await Course.findById(req.params.id);
	console.log('route', course);

	res.render('course-edit', {
		title: `Edit ${course.title}`,
		course,
	});
});
module.exports = router;
