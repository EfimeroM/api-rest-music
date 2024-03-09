const { validationResult } = require("express-validator")
const User = require("../models/User")
const bcrypt = require("bcrypt")

const register = async (req, res) => {
  const params = req.body
  // validate fields
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ status: "error", message: errors.array()[0].msg })

  try {
    // check if the email or nickname already exists
    const userExists = await User.find({
      $or: [
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() }
      ]
    })
    if (userExists && userExists.length >= 1) return res.status(400).json({ status: "error", message: "Error the user already exists" })

    //encrypt user password
    params.password = await bcrypt.hash(params.password, 10)

    const userStored = await User.create(params)
    if (!userStored) throw Error

    return res.status(201).json({
      status: "success", message: "User registered",
      user: {
        _id: userStored._id,
        name: userStored.name,
        surname: userStored.surname || "",
        nick: userStored.nick,
        image: userStored.image
      }
    })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to register user" })
  }
}

module.exports = {
  register
}