import db from "../../../database/index.js";

export const getHistoryHandler = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    const [child] = await db.query(`SELECT * FROM Child WHERE id = ?`, [id]);

    if (child.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Child not found", data: [] });
    }

    const [history] = await db.query(
      `SELECT * FROM History WHERE assignedToChild = ?`,
      [id]
    );

    if (history.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "History not found", data: [] });
    }

    const temp = await Promise.all(
      history.map(async (item) => {
        const [result] = await db.query(
          `SELECT r.id, p.prediction, p.subtitle, r.createdAt from Result r JOIN Predict p ON p.id = r.assignedToPredict JOIN History h on h.assignedToResult = r.id where r.id = ?`,
          [item.assignedToResult]
        );
        return result;
      })
    );

    const results = temp.flat().reverse();

    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Result not found", data: [] });
    }

    const data = results.map((item) => {
      return {
        id: item.id,
        name: child[0].name,
        prediction: item.prediction,
        subtitle: item.subtitle,
        createdAt: item.createdAt,
      };
    });

    return res.status(200).json({
      status: "success",
      message: "data history",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
