const app = require('../src/app');
const helpers = require('./test-helpers');

// Contains tests for all questions endpoints
describe('Questions Endpoints', function () {

  // Creates a container for the knex instance at an accessible scope for all tests
  let db;

  // Creates test questions and answers arrays to seed the database
  const [testQuestions, testAnswers] = helpers.makeQuestionsAndAnswersArray();

  // Before all tests creates the knex instance to the database
  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  // After all tests disconnects from the database
  after('disconnect from db', () => db.destroy());

  // Before all tests make sure the tables are clean
  before('cleanup', () => helpers.cleanTables(db));

  // After each test make sure the tables are clean
  afterEach('cleanup', () => helpers.cleanTables(db));
});