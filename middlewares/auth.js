const jwt = require("jwt-simple")
const moment = require("moment")

const { SECRET_KEY } = require("../config")

const auth = (req, res, next) => {
  if (!req.headers.authorization) return res.status(403).json({ status: "error", message: "Header auth not found" })

  const token = req.headers.authorization.replace(/^Bearer\s+/i, '').replace(/['"]+/g, '')
  try {
    const payload = jwt.decode(token, SECRET_KEY)
    if (payload.exp <= moment().unix()) return res.status(401).send({ status: "error", message: "Expired Token" })

    req.user = payload
  } catch (error) {
    return res.status(404).send({ status: "error", message: "Invalid Token" })
  }
  next()
}

module.exports = { auth }