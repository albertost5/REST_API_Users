// MODULES
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const verifyToken = require('../middlewares/auth');
const roles = require('./types/roles');
const errorResponse = require('../utils/error.util');

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
router.get('/', verifyToken, async (req, res) => {
	let users;
	try {
		users = await readUsers();
	} catch (error) {
		return res.status(404).json(errorResponse(404, 'NOT_FOUND', 'Error getting users.'));
	}

	res.json(users);
});

router.post('/', async (req, res) => {

	let body = req.body;

	User.findOne({ email: body.email }, (err, user) => {
		if (err) {
			res.status(404).json(errorResponse(404, 'NOT_FOUND', 'Something went wrong.'));
		}

		if (user) {
			res.status(409).json(errorResponse(409, 'CONFLICT', `The user ${body.email} already exists.`));
		}
	});

	const { error, value } = schema.validate({ name: body.name, email: body.email });

	if (error) return res.status(400).json({
		'code': 400,
		'message': 'BAD_REQUEST',
		'description': error.details[0].message.replace(/\"/g, '').toUpperCase()
	});

	let user;

	try {
		user = await createUser(body);
	} catch (err) {
		return res.status(400).json(errorResponse(400, 'BAD_REQUEST', 'Bad request due to malformed sintax.'));
	}

	res.json({
		'name': user.name,
		'email': user.email
	});
});

router.put('/:email', verifyToken, async (req, res) => {
	const EMAIL = req.params.email;

	// check if the token has expired

	if (EMAIL == req.userEmail || req.userRole == roles.ADMIN) {
		const { error, value } = schema.validate({ name: req.body.name });

		if (error) return res.status(400).json( errorResponse( 400, 'BAD_REQUEST', error.details[0].message.replace(/\"/g, '').toUpperCase() ) );

		let user;

		try {
			user = await updateUser(EMAIL, req.body);
		} catch (err) {
			return res.status(400).json(errorResponse(400, 'BAD_REQUEST', 'Error updating user.'));
		}

		res.json({
			name: user.name,
			email: user.email,
			password: user.password
		});
	} else {
		return res.status(403).json(errorResponse(403, 'FORBIDDEN', `The user doesn't have right to update other users.`));
	}

});

router.delete('/:email', verifyToken, async (req, res) => {

	const EMAIL = req.params.email;

	if (EMAIL == req.userEmail || req.userRole == roles.ADMIN) {

		try {
			user = await disableUser(req.params.email);
		} catch (err) {
			return res.status(404).json(errorResponse(404, 'NOT_FOUND', 'Error deleting user.'));
		}

		res.json(`The user, ${user.email}, was deleted.`);

	} else {
		return res.status(403).json(errorResponse(403, 'FORBIDDEN', `The customer doesn't have right to delete other accounts.`));
	}
});

// FUNCTIONS
async function readUsers() {
	let users = User.find({ status: true }, 'name email').select("-_id");
	return users;
}

async function createUser(body) {
	let user = new User({
		email: body.email,
		name: body.name,
		password: bcrypt.hashSync(body.password, 10),
	});

	return user.save();
}

async function updateUser(userEmail, body) {
	let user = User.findOneAndUpdate(
		{ email: userEmail },
		{
			$set:
			{
				name: body.name,
				password: bcrypt.hashSync(body.password, 10)
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