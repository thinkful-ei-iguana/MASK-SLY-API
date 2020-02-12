const express = require('express');
const AuthService = require('./AuthService');
const { requireAuth } = require('../../Middleware/JWT');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter
  .route('/token')
  .post(jsonBodyParser, async (req, res, next) => {
    const { Username, Password } = req.body;
    const loginUser = { Username, Password };

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    try {
      const dbUser = await AuthService.getUserWithUserName(
        req.app.get('db'),
        loginUser.Username
      );

      if (!dbUser)
        return res.status(400).json({
          error: 'Incorrect username or password'
        });

      const compareMatch = await AuthService.comparePasswords(
        loginUser.Password,
        dbUser.Password
      );

      if (!compareMatch)
        return res.status(400).json({
          error: 'Incorrect username or password'
        });

      const sub = dbUser.Username;
      const payload = {
        user_id: dbUser.id,
        name: dbUser.FirstName
      };
      res.send({
        authToken: AuthService.createJwt(sub, payload)
      });
    } catch (error) {
      next(error);
    }
  })

  .put(requireAuth, (req, res) => {
    const sub = req.user.Username;
    const payload = {
      user_id: req.user.id,
      name: req.user.FirstName
    };
    res.send({
      authToken: AuthService.createJwt(sub, payload)
    });
  });

module.exports = authRouter;
