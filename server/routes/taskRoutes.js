const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");


// GET → Görevleri getir
router.get("/", verifyToken, getTasks);


// POST → Yeni görev oluştur
router.post("/", verifyToken, createTask);


// PUT → Görevi güncelle
router.put("/:id", verifyToken, updateTask);


// DELETE → Görevi sil
router.delete("/:id", verifyToken, deleteTask);


module.exports = router;