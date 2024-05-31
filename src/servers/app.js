import express from "express";
import authRoute from "./routes/authRoute.js";
import missionRoute from "./routes/missionRoute.js";
import childRoute from "./routes/childRoute.js";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from a .env file
dotenv.config();

// Create an Express application
const app = express();

// Middleware to parse the request body as JSON
app.use(express.json());

// Middleware to parse the request body as URL encoded data
app.use(express.urlencoded({ extended: false }));

// Middleware to enable CORS (Cross-Origin Resource Sharing) for all requests
app.use(cors());

// Middleware to handle routes for authentication (sign-in, sign-up)
app.use("/", authRoute);
app.use("/missions", missionRoute);
app.use("/childs", childRoute);

// Middleware to handle errors
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server on port 8080 or the port specified in the environment
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
