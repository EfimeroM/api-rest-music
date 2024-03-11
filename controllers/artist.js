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

const one = async (req, res) => {
  const { id } = req.params

  try {
    const artistDb = await Artist.findById(id)
    if (!artistDb) return res.status(404).json({ status: "error", message: "Artist not found" })

    return res.status(200).json({ status: "success", message: "Get an artist", artist: artistDb })
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error to get an artist" })
  }
}

const list = async (req, res) => {
  return res.status(200).json({ status: "success", message: "List Artist" })

}


module.exports = {
  save,
  one,
  list
}