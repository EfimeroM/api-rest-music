const Song = require("../models/Song")

const save = async (req, res) => {
  const params = req.body

  try {
    const songStored = await Song.create(params)
    if (!songStored) throw Error

    res.status(200).json({ status: "success", message: "Save user", song: songStored })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to save song", error })
  }
}

module.exports = {
  save
}