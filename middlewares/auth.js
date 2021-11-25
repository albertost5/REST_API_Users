const jwt = require('jsonwebtoken');
const config = require('config');



let verifyToken = (req, res, next) => {
	let authHeader = req.get('Authorization');
	if(!authHeader) return res.json({
		'code': 400,
		'message': 'BAD_REQUEST',
		'description': 'The user dont have rights.'
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
		next();
	});
};


// EXPORT
module.exports = verifyToken;