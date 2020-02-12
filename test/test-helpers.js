const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Make the knex instance connected to postgres

function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL
  });
}

// Returns an array of test users

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'OldBen',
      password: 'UseThe4ce',
      first_name: 'Obewon',
      last_name: 'Kenobi',
      email: 'theforceisstrongwiththis1@gmail.com'
    },
    {
      id: 2,
      username: 'The Dr.',
      password: 'itsb1ggeronthe1ns1de',
      first_name: 'The',
      last_name: 'Doctor',
      email: 'TARDIStrooper@yahoo.com'
    }
  ];
}

// Cleans all of the tables in the database
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        "users"`
    )
      .then(() =>
        Promise.all([
          trx.raw('ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1'),
          trx.raw('SELECT setval(\'users_id_seq\', 0)')
        ])
      )
  );
}

// Seeds the users into the database
function seedUsers(db, users) {
  // Prepares the users by bcrypting their password
  const hashedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 12)
  }))

  // Inserts the users into the database and set the id sequence to match the number of users
  return db.transaction(async trx => {
    await trx.into('users').insert(hashedUsers)

    await trx.raw(
      'SELECT setval(\'users_id_seq\', ?)',
      [users[users.length - 1].id]
    )
  })
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  cleanTables,
  seedUsers
}