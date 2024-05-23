import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";
import { db } from "../../db/index.js";

// create jwt token
const createToken = (id) => {
  const token = jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: "1h",
  });

  return token;
};

export const signInHandler = async (req, res) => {
  try {
    // get email and password from request body
    const { email, password } = req.body;

    // validate email and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // check if email exist
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // create jwt token
    const token = createToken(user.id);

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const signUpHandler = async (req, res) => {
  try {
    // get name, email, and password from request body
    const { name, email, password } = req.body;

    // validate name, email, and password
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // validate email and password
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Password is not strong enough" });
    }

    // check if email already exist
    const isEmailExist = false;

    if (isEmailExist) {
      return res.status(400).json({ message: "Email already exist" });
    }

    // hash password with bcrypt
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    if (!hashedPassword) {
      res.status(500).json({ message: "Failed to hash password" });
    }

    // create user in database
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
