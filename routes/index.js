import express from 'express';
// controllers
import user from '../controllers/user.js';
// middlewares
import { encode, logencode } from '../middlewares/jwt.js';

const router = express.Router();

router
.post('/welcome', encode, user.onCreateUser)
.post('/login', logencode, (req, res, next) => {
  return res
    .status(200)
    .json({
      success: true,
      authorization: req.authToken,
    });
});

export default router;