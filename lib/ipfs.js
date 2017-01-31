const IPFS = require('ipfs')

const fs = require('fs')
const os = require('os')
const path = require('path')
const pug = require('pug')
const series = require('async/series')

const ipfs = new IPFS()

const filePath = {}

const templates = {
  fileName: 'codez.html',
  pug: './templates/codez.pug.html',
  html: './templates/codez.html'
}

function addFile(req, res) {


  let qrCodeDataUrl = req.body.qrCodeDataUrl
  let templateOptions = { qrCodeDataUrl }

  if (!ipfs.isOnline()) {
    return res.send(400).json({
      success: false,
      message: 'Not online'
    })
  }

  const html = pug.renderFile(templates.pug, templateOptions)

  series([
    (cb) => {
      fs.writeFile(templates.html, html, (err) => {
        if (err) {
          cb(err)
        }

        filePath.path = templates.fileName,
        filePath.content = fs.createReadStream(templates.html)

        cb()
      });
    },
    (cb) => {
      ipfs.files.add(filePath, (err, result) => {

        if (err) {
          cb(err)
        }

        console.log(`${result[0].hash} was added to IPFS`)

        cb(err, result)
      })
    }
  ], (err, result) => {

    if (err) {
      return res.send(500).json({
        success: false,
        message: 'Adding that failed'
      })
    }

    res.send(200).json({
      success: true,
      result: result && result[0] ? result[0].hash : null
    })
  })
}

function getFile(req, res) {
  const hash = req.params.hash

  ipfs.files.cat(hash, (err, stream) => {
    let body = ''

    if (err) {
      return res.send(500).json({
        success: false,
        message: `Getting file of ${hash} failed`
      })
    }

    stream
      .on('data', function (chunk) {
        body += chunk
      })
      .on('end', function () {
        res.send(body)
      })

  })

}

function goOnline() {

  console.log(` `)
  console.log(`==== IPFS ====`)

  series([
    (cb) => {
      ipfs.version((err, version) => {

        if (err) {
          return cb(err)
        }

        console.log(`Version: ${version.version}`)

        cb()
      })

    },
    (cb) => {
      ipfs.config.get((err, config) => {

        if (err) {
          return cb(err)
        }

        console.log(`Peer ID: ${config.Identity.PeerID}`)

        cb()
      })
    },
    // (cb) => ipfs.init({}, cb),
    (cb) => ipfs.load(cb),
    (cb) => ipfs.goOnline(cb)
  ], (err) => {

    if (err) {
      return console.log(err)
    }

    console.log(`Successfully connected to IPFS`)
    console.log(`==============`)
    console.log(` `)

  })
}

module.exports = {
  addFile,
  getFile,
  goOnline
}
