import express from 'express';
// controllers
import user from '../controllers/user.js';

const router = express.Router();

router
  .get('/', user.onGetAllUsers)
  .get('/:email', user.onGetUserByEmail)
  .delete('/:email', user.onDeleteUserByEmail)

export default router;