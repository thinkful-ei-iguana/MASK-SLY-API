const express = require('express');
const path = require('path');
const accountService = require('./accountService');

const accountRouter = express.Router();
const jsonBodyParser = express.json();

accountRouter.post('/', jsonBodyParser, async (req, res, next) => {
  const { Password, Username, FirstName, LastName, Email } = req.body;

  for (const field of [
    'FirstName',
    'LastName',
    'Email',
    'Username',
    'Password'
  ])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  try {
    const passwordError = UserService.validatePassword(Password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    const hasUserWithUserName = await UserService.hasUserWithUserName(
      req.app.get('db'),
      Username
    );

    if (hasUserWithUserName)
      return res.status(400).json({ error: `Username already taken` });

    const hashedPassword = await UserService.hashPassword(Password);

    const newUser = {
      Username,
      Email,
      FirstName,
      LastName,
      Password: hashedPassword
    };

    const user = await UserService.insertUser(req.app.get('db'), newUser);

    await UserService.populateUserWords(req.app.get('db'), user.id);

    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${user.id}`))
      .json(UserService.serializeUser(user));
  } catch (error) {
    next(error);
  }
});

module.exports = accountRouter;
