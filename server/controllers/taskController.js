const { sql } = require("../config/db");

//Get Tasks

async function getTasks(req, res) {
  try {
    const userId = req.user.id;

    const result = await sql.query`
      SELECT Id, Title, Completed, CreatedAt
      FROM Tasks
      WHERE UserId = ${userId}
      ORDER BY Id DESC
    `;

    res.status(200).json({
      success: true,
      tasks: result.recordset,
    });

  } catch (error) {
    console.error("Görevleri getirme hatası:", error);

    res.status(500).json({
      success: false,
      message: "Görevler getirilemedi.",
    });
  }
}

// Create Task

async function createTask(req, res) {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Görev başlığı boş bırakılamaz.",
      });
    }

    const result = await sql.query`
      INSERT INTO Tasks (Title, UserId)
      OUTPUT INSERTED.Id, INSERTED.Title, INSERTED.Completed, INSERTED.CreatedAt
      VALUES (${title}, ${userId})
    `;

    res.status(201).json({
      success: true,
      message: "Görev başarıyla eklendi.",
      task: result.recordset[0],
    });

  } catch (error) {
    console.error("Görev ekleme hatası:", error);

    res.status(500).json({
      success: false,
      message: "Görev eklenemedi.",
    });
  }
}

// Update Task

async function updateTask(req, res) {
  try {
    const taskId = req.params.id;
    const { title, completed } = req.body;
    const userId = req.user.id;

    const existingTask = await sql.query`
      SELECT Id
      FROM Tasks
      WHERE Id = ${taskId}
      AND UserId = ${userId}
    `;

    if (existingTask.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Görev bulunamadı.",
      });
    }

    const result = await sql.query`
      UPDATE Tasks
      SET
        Title = ${title},
        Completed = ${completed}
      OUTPUT INSERTED.Id, INSERTED.Title, INSERTED.Completed, INSERTED.CreatedAt
      WHERE Id = ${taskId}
      AND UserId = ${userId}
    `;

    res.status(200).json({
      success: true,
      message: "Görev güncellendi.",
      task: result.recordset[0],
    });

  } catch (error) {
    console.error("Görev güncelleme hatası:", error);

    res.status(500).json({
      success: false,
      message: "Görev güncellenemedi.",
    });
  }
}

// Delete Task

async function deleteTask(req, res) {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const result = await sql.query`
      DELETE FROM Tasks
      OUTPUT DELETED.Id
      WHERE Id = ${taskId}
      AND UserId = ${userId}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Görev bulunamadı.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Görev başarıyla silindi.",
    });

  } catch (error) {
    console.error("Görev silme hatası:", error);

    res.status(500).json({
      success: false,
      message: "Görev silinemedi.",
    });
  }
}


module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};