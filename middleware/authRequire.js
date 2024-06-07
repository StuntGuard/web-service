import jwt from "jsonwebtoken";
import db from "../database/index.js";

export const authRequire = async (req, res, next) => {
  // get authorization from headers
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  // get token from authorization
  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  // verify token
  jwt.verify(token, process.env.SECRET_TOKEN, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ status: "fail", message: "Token Expired" });
      }

      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    try {
      const id = decoded.id;

      console.log(id);

      const [results] = await db.query(`SELECT * FROM User WHERE id = ?`, [id]);

      if (results.length <= 0) {
        return res
          .status(401)
          .json({ status: "fail", message: "Unauthorized" });
      }
      const user = results[0];
      req.user = user.id;
      next();
    } catch (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }
  });
};
