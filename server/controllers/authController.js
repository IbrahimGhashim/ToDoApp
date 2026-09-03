const { sql } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ====================
// REGISTER
// ====================
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tüm alanlar doldurulmalıdır.",
      });
    }

    const existingUser = await sql.query`
      SELECT Id
      FROM Users
      WHERE Email = ${email}
    `;

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Bu email adresi zaten kayıtlı.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql.query`
      INSERT INTO Users (Name, Email, Password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;

    res.status(201).json({
      success: true,
      message: "Kayıt başarılı!",
    });

  } catch (error) {
    console.error("Register hatası:", error);

    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
}


// ====================
// LOGIN
// ====================
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Alan kontrolü
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email ve şifre gereklidir.",
      });
    }

    // Kullanıcıyı email ile bul
    const result = await sql.query`
      SELECT Id, Name, Email, Password
      FROM Users
      WHERE Email = ${email}
    `;

    // Kullanıcı bulunamadı
    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email veya şifre hatalı.",
      });
    }

    const user = result.recordset[0];

    // Şifre kontrolü
    const passwordMatch = await bcrypt.compare(
      password,
      user.Password
    );

    // Şifre yanlış
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Email veya şifre hatalı.",
      });
    }

    // JWT oluştur
const token = jwt.sign(
  {
    id: user.Id,
    email: user.Email,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d",
  }
);

// Giriş başarılı
res.status(200).json({
  success: true,
  message: "Giriş başarılı!",
  token: token,
  user: {
    id: user.Id,
    name: user.Name,
    email: user.Email,
  },
});

  } catch (error) {
    console.error("Login hatası:", error);

    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
}


module.exports = {
  registerUser,
  loginUser,
};