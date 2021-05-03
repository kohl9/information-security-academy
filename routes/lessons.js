const express = require('express')
const Lesson = require('./../models/lesson')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('lessons/new', { lesson: new Lesson() })
})

router.get('/edit/:id', async (req, res) => {
    const lesson = await Lesson.findById(req.params.id)
    res.render('lessons/edit', { lesson: lesson })
})

router.get('/:slug', async (req, res) => {
    const lesson = await Lesson.findOne({ slug: req.params.slug })
    if (lesson == null) res.redirect('/')
    res.render('lessons/show', { lesson: lesson })
})

router.post('/', async (req, res, next) => {
    req.lesson = new Lesson()
    next()
}, saveLessonAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.lesson = await Lesson.findById(req.params.id)
    next()
}, saveLessonAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Lesson.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

// router.get('/:id', async (req, res) => {
//     const lesson = await Lesson.findById(req.params.id)
//     if (lesson == null) res.redirect('/')
//     res.render('lessons/show', { lesson: lesson })
// })

router.get('/', async (req, res) => {
    const lessons = await Lesson.find()
    res.render('lessons/index', { lessons: lessons })
})

function saveLessonAndRedirect(path) {
    return async (req, res) => {
        let lesson = req.lesson
        lesson.title = req.body.title
        lesson.description = req.body.description
        lesson.markdown = req.body.markdown
        console.log(lesson.title + ' ' + lesson.markdown)
        try {
            lesson = await lesson.save()
            console.log('Done')
            res.redirect(`/lessons/${lesson.slug}`)
        } catch (e) {
            res.render(`lessons/${path}`)
        }
    }
}

module.exports = router