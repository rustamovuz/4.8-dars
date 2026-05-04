const { read_file, write_file } = require("../fs/file-manager")
const bcrypt = require("bcryptjs")
const { v4 } = require("uuid")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
  const { username, email, password } = req.body

  if(!username || !email || !password) {
    return res.status(400).json({
      message: "username, email, password are required"
    })
  }

  const users = read_file("users.json")

  const foundedEmail = users.find((u) => u.email === email)

  if(foundedEmail) {
    return res.status(400).json({
      message: "Email already exists"
    })
  }

  const hashPassword = await bcrypt.hash(password, 8)

  users.push({
    id: v4(),
    username,
    email,
    password: hashPassword
  })

    write_file("users.json",users)

    res.status(200).json({
        message: "Registered"
  }) 
}

const login = async (req, res) => {
  const { email, password } = req.body

  const users = read_file("users.json")

  const foundedEmail = users.find((i) => i.email === email)

  if(!foundedEmail) {
    return res.status(401).json({
      message: "User not found"
    })
  }

  const checkPassword = await bcrypt.compare(password, foundedEmail.password)

  if(checkPassword) {

  const payload = { id: foundedEmail.id, email: foundedEmail.email }
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" })

  return res.status(200).json({
    message: "Success",
    token
  })
} else {
  return res.status(401).json({
    message: "Wrong password"
  })
}
}


module.exports = {
  register,
  login
}