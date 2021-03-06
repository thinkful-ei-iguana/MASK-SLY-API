const app = require('../src/app');
const helpers = require('./test-helpers');

// Contains all tests for the user answers endpoints
describe.only('User Answers Endpoints', function () {

  // Creates a container for the knex instance at an accessible scope for all tests
  let db;

  // Creates a test user for accessing auth protected endpoints
  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  // Take the necessary test arrays from the helpers
  const [testQuestions, testAnswers, testUserAnswers] = helpers.makeQuestionAndAnswersArrays();

  // Before all tests creates the knex instance to the database
  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  // After all tests diconnect from the database
  after('disconnect from db', () => db.destroy());

  // Before all tests make sure the tables are clean
  before('cleanup', () => helpers.cleanTables(db));

  // After each test make sure the tables are clean
  afterEach('cleanup', () => helpers.cleanTables(db));

  // Contains all the tests for the '/user_answers' endpoints
  describe('/api/user_answers', () => {

    // Before each test seed the users, questions, and answers into the database
    beforeEach('insert users, questions, and answers', () => {
      return helpers.seedUsersQuestionsAnswers(
        db,
        testUsers,
        testQuestions,
        testAnswers,
        testUserAnswers
      );
    });

    // Contains all tests for the GET user questions endpoint
    describe('GET /api/user_answers/:question_id', () => {

      // Contains the tests for retrieving a specific user answer
      it('responds with a 200 and the expected users answer', () => {

        // Creates the test question
        const testQuestion = testQuestions[1];

        // Gets the corret expected user answer
        const userAnswer = helpers.findUserAnswer(testUserAnswers, testQuestion.id, testUser.id);

        // Gets the count of how many users have answered the question
        const questionAnswerCount = testUserAnswers.filter(answer => answer.question_id === userAnswer.question_id).length;

        // Gets the count of how many times the answer has been selected by users
        const answerSelectedCount = testUserAnswers.filter(answer => answer.answer_id === userAnswer.answer_id).length;
      
        // Finds the answer corresponding to the user answers answer id
        const answer = helpers.findAnswer(testAnswers, userAnswer.answer_id);

        return supertest(app)
          .get(`/api/user_answers/${testQuestion.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect({
            answer: answer.answer,
            selected: answerSelectedCount,
            answered: questionAnswerCount
          });
      });
    });
    
    // Contains all tests for the POST user answers endpoint
    describe('POST /api/user_answers', () => {

      // Establishes the required fields to post a user answer
      const requiredFields = ['question_id', 'answer_id'];

      // Applies the tests for the request body validation to each of the required fields
      requiredFields.forEach(field => {

        // Creates the test answer and the test question being answered
        const testQuestion = testQuestions[2];
        const testAnswer = testAnswers[10];

        // Establishes a test request body to send
        const newUserAnswer = {
          answer_id: testAnswer.id,
          question_id: testQuestion.id
        };

        // Now run the actual test
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {

          // Delete the current field from the new user answer
          delete newUserAnswer[field];

          return supertest(app)
            .post('/api/user_answers')
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .send(newUserAnswer)
            .expect(400, {
              error: `Missing '${field}' in request body`
            });
        });
      });

      // Tests whether the endpoint responds appropriately when the user posts
      it('creates a user answer, responding with 201 and the users answer, how many other users selected the answer, and and how many users have answered the question', () => {
        
        // Establishes the test question and test answer
        const testQuestion = testQuestions[2];
        const testAnswer = testAnswers[10];
        
        // Creates the new user answer for the request body
        const newUserAnswer = {
          answer_id: testAnswer.id,
          question_id: testQuestion.id
        };

        // Gets the count of how many users have answered the question
        const questionAnswerCount = testUserAnswers.filter(answer => answer.question_id === testQuestion.id).length;

        // Gets the count of how many times the answer has been selected by users
        const answerSelectedCount = testUserAnswers.filter(answer => answer.answer_id === testAnswer.id).length;

        return supertest(app)
          .post('/api/user_answers')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(newUserAnswer)
          .expect(201)
          .expect(res => {
            expect(res.body.answer).to.eql(testAnswer.answer);
            expect(res.body.selected).to.eql(answerSelectedCount + 1);
            expect(res.body.answered).to.eql(questionAnswerCount + 1);
          });
      }); 
    });
  });
});