require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

const PORT = 5000;


// MIDDLEWARE

app.use(cors());

app.use(express.json());


// SQL SERVER

connectDB();


// ROUTES

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use("/api/tasks", taskRoutes);


// ANA SAYFA

app.get("/", (req, res) => {
  res.json({
    message: "To Do App Backend çalışıyor!",
  });
});


// SERVER

app.listen(PORT, () => {
  console.log(
    `Server http://localhost:${PORT} adresinde çalışıyor.`
  );
});