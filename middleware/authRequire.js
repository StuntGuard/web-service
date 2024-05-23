import jwt from "jsonwebtoken";
import db from "../database";

export const authRequire = async (req, res, next) => {
  try {
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
    const { id } = jwt.verify(token, process.env.SECRET_TOKEN);

    const [results] = await db.query(`SELECT * FROM User WHERE id = ?`, [id]);

    if (results.length <= 0) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    // set user id in request object for future use
    const user = results[0];
    req.user = user.id;

    next();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
