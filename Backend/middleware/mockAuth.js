module.exports = function mockAuth(req, res, next) {
  // Pretend user is logged in
  req.user = {
    _id: "663a1f2c1234567890abcd12",
    role: req.headers['x-role'] || 'user',
    email: "test@example.com"
  };
  next();
};
