const {JWT_SECRET} = require('../graphql/resolvers/auth');

module.exports = (req, res, next) => {
  req.isAuth = false;

  const authHeader = req.get('Authorization');
  if (!authHeader) return next();
  let decodedToken;

  try {
    const token = authHeader.split(' ')[1];
    decodedToken = jwt.verify(token, JWT_SECRET)
  } catch (e) {
    return next();
  }

  if (!decodedToken) return next();

  req.userId = decodedToken.userId;
  req.isAuth = true;
  return next();
};