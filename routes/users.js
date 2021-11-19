// MODULES
const express = require('express');
const router = express.Router();
const User = require('../models/user');


// MIDDLEWARES
// router.use(express.json());


// ROUTES
router.get('/', (req, res) => {
    res.json('Ready first users endpoint');
});

router.post('/', (req, res) => {

    let body = req.body;
    let result = createUser(body);

    result.then(u => {

        res.json(u)

    }).catch(err => {

        res.status(400).json({
            'code': 400,
            'message': 'BAD_REQUEST',
            'description': 'Bad request due to malformed sintax.'
        })

    });
});





// FUNCTIONS
async function createUser(body) {
    let user = new User({
        email: body.email,
        name: body.name,
        password: body.password
    });

    return await user.save();
}



// EXPORT
module.exports = router;