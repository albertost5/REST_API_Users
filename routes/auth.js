const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



router.post('/', async (req, res) => {

    try {
        // Return the document or null.
        user = await User.findOne({ email: req.body.email }).exec();

        let validPassword = bcrypt.compareSync(req.body.password, user.password);

        if (user && validPassword) {
            let jsonWebToken = jwt.sign({ _id: user._id, name: user.name, email: user.email }, 'whatever', { expiresIn: '1h' });
            // res.json(`Welcome ${user.name}!!`);
            res.json(
                {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    jsonWebToken
                }
            );
        } else {
            return res.status(401).json({
                'code': 401,
                'message': 'UNATHORIZED',
                'description': 'Wrong credentials.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            'code': 500,
            'message': 'INTERNAL_SERVER_ERROR',
            'description': 'There was a problem with the server.'
        });
    }

});



// EXPORT
module.exports = router;