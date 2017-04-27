var express = require('express');
var router = express.Router();

const knex = require('../db/knex');

// FUNCTIONS
function validTodo(todo) {
    return typeof todo.title == 'string' &&
        todo.title.trim() != '' &&
        typeof todo.priority != 'undefined' &&
        !isNaN(Number(todo.priority));
};

function resRenderTodo(id, res, viewName) {
    if (validId(id)) {
        knex('todo')
            .select()
            .where('id', id)
            .first()
            .then(todo => {
                res.render(viewName, todo);
            });
    } else {
        res.status(500);
        res.render('error', {
            message: 'Invalid id'
        })
    }
};

function insertUpdateRedirect(req, res, callback) {
    if (validTodo(req.body)) {
        let todo = {
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
        };
        // inserting into the database
        callback(todo);
    } else {
        res.status(500);
        res.render('error', {
            message: 'Invalid todo'
        })
    }
}

function validId(id) {
    return !isNaN(id);
}

// ROUTES

/* GET todo page. localhost:3000/todo/ */
router.get('/', (req, res) => {
    knex('todo')
        .select()
        .then(todos => {
            res.render('all', { todos: todos });
        })
});

// Needs to be before route GET '/:id' otherwise will assume :id = new 
// creating new todo item on handlebar form new @ localhost:3000/todo/new
router.get('/new', (req, res) => {
    console.log("going GET '/new' route");
    res.render('new');
});

//  looking at certain title w localhost:3000/todo/:id
router.get('/:id', (req, res, next) => {
    console.log("going GET '/:id' route");
    const id = req.params.id;
    resRenderTodo(id, res, 'single');
});

router.get('/:id/edit', (req, res) => {
    console.log("going GET '/:id/edit' route");
    const id = req.params.id;
    resRenderTodo(id, res, 'edit');
})

// after new form is submitted goes to this route posting to my_users db todo table from id with knex then redirect to localhost:3000/todo
router.post('/', (req, res) => {
    console.log("going POST '/' route");
    insertUpdateRedirect(req, res, (todo) => {
        todo.date = new Date();
        knex('todo')
            .insert(todo, 'id')
            .then(ids => {
                const id = ids[0];
                res.redirect(`/todo/${id}`);
            });
    })
});

router.put('/:id', (req, res) => {
    console.log("going PUT '/:id' route");
    insertUpdateRedirect(req, res, (todo) => {
        todo.date = new Date();
        knex('todo')
            .where(id, req.params.id)
            .update(todo, 'id')
            .then(() => {
                res.redirect(`/todo/${req.params.id}`);
            });
    })
});

router.delete('/:id', (req, res) => {
    console.log("going DELETE '/:id' route");
    const id = req.params.id;
    if (validId(id)) {
        knex('todo')
            .select()
            .where('id', id)
            .del()
            .then(() => {
                res.redirect('/todo');
            });
    } else {
        res.status(500);
        res.render('error', {
            message: 'Invalid id'
        })
    }
})

module.exports = router;