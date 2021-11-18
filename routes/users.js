// MODULES
const express = require('express');
const router = express.Router();

// MIDDLEWARES
router.use(express.json());


// ROUTES
router.get('/', (req, res) => {
    res.json('Ready first users endpoint');
});

module.exports = router;