// MODULES
const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// MIDDLEWARES
// router.use(express.json());


// ROUTES
router.get('/', (req, res) => {
    res.json('Ready first courses endpoint.');
});


router.post('/', async (req, res) => {

    let course;
    try {
        course = await createCourse(req.body);
    } catch (error) {
        return res.status(400).json({
            'code': 400,
            'message': 'BAD_REQUEST',
            'description': 'Error creating course.'
        });
    }
    res.json(course);
});

router.put('/:id', async (req, res) => {

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
        res.status(400).json({
            'code': 400,
            'message': 'BAD_REQUEST',
            'description': 'Error updating course.'
        });
    }

    res.json(course);
});

router.delete('/:id', async (req, res) => {
    let course;

    try {
        course = await Course.findByIdAndUpdate(req.params.id, { $set: { status: false } }, { returnOriginal: false });
    } catch (error) {
        res.status(404).json({
            'code': 404,
			'message': 'NOT_FOUND',
			'description': 'Error deleting course.'
        });
    }

    res.json(`The course, ${course.title}, was deleted.`);
});

// FUNCTIONS
async function createCourse(body) {
    let course = new Course({
        title: body.title,
        description: body.description
    });

    return course.save();
}


module.exports = router;