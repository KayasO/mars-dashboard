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
    res.send(image)
  } catch (err) {
    console.log('error:', err)
  }
})

// your API calls
app.get('/manifests', async (req, res) => {
  try {
    const { rover } = req.query

    const data = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.API_KEY}`
    ).then((res) => res.json())

    const response = {
      name: rover,
      launch_date: data.photo_manifest.launch_date,
      landing_date: data.photo_manifest.landing_date,
      status: data.photo_manifest.status,
      recent_photos_amount:
        data.photo_manifest.photos[data.photo_manifest.photos.length - 1]
          .total_photos,
      recent_photos_date:
        data.photo_manifest.photos[data.photo_manifest.photos.length - 1]
          .earth_date,
    }

    res.send(response)
  } catch (err) {
    console.log('error:', err)
  }
})

app.get('/photos', async (req, res) => {
  try {
    const { rover } = req.query
    const sol = Math.floor(Math.random() * 100)

    const photos = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?page=1&sol=${sol}&api_key=${process.env.API_KEY}`
    ).then((res) => res.json())
    res.send(photos)
  } catch (err) {
    console.log('error:', err)
  }
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
