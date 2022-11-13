/* eslint-disable func-names */
/* eslint-disable no-return-assign */
module.exports = function computePrices(courses) {
	return courses.reduce((total, course) => total += course.price * course.count, 0);
};
