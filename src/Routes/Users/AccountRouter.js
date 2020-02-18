const express = require('express');
const path = require('path');
const AccountService = require('./AccountService');

const accountRouter = express.Router();
const jsonBodyParser = express.json();

accountRouter.post('/', jsonBodyParser, async (req, res, next) => {
  const { password, username, first_name, last_name, email } = req.body;

  for (const field of [
    'first_name',
    'last_name',
    'email',
    'username',
    'password'
  ])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  try {
    const passwordError = AccountService.validatePassword(password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    const hasUserWithUserName = await AccountService.hasUserWithUserName(
      req.app.get('db'),
      username
    );

    if (hasUserWithUserName)
      return res.status(400).json({ error: `Username already taken` });

    const hashedPassword = await AccountService.hashPassword(password);

    const newUser = {
      username,
      email,
      first_name,
      last_name,
      password: hashedPassword
    };

    const user = await AccountService.insertUser(req.app.get('db'), newUser);

    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${user.id}`))
      .json(AccountService.serializeUser(user));
  } catch (error) {
    next(error);
  }
});

accountRouter.post('/initial', jsonBodyParser, (req, res, next) => {
  const {
    user_id,
    age,
    location,
    nationality,
    gender,
    collegegraduate
  } = req.body;

  if (!user_id) {
    logger.error('User ID is required');
    return res.status(400).send('User ID required');
  }
  if (!age) {
    logger.error('Age is required');
    return res.status(400).send('Age required');
  }
  if (!nationality) {
    logger.error('Nationality is required');
    return res.status(400).send('Nationality required');
  }
  if (!gender) {
    logger.error('Gender is required');
    return res.status(400).send('Gender required');
  }
  if (!collegegraduate) {
    logger.error('CollegeGraduate is required');
    return res.status(400).send('CollegeGraduate required');
  }
  if (!location) {
    logger.error('Location is required');
    return res.status(400).send('Location required');
  }

  const initialAnswers = {
    user_id,
    age,
    location,
    nationality,
    gender,
    collegegraduate
  };

  AccountService.insertAnswers(initialAnswers)
    .then(result => res.status(201).json(result))
    .catch(next);
});

accountRouter.get('/initial/:user_id', (req, res) => {
  const { user_id } = req.param;

  AccountService.initialStatus(req.app.get('db')).then(result => {
    if (result !== undefined) {
      return res.status(200).json(true);
    } else {
      return res.status(200).json(false);
    }
  });
});

module.exports = accountRouter;

// if (
//   result.age === undefined &&
//   result.location === undefined &&
//   result.nationality === undefined &&
//   result.gender === undefined &&
//   result.collegegraduate === undefined
// ) {
//   return res.status(200).json(true);
// } else {
//   return res.status(200).json(false);
// }
