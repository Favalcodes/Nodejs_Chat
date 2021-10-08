// utils
import makeValidation from '@withvoid/make-validation';
// models
import UserModel from '../models/User.js';

export default {
  onGetAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getUsers();
      return res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
    onGetUserById: async (req, res) => {
      try {
        const user = await UserModel.getUserById(req.params.id);
        return res.status(200).json({ success: true, user });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
    },
    onGetUserByEmail: async (req, res) => {
      try {
        const user = await UserModel.getUserByEmail(req.params.email);
        if (!user) throw ({ error: 'No user with this email found' });
        return res.status(200).json({ success: true, user });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
    },
    onCreateUser: async (req, res) => {
      try {
        const validation = makeValidation(types => ({
          payload: req.body,
          checks: {
            firstName: { type: types.string },
            lastName: { type: types.string },
            email: { type: types.string }
          }
        }));
        if (!validation.success) return res.status(400).json(validation);
  
  
        const { firstName, lastName, email } = req.body;
        const user = await UserModel.createUser(firstName, lastName, email);
        return res.status(200).json({ success: true, user, authorization: req.authToken });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
    },
    onDeleteUserByEmail: async (req, res) => {
      try {
        const user = await UserModel.deleteByUserByEmail(req.params.email);
        return res.status(200).json({ 
          success: true, 
          message: `User Deleted.` 
        });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
    },
  }