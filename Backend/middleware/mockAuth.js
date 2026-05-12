module.exports = function mockAuth(req, res, next) {
  const userId = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];
  const userRole = req.headers['x-user-role'];

  if (!userId) {
    return res.status(401).json({
      message: 'Unauthorized: missing user ID'
    });
  }

  req.user = {
    _id: userId,
    email: userEmail || 'unknown@example.com',
    role: userRole || 'user'
  };

  next();
};
