const { Sequelize } = require("sequelize");
const { secret } = require("./secret");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅  PostgreSQL connected");
  } catch (err) {
    console.error("❌  DB connection failed:", err.message);
  }
};

module.exports = { sequelize, connectDB };