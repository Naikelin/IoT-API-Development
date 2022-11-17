const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

// --- MIDDLEWARES ---

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// ---ROUTES ---
app.use('/api/v1/', require('./routes/index.route'));


// --- BINDING SERVER TO LOCALHOST:PORT
app.listen(port, () => {
  console.log(`[SERVER] IoT API on port ${port}`)
})

