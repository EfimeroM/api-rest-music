const dotenv = require("dotenv")

dotenv.config()

module.exports = {
  NODE_ENV : process.env.NODE_ENV || "development",
  MONGO_URI : process.env.MONGO_URI || "mongodb://localhost:27017/api_rest_music",
  PORT : process.env.PORT || 8080
}