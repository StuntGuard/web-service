import db from "../../../database/index.js";
import { uploadFile } from "../../services/storageService.js";
//this function for getting child by userId
export const getChildByHandler = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    const [results] = await db.query(
      `SELECT * FROM Child WHERE assignedToUser = ?`,
      [userId]
    );

    return res.status(200).json({
      status: "success",
      message: "child fetched",
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

// this function for creating child
export const postChildHandler = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    const image = req.file;

    console.log(image);

    if (!image) {
      return res.status(400).json({
        status: "fail",
        message: "image is required",
      });
    }

    const url_photo = await uploadFile(image);

    const { name, gender } = req.body;

    if (!name || !gender || !url_photo) {
      return res.status(400).json({
        status: "fail",
        message: "name, gender, and url_photo are required",
      });
    }

    const genderFilter = ["laki-laki", "perempuan"];

    if (!genderFilter.find((element) => element === gender)) {
      return res.status(400).json({
        status: "fail",
        message: "gender must be laki-laki or perempuan",
      });
    }

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    await db.query(
      "INSERT INTO Child (name, gender, url_photo, assignedToUser, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [name, gender, url_photo, userId, createdAt, updatedAt]
    );

    return res.status(201).json({
      status: "success",
      message: "child created",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

// this function for delete child by id
export const deleteChildHandler = async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    const { id } = req.params;

    const [results] = await db.query("SELECT * FROM Child WHERE id = ?", [id]);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Child not found" });
    }

    await db.query("DELETE FROM Child WHERE id = ?", [id]);

    return res
      .status(200)
      .json({ status: "success", message: "Child deleted" });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
