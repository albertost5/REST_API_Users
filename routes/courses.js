// MODULES
const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const verifyToken = require('../middlewares/auth');

// MIDDLEWARES
// router.use(express.json());


// ROUTES
router.get('/', verifyToken, async (req, res) => {
    let courses;

    try {
        courses = await Course.find({ status: true }).select('_id description title').exec();
    } catch (error) {
        res.status(404).json({
            'code': 404,
			'message': 'NOT_FOUND',
			'description': 'Error getting courses.'
        })
    }

    res.json(courses);

});


router.post('/', verifyToken, async (req, res) => {

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
    res.json({
        "title": course.title,
        "description": course.description
    });
});

router.put('/:id', verifyToken, async (req, res) => {

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

    res.json({
        "title": course.title,
        "description": course.description,
        "_id": course._id
    });
});

router.delete('/:id', verifyToken, async (req, res) => {
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


// EXPORT
module.exports = router;