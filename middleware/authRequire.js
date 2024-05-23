import jwt from "jsonwebtoken";
import { db } from "../db/index.js";

export const authRequire = async (req, res, next) => {
  try {
    // get authorization from headers
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // get token from authorization
    const token = authorization.split(" ")[1];

    if (!token) {
      throw new Error("Token not found");
    }

    // verify token
    const { id } = jwt.verify(token, process.env.SECRET_TOKEN);

    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // set user id in request object for future use
    req.user = user.id;

    next();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
