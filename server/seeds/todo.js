// title - text
// priority - integer 1, 2, 3
// description - text
// done - boolean
// date - datetime

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('todo').del()
    // Inserts seed entries
    .then(function () {
      const todos = [{
          title: 'build CRUD app',
          priority: 1,
          date: new Date()
        },
        {
          title: 'practice golf',
          priority: 3,
          date: new Date()
        },
        {
          title: 'keep practicing React and Node.js',
          priority: 2,
          date: new Date()
        }
      ];
      return knex('todo').insert(todos);
    });
};
