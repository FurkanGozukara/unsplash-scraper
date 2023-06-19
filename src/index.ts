import setupScraper from './scraper/setup.js'
import startHttpServer from './server.js'
import startCliApp from './cli/cli.js'

setupScraper().then(
  async ({ page, mode, seachQuery, downloadAllImages, max_images, size }) => {
    if (mode === 'HTTP Server') {
      await startHttpServer(page)
    } else {
      await startCliApp(
        page,
        seachQuery!,
        downloadAllImages!,
        max_images!,
        size!
      )
    }
  }
)
