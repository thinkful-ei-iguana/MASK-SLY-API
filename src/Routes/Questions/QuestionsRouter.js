const express = require('express');
const QuestionsService = require('./QuestionsService');
const { requireAuth } = require('../../Middleware/JWT');

const questionsRouter = express.Router();

// Sets require auth on all questions checkpoints
questionsRouter.use(requireAuth);

// Responds when a GET request is made to the '/api/questions' endpoint
questionsRouter.route('/').get(async (req, res, next) => {
  try {
    // Retrieve questions from the database
    const questions = await QuestionsService.getQuestions(req.app.get('db'));

    // Respond with the questions
    res.json(questions);

    next();
  } catch (error) {
    next(error);
  }
});

// Responds with the specific question and its answer selections
questionsRouter.get('/:question_id', (req, res) => {
  const { question_id } = req.params;

  QuestionsService.getQuestion(req.app.get('db'), question_id).then(result => {
    const [question] = result;
    res.status(200).json(question);
  });
});

// Responds when a GET request is made to the '/questions/topic' endpoint
questionsRouter.get('/topic', (req, res) => {
  // Retrieves all the questions and groups them by topic and returns them to the client
  QuestionsService.groupByTopic(req.app.get('db')).then(result => {
    return res.status(200).json(result);
  });
});

// Responds when a GET request is made to the '/questions/topic/:topic' endpoint
questionsRouter.get('/topic/:topic', (req, res) => {
  const { topic } = req.params;

  // Retrieves all the questions related to ':topic' and returns them to the client
  QuestionsService.getQuestionAnswers(req.app.get('db'), topic).then(res =>
    console.log(res)
  );
});

// Used to return a user's completed quiz array
questionsRouter.get('/completed/:user_id', (req, res, next) => {
  const { user_id } = req.params;
  let allQuestionIds = [];
  let completedQuestionIds = [];
  let incompletedQuestionData = [];
  let completedQuestionData = [];

  QuestionsService.getQuestions(req.app.get('db')).then(questionIds => {
    return (allQuestionIds = questionIds);
  });
  QuestionsService.getCompletedIds(req.app.get('db'), user_id)
    .then(result => {
      return (completedQuestionIds = result);
    })
    .then(() => {
      allQuestionIds.forEach(item1 => {
        completedQuestionIds.forEach(item2 => {
          if (item1.id !== item2.question_id) {
            console.log('fail incomplete');
            incompletedQuestionData.push(item1);
          } else {
            console.log('fail complete');
            completedQuestionData.push(item1);
          }
        });
      });
    })
    .then(() => {})
    .then(() => {
      console.log(completedQuestionData);
      console.log(incompletedQuestionData);
    });
});

// Responds when a GET request is made to the '/questions/:page' endpoint
questionsRouter.route('/:page/:page_size').get(async (req, res, next) => {
  try {
    res.json(
      await QuestionsService.paginateQuestions(
        req.app.get('db'),
        req.params.page,
        req.params.page_size
      )
    );
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = questionsRouter;
