const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = require("../env");

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET_KEY);
        return user;
      } catch (error) {
        throw new AuthenticationError("Authentication token invalid/expired");
      }
    }
    throw new AuthenticationError(
      "Authentication token must be 'Bearer [token]'"
    );
  }
  throw new AuthenticationError("Authorization header must be provided");
};
