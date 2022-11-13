/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
const uuid = require('uuid').v4;
const path = require('path');
const fs = require('fs');

class Course {
	constructor(title, img, price) {
		this.title = title;
		this.img = img;
		this.price = price,
		this.id = uuid();
	}

	toJSON() {
		return {
			title: this.title,
			img: this.img,
			price: this.price,
			id: this.id,
		};
	}

	static async update(course) {
		const courses = await Course.getAll();
		const idx = courses.findIndex(c => c.id === course.id);
		courses[idx] = course;
		console.log('courses', idx);

		return new Promise((resolve, reject) => {
			fs.writeFile(
				path.join(__dirname, '..', 'data', 'courses.json'),
				JSON.stringify(courses),
				err => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				},
			);
		});
	}

	async save() {
		const courses = await Course.getAll();
		courses.push(this.toJSON());

		return new Promise((resolve, reject) => {
			fs.writeFile(
				path.join(__dirname, '..', 'data', 'courses.json'),
				JSON.stringify(courses),
				err => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				},
			);
		});
	}

	static getAll() {
		return new Promise((resolve, reject) => {
			fs.readFile(
				path.join(__dirname, '..', 'data', 'courses.json'),
				'utf-8',
				(err, data) => {
					if (err) {
						reject(err);
					} else {
						resolve(JSON.parse(data));
					}
				},
			);
		});
	}

	static async getById(id) {
		const courses = await Course.getAll();
		return courses.find(c => c.id === id);
	}
}

module.exports = Course;
