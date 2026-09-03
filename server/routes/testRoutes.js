const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

router.get("/protected", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "Bu korumalı alana erişebildin!",
    user: req.user,
  });
});

module.exports = router;