import db from "../../../database/index.js";
import { predictData } from "../../services/predictData.js";
import { VertexAI } from "@google-cloud/vertexai";

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

    const projectId = process.env.GCLOUD_PROJECT_ID;
    const location = "us-central1";
    const modelGemini = "gemini-1.0-pro-vision-001";

    const { prediction, message, subtitle } = predictResult[0];

    const [predictExist] = await db.query(
      `SELECT rs.id AS id FROM Result rs JOIN Predict p on rs.assignedToPredict = p.id WHERE p.prediction LIKE ? AND rs.score = ?`,
      [label, confidenceScore, id]
    );

    console.log(predictExist);

    if (predictExist.length === 0) {
      const [results] = await db.query(
        `INSERT INTO Result (score, assignedToPredict, createdAt, updatedAt) VALUES (?,?,?,?)`,
        [confidenceScore, predictResult[0].id, createdAt, updatedAt]
      );

      await db.query(
        `INSERT INTO History (assignedToChild, createdAt, updatedAt, assignedToResult) VALUES (?,?,?,?)`,
        [id, createdAt, updatedAt, results.insertId]
      );

      const resultPrompt = await sendMultiModalPrompt(
        projectId,
        location,
        modelGemini,
        prediction,
        message,
        subtitle
      );

      console.log(resultPrompt);

      const resultParse = JSON.parse(resultPrompt);

      console.log(resultParse);

      const insertQuery = `INSERT INTO Recommendation (title, description, assignedToResult) VALUES(?,?,?)`;

      const insertData = resultParse.map((e) => {
        return db.query(insertQuery, [
          e.title,
          e.description,
          results.insertId,
        ]);
      });

      await Promise.all(insertData);

      return res.status(200).json({
        status: "success",
        message: "data predicted",
        data: {
          id: results.insertId,
          ...dataPredict,
        },
      });
    }

    await db.query(
      `INSERT INTO History (assignedToChild, createdAt, updatedAt, assignedToResult) VALUES (?,?,?,?)`,
      [id, createdAt, updatedAt, predictExist[0].id]
    );

    return res.status(200).json({
      status: "success",
      message: "data predicted",
      data: {
        id: predictExist[0].id,
        ...dataPredict,
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
      `SELECT * FROM Recommendation WHERE assignedToResult = ?`,
      [id]
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

async function sendMultiModalPrompt(
  projectId,
  location,
  model,
  prediction,
  confidenceScore
) {
  const vertexAI = new VertexAI({ project: projectId, location: location });

  const generativeVisionModel = vertexAI.getGenerativeModel({
    model: model,
  });

  const request = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Based on the machine learning model's prediction, the child is classified as ${prediction} with a confidence score of ${confidenceScore}. Provide recommendations for parents in the format of an array of objects with properties 'title' and 'description'. The response format should be as follows:
  [
    { "title": "Title 1", "description": "Description 1" },
    { "title": "Title 2", "description": "Description 2" }
  ]
  `,
          },
        ],
      },
    ],
  };

  const response = await generativeVisionModel.generateContent(request);

  const aggregatedResponse = await response.response;

  const fullTextResponse =
    aggregatedResponse.candidates[0].content.parts[0].text;

  return fullTextResponse;
}
