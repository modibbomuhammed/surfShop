const faker = require('faker');
const Post = require('./models/post');
const cities = require('./cities');

// const seedPosts = async () => {
// 	await Post.remove({})
// 	for(let i of new Array(40)){
// 		const post = {
// 			title: faker.lorem.word(),
// 			description: faker.lorem.text(),
// 			author: {
// 					 '_id' : "5e68f90edfffd840396c9360",
// 				'username' : 'ash',
// 			}
// 		}
// 		await Post.create(post);
// 	}
// 	console.log('40 Posts created!!')
// }

async function seedPosts() {
	await Post.deleteMany({});
	for(const i of new Array(600)) {
		const random1000 = Math.floor(Math.random() * 1000);
		const random5 = Math.floor(Math.random() * 6);
		const title = faker.lorem.word();
		const description = faker.lorem.text();
		const postData = {
			title,
			description,
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			geometry: {
				type: 'Point',
				coordinates: [cities[random1000].longitude, cities[random1000].latitude],
			},
			author: "5e68f90edfffd840396c9360",
			image: [
				{
					url: 'https://res.cloudinary.com/devsprout/image/upload/v1561315599/surf-shop/surfboard.jpg'
				}
			],
			avgRating: random5,
			price: random1000
		}
		let post = new Post(postData);
		post.properties.description = `<strong><a href="/posts/${post._id}">${title}</a></strong><p>${post.location}</p><p>${description.substring(0, 20)}...</p>`;
		await post.save();
	}
	console.log('600 new posts created');
}

// export default = seedPosts
module.exports = seedPosts