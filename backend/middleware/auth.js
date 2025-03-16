const admin = require('firebase-admin');

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(" ")[1]; // get token from header
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // set user in request object
    next(); // proceed to the next middleware or route handler
  }  catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

module.exports = verifyToken;
// In the above snippet, we created a middleware function called verifyToken that verifies the token in the request header. If the token is valid, we set the user in the request object and proceed to the next middleware or route handler. Otherwise, we return an error response.
