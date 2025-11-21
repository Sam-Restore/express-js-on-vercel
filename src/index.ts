import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Home route - HTML
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Express on Vercel 🚀</h1>
        <p>This is a minimal example without a database or forms.</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `)
})

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'))
})

// Example API endpoint - JSON
app.get('/api-data', (req, res) => {
  res.json({
    message: 'Here is some sample API data',
    items: ['apple', 'banana', 'cherry'],
  })
})

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

import fs from 'fs'

// ----- Phones endpoint ----- //
app.get('/phones', (req, res) => {
  try {
    const raw = fs.readFileSync('android_devices.json', 'utf8')
    const data = JSON.parse(raw)

    const { brand, search } = req.query

    if (brand) {
      const b = (brand as string).toLowerCase()
      const filtered = Object.fromEntries(
        Object.entries(data).filter(([k]) => k.toLowerCase() === b)
      )
      return res.json(filtered)
    }

    if (search) {
      const s = (search as string).toLowerCase()
      const out: any[] = []

      for (const brand in data) {
        for (const phone of data[brand]) {
          if (
            phone.model?.toLowerCase().includes(s) ||
            phone.codename?.toLowerCase().includes(s)
          ) {
            out.push({ brand, ...phone })
          }
        }
      }

      return res.json(out)
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Error reading phone database' })
  }
})


export default app
