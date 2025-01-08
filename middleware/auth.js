const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {

  
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No auth token found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.authAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};


