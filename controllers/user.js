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

const profile = async (req, res) => {
  const { id } = req.params

  try {
    const userDb = await User.findById(id)
    if (!userDb) return res.status(404).json({ status: "error", message: "User not found" })

    return res.status(200).json({ status: "success", message: "User profile", user: userDb })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to get profile user" })
  }
}

const update = async (req, res) => {
  const userIdentity = req.user
  const userToUpdate = req.body
  // validate fields
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ status: "error", message: errors.array()[0].msg })

  try {
    const usersDb = await User.find({
      $or: [
        { email: userToUpdate.email.toLowerCase() },
        { nick: userToUpdate.nick.toLowerCase() }
      ]
    })

    //check data user duplicate
    let userIsset = false
    usersDb.forEach(user => {
      if (user && user._id != userIdentity._id) userIsset = true
    })
    if (userIsset) return res.status(400).json({ status: "error", message: "User already exists" })

    if (userToUpdate.password) {
      userToUpdate.password = await bcrypt.hash(userToUpdate.password, 10)
    } else {
      delete userToUpdate.password
    }
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error user not found" })
  }

  try {
    const userUpdated = await User.findByIdAndUpdate(userIdentity._id, userToUpdate, { new: true })
    if (!userUpdated) return res.status(404).json({ status: "error", message: "User not found" })
    //create new token
    const token = jwt.createToken(userUpdated)

    return res.status(200).json({ status: "success", message: "User updated", user: userUpdated, token })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error user not found" })
  }
}

const upload = async (req, res) => {
  return res.status(200).json({ status: "success", message: "Image uploaded" })
}

module.exports = {
  register,
  login,
  profile,
  update,
  upload
}