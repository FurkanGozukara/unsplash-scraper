import setupScraper from './scraper/setup.js'
import startHttpServer from './server.js'
import startCliApp from './cli/cli.js'

setupScraper().then(
  async ({
    page,
    mode,
    seachQuery,
    downloadAllImages,
    max_images,
    size,
    hide_plus,
    concurrent,
  }) => {
    if (mode === 'REST API') {
      await startHttpServer(page)
    } else {
      await startCliApp(
        page,
        seachQuery!,
        downloadAllImages!,
        max_images!,
        size!,
        hide_plus!,
        concurrent!
      )
    }
  }
)
