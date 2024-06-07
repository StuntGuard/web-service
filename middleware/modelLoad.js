import { getModel } from "../src/services/loadModel.js";

export async function modelLoadMiddleware(req, res, next) {
  try {
    req.model = await getModel();
    next();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
