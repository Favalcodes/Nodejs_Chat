import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js'

const SECRET_KEY = 'qwerty123456poiu0987!^@';

export const encode = async (req, res, next) => {
  try {
    const { firstname, lastname, email } = req.body;
    const user = await UserModel.getUserByEmail(email);
    if(user) {
      throw ({ 
        error: "Email already exist"
      })
    } else {
      const payload = {
        firstname,
        lastname,
        email
      };
      const authToken = jwt.sign(payload, SECRET_KEY);
      console.log('Auth', authToken);
      req.authToken = authToken;
      next();
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.error });
  }
}

export const logencode = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.getUserByEmail(userId);
    if (!user) {
      throw ({ error: 'No user with this email found' });
    } else {
    const payload = {
      userId: user.email
    };
    const authToken = jwt.sign(payload, SECRET_KEY);
    console.log('Auth', authToken);
    req.authToken = authToken;
    next();
  }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.error });
  }
}

export const decode = (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(400).json({ success: false, message: 'No access token provided' });
  }
  const accessToken = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    req.userId = decoded.userId;
    return next();
  } catch (error) {

    return res.status(401).json({ success: false, message: error.message });
  }
}