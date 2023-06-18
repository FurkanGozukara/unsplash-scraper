import puppeteer, { Page } from 'puppeteer'

const setupScraper = async (): Promise<Page> => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    await page.goto('https://unsplash.com/')

    // Handle Ctrl + C signal
    process.on('SIGINT', async () => {
      await browser.close()
      process.exit(0)
    })

    return page
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

export default setupScraper
