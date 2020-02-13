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

// Returns an array of answers and an array of quesitons
function makeQuestionAndAnswersArray() {
  const questions = [
    {
      id: 1,
      question: "What is the airspeed velocity of an unlaiden swallow",
      topic: "history",
      answered: 34
    },
    {
      id: 2,
      question: "What am I holding in my hand?",
      topic: "psychic",
      answered: 19
    },
    {
      id: 3,
      question: "What is the meaning of life, the universe and everything?",
      topic: "philosophy",
      answered: 42
    },
    {
      id: 4,
      question: "",
      topic: "",
      answered: 34
    },
    {
      id: 5,
      question: "",
      topic: "",
      answered: 34
    }
  ]
}

// Generates an authorization header usin the users information and the jwt secret
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {

  // Creates the token
  const token = jwt.sign(
    { user_id: user.id},
    secret,
    {
      subject: user.username,
      algorithm: 'HS256'
    }
  );

  //returns the generated token
  return `Bearer ${token}`;
}

// Cleans all of the tables in the database
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        "user_answers",
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
  makeAuthHeader,
  cleanTables,
  seedUsers
}