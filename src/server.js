import app from "./app"

require("dotenv").config()

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    console.log(`http://localhost:3000/`)
})

export default server
