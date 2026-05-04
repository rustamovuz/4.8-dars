const express = require("express")
const cors = require("cors")
const authRouter = require("./router/auth.routes")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

// router
app.use("/auth", authRouter)

app.listen(PORT, () => {
  console.log("Server is running at: http://localhost:" + PORT);
})