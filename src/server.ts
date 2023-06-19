import type { Page } from 'puppeteer'
import express from 'express'
import scrape from './scraper/scrape.js'

const startHttpServer = async (page: Page) => {
  const app = express()

  app.use(express.json())

  app.get('/', async (req, res) => {
    const { query, p, limit, hide_plus } = req.query

    if (!query || !p || !limit) {
      return res.status(400).json({
        error: 'Missing query, p, and limit',
      })
    }

    const data = await scrape(page, query.toString(), +p, +limit, !!hide_plus)

    if (!data) {
      return res.status(404).json({
        error: 'No data found',
      })
    }

    return res.status(200).json(data)
  })

  const PORT = process.env.PORT || 3000

  app.listen(3000, () => console.log(`Server running on port ${PORT}`))
}

export default startHttpServer
