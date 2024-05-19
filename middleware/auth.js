const jwt = require("jsonwebtoken");
const logger = require("./logger");
const requireSignIn = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
     logger.warn("Authentication failed: No token provided or token has expired.");
    return res
      .status(401)
      .json({ error: true, message: "Authentication invalid" });
  }
  const token = authHeader.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        logger.warn("Authentication failed: Invalid token.");
        res.status(403).json({ error: true, message: "Invalid token" });
      } else {
        logger.info(`User authenticated successfully: ${decodedToken.id}`);
        req.user = decodedToken;
        next();
      }
    });
  } else {
    logger.warn("Authentication failed: No token provided.");
    res.status(401).json({ error: true, message: "You are not authenticated" });
  }
};

module.exports = {
  requireSignIn,
};
