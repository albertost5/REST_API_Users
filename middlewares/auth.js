const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/user');


let verifyToken = (req, res, next) => {
	let authHeader = req.get('Authorization');
	if(!authHeader) return res.json({
		'code': 401,
		'message': 'UNAUTHORIZED',
		'description': `The customer doesn't have right, missing authorization.`
	})
	let bearer = authHeader?.split(' ');
	let token = bearer[1];

	jwt.verify(token, config.get('tokenConfig.secret'), (err, jwtDecoded) => {
		if (err) {
			return res.status(403).json({
				'code': 403,
				'message': 'FORBIDDEN',
				'description': 'Could not connect to the protected route.'
			});
		}

		req.userId = jwtDecoded._id;
		req.userRole = jwtDecoded.role;
		req.userEmail = jwtDecoded.email;
		
		next();
	});
};


// EXPORT
module.exports = verifyToken;