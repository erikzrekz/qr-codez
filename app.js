const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const path = require('path')
const pug = require('pug')
const ipfs = require('./lib/ipfs')

const app = express()
app.set('port', 4000)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const html = pug.renderFile('./templates/index.pug.html')

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => res.send(html))
app.post('/ipfs', ipfs.addFile)
app.get('/ipfs/:hash', ipfs.getFile)

const httpServer = http.createServer(app);
httpServer.listen(app.get('port'), () => ipfs.goOnline())

