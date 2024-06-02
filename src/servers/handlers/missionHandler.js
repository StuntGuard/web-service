import db from "../../../database/index.js";

// this function for getting all missions by user id
export const getAllMissionsHandler = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
    }

    const [childs] = await db.query(`SELECT * FROM Child WHERE id = ${id}`);

    console.log(childs);

    if (childs.length <= 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "child not found" });
    }

    const [results] = await db.query(
      `SELECT * FROM Mission WHERE assignedToUser = ? AND assignedToChild = ?`,
      [userId, id]
    );

    return res.status(200).json({
      status: "success",
      message: "mission fetched",
      data: results.reverse(),
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

// this function for creating mission by user id
export const postMissionHandler = async (req, res) => {
  try {
    // get user id from request object
    const userId = req.user;
    const { id } = req.params;

    // check if user is logged in
    if (!userId) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
    }

    const [childs] = await db.query(`SELECT * FROM Child WHERE id = ?`, [id]);

    if (childs.length <= 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "child not found" });
    }

    // get title and description from request body
    const { title, description } = req.body;

    // validate title and description
    if (!title || !description) {
      return res.status(400).json({
        status: "fail",
        message: "Title and description are required",
      });
    }

    // create date for createdAt and updatedAt
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // insert mission into database
    await db.query(
      `INSERT INTO Mission (title, description, assignedToUser, assignedToChild, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, userId, id, createdAt, updatedAt]
    );

    return res
      .status(201)
      .json({ status: "success", message: "mission created" });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

// this function for getting mission by id and user id
// export const getMissionByIdHandler = async (req, res) => {
//   try {
//     // get user id from request object
//     const userId = req.user;

//     // check if user is logged in
//     if (!userId) {
//       return res.status(401).json({
//         status: "fail",
//         message: "Unauthorized",
//       });
//     }

//     // get mission id from request params
//     const { id } = req.params;

//     // check if mission id is provided
//     const [results] = await db.query(
//       `SELECT * FROM Mission WHERE id = ? AND assignedToUser = ?`,
//       [id, userId]
//     );

//     // check if mission is found
//     if (results.length <= 0) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "mission not found" });
//     }

//     return res.status(200).json({
//       status: "success",
//       message: "mission fetched",
//       data: results[0],
//     });
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// this function for updating mission by id and user id
// export const updateMissionHandler = async (req, res) => {
//   try {
//     // get user id from request object
//     const userId = req.user;

//     // check if user is logged in
//     if (!userId) {
//       return res.status(401).json({
//         status: "fail",
//         message: "Unauthorized",
//       });
//     }

//     // get mission id from request params
//     const { id } = req.params;

//     // check if mission id is provided
//     const [results] = await db.query(
//       `SELECT * FROM Mission WHERE id = ? AND assignedToUser = ?`,
//       [id, userId]
//     );

//     if (results.length <= 0) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Mission not found" });
//     }

//     // get title and description from request body
//     const { title, description } = req.body;

//     // validate title and description
//     if (!title || !description) {
//       return res.status(400).json({
//         status: "fail",
//         message: "Title and description are required",
//       });
//     }

//     // create date for updatedAt
//     const updatedAt = new Date().toISOString();

//     // update mission in database
//     await db.query(
//       `UPDATE Mission SET title = ?, description = ?, updatedAt = ? WHERE id = ? AND assignedToUser = ?`,
//       [title, description, updatedAt, id, userId]
//     );

//     return res
//       .status(200)
//       .json({ status: "success", message: "mission updated" });
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// this function for deleting mission by id and user id
export const deleteMissionHandler = async (req, res) => {
  try {
    // get user id from request object
    const userId = req.user;

    // check if user is logged in
    if (!userId) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
    }

    // get mission id from request params
    const { id } = req.params;

    // check if mission id is provided
    const [results] = await db.query(
      `SELECT * FROM Mission WHERE id = ? and assignedToUser = ?`,
      [id, userId]
    );

    // check if mission is found
    if (results.length <= 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "mission not found" });
    }

    // delete mission from database
    await db.query(`DELETE FROM Mission WHERE id = ? and assignedToUser = ?`, [
      id,
      userId,
    ]);

    return res
      .status(200)
      .json({ status: "success", message: "mission deleted" });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
