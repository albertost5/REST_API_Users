const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('config');
const errorResponse = require('../utils/error.util');



router.post('/', async (req, res) => {

    try {
        // Return the document or null.
        user = await User.findOne({ email: req.body.email });

        let validPassword = bcrypt.compareSync(req.body.password, user.password);

        if (user && validPassword) {
            let jsonWebToken = jwt.sign({ _id: user._id, role: user.role, email: user.email }, config.get('tokenConfig.secret'), { expiresIn: config.get('tokenConfig.expiration') });
            // res.json(`Welcome ${user.name}!!`);
            res.json(
                {
                    id: user._id,
                    jsonWebToken
                }
            );
        } else {
            return res.status(401).json(errorResponse(401, 'UNATHORIZED', 'Wrong credentials.'));
        }
    } catch (error) {
        return res.status(500).json(errorResponse(500, 'INTERNAL_SERVER_ERROR', 'There was a problem with the server.'));
    }

});



// EXPORT
module.exports = router;