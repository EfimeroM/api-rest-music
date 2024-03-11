const Artist = require("../models/Artist")

const save = async (req, res) => {
  const params = req.body
  try {

    const artistStored = await Artist.create(params)
    if (!artistStored) throw Error

    return res.status(201).json({ status: "success", message: "Artist saved", artist: artistStored })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to save artist" })
  }
}


module.exports = {
  save
}