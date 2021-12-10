// MODULES
const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const verifyToken = require('../middlewares/auth');
const roles = require('./types/roles');
const errorResponse = require('../utils/error.util');

// ROUTES
router.get('/', verifyToken, async (req, res) => {
    let courses;

    try {
        courses = await Course.find({ status: true }).select('_id description title author').populate('author','-_id name');
    } catch (error) {
        res.status(404).json(errorResponse(404, 'NOT_FOUND', 'Error getting courses.'));
    }
    if(!courses) return res.status(204).json('There is not courses to show.');
    res.json(courses);

});


router.post('/', verifyToken, async (req, res) => {
    
    let course;

    try {
        course = await Course.create({ title: req.body.title, description: req.body.description, author: req.userId });
    } catch (error) {
        return res.status(400).json(errorResponse(400, 'BAD_REQUEST', 'Error creating course.'));
    }

    res.json({
        "title": course.title,
        "description": course.description,
        "author": course.author
    });
});

router.put('/:id', verifyToken, async (req, res) => {
    if (req.userRole == roles.ADMIN) {

        let course;
        let body = req.body;
        let update = {
            $set:
            {
                title: body.title,
                description: body.description
            }
        };

        try {
            course = await Course.findByIdAndUpdate(req.params.id, update, { returnOriginal: false })
        } catch (error) {
            res.status(400).json(errorResponse(400, 'BAD_REQUEST', 'Error updating course.'));
        }

        res.json({
            "title": course.title,
            "description": course.description,
            "_id": course._id
        });

    } else {
        res.status(403).json(errorResponse(403, 'FORBIDDEN', `The customer doesn't have right to update a course.`));
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    if (req.userRole == roles.ADMIN) {

        let course;
        try {
            course = await Course.findByIdAndUpdate(req.params.id, { $set: { status: false } }, { returnOriginal: false });
        } catch (error) {
            res.status(404).json(errorResponse(404, 'NOT_FOUND', 'Error deleting course.'));
        }

        res.json(`The course, ${course.title}, was deleted.`);

    } else {
        res.status(403).json(errorResponse(403, 'FORBIDDEN', `The customer doesn't have right to delete a course.`));
    }

});


// EXPORT
module.exports = router;