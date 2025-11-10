const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Authorization error", error: err.message });
    }
  };
};

export default authorizeRoles;
