import db from "../../../database/index.js";
import { predictData } from "../../services/predictData.js";

export const postPredictHandler = async (req, res) => {
  try {
    const { age, height, gender } = req.body;
    const { id } = req.params;

    if (!age || !height || !gender) {
      return res.status(400).json({
        status: "fail",
        message: "age, height, and gender are required",
      });
    }

    const genderFilter = ["perempuan", "laki-laki"];

    if (!genderFilter.find((element) => element === gender)) {
      return res.status(400).json({
        status: "fail",
        message: "gender must be 'perempuan' or 'laki-laki'",
      });
    }

    const model = req.model;

    if (!model) {
      return res.status(500).json({
        status: "fail",
        message: "Model not found",
      });
    }

    const dataPredict = await predictData(model, { age, gender, height });

    const { label, confidenceScore } = dataPredict;

    console.log(label, confidenceScore);

    if (!label || !confidenceScore) {
      return res.status(500).json({
        status: "fail",
        message: "Failed to predict data",
      });
    }

    const [predictResult] = await db.query(
      `SELECT * FROM Predict WHERE prediction LIKE ?`,
      [label]
    );

    if (predictResult.length === 0) {
      return res.status(500).json({
        status: "fail",
        message: "Failed to get prediction data",
      });
    }

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const [history] = await db.query(
      `INSERT INTO History (assignedToChild, createdAt, updatedAt) VALUES (?,?,?)`,
      [id, createdAt, updatedAt]
    );

    const [results] = await db.query(
      `INSERT INTO Result (score, assignedToPredict, assignedToHistory, createdAt, updatedAt) VALUES (?,?,?,?,?)`,
      [
        confidenceScore,
        predictResult[0].id,
        history.insertId,
        createdAt,
        updatedAt,
      ]
    );

    return res.status(200).json({
      status: "success",
      message: "data predicted",
      data: {
        id: results.insertId,
        ...dataPredict,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

export const getPredictHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [results] = await db.query(
      `SELECT r.score, r.createdAt, p.id, p.prediction, p.message, p.subtitle FROM Result r JOIN Predict p ON p.id = r.assignedToPredict WHERE r.id = ?`,
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Result not found",
      });
    }

    const [reccomendations] = await db.query(
      `SELECT * FROM Recommendation WHERE assignedToPredict = ?`,
      [results[0].id]
    );

    if (reccomendations.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Reccomendation not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "data predicted",
      data: {
        ...results[0],
        reccomendations,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
