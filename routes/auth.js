const express = require('express');
const router = express.Router();

// Instantiate Services
const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();

module.exports = (app, passport) => {

  app.use('/auth', router);

  // Registration Endpoint
  router.post('/register', async (req, res, next) => {
  
    try {
      const data = req.body;
      
      const response = await AuthServiceInstance.register(data);
      res.status(201).send(response);
    } catch(err) {
      next(err);
    }
  
  });
  
  // Login Endpoint
  router.post('/login', passport.authenticate('local'), async (req, res, next) => {
    try {
      const { username, password } = req.body;
    
      const response = await AuthServiceInstance.login({ email: username, password});
    
      res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  });

  // Logout Endpoint
  router.post('/logout', async (req, res, next) => {
    try {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.status(200).send({ message: 'Logged out successfully' });
      });
    } catch(err) {
      next(err);
    }
  });
}