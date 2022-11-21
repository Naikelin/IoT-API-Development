const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'API Documentation',
      description: 'API Documentation',
      contact: {
        name: 'API Support',
        url: '',
        email: ''
      },
      servers: ['http://localhost:3000']
    }
  },
  basePath: '/',
  apis: ['./routes/index.route.js']
}

// --- MIDDLEWARES ---

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use('/api-docs', 
    swaggerUI.serve, 
    swaggerUI.setup(
      swaggerJsDoc(swaggerOptions)
    )
)

// ---ROUTES ---
app.use('/api/v1/', require('./routes/index.route'))
app.use('/test', require('./routes/test.route'))


// --- BINDING SERVER TO LOCALHOST:PORT
app.listen(port, () => {
  console.log(`[SERVER] IoT API on port ${port}`)
})

