import setupScraper from './scraper/setup.js'
import startHttpServer from './server.js'
import startCliApp from './cli/cli.js'

setupScraper().then(
  async ({
    page,
    mode,
    searchQueries,
    downloadAllImages,
    max_images,
    size,
    hide_plus,
    order_by,
    orientation,
    concurrent,
  }) => {
    if (mode === 'REST API') {
      await startHttpServer(page)
    } else {
      await startCliApp(
        page,
        searchQueries!,
        downloadAllImages!,
        max_images!,
        size!,
        hide_plus!,
        order_by!,
        orientation!,
        concurrent!
      )
    }
  }
)
