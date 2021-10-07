import jwt from 'jsonwebtoken';

const SECRET_KEY = 'qwerty123456poiu0987!^@';

export const encode = async (req, res, next) => {
  try {
    const { firstname, lastname, type } = req.body;
    const payload = {
      firstname,
      lastname,
      type
    };
    const authToken = jwt.sign(payload, SECRET_KEY);
    console.log('Auth', authToken);
    req.authToken = authToken;
    next();
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
    req.userType = decoded.type;
    return next();
  } catch (error) {

    return res.status(401).json({ success: false, message: error.message });
  }
}