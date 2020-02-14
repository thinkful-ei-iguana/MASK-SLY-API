const express = require('express');
const QuestionsService = require('./QuestionsService');
const { requireAuth } = require('../../Middleware/JWT');

const questionsRouter = express.Router();

// Sets require auth on all questions checkpoints
questionsRouter
  .use(requireAuth);

// Responds when a GET request is made to the '/api/questions' endpoint
questionsRouter
  .route('/')
  .get(async (req, res, next) => {
    try {

      // Retrieve questions from the database
      const questions = await QuestionsService.getQuestions(
        req.app.get('db')
      )
      
      // Respond with the questions
      res.json(questions);

      next();
    } catch (error) {
      next(error);
    }
  });

// Responds when a GET request is made to the '/questions/:page' endpoint
questionsRouter
  .route('/:page/:page_size')
  .get(async (req, res, next) => {
    try {
      res.json(await QuestionsService.paginateQuestions(
        req.app.get('db'),
        req.params.page,
        req.params.page_size
      ));
      next();
    } catch (error) {
      next(error)
    }
  });

// Responds when a GET request is made to the '/questions/:question_id/answers' endpoint
questionsRouter
  .route('/:question_id/answers')
  .get(async (req, res, next) => {
    try {

      // Checks if the question exists in the database
      const questionAnswers  = QuestionsService.getQuestionAnswers(
        req.app.get('db'),
        req.params.question_id
      );

      // If the question does not exist then responds with a 404 NOT FOUND
      if (questionAnswers === []) {
        return res
          .status(404)
          .json({
            error: 'Unable to find question with that id'
          });
      } else {
        return res.json(await  QuestionsService.getQuestionAnswers(
          req.app.get('db'),
          req.params.question_id
        ))
      }
      next();
    } catch (error) {
      next(error)
    }
  });

module.exports = questionsRouter;
