require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// example API call
app.get('/apod', async (req, res) => {
  try {
    const image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json())
    res.send({ image })
  } catch (err) {
    console.log('error:', err)
  }
})

// your API calls
app.get('/manifests/curiosity', async (req, res) => {
  try {
    const data = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${process.env.API_KEY}`
    ).then((res) => res.json())
    res.send({ data })
  } catch (err) {
    console.log('error:', err)
  }
})

app.get('/rovers/curiosity', async (req, res) => {
  try {
    const { date } = req.query

    const images = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${process.env.API_KEY}`
    ).then((res) => res.json())
    res.send({ images })
  } catch (err) {
    console.log('error:', err)
  }
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
