const sql = require("mssql/msnodesqlv8");

const config = {
  connectionString:
    `Driver={ODBC Driver 18 for SQL Server};` +
    `Server=${process.env.DB_SERVER};` +
    `Database=${process.env.DB_DATABASE};` +
    `Trusted_Connection=Yes;` +
    `TrustServerCertificate=Yes;`,
};

async function connectDB() {
  try {
    await sql.connect(config);

    console.log("SQL Server bağlantısı başarılı!");
  } catch (error) {
    console.error(
      "SQL Server bağlantı hatası:",
      error
    );
  }
}

module.exports = {
  sql,
  connectDB,
};