import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Authorization: Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

export default verifyToken;
