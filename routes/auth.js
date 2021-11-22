const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');



router.post('/', async (req, res) => {

    try {
        // Return the document or null.
        user = await User.findOne({ email: req.body.email }).exec();

        let validPassword = bcrypt.compareSync(req.body.password, user.password);f

        if (user && validPassword) {
            res.json(`Welcome ${user.name}!!`);
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