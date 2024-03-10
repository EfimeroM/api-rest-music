const { validationResult } = require("express-validator")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("../helpers/jwt")

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

    //delete password, role and email
    const userIdentity = { ...userStored.toObject(), password: undefined, role: undefined, email: undefined }

    return res.status(201).json({
      status: "success", message: "User registered",
      user: userIdentity
    })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to register user" })
  }
}

const login = async (req, res) => {
  let params = req.body
  if (!params.email || !params.password) return res.status(400).json({ status: "error", message: "Missing data error" })

  try {
    const userDb = await User.findOne({ email: params.email }).select("+password +role")
    if (!userDb) return res.status(404).json({ status: "error", message: "User not found" })

    //compare password
    const pwd = bcrypt.compareSync(params.password, userDb.password)
    if (!pwd) return res.status(400).json({ status: "error", message: "User password is incorrect" })

    //clean password and role
    const identityUser = { ...userDb.toObject(), password: undefined, role: undefined }

    //create user token
    const token = jwt.createToken(userDb)

    return res.status(200).json({ status: "success", message: "User logged", user: identityUser, token })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to login user" })
  }
}


module.exports = {
  register,
  login
}