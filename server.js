const express = require('express')

const app = express()
const port = 3000

// --- MIDDLEWARES ---

server.use(bodyParser.json())
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// ---ROUTES ---
server.use('/', require('./routes/index'));


// --- BINDING SERVER TO LOCALHOST:PORT
app.listen(port, () => {
  console.log(`[SERVER] IoT API on port ${port}`)
})

