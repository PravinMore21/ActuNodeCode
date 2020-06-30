//Entry point for our server
require('dotenv').config({path: __dirname + '/.env'})
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries2')
const port = process.env.NODE_PORT

app.use((req, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Credentials", "true");
  response.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const main = require('./queries2');

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})



app.get('/productAllNameStatus', db.getProductNameStatus)
app.get('/productByStatus/:status', db.getProductByStatus)



app.get('/productDetails', db.getAllProducts)
app.get('/productDetails/code/:code', db.getProductsByCode)
app.get('/productDetails/name/:name', db.getProductsByName)

app.put('/prodStatusUpdate/:code', db.updateStatusComment)

app.get('/planDetails', db.getAllProducts)

app.get('/STPRules', db.getAllSTPRule)

app.get('/medicalDetails', db.getAllMedical)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})