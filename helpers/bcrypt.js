const bcrypt = require("bcrypt")

const encryptPassword = async(password) => await bcrypt.hash(password, 10)

const comparePassword = (password, passwordEncrypt) => bcrypt.compareSync(password, passwordEncrypt)

module.exports = {
  encryptPassword,
  comparePassword
}