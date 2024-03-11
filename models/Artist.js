const { Schema, model } = require("mongoose")

const ArtistSchema = ({
  name: {
    type: String,
    required: true
  },
  description: String,
  image: {
    type: String,
    default: "default.png"
  },
  create_at: {
    type: Date,
    default: Date.now()
  }
})

module.exports = model("Artist", ArtistSchema)