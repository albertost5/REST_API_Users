// MODULES
const express = require('express');
const user = require('../models/user');
const router = express.Router();
const User = require('../models/user');
const Joi = require('joi');


// MIDDLEWARES
// router.use(express.json());

// SCHEMA
const schema = Joi.object({
	name: Joi.string()
		.min(3)
		.max(10)
		.required(),

	password: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});


// ROUTES
router.get('/', async (req, res) => {
	let users;
	try {
		users = await readUsers();
	} catch (error) {
		return res.status(404).json({
			'code': 404,
			'message': 'NOT_FOUND',
			'description': 'Error getting users.'
		});
	}

	res.json(users);
});

router.post('/', async (req, res) => {

	let body = req.body;
	// let result = createUser(body);
	const { error, value } = schema.validate({ name: body.name, email: body.email });

	if(error) return res.status(400).json({
		'code': 400,
		'message': 'BAD_REQUEST',
		'description': error.details[0].message.replace(/\"/g, '').toUpperCase()
	});

	let result;

	try {
		result = await createUser(body);
	} catch (err) {
		return res.status(400).json({
			'code': 400,
			'message': 'BAD_REQUEST',
			'description': 'Bad request due to malformed sintax.'
		});
	}

	res.json(result);
});

router.put('/:email', async (req, res) => {
	const EMAIL = req.params.email;

	const { error, value } = schema.validate({ name: req.body.name });

	if(error) return res.status(400).json({
		'code': 400,
		'message': 'BAD_REQUEST',
		'description': error.details[0].message.replace(/\"/g, '').toUpperCase()
	});

	let user;

	try {
		user = await updateUser(EMAIL, req.body);
	} catch (err) {
		return res.status(400).json({
			'code': 400,
			'message': 'BAD_REQUEST',
			'description': 'Error updating user.'
		});
	}

	res.json({
		name: user.name,
		email: user.email,
		password: user.password
	});
});

router.delete('/:email', async (req, res) => {

	let user;
	try {
		user = await disableUser(req.params.email);
	} catch (err) {
		return res.status(404).json({
			'code': 404,
			'message': 'NOT_FOUND',
			'description': 'Error deleting user.'
		});
	}
	res.json(`Deleted user with email: ${user.email}`)
});

// FUNCTIONS
async function readUsers() {
	let users = User.find({ status: true }, 'name email').select("-_id").exec();
	return users;
}

async function createUser(body) {
	let user = new User({
		email: body.email,
		name: body.name,
		password: body.password
	});

	return await user.save();
}

async function updateUser(userEmail, body) {
	let user = User.findOneAndUpdate(
		{ email: userEmail },
		{
			$set:
			{
				name: body.name,
				password: body.password
			}
		},
		{ returnDocument: 'after' }
	);

	return user;
}

async function disableUser(userEmail) {
	let user = User.findOneAndUpdate(
		{ email: userEmail },
		{
			$set:
			{
				status: false,
			}
		},
		{ returnDocument: 'after' }
	);

	return user;
}



// EXPORT
module.exports = router;